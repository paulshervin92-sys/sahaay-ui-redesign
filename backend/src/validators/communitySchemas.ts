import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    text: z.string().min(1),
    category: z.string().min(1),
    type: z.string().optional(),
    question: z.string().optional(),
    options: z.array(z.string()).optional(),
  }),
});

export const reportPostSchema = z.object({
  body: z.object({
    postId: z.string().min(1),
    category: z.string().min(1),
    anonymous: z.boolean(),
  }),
});

export const likePostSchema = z.object({
  body: z.object({
    postId: z.string().min(1),
    liked: z.boolean(),
  }),
});
