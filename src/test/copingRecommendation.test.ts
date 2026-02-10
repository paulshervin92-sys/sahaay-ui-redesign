/**
 * Unit tests for AI-driven coping recommendation engine
 * 
 * Run with: npm test copingRecommendation.test.ts
 */

import { describe, it, expect } from "vitest";
import {
  analyzeChatSentiment,
  getMoodIntensity,
  buildRecommendationContext,
  getRecommendedCopingTools,
  type RecommendationContext,
} from "@/lib/copingRecommendation";
import { EVIDENCE_BASED_COPING_TOOLS } from "@/lib/copingToolsData";
import type { Mood } from "@/types";

describe("Sentiment Analysis", () => {
  it("detects crisis keywords", () => {
    const result = analyzeChatSentiment("I'm having a panic attack and can't breathe");
    expect(result.hasCrisis).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.keywords).toContain("panic");
  });

  it("detects low mood keywords", () => {
    const result = analyzeChatSentiment("Feeling hopeless and alone today");
    expect(result.hasLowMood).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.keywords).toContain("hopeless");
  });

  it("detects stress keywords", () => {
    const result = analyzeChatSentiment("So stressed with deadlines and feeling exhausted");
    expect(result.hasStress).toBe(true);
    expect(result.keywords.length).toBeGreaterThan(0);
    expect(result.keywords).toContain("stressed");
  });

  it("handles neutral text", () => {
    const result = analyzeChatSentiment("Just checking in today");
    expect(result.hasCrisis).toBe(false);
    expect(result.hasLowMood).toBe(false);
    expect(result.hasStress).toBe(false);
    expect(result.keywords.length).toBe(0);
  });
});

describe("Mood Intensity Mapping", () => {
  it("assigns correct intensity for anxious mood", () => {
    expect(getMoodIntensity("anxious")).toBe(8);
  });

  it("assigns correct intensity for happy mood", () => {
    expect(getMoodIntensity("happy")).toBe(2);
  });

  it("assigns default intensity for null mood", () => {
    expect(getMoodIntensity(null)).toBe(5);
  });
});

describe("Recommendation Context Builder", () => {
  it("builds context from recent check-ins", () => {
    const today = new Date().toISOString();
    const checkIns = [
      { mood: "anxious" as Mood, createdAt: today },
      { mood: "calm" as Mood, createdAt: "2024-01-01T00:00:00Z" }, // Old check-in
    ];

    const context = buildRecommendationContext(checkIns, []);
    
    expect(context.currentMood).toBe("anxious");
    expect(context.moodIntensity).toBe(8);
  });

  it("extracts chat summary from messages", () => {
    const chatMessages = [
      { text: "I'm having a panic attack" },
      { text: "Everything feels overwhelming" },
    ];

    const context = buildRecommendationContext([], chatMessages);
    
    expect(context.recentChatSummary).toContain("panic attack");
    expect(context.recentChatSummary).toContain("overwhelming");
    expect(context.chatKeywords.length).toBeGreaterThan(0);
    expect(context.chatKeywords).toContain("panic");
  });

  it("handles empty data gracefully", () => {
    const context = buildRecommendationContext([], []);
    
    expect(context.currentMood).toBe(null);
    expect(context.moodIntensity).toBe(5);
    expect(context.recentChatSummary).toBe("");
    expect(context.chatKeywords.length).toBe(0);
  });
});

