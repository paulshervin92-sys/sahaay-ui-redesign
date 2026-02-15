import { runWithFallback, safeDefaultResponse } from "./aiService.js";

export const generateSupportResponse = async (text: string, context: string, meta?: { userId?: string; purpose?: string }) => {
  const systemPrompt = context 
    ? "You are a supportive mental wellness assistant. You're in an ongoing conversation. Read the conversation history to understand context, but FOCUS ON THE CURRENT MESSAGE. Ask thoughtful follow-up questions. Never repeat what the user just said. Keep responses concise and warm."
    : "You are a supportive mental wellness assistant. This is the start of a conversation. Greet warmly and ask an open-ended question. Be empathetic.";
  
  const userContent = context 
    ? `---CONVERSATION HISTORY---\n${context}\n\n---CURRENT MESSAGE---\n${text}\n\nRespond to their current message. Do NOT echo or repeat their message. Reference history only if highly relevant.`
    : text;
  
  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
    { role: "user" as const, content: userContent },
  ];

  const result = await runWithFallback(messages, undefined, meta);
  if (!result.content) {
    return safeDefaultResponse("That sounds important. Can you tell me a bit more about how you're feeling?");
  }

  return { text: result.content, usedFallback: false, model: result.model };
};
