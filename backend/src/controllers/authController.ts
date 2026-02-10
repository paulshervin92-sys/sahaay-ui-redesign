import type { Request, Response } from "express";
import { authenticateUser, registerUser } from "../services/auth/authService.js";
import { createSession, deleteSession } from "../services/auth/sessionService.js";
import { env } from "../config/env.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

export const register = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body as { email: string; password: string; displayName?: string };
  const user = await registerUser(email, password, displayName);
  const session = await createSession(user.userId);
  res.cookie(env.SESSION_COOKIE_NAME, session.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
  return res.json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await authenticateUser(email, password);
  const session = await createSession(user.userId);
  res.cookie(env.SESSION_COOKIE_NAME, session.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
  return res.json({ user });
};

export const logout = async (req: AuthRequest, res: Response) => {
  const sessionId = req.cookies?.[env.SESSION_COOKIE_NAME];
  if (sessionId) {
    await deleteSession(sessionId);
  }
  res.clearCookie(env.SESSION_COOKIE_NAME);
  return res.json({ ok: true });
};

export const me = async (req: AuthRequest, res: Response) => {
  return res.json({ userId: req.userId });
};
