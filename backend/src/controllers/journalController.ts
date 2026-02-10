import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { createJournalEntry, listJournalEntries } from "../services/journal/journalService.js";

export const listJournals = async (req: AuthRequest, res: Response) => {
  const entries = await listJournalEntries(req.userId as string);
  return res.json({ entries });
};

export const createJournal = async (req: AuthRequest, res: Response) => {
  const { prompt, entry, createdAt } = req.body as { prompt: string; entry: string; createdAt?: string };
  const created = await createJournalEntry(req.userId as string, { prompt, entry, createdAt });
  return res.json({ entry: created });
};
