import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";
import { classifyEmotion } from "../services/emotion/emotionEngine.js";
import { detectCrisis } from "../services/emotion/crisisService.js";
import { generateSupportResponse } from "../services/ai/responseService.js";

const messagesCollection = () => getFirestore().collection("chatMessages");

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
  const emotion = await classifyEmotion(text);
  const crisis = await detectCrisis(text);
  const tags = extractTags(text);

  const doc = await messagesCollection().add({
    userId: req.userId,
    sender: "user",
    text,
    tags,
    emotion,
    crisis,
    createdAt: new Date().toISOString(),
  });

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
  const recent = await messagesCollection().where("userId", "==", req.userId).limit(5).get();
  const recentMessages = recent.docs.map((doc) => doc.data());
  recentMessages.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
  const context = recentMessages.map((doc: any) => doc.text).join(" ");
  const response = await generateSupportResponse(text, context);
  await messagesCollection().add({
    userId: req.userId,
    sender: "ai",
    text: response.text,
    createdAt: new Date().toISOString(),
  });
  return res.json({ response });
};
