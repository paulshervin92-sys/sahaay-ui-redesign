import { DateTime } from "luxon";
import { getDailyCheckIns } from "../checkin/checkinService.js";

const moodScore = (mood: string) => {
  switch (mood) {
    case "happy":
      return 5;
    case "calm":
      return 4;
    case "neutral":
      return 3;
    case "sad":
      return 2;
    case "anxious":
    case "frustrated":
      return 1;
    default:
      return 3;
  }
};

export const buildAnalytics = async (userId: string, timezone: string) => {
  const daily = await getDailyCheckIns(userId);
  const dayKeys = new Set(daily.map((item) => item.dayKey));
  const now = DateTime.now().setZone(timezone);

  let streak = 0;
  let cursor = now.startOf("day");
  while (dayKeys.has(cursor.toFormat("yyyy-LL-dd"))) {
    streak += 1;
    cursor = cursor.minus({ days: 1 });
  }

  const sentimentByDay = daily.map((item) => {
    const entries = Array.isArray(item.entries) ? item.entries : [];
    const sentiment = entries.reduce((sum: number, entry: any) => sum + (entry.sentimentScore ?? 0.5), 0) / (entries.length || 1);
    const normalizedMood = entries.length ? entries[0].mood : "neutral";
    return {
      dayKey: item.dayKey,
      sentiment,
      normalizedMood,
      moodScore: moodScore(normalizedMood),
    };
  });

  const averageSentiment = sentimentByDay.reduce((sum, day) => sum + day.sentiment, 0) / (sentimentByDay.length || 1);

  return {
    streak,
    averageSentiment,
    sentimentByDay,
  };
};
