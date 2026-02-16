import type { Response } from "express";
import { getFirestore } from "../config/firebase.js";

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


const getUserTimezone = async (userId: string) => {
  const doc = await getFirestore().collection("settings").doc(userId).get();
  return (doc.data() as { timezone?: string })?.timezone || "UTC";
};

export const createJournal = async (req: AuthRequest, res: Response) => {

  const { prompt, entry, createdAt, eventTime } = req.body as { prompt: string; entry: string; createdAt?: string; eventTime?: string };
  const userId = req.userId as string;
  const timezone = await getUserTimezone(userId);

  const created = await createJournalEntry(userId, { prompt, entry, createdAt, eventTime }, timezone);
  return res.json({ entry: created });
};
