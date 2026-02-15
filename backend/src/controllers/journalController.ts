import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { createJournalEntry, listJournalEntries, getJournalEntryByDate } from "../services/journal/journalService.js";

export const listJournals = async (req: AuthRequest, res: Response) => {
  const entries = await listJournalEntries(req.userId as string);
  return res.json({ entries });
};

export const getJournalByDate = async (req: AuthRequest, res: Response) => {
  const { date } = req.params;
  const entry = await getJournalEntryByDate(req.userId as string, date);
  return res.json({ entry });
};

export const createJournal = async (req: AuthRequest, res: Response) => {

  const { prompt, entry, createdAt, eventTime } = req.body as { prompt: string; entry: string; createdAt?: string; eventTime?: string };
  const created = await createJournalEntry(req.userId as string, { prompt, entry, createdAt, eventTime });
  return res.json({ entry: created });
};
