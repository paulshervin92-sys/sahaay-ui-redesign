import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getWeeklyGoal, upsertWeeklyGoal } from "../services/weeklyGoal/weeklyGoalService.js";

export const getGoal = async (req: AuthRequest, res: Response) => {
  const goal = await getWeeklyGoal(req.userId as string);
  return res.json({ goal });
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  const goal = await upsertWeeklyGoal(req.userId as string, req.body);
  return res.json({ goal });
};
