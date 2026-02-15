import { Router } from "express";
import { updateStreak, getStreak, getRewards } from "../controllers/streakController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const streakRoutes = Router();

streakRoutes.post("/update", requireAuth, asyncHandler(updateStreak));
streakRoutes.get("/me", requireAuth, asyncHandler(getStreak));
streakRoutes.get("/rewards", requireAuth, asyncHandler(getRewards));
