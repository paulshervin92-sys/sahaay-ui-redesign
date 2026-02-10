import { Router } from "express";
import { getRecommendations } from "../controllers/copingController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const copingRoutes = Router();

copingRoutes.get("/recommendations", requireAuth, asyncHandler(getRecommendations));
