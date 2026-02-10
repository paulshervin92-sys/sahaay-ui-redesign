import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analyticsRoutes = Router();

analyticsRoutes.get("/", requireAuth, asyncHandler(getAnalytics));
