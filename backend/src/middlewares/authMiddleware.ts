import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { getSession } from "../services/auth/sessionService.js";

export interface AuthRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  // Support both cookie-based (web) and token-based (mobile) authentication
  let sessionId = req.cookies?.[env.SESSION_COOKIE_NAME];
  
  // If no cookie, check Authorization header (for mobile app)
  if (!sessionId && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      sessionId = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }
  
  if (!sessionId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const session = await getSession(sessionId);
  if (!session) {
    return res.status(401).json({ error: "unauthorized" });
  }

  req.userId = session.userId;
  req.isAdmin = session.isAdmin;
  return next();
};
