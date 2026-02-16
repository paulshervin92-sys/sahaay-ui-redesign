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

    const fallbacks = [
      "I hear you. That sounds like a lot to hold right now. Would you like to tell me more about what's on your mind?",
      "Thank you for sharing that with me. It takes courage to open up. How have you been coping with this lately?",
      "I'm here with you. That sounds like a significant experience. What part of that is feeling the heaviest right now?",
      "I appreciate you telling me this. It's safe to talk here. Is there anything else about that situation you'd like to vent about?",
      "That sounds like a complex emotion. I'm listening—please feel free to share more whenever you're ready."
    ];
    const picked = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return safeDefaultResponse(picked);
  }

  return { text: result.content, usedFallback: false, model: result.model };
};
