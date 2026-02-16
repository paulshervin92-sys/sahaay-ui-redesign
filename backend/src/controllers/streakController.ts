import { getFirestore } from "../config/firebase.js";
const userStreaksCollection = () => getFirestore().collection("userStreaks");
const userRewardsCollection = () => getFirestore().collection("userRewards");
import type { Request, Response } from "express";
import { updateUserStreak } from "../services/streakService.js";

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getStreak = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const streakDoc = await userStreaksCollection().doc(userId).get();
  const rewardDoc = await userRewardsCollection().doc(userId).get();
  return res.json({
    streak: streakDoc.exists ? streakDoc.data() : {},
    rewards: rewardDoc.exists ? rewardDoc.data() : { unlockedRewards: [], activePremiumUntil: null }
  });
};

export const getRewards = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  const rewardDoc = await userRewardsCollection().doc(userId).get();
  return res.json(rewardDoc.exists ? rewardDoc.data() : { unlockedRewards: [], activePremiumUntil: null });
};

export const updateStreak = async (req: AuthenticatedRequest, res: Response) => {
  const { activityType } = req.body;
  const userId = req.userId;
  const timezone = req.body.timezone || "UTC";

  if (!userId || !activityType) {
    return res.status(400).json({ error: "activityType required" });
  }
  try {
    const result = await updateUserStreak(userId, activityType, timezone);
    return res.json(result);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "Failed to update streak" });
    }
  }
};