describe("Recommendation Engine", () => {
  it("prioritizes breathing tools for anxious crisis", () => {
    const context: RecommendationContext = {
      currentMood: "anxious",
      moodIntensity: 8,
      recentChatSummary: "I'm having a panic attack and can't breathe",
      chatKeywords: ["panic", "can't breathe"],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Top 3 should include breathing or grounding techniques
    const topCategories = recommendations.slice(0, 3).map(t => t.category);
    expect(topCategories.filter(c => c === "breathing" || c === "grounding").length).toBeGreaterThan(0);
    
    // Should have high scores
    expect(recommendations[0].score).toBeGreaterThan(50);
  });

  it("prioritizes reflection tools for low mood", () => {
    const context: RecommendationContext = {
      currentMood: "sad",
      moodIntensity: 6,
      recentChatSummary: "Feeling hopeless and worthless today",
      chatKeywords: ["hopeless", "worthless"],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Should include reflection or cognitive tools in top 3
    const topCategories = recommendations.slice(0, 3).map(t => t.category);
    expect(topCategories.filter(c => c === "reflection" || c === "cognitive").length).toBeGreaterThan(0);
  });

  it("provides balanced recommendations for neutral mood", () => {
    const context: RecommendationContext = {
      currentMood: "neutral",
      moodIntensity: 4,
      recentChatSummary: "",
      chatKeywords: [],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Should return all tools
    expect(recommendations.length).toBe(EVIDENCE_BASED_COPING_TOOLS.length);
    
    // Scores should be reasonable (not all zeros or all 100s)
    const scores = recommendations.map(t => t.score);
    expect(Math.max(...scores)).toBeLessThan(100);
    expect(Math.min(...scores)).toBeGreaterThan(0);
  });

  it("generates explanations for all recommendations", () => {
    const context: RecommendationContext = {
      currentMood: "anxious",
      moodIntensity: 8,
      recentChatSummary: "Feeling stressed and overwhelmed",
      chatKeywords: ["stressed", "overwhelmed"],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // All recommendations should have reasons
    recommendations.forEach(tool => {
      expect(tool.reason).toBeTruthy();
      expect(tool.reason.length).toBeGreaterThan(0);
    });
  });

  it("sorts recommendations by score descending", () => {
    const context: RecommendationContext = {
      currentMood: "anxious",
      moodIntensity: 8,
      recentChatSummary: "Panic attack",
      chatKeywords: ["panic"],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Verify descending order
    for (let i = 0; i < recommendations.length - 1; i++) {
      expect(recommendations[i].score).toBeGreaterThanOrEqual(recommendations[i + 1].score);
    }
  });

  it("handles edge case: no supported moods match", () => {
    // Create context with a mood that few tools support
    const context: RecommendationContext = {
      currentMood: "happy",
      moodIntensity: 2,
      recentChatSummary: "",
      chatKeywords: [],
    };

    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Should still return recommendations (with lower scores)
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].score).toBeGreaterThan(0);
  });
});

describe("Integration Test: Full Workflow", () => {
  it("recommends appropriate tools for panic scenario", () => {
    // Simulate user data
    const today = new Date().toISOString();
    const checkIns = [
      { mood: "anxious" as Mood, createdAt: today },
    ];
    const chatMessages = [
      { text: "I'm having a panic attack" },
      { text: "My heart is racing and I can't breathe" },
    ];

    // Build context
    const context = buildRecommendationContext(checkIns, chatMessages);
    
    // Get recommendations
    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    // Assertions
    expect(context.currentMood).toBe("anxious");
    expect(context.chatKeywords).toContain("panic");
    
    const topTool = recommendations[0];
    expect(topTool.category).toMatch(/breathing|grounding/);
    expect(topTool.score).toBeGreaterThan(60);
    expect(topTool.reason).toContain("anxious");
  });

  it("recommends appropriate tools for sadness scenario", () => {
    const today = new Date().toISOString();
    const checkIns = [
      { mood: "sad" as Mood, createdAt: today },
    ];
    const chatMessages = [
      { text: "Feeling hopeless and alone" },
      { text: "Everything feels dark" },
    ];

    const context = buildRecommendationContext(checkIns, chatMessages);
    const recommendations = getRecommendedCopingTools(EVIDENCE_BASED_COPING_TOOLS, context);
    
    expect(context.currentMood).toBe("sad");
    expect(context.chatKeywords).toContain("hopeless");
    
    const topCategories = recommendations.slice(0, 3).map(t => t.category);
    expect(topCategories.filter(c => c === "reflection" || c === "cognitive").length).toBeGreaterThan(0);
  });
});
