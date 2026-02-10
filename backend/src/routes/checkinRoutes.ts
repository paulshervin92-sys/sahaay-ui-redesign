import { Router } from "express";
import { createCheckIn, listCheckIns } from "../controllers/checkinController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createCheckInSchema } from "../validators/checkinSchemas.js";

export const checkinRoutes = Router();

checkinRoutes.get("/", requireAuth, asyncHandler(listCheckIns));
checkinRoutes.post("/", requireAuth, validate(createCheckInSchema), asyncHandler(createCheckIn));
