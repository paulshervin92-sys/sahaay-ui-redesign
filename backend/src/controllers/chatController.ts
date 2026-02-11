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
  const { text } = req.body as { text: string };
  const userId = req.userId as string;
  const emotion = await classifyEmotion(text, { userId, purpose: "chat_emotion" });
  const crisis = await detectCrisis(text, { userId: req.userId as string, purpose: "chat_crisis" });
  const tags = extractTags(text);
  const timezone = await getUserTimezone(userId);
  const moodLabel = buildMoodLabel(emotion);
  const dayKey = getDayKey(new Date(), timezone);

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

  await upsertDailyCheckIn(userId, timezone, {
    mood: emotion.primary,
    moodLabel,
    note: text,
    sentimentScore: emotion.sentimentScore,
  });

  await generateDailySummary(userId, timezone, emotion);

  return res.json({ messageId: doc.id, emotion, crisis, tags });
};

export const listMessages = async (req: AuthRequest, res: Response) => {
  const snapshot = await messagesCollection().where("userId", "==", req.userId).limit(20).get();
  const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  messages.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
  return res.json({ messages });
};

export const generateResponse = async (req: AuthRequest, res: Response) => {
  const { text } = req.body as { text: string };
  const userId = req.userId as string;
  const recent = await messagesCollection().where("userId", "==", userId).limit(5).get();
  const recentMessages = recent.docs.map((doc) => doc.data());
  recentMessages.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
  const context = recentMessages.map((doc: any) => doc.text).join(" ");
  const response = await generateSupportResponse(text, context, { userId, purpose: "chat_response" });
  const timezone = await getUserTimezone(userId);
  const dayKey = getDayKey(new Date(), timezone);
  await messagesCollection().add({
    userId: req.userId,
    sender: "ai",
    text: response.text,
    dayKey,
    timezone,
    createdAt: new Date().toISOString(),
  });
  return res.json({ response });
};

export const getTodaySummary = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const timezone = await getUserTimezone(userId);
  const summary = await getDailySummary(userId, timezone);
  return res.json({ summary });
};
