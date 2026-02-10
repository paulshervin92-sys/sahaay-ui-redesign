import { runWithFallback } from "../ai/aiService.js";

const crisisKeywords = [
  "suicide",
  "kill myself",
  "end it all",
  "self harm",
  "dont want to live",
  "i want to die",
];

export interface CrisisResult {
  severity: "none" | "low" | "high";
  rationale: string;
  usedFallback: boolean;
}

export const detectCrisis = async (text: string): Promise<CrisisResult> => {
  const messages = [
    { role: "system" as const, content: "Detect crisis risk. Return JSON with severity (none, low, high) and rationale." },
    { role: "user" as const, content: text },
  ];

  const response = await runWithFallback(messages, { type: "json_object" });
  if (response.content) {
    try {
      const parsed = JSON.parse(response.content) as CrisisResult;
      if (parsed?.severity) {
        return { ...parsed, usedFallback: false };
      }
    } catch {
      // fall through
    }
  }

  const lower = text.toLowerCase();
  const matched = crisisKeywords.some((kw) => lower.includes(kw));
  return {
    severity: matched ? "high" : "none",
    rationale: matched ? "Matched crisis keyword" : "No keyword match",
    usedFallback: true,
  };
};
