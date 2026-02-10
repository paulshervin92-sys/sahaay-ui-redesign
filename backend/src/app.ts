import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";
import { checkinRoutes } from "./routes/checkinRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import { copingRoutes } from "./routes/copingRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
import { communityRoutes } from "./routes/communityRoutes.js";
import { journalRoutes } from "./routes/journalRoutes.js";
import { safetyPlanRoutes } from "./routes/safetyPlanRoutes.js";
import { weeklyGoalRoutes } from "./routes/weeklyGoalRoutes.js";
import { configRoutes } from "./routes/configRoutes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("combined"));

app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/coping", copingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/safety-plan", safetyPlanRoutes);
app.use("/api/weekly-goal", weeklyGoalRoutes);
app.use("/api/config", configRoutes);

app.use(errorHandler);
