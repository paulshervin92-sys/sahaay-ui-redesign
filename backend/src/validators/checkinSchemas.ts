import { z } from "zod";

export const createCheckInSchema = z.object({
  body: z.object({
    mood: z.enum(["happy", "calm", "neutral", "sad", "anxious", "frustrated"]),
    note: z.string().optional(),
    timezone: z.string().default("UTC"),
    createdAt: z.string().optional(),
  }),
});
