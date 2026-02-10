import { runWithFallback, safeDefaultResponse } from "./aiService.js";

export const generateSupportResponse = async (text: string, context: string) => {
  const messages = [
    {
      role: "system" as const,
      content: "You are a supportive mental wellness assistant. Respond with empathy, avoid medical claims, and keep it concise.",
    },
    { role: "user" as const, content: `${text}\n\nContext: ${context}` },
  ];

  const result = await runWithFallback(messages);
  if (!result.content) {
    return safeDefaultResponse("I am here with you. Do you want to share a little more about what you are feeling?");
  }

  return { text: result.content, usedFallback: false, model: result.model };
};
