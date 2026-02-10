import type { Mood } from "../checkin/checkinService.js";

export type CopingCategory = "breathing" | "grounding" | "cognitive" | "movement" | "reflection";
export type IntensityLevel = "low" | "medium" | "high";

export interface CopingTool {
  id: string;
  title: string;
  description: string;
  category: CopingCategory;
  supportedMoods: Mood[];
  intensityLevel: IntensityLevel;
  durationMinutes: number;
  type: string;
}

export interface RecommendedTool extends CopingTool {
  score: number;
  reason: string;
}

export interface RecommendationContext {
  currentMood: Mood | null;
  moodIntensity: number;
  recentChatSummary: string;
  chatKeywords: string[];
}

const CRISIS_KEYWORDS = [
  "panic",
  "overwhelmed",
  "heart racing",
  "cant breathe",
  "scared",
  "terrified",
  "anxiety attack",
  "out of control",
  "dizzy",
  "shaking",
];

const LOW_MOOD_KEYWORDS = [
  "tired",
  "hopeless",
  "alone",
  "sad",
  "depressed",
  "empty",
  "worthless",
  "numb",
  "crying",
  "heavy",
  "dark",
];

const STRESS_KEYWORDS = [
  "stressed",
  "overloaded",
  "too much",
  "pressure",
  "deadline",
  "exhausted",
  "tense",
  "tight",
  "sore",
  "headache",
];

export const analyzeChatSentiment = (chatText: string) => {
  const lower = chatText.toLowerCase();
  const keywords: string[] = [];

  const hasCrisis = CRISIS_KEYWORDS.some((kw) => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });

  const hasLowMood = LOW_MOOD_KEYWORDS.some((kw) => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });

  const hasStress = STRESS_KEYWORDS.some((kw) => {
    if (lower.includes(kw)) {
      keywords.push(kw);
      return true;
    }
    return false;
  });

  return { keywords, hasCrisis, hasLowMood, hasStress };
};

export const getMoodIntensity = (mood: Mood | null): number => {
  const intensityMap: Record<Mood, number> = {
    anxious: 8,
    frustrated: 7,
    sad: 6,
    neutral: 4,
    calm: 3,
    happy: 2,
  };

  return mood ? intensityMap[mood] : 5;
};

const scoreTool = (tool: CopingTool, context: RecommendationContext) => {
  let score = 0;
  if (context.currentMood && tool.supportedMoods.includes(context.currentMood)) {
    score += 40;
  } else if (context.currentMood) {
    score += 20;
  }

  const sentiment = analyzeChatSentiment(context.recentChatSummary);
  if (sentiment.hasCrisis) {
    if (tool.category === "breathing" || tool.category === "grounding") score += 30;
  } else if (sentiment.hasLowMood) {
    if (tool.category === "reflection" || tool.category === "cognitive") score += 30;
  } else if (sentiment.hasStress) {
    if (tool.category === "movement" || tool.category === "grounding") score += 30;
  }

  if (context.moodIntensity >= 7) {
    if (tool.intensityLevel === "high") score += 20;
    if (tool.intensityLevel === "medium") score += 10;
  } else if (context.moodIntensity >= 4) {
    if (tool.intensityLevel === "medium") score += 20;
    if (tool.intensityLevel === "low") score += 15;
  } else {
    if (tool.intensityLevel === "low") score += 20;
    if (tool.intensityLevel === "medium") score += 10;
  }

  if (!context.currentMood || context.currentMood === "neutral") {
    if (tool.durationMinutes <= 3) score += 10;
    else if (tool.durationMinutes <= 5) score += 5;
  }

  return Math.min(score, 100);
};

const generateExplanation = (tool: CopingTool, context: RecommendationContext) => {
  const reasons: string[] = [];
  const sentiment = analyzeChatSentiment(context.recentChatSummary);

  if (context.currentMood) {
    reasons.push(`you felt ${context.currentMood} today`);
  }

  if (sentiment.hasCrisis && (tool.category === "breathing" || tool.category === "grounding")) {
    reasons.push("you mentioned feeling overwhelmed");
  } else if (sentiment.hasLowMood && (tool.category === "reflection" || tool.category === "cognitive")) {
    reasons.push("you expressed feelings of sadness or hopelessness");
  } else if (sentiment.hasStress && (tool.category === "movement" || tool.category === "grounding")) {
    reasons.push("you mentioned feeling stressed or tense");
  }

  if (context.moodIntensity >= 7 && tool.intensityLevel === "high") {
    reasons.push("this offers quick relief");
  }

  if (reasons.length === 0) {
    return `This ${tool.category} technique is gentle and effective.`;
  }

  return `This technique is suggested because ${reasons.join(" and ")}.`;
};

export const getRecommendedCopingTools = (tools: CopingTool[], context: RecommendationContext): RecommendedTool[] => {
  const scored = tools.map((tool) => ({
    ...tool,
    score: scoreTool(tool, context),
    reason: generateExplanation(tool, context),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
};
