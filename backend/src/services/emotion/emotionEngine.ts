import { runWithFallback } from "../ai/aiService.js";

export type EmotionLabel = "happy" | "calm" | "neutral" | "sad" | "anxious" | "frustrated";

export interface EmotionResult {
  primary: EmotionLabel;
  secondary: EmotionLabel[];
  confidence: number;
  sentimentScore: number;
  usedFallback: boolean;
}

export const buildMoodLabel = (emotion: EmotionResult) => {
  if (!emotion.secondary?.length) return emotion.primary;
  if (emotion.confidence >= 0.75) return emotion.primary;
  return `${emotion.primary}/${emotion.secondary[0]}`;
};

const keywordWeights: Record<EmotionLabel, string[]> = {
  happy: ["happy", "grateful", "excited", "joy"],
  calm: ["calm", "relaxed", "steady", "peace"],
  neutral: ["okay", "fine", "neutral"],
  sad: ["sad", "down", "hopeless", "empty", "cry"],
  anxious: ["anxious", "panic", "worried", "overwhelmed", "scared"],
  frustrated: ["frustrated", "angry", "irritated", "stuck", "tense"],
};

const scoreKeywords = (text: string) => {
  const lower = text.toLowerCase();
  const scores: Record<EmotionLabel, number> = {
    happy: 0,
    calm: 0,
    neutral: 0,
    sad: 0,
    anxious: 0,
    frustrated: 0,
  };

  (Object.keys(keywordWeights) as EmotionLabel[]).forEach((label) => {
    keywordWeights[label].forEach((kw) => {
      if (lower.includes(kw)) {
        scores[label] += 1;
      }
    });
  });

  return scores;
};

const normalizeScores = (scores: Record<EmotionLabel, number>) => {
  const entries = Object.entries(scores) as Array<[EmotionLabel, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, value]) => sum + value, 0) || 1;
  const primary = entries[0][0];
  const confidence = Math.min(1, entries[0][1] / total);
  const secondary = entries.filter(([, value]) => value > 0).slice(1).map(([label]) => label);
  const sentimentScore = (scores.happy * 5 + scores.calm * 4 + scores.neutral * 3 + scores.sad * 2 + scores.anxious * 1 + scores.frustrated * 1) / (total * 5);
  return { primary, confidence, secondary, sentimentScore };
};

export const classifyEmotion = async (text: string, meta?: { userId?: string; purpose?: string }): Promise<EmotionResult> => {
  const messages = [
    { 
      role: "system" as const, 
      content: `You are an expert emotion and sentiment analyzer for a mental health app. Analyze the user's text and return JSON with:
- primary: main emotion (happy, calm, neutral, sad, anxious, frustrated)
- secondary: array of other detected emotions
- confidence: how confident you are (0-1)
- sentimentScore: overall positivity score (0=very negative, 0.5=neutral, 1=very positive)

Consider:
- Subtle emotional cues and context
- Mixed emotions (e.g., anxious but hopeful)
- Intensity of language
- Mental health relevant patterns

Return ONLY valid JSON, no explanations.`
    },
    { role: "user" as const, content: text },
  ];

  const response = await runWithFallback(messages, { type: "json_object" }, meta);
  if (response.content) {
    try {
      const parsed = JSON.parse(response.content) as EmotionResult;
      if (parsed && parsed.primary && typeof parsed.confidence === "number") {
        if (parsed.confidence >= 0.7) {
          return { ...parsed, usedFallback: false };
        }
      }
    } catch {
      // fall through
    }
  }

  const scores = scoreKeywords(text);
  const normalized = normalizeScores(scores);
  return {
    primary: normalized.primary,
    secondary: normalized.secondary,
    confidence: Math.max(0.7, normalized.confidence),
    sentimentScore: normalized.sentimentScore,
    usedFallback: true,
  };
};
