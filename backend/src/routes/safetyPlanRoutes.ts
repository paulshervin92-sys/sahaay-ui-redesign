import { Router } from "express";
import { getPlan, updatePlan } from "../controllers/safetyPlanController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateSafetyPlanSchema } from "../validators/safetyPlanSchemas.js";

export const safetyPlanRoutes = Router();

safetyPlanRoutes.get("/", requireAuth, asyncHandler(getPlan));
safetyPlanRoutes.put("/", requireAuth, validate(updateSafetyPlanSchema), asyncHandler(updatePlan));
