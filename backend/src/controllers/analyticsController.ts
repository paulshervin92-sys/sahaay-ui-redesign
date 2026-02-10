import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { buildAnalytics } from "../services/analytics/analyticsService.js";

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  const timezone = (req.query.timezone as string) || "UTC";
  const analytics = await buildAnalytics(req.userId as string, timezone);
  return res.json({ analytics });
};
