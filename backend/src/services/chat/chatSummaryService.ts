import { getFirestore } from "../../config/firebase.js";
import { getDayKey } from "../../utils/date.js";
import { runWithFallback, safeDefaultResponse } from "../ai/aiService.js";
import type { EmotionResult } from "../emotion/emotionEngine.js";

const summariesCollection = () => getFirestore().collection("chatDailySummaries");
const messagesCollection = () => getFirestore().collection("chatMessages");

export interface DailyChatSummary {
  id: string;
  userId: string;
  dayKey: string;
  timezone: string;
  summary: string;
  topEmotions: string[];
  updatedAt: string;
  messageCount: number;
}

const buildTranscript = (messages: Array<{ sender?: string; text?: string }>) => {
  return messages
    .map((msg) => {
      const sender = msg.sender === "ai" ? "Assistant" : "User";
      return `${sender}: ${msg.text ?? ""}`.trim();
    })
    .filter(Boolean)
    .join("\n");
};

export const generateDailySummary = async (
  userId: string,
  timezone: string,
  latestEmotion?: EmotionResult,
): Promise<DailyChatSummary> => {
  const now = new Date();
  const dayKey = getDayKey(now, timezone);
  const snapshot = await messagesCollection()
    .where("userId", "==", userId)
    .where("dayKey", "==", dayKey)
    .get();

  const messages = snapshot.docs
    .map((doc) => doc.data())
    .filter((msg) => msg.text)
    .sort((a: any, b: any) => (a.createdAt < b.createdAt ? -1 : 1));

  const transcript = buildTranscript(messages.slice(-30));
  const messagesCount = messages.length;

  const defaultSummary = safeDefaultResponse("You shared a few thoughts today. Keep checking in with how you are feeling.");

  const prompt = `Summarize today's conversation in 3-5 sentences. Mention the overall emotional tone and key topics. Return JSON with {"summary": "...", "topEmotions": ["..."]}.\n\nTranscript:\n${transcript}`;

  const result = await runWithFallback(
    [
      { role: "system" as const, content: "Return JSON only." },
      { role: "user" as const, content: prompt },
    ],
    { type: "json_object" },
    { userId, purpose: "chat_daily_summary" },
  );

  let summaryText = defaultSummary.text;
  let topEmotions: string[] = [];

  if (result.content) {
    try {
      const parsed = JSON.parse(result.content) as { summary?: string; topEmotions?: string[] };
      if (parsed.summary) summaryText = parsed.summary;
      if (Array.isArray(parsed.topEmotions)) topEmotions = parsed.topEmotions;
    } catch {
      summaryText = defaultSummary.text;
    }
  }

  if (!topEmotions.length && latestEmotion?.primary) {
    topEmotions = [latestEmotion.primary, ...(latestEmotion.secondary ?? [])].slice(0, 2);
  }

  const docId = `${userId}_${dayKey}`;
  const updatedAt = new Date().toISOString();
  const payload = {
    userId,
    dayKey,
    timezone,
    summary: summaryText,
    topEmotions,
    updatedAt,
    messageCount: messagesCount,
  };

  await summariesCollection().doc(docId).set(payload, { merge: true });

  return { id: docId, ...payload };
};

export const getDailySummary = async (userId: string, timezone: string) => {
  const dayKey = getDayKey(new Date(), timezone);
  const doc = await summariesCollection().doc(`${userId}_${dayKey}`).get();
  return doc.data() ?? null;
};
