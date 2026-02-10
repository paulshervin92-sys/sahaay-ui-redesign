import { openaiClient } from "./openaiClient.js";

const FALLBACK_MODELS = ["gpt-4.1-mini", "gpt-4o-mini", "gpt-3.5-turbo"] as const;

const isRetryable = (err: unknown) => {
  const anyErr = err as { status?: number; code?: string; message?: string };
  const status = anyErr?.status ?? 0;
  if (status === 429 || status === 408 || status === 500 || status === 502 || status === 503 || status === 504) {
    return true;
  }
  if (anyErr?.code && ["rate_limit_exceeded", "insufficient_quota", "ETIMEDOUT", "ENOTFOUND"].includes(anyErr.code)) {
    return true;
  }
  return false;
};

export const runWithFallback = async (messages: Array<{ role: "system" | "user"; content: string }>, responseFormat?: { type: "json_object" }) => {
  let lastError: unknown = null;

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await openaiClient.chat.completions.create({
        model,
        messages,
        temperature: 0.2,
        response_format: responseFormat,
      });
      const content = response.choices[0]?.message?.content ?? "";
      if (content) {
        return { content, model, error: null };
      }
    } catch (err) {
      lastError = err;
      if (!isRetryable(err)) {
        break;
      }
    }
  }

  return { content: "", model: null, error: lastError };
};

export const safeDefaultResponse = (fallbackText: string) => {
  return {
    text: fallbackText,
    usedFallback: true,
  };
};
