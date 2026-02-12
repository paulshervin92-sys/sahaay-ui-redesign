import type { Request, Response } from "express";
import type { CookieOptions } from "express";
import { authenticateUser, registerUser } from "../services/auth/authService.js";
import { createSession, deleteSession } from "../services/auth/sessionService.js";
import { env } from "../config/env.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

const getCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: env.NODE_ENV === "production" ? "none" : "lax",
  secure: env.NODE_ENV === "production",
  path: "/",
});

export const register = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body as { email: string; password: string; displayName?: string };
  const user = await registerUser(email, password, displayName);
  const session = await createSession(user.userId);
  
  // Set cookie for web app (backward compatible)
  res.cookie(env.SESSION_COOKIE_NAME, session.sessionId, getCookieOptions());
  
  // Return token in response body for mobile app
  return res.json({ 
    user,
    token: session.sessionId,  // Mobile app uses this
    session: session.sessionId // For compatibility
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await authenticateUser(email, password);
  const session = await createSession(user.userId);
  
  // Set cookie for web app (backward compatible)
  res.cookie(env.SESSION_COOKIE_NAME, session.sessionId, getCookieOptions());
  
  // Return token in response body for mobile app
  return res.json({ 
    user,
    token: session.sessionId,  // Mobile app uses this
    session: session.sessionId // For compatibility
  });
};

export const logout = async (req: AuthRequest, res: Response) => {
  // Support both cookie and token-based auth
  let sessionId = req.cookies?.[env.SESSION_COOKIE_NAME];
  
  // Check Authorization header for mobile
  if (!sessionId && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      sessionId = authHeader.substring(7);
    }
  }
  
  if (sessionId) {
    await deleteSession(sessionId);
  }
  res.clearCookie(env.SESSION_COOKIE_NAME, getCookieOptions());
  return res.json({ ok: true });
};

export const me = async (req: AuthRequest, res: Response) => {
  return res.json({ userId: req.userId });
};
