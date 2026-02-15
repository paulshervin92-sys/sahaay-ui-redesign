import { Router } from "express";
import * as eventController from "../controllers/eventController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const eventRoutes = Router();

eventRoutes.get("/:date", requireAuth, asyncHandler(eventController.getEvents));
eventRoutes.post("/", requireAuth, asyncHandler(eventController.createEvent));
eventRoutes.put("/:id", requireAuth, asyncHandler(eventController.updateEvent));
eventRoutes.delete("/:id", requireAuth, asyncHandler(eventController.deleteEvent));
