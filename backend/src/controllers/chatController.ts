import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";
import { buildMoodLabel, classifyEmotion } from "../services/emotion/emotionEngine.js";
import { detectCrisis } from "../services/emotion/crisisService.js";
import { generateSupportResponse } from "../services/ai/responseService.js";
import { upsertDailyCheckIn } from "../services/checkin/checkinService.js";
import { generateDailySummary, getDailySummary } from "../services/chat/chatSummaryService.js";
import { getDayKey } from "../utils/date.js";

const messagesCollection = () => getFirestore().collection("chatMessages");
const settingsCollection = () => getFirestore().collection("settings");

const getUserTimezone = async (userId: string) => {
  const doc = await settingsCollection().doc(userId).get();
  const data = doc.data() as { timezone?: string } | undefined;
  return data?.timezone || "UTC";
};

const extractTags = (text: string) => {
  const lower = text.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("work") || lower.includes("boss")) tags.push("work stress");
  if (lower.includes("sleep")) tags.push("sleep");
  if (lower.includes("family")) tags.push("family");
  if (lower.includes("lonely") || lower.includes("alone")) tags.push("loneliness");
  if (lower.includes("anxious") || lower.includes("anxiety")) tags.push("anxiety");
  if (lower.includes("sad") || lower.includes("down")) tags.push("low mood");
  return tags;
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { text, getResponse = false } = req.body as { text: string; getResponse?: boolean };
  const userId = req.userId as string;
  
  try {
    // Parallelize emotion and crisis detection for speed
    const [emotion, crisis, timezone] = await Promise.all([
      classifyEmotion(text, { userId, purpose: "chat_emotion" }),
      detectCrisis(text, { userId, purpose: "chat_crisis" }),
      getUserTimezone(userId),
    ]);
    
    const tags = extractTags(text);
    const moodLabel = buildMoodLabel(emotion);
    const dayKey = getDayKey(new Date(), timezone);

    // Save user message
    const doc = await messagesCollection().add({
      userId: req.userId,
      sender: "user",
      text,
      tags,
      emotion,
      crisis,
      dayKey,
      timezone,
      createdAt: new Date().toISOString(),
    });

    // Run these in background without blocking response
    Promise.all([
      upsertDailyCheckIn(userId, timezone, {
        mood: emotion.primary,
        moodLabel,
        note: text,
        sentimentScore: emotion.sentimentScore,
      }),
      generateDailySummary(userId, timezone, emotion),
    ]).catch(err => console.error("Background task error:", err));

    // If frontend wants response in same call, generate it
    if (getResponse) {
      const recent = await messagesCollection()
        .where("userId", "==", userId)
        .where("dayKey", "==", dayKey)
        .limit(10)
        .get();
      
      let recentMessages = recent.docs.map((doc) => doc.data());
      
      // Filter out the current message to prevent repetition
      recentMessages = recentMessages.filter((msg: any) => 
        msg.text !== text && msg.sender !== "ai"
      );
      
      // Sort by recency (most recent first)
      recentMessages.sort((a: any, b: any) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
      
      // Take last 3 messages for context
      const contextMessages = recentMessages.slice(0, 3);
      const context = contextMessages
        .map((msg: any) => `User: ${msg.text}`)
        .reverse()
        .join("\n");
      
      const response = await generateSupportResponse(text, context, { userId, purpose: "chat_response" });
      
      // Save AI response
      const aiDoc = await messagesCollection().add({
        userId: req.userId,
        sender: "ai",
        text: response.text,
        dayKey,
        timezone,
        createdAt: new Date().toISOString(),
      });
      
      return res.json({ 
        messageId: doc.id, 
        emotion, 
        crisis, 
        tags,
        response: {
          id: aiDoc.id,
          text: response.text,
        }
      });
    }

    return res.json({ messageId: doc.id, emotion, crisis, tags });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ 
      error: "Failed to send message",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const listMessages = async (req: AuthRequest, res: Response) => {
  const { dayKey } = req.query as { dayKey?: string };
  const userId = req.userId as string;
  const timezone = await getUserTimezone(userId);
  const targetDayKey = dayKey || getDayKey(new Date(), timezone);

  const query = messagesCollection()
    .where("userId", "==", userId)
    .where("dayKey", "==", targetDayKey);

  const snapshot = await query.get();
  const messages = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() as any }))
    .filter(msg => msg.createdAt);

  // Sort: Oldest first (Top), Newest last (Bottom)
  // ISO strings sort correctly with localeCompare or simple < >
  messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return res.json({ messages });
};

export const listHistory = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  // Fetch by userId only (equality filter) - no index needed beyond standard
  const snapshot = await getFirestore()
    .collection("chatDailySummaries")
    .where("userId", "==", userId)
    .get();

  const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));

  // Sort in-memory: Newest day first
  history.sort((a, b) => b.dayKey.localeCompare(a.dayKey));

  return res.json({ history: history.slice(0, 50) });
};

export const generateResponse = async (req: AuthRequest, res: Response) => {
  const { text } = req.body as { text: string };
  const userId = req.userId as string;
  
  try {
    const timezone = await getUserTimezone(userId);
    const dayKey = getDayKey(new Date(), timezone);
    
    const recent = await messagesCollection()
      .where("userId", "==", userId)
      .where("dayKey", "==", dayKey)
      .limit(10)
      .get();
    
    let recentMessages = recent.docs.map((doc) => doc.data());
    
    // Filter out current message and AI messages
    recentMessages = recentMessages.filter((msg: any) => 
      msg.text !== text && msg.sender !== "ai"
    );
    
    // Sort by recency (most recent first)
    recentMessages.sort((a: any, b: any) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
    
    // Take last 3 messages for context
    const contextMessages = recentMessages.slice(0, 3);
    const context = contextMessages
      .map((msg: any) => `User: ${msg.text}`)
      .reverse()
      .join("\n");
    
    const response = await generateSupportResponse(text, context, { userId, purpose: "chat_response" });
    
    await messagesCollection().add({
      userId: req.userId,
      sender: "ai",
      text: response.text,
      dayKey,
      timezone,
      createdAt: new Date().toISOString(),
    });
    
    return res.json({ response });
  } catch (error) {
    console.error("Generate response error:", error);
    return res.status(500).json({ 
      error: "Failed to generate response",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};

export const getTodaySummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const timezone = await getUserTimezone(userId);
  const summary = await getDailySummary(userId, timezone);
  return res.json({ summary });
};
