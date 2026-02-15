import { runWithFallback, safeDefaultResponse } from "./aiService.js";

export const generateSupportResponse = async (text: string, context: string, meta?: { userId?: string; purpose?: string }) => {
  const systemPrompt = context 
    ? `You are Sahaay, a supportive mental wellness companion. You're empathetic, warm, and non-judgmental.

Guidelines:
✓ Validate their feelings first ("That sounds really challenging")
✓ Ask ONE thoughtful follow-up question
✓ Use their emotional language naturally
✓ Be conversational and genuine
✓ Keep responses 2-3 sentences max

✗ Never repeat their exact words back
✗ Don't list multiple questions
✗ Avoid clinical/robotic language
✗ Don't give unsolicited advice

You're in an ongoing conversation. Read the history to understand context, but focus on their CURRENT message.`
    : `You are Sahaay, a supportive mental wellness companion. This is the start of a conversation.

Greet them warmly and ask ONE open-ended question about how they're feeling. Be empathetic and conversational. Keep it to 2 sentences max.`;
  
  const userContent = context 
    ? `---PREVIOUS MESSAGES---\n${context}\n\n---THEIR CURRENT MESSAGE---\n${text}\n\nRespond to what they just said. Acknowledge their feeling, then ask a thoughtful follow-up question.`
    : text;
  
  const messages = [
    {
      role: "system" as const,
      content: systemPrompt,
    },
    { role: "user" as const, content: userContent },
  ];

  const result = await runWithFallback(messages, undefined, meta);
  
  // Log for debugging
  if (!result.content) {
    console.error("[responseService] No content returned from AI:", {
      error: result.error,
      model: result.model,
      text: text.substring(0, 50),
    });
    return safeDefaultResponse("That sounds important. Can you tell me a bit more about how you're feeling?");
  }

  return { text: result.content, usedFallback: false, model: result.model };
};
