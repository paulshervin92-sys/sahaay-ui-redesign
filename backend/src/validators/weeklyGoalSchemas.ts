import { z } from "zod";

export const updateWeeklyGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    targetPerWeek: z.number().min(1).max(7),
    updatedAt: z.string().optional(),
  }),
});
