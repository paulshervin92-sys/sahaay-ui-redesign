import { DateTime } from "luxon";
import { getFirestore } from "../../config/firebase.js";
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

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

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
    const latestEntry = entries
      .slice()
      .sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1))[0];
    const normalizedMood = latestEntry?.mood || "neutral";
    const moodScoreValue = moodScore(normalizedMood);
    const moodScore10 = Math.round((moodScoreValue / 5) * 10);
    const sentiment10 = Math.round(sentiment * 10);
    const blendedMood = Math.round(0.6 * sentiment10 + 0.4 * moodScore10);
    const stressScore = clamp(10 - blendedMood, 0, 10);
    return {
      dayKey: item.dayKey,
      sentiment,
      normalizedMood,
      moodScore: moodScoreValue,
      moodScore10,
      stressScore,
      entryCount: entries.length,
    };
  });

  const averageSentiment = sentimentByDay.reduce((sum, day) => sum + day.sentiment, 0) / (sentimentByDay.length || 1);

  return {
    streak,
    averageSentiment,
    sentimentByDay,
  };
};

export const getGlobalAnalytics = async () => {
  const db = getFirestore();
  const snapshot = await db.collection("checkinsDaily").get();
  const records = snapshot.docs.map((doc: any) => doc.data());

  const trends: Record<string, { totalSentiment: number; count: number; moods: Record<string, number> }> = {};

  records.forEach((record: any) => {
    const day = record.dayKey;
    if (!trends[day]) trends[day] = { totalSentiment: 0, count: 0, moods: {} };

    const entries = record.entries || [];
    entries.forEach((e: any) => {
      trends[day].totalSentiment += (e.sentimentScore ?? 0.5);
      trends[day].count += 1;
      const mood = e.mood || "neutral";
      trends[day].moods[mood] = (trends[day].moods[mood] || 0) + 1;
    });
  });

  return Object.entries(trends)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14)
    .map(([day, data]) => ({
      day,
      averageSentiment: Number((data.totalSentiment / (data.count || 1)).toFixed(2)),
      totalParticipants: data.count,
      topMood: Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral"
    }));
};
