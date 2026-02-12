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
import { adminRoutes } from "./routes/adminRoutes.js";

export const app = express();

app.use(helmet());

// CORS configuration for both web and mobile apps
const allowedOrigins = [
  env.CORS_ORIGIN,              // Web frontend
  'http://localhost:8081',      // React Native Metro bundler
  'http://10.0.2.2:8081',      // Android emulator
  'capacitor://localhost',      // Capacitor (if used)
];

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for development - tighten in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
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
app.use("/admin", adminRoutes);

app.use(errorHandler);
