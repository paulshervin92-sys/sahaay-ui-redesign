
import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";
import { runWithFallback } from "../services/ai/aiService.js";

const postsCollection = () => getFirestore().collection("communityPosts");
const reportsCollection = () => getFirestore().collection("reports");

export const listPosts = async (_req: AuthRequest, res: Response) => {
  const snapshot = await postsCollection().orderBy("createdAt", "desc").limit(50).get();
  return res.json({ posts: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { text, category, type, question, options } = req.body as any;
  let data: any = {
    text,
    category,
    author: "Anonymous",
    likes: 0,
    replies: 0,
    createdAt: new Date().toISOString(),
  };
  if (type === "poll" && question && Array.isArray(options)) {
    data = {
      ...data,
      type: "poll",
      question,
      options: options.map((opt: string) => ({ text: opt, votes: 0, voters: [] })),
    };
  }
  const doc = await postsCollection().add(data);
  return res.json({ id: doc.id });
};

export const votePoll = async (req: AuthRequest, res: Response) => {
  const { postId, optionIdx } = req.body as { postId: string; optionIdx: number };
  const userId = req.userId as string;
  const docRef = postsCollection().doc(postId);
  const snap = await docRef.get();
  if (!snap.exists) return res.status(404).json({ error: "not_found" });
  const data = snap.data() || {};
  if (data.type !== "poll" || !Array.isArray(data.options)) return res.status(400).json({ error: "not_poll" });
  // Remove previous vote
  data.options.forEach((opt: any) => {
    opt.voters = (opt.voters || []).filter((v: string) => v !== userId);
    opt.votes = opt.voters.length;
  });
  // Add new vote
  if (data.options[optionIdx]) {
    data.options[optionIdx].voters.push(userId);
    data.options[optionIdx].votes = data.options[optionIdx].voters.length;
  }
  await docRef.update({ options: data.options });
  return res.json({ options: data.options });
};

export const generatePollOptions = async (req: AuthRequest, res: Response) => {
  const { question } = req.body as { question: string };
  const prompt = `Generate 3-4 concise poll options for the following question. Return as a JSON array of strings.\nQuestion: ${question}`;
  const { content } = await runWithFallback([
    { role: "system", content: "You are a helpful assistant that generates poll options." },
    { role: "user", content: prompt },
  ], { type: "json_object" }, { userId: req.userId, purpose: "generate_poll_options" });
  let options: string[] = [];
  try {
    options = JSON.parse(content);
  } catch {
    options = [];
  }
  return res.json({ options });
};

export const reportPost = async (req: AuthRequest, res: Response) => {
  const { postId, category, anonymous } = req.body as { postId: string; category: string; anonymous: boolean };
  await reportsCollection().add({
    postId,
    category,
    anonymous,
    userId: anonymous ? null : req.userId,
    createdAt: new Date().toISOString(),
  });
  return res.json({ ok: true });
};

export const likePost = async (req: AuthRequest, res: Response) => {
  const { postId, liked } = req.body as { postId: string; liked: boolean };
  const docRef = postsCollection().doc(postId);
  const snap = await docRef.get();
  if (!snap.exists) {
    return res.status(404).json({ error: "not_found" });
  }
  const data = snap.data() || {};
  const likes = Math.max(0, (data.likes || 0) + (liked ? 1 : -1));
  await docRef.update({ likes });
  return res.json({ likes });
};
