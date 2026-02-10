import { Router } from "express";
import { getGoal, updateGoal } from "../controllers/weeklyGoalController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateWeeklyGoalSchema } from "../validators/weeklyGoalSchemas.js";

export const weeklyGoalRoutes = Router();

weeklyGoalRoutes.get("/", requireAuth, asyncHandler(getGoal));
weeklyGoalRoutes.put("/", requireAuth, validate(updateWeeklyGoalSchema), asyncHandler(updateGoal));
