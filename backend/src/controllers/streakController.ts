import { getFirestore } from "../config/firebase.js";
const userStreaksCollection = () => getFirestore().collection("userStreaks");
const userRewardsCollection = () => getFirestore().collection("userRewards");
export const getStreak = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const streakDoc = await userStreaksCollection().doc(userId).get();
  const rewardDoc = await userRewardsCollection().doc(userId).get();
  return res.json({
    streak: streakDoc.exists ? streakDoc.data() : {},
    rewards: rewardDoc.exists ? rewardDoc.data() : { unlockedRewards: [], activePremiumUntil: null }
  });
};

export const getRewards = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const rewardDoc = await userRewardsCollection().doc(userId).get();
  return res.json(rewardDoc.exists ? rewardDoc.data() : { unlockedRewards: [], activePremiumUntil: null });
};
import type { Request, Response } from "express";
import { updateUserStreak } from "../services/streakService.js";

export const updateStreak = async (req: Request, res: Response) => {
  const { userId, activityType } = req.body;
  if (!userId || !activityType) {
    return res.status(400).json({ error: "userId and activityType required" });
  }
  try {
    const result = await updateUserStreak(userId, activityType);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to update streak" });
  }
};
