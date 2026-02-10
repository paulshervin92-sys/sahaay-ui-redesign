import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { upsertDailyCheckIn, getDailyCheckIns } from "../services/checkin/checkinService.js";
import { classifyEmotion } from "../services/emotion/emotionEngine.js";

export const createCheckIn = async (req: AuthRequest, res: Response) => {
  const { mood, note, timezone, createdAt } = req.body as { mood: any; note?: string; timezone: string; createdAt?: string };
  const emotion = note ? await classifyEmotion(note) : null;
  const sentimentScore = emotion?.sentimentScore ?? 0.5;
  const result = await upsertDailyCheckIn(req.userId as string, timezone, { mood, note, sentimentScore, createdAt });
  return res.json({ result, emotion });
};

export const listCheckIns = async (req: AuthRequest, res: Response) => {
  const checkIns = await getDailyCheckIns(req.userId as string);
  return res.json({ checkIns });
};
