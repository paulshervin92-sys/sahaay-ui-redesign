import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { getSession } from "../services/auth/sessionService.js";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const sessionId = req.cookies?.[env.SESSION_COOKIE_NAME];
  if (!sessionId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: "unauthorized" });
  }

  req.userId = session.userId;
  return next();
};
