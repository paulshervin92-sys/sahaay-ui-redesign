import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";

const postsCollection = () => getFirestore().collection("communityPosts");
const reportsCollection = () => getFirestore().collection("reports");

export const listPosts = async (_req: AuthRequest, res: Response) => {
  const snapshot = await postsCollection().orderBy("createdAt", "desc").limit(50).get();
  return res.json({ posts: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { text, category } = req.body as { text: string; category: string };
  const doc = await postsCollection().add({
    text,
    category,
    author: "Anonymous",
    likes: 0,
    replies: 0,
    createdAt: new Date().toISOString(),
  });
  return res.json({ id: doc.id });
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
