import { Router } from "express";
import { listJournals, createJournal, getJournalByDate } from "../controllers/journalController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createJournalSchema } from "../validators/journalSchemas.js";

export const journalRoutes = Router();

journalRoutes.get("/", requireAuth, asyncHandler(listJournals));
journalRoutes.get("/by-date/:date", requireAuth, asyncHandler(getJournalByDate));
journalRoutes.post("/", requireAuth, validate(createJournalSchema), asyncHandler(createJournal));

