import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { upsertReminder, registerSubscription } from "../services/notification/notificationService.js";

export const updateReminder = async (req: AuthRequest, res: Response) => {
  const { timezone, time, enabled } = req.body as { timezone: string; time: string; enabled: boolean };
  await upsertReminder(req.userId as string, timezone, time, enabled);
  return res.json({ ok: true });
};

export const registerPush = async (req: AuthRequest, res: Response) => {
  await registerSubscription(req.userId as string, req.body);
  return res.json({ ok: true });
};
