import { openaiClient } from "./openaiClient.js";
import { logOpenAiUsage } from "./openaiUsageService.js";

const FALLBACK_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"] as const;

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

export const runWithFallback = async (
  messages: Array<{ role: "system" | "user"; content: string }>,
  responseFormat?: { type: "json_object" },
  meta?: { userId?: string; purpose?: string },
) => {
  let lastError: unknown = null;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const response = await openaiClient.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 150,
        response_format: responseFormat,
      });
      const content = response.choices[0]?.message?.content ?? "";
      if (content) {
        console.log(`[AI] ✓ ${model} success (${response.usage?.total_tokens} tokens)`);
        if (response.usage && meta?.purpose) {
          await logOpenAiUsage({
            userId: meta.userId,
            purpose: meta.purpose,
            model,
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
            createdAt: new Date().toISOString(),
          });
        }
        return { content, model, error: null, usage: response.usage };
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[AI] ✗ ${model} failed: ${errMsg}`);
      lastError = err;
      if (!isRetryable(err)) {
        break;
      }
    }
  }

  console.error("[AI] All models failed, returning empty");
  return { content: "", model: null, error: lastError };
};

export const safeDefaultResponse = (fallbackText: string) => {
  return {
    text: fallbackText,
    usedFallback: true,
  };
};
