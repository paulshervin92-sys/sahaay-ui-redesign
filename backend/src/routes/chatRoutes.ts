import { Router } from "express";
import { sendMessage, listMessages, generateResponse, getTodaySummary } from "../controllers/chatController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendMessageSchema } from "../validators/chatSchemas.js";

export const chatRoutes = Router();

chatRoutes.get("/", requireAuth, asyncHandler(listMessages));
chatRoutes.get("/summary/today", requireAuth, asyncHandler(getTodaySummary));
chatRoutes.post("/", requireAuth, validate(sendMessageSchema), asyncHandler(sendMessage));
chatRoutes.post("/respond", requireAuth, validate(sendMessageSchema), asyncHandler(generateResponse));
