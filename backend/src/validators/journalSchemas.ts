import { z } from "zod";

export const createJournalSchema = z.object({
  body: z.object({
    prompt: z.string().min(1),
    entry: z.string().min(1),
    createdAt: z.string().optional(),
  }),
});
