import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: "request_error", message: err.message });
  }

  const message = err instanceof Error ? err.message : "Unknown error";
  return res.status(500).json({ error: "server_error", message });
};
