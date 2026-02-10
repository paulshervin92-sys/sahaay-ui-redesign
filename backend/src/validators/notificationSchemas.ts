import { z } from "zod";

export const reminderSchema = z.object({
  body: z.object({
    timezone: z.string().default("UTC"),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    enabled: z.boolean(),
  }),
});

export const registerPushSchema = z.object({
  body: z.object({
    type: z.enum(["webpush", "fcm"]),
    endpoint: z.string().optional(),
    keys: z.any().optional(),
    token: z.string().optional(),
  }),
});
