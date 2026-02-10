import { z } from "zod";

export const updateSafetyPlanSchema = z.object({
  body: z.object({
    updatedAt: z.string().optional(),
    reasonsToLive: z.array(z.string()).optional(),
    warningSigns: z.array(z.string()).optional(),
    triggers: z.array(z.string()).optional(),
    copingSteps: z.array(z.string()).optional(),
    safePlaces: z.array(z.string()).optional(),
    contacts: z.array(z.any()).optional(),
    resources: z.array(z.any()).optional(),
    groundingNotes: z.string().optional(),
  }),
});
