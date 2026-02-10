import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getSafetyPlan, upsertSafetyPlan } from "../services/safety/safetyPlanService.js";

export const getPlan = async (req: AuthRequest, res: Response) => {
  const plan = await getSafetyPlan(req.userId as string);
  return res.json({ plan });
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  const updated = await upsertSafetyPlan(req.userId as string, req.body);
  return res.json({ plan: updated });
};
