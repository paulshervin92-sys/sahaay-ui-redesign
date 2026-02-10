import { Router } from "express";
import { updateReminder, registerPush } from "../controllers/notificationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { registerPushSchema, reminderSchema } from "../validators/notificationSchemas.js";

export const notificationRoutes = Router();

notificationRoutes.post("/reminder", requireAuth, validate(reminderSchema), asyncHandler(updateReminder));
notificationRoutes.post("/register", requireAuth, validate(registerPushSchema), asyncHandler(registerPush));
