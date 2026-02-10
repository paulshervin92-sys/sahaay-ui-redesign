import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    goals: z.array(z.string()).optional(),
    baselineMood: z.enum(["happy", "calm", "neutral", "sad", "anxious", "frustrated"]).optional(),
    onboardingComplete: z.boolean().optional(),
  }),
});

export const updateSettingsSchema = z.object({
  body: z.object({
    fontScale: z.number().optional(),
    reduceMotion: z.boolean().optional(),
    remindersEnabled: z.boolean().optional(),
    reminderTime: z.string().optional(),
    privateMode: z.boolean().optional(),
    offlineSync: z.boolean().optional(),
    timezone: z.string().optional(),
  }),
});
