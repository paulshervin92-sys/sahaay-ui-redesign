import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useUser } from "@/contexts/UserContext";
import { apiFetch } from "@/lib/api";

interface AnalyticsPayload {
  streak: number;
  averageSentiment: number;
  sentimentByDay: Array<{
    dayKey: string;
    sentiment: number;
    normalizedMood: string;
    moodScore: number;
    moodScore10?: number;
    stressScore?: number;
    entryCount?: number;
  }>;
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  neutral: "😐",
  sad: "😔",
  anxious: "😰",
  frustrated: "😤",
};

const Analytics = () => {
  const [range, setRange] = useState("weekly");
  const { settings, checkIns } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const timezone = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  useEffect(() => {
    apiFetch<{ analytics: AnalyticsPayload }>(`/api/analytics?timezone=${encodeURIComponent(timezone)}`)
      .then((result) => setAnalytics(result.analytics))
      .catch(() => setAnalytics(null));
  }, [timezone]);

  const sentimentDays = analytics?.sentimentByDay ?? [];
  const weeklyData = sentimentDays.slice(0, 7).reverse().map((day) => {
    const label = new Date(`${day.dayKey}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });
    const mood = day.moodScore10 ?? Math.round(day.sentiment * 10);
    const moodLabel = day.normalizedMood || "neutral";
    const emoji = moodEmojis[moodLabel] || "😐";
    const stress = day.stressScore ?? Math.max(0, 10 - mood);
    return { day: label, mood, stress, moodLabel, emoji, entryCount: day.entryCount ?? 0 };
  });

  const monthlyData = (() => {
    const buckets: Record<string, { mood: number; stress: number; count: number }> = {};
    sentimentDays.forEach((day) => {
      const date = new Date(`${day.dayKey}T00:00:00`);
      const weekKey = `W${Math.ceil(date.getDate() / 7)}`;
      if (!buckets[weekKey]) {
        buckets[weekKey] = { mood: 0, stress: 0, count: 0 };
      }
      const mood = day.moodScore10 ?? Math.round(day.sentiment * 10);
      buckets[weekKey].mood += mood;
      buckets[weekKey].stress += day.stressScore ?? Math.max(0, 10 - mood);
      buckets[weekKey].count += 1;
    });

    return Object.entries(buckets).map(([week, value]) => ({
      week,
      mood: value.count ? Number((value.mood / value.count).toFixed(1)) : 0,
      stress: value.count ? Number((value.stress / value.count).toFixed(1)) : 0,
    }));
  })();

  const data = range === "weekly" ? weeklyData : monthlyData;
  const xKey = range === "weekly" ? "day" : "week";

  const weeklySummary = useMemo(() => {
    if (!checkIns.length) return "Keep going — your mood story will appear here soon.";
    const lastSeven = checkIns.slice(0, 7);
    const avg = lastSeven.reduce((sum, item) => sum + (item.mood === "happy" ? 4 : item.mood === "calm" ? 3 : item.mood === "neutral" ? 2 : 1), 0) / lastSeven.length;
    return avg >= 3 ? "Your week leaned lighter and calmer overall." : "This week felt heavier — be gentle with yourself.";
  }, [checkIns]);

  const calendarDays = useMemo(() => {
    const days = checkIns.slice(0, 14).reverse().map((item) => {
      const day = new Date(item.createdAt).toLocaleDateString(undefined, { weekday: "short" });
      return {
        id: item.id,
        day,
        mood: item.mood,
        emoji: moodEmojis[item.mood] ?? "🙂",
      };
    });
    return days;
  }, [checkIns]);

  const bestTime = useMemo(() => {
    if (!checkIns.length) return "Not enough check-ins yet.";
    const buckets = { morning: 0, afternoon: 0, evening: 0 };
    const counts = { morning: 0, afternoon: 0, evening: 0 };
    checkIns.slice(0, 14).forEach((item) => {
      const hour = new Date(item.createdAt).getHours();
      const key = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
      const score = item.mood === "happy" ? 4 : item.mood === "calm" ? 3 : item.mood === "neutral" ? 2 : 1;
      buckets[key] += score;
      counts[key] += 1;
    });
    const averages = Object.keys(buckets).map((key) => ({
      key,
      value: counts[key as keyof typeof counts] ? buckets[key as keyof typeof buckets] / counts[key as keyof typeof counts] : 0,
    }));
    const top = averages.sort((a, b) => b.value - a.value)[0];
    return top?.value ? `${top.key} tends to feel best for you.` : "Not enough data yet.";
  }, [checkIns]);

  const bestDayOfWeek = useMemo(() => {
    if (!checkIns.length) return "Not enough data yet.";
    const dayScores: Record<string, { total: number; count: number }> = {};
    checkIns.slice(0, 30).forEach((item) => {
      const dayName = new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'long' });
      const score = item.mood === "happy" ? 4 : item.mood === "calm" ? 3 : item.mood === "neutral" ? 2 : 1;
      if (!dayScores[dayName]) dayScores[dayName] = { total: 0, count: 0 };
      dayScores[dayName].total += score;
      dayScores[dayName].count += 1;
    });
    const averages = Object.entries(dayScores).map(([day, data]) => ({
      day,
      avg: data.total / data.count,
    }));
    if (!averages.length) return "Not enough data yet.";
    const best = averages.sort((a, b) => b.avg - a.avg)[0];
    return best.avg >= 3 ? `${best.day}s tend to be your brightest days.` : "Keep tracking to see your patterns emerge.";
  }, [checkIns]);

  const moodTrend = useMemo(() => {
    if (checkIns.length < 3) return "Keep checking in to see your mood trend.";
    const recent = checkIns.slice(0, 7);
    const older = checkIns.slice(7, 14);
    if (!older.length) return `You've checked in ${checkIns.length} times — you're building a great habit!`;
    const recentAvg = recent.reduce((sum, item) => sum + (item.mood === "happy" ? 4 : item.mood === "calm" ? 3 : item.mood === "neutral" ? 2 : 1), 0) / recent.length;
    const olderAvg = older.reduce((sum, item) => sum + (item.mood === "happy" ? 4 : item.mood === "calm" ? 3 : item.mood === "neutral" ? 2 : 1), 0) / older.length;
    const diff = recentAvg - olderAvg;
    if (diff > 0.5) return "Your mood has been lifting lately — keep going!";
    if (diff < -0.5) return "Things feel heavier recently — remember to be gentle with yourself.";
    return "Your mood has been steady — that's a sign of resilience.";
  }, [checkIns]);

  const insights = [
    analytics?.averageSentiment
      ? `Your overall positivity score this period: ${Math.round(analytics.averageSentiment * 100)}%.`
      : moodTrend,
    `Current streak: ${analytics?.streak ?? 0} day${analytics?.streak === 1 ? '' : 's'}.`,
    bestDayOfWeek,
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Your mood journey</h1>
          <p className="text-sm text-muted-foreground">Gentle patterns and progress over time.</p>
        </div>
        <Tabs value={range} onValueChange={setRange}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="weekly" className="rounded-lg">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mood Line Chart */}
      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mood trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                stroke="hsl(var(--text-muted))"
                interval={0}
                angle={-20}
                height={30}
                tickMargin={8}
              />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={(value: any, name: any, props: any) => {
                  if (name === "mood" && props.payload.moodLabel) {
                    return [`${props.payload.emoji} ${props.payload.moodLabel}`, "mood"];
                  }
                  return [value, name];
                }}
              />
              <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-sm text-muted-foreground">
            Trend insight: {moodTrend}
          </p>
        </CardContent>
      </Card>

      {/* Stress Bar Chart */}
      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stress levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--text-muted))"
                interval={0}
                angle={-20}
                height={30}
                tickMargin={8}
              />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                formatter={(value: any, name: any, props: any) => {
                  if (name === "stress") {
                    const count = props?.payload?.entryCount ?? 0;
                    const label = count ? `${count} check-in${count === 1 ? "" : "s"}` : "sentiment";
                    return [`${value} / 10 (${label})`, "stress"];
                  }
                  return [value, name];
                }}
              />
              <Bar dataKey="stress" fill="hsl(var(--peach))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-sm text-muted-foreground">
            Stress is estimated from your mood check-ins and sentiment, scaled from 0 (low) to 10 (high).
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Mood calendar</h2>
        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6">
            {sentimentDays.length ? (
              (() => {
                const now = new Date();
                const year = now.getFullYear();
                const month = now.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const dayKeys = sentimentDays.reduce<Record<string, string>>((acc, day) => {
                  const emoji = moodEmojis[day.normalizedMood] || "😐";
                  acc[day.dayKey] = emoji;
                  return acc;
                }, {});

                const cells: Array<{ key: string; label?: number; emoji?: string }>
                  = [];
                for (let i = 0; i < firstDay; i += 1) {
                  cells.push({ key: `empty-${i}` });
                }
                for (let d = 1; d <= daysInMonth; d += 1) {
                  const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  cells.push({
                    key: dayKey,
                    label: d,
                    emoji: dayKeys[dayKey],
                  });
                }

                return (
                  <div className="space-y-3">
                    <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
                        <div key={label} className="py-1">{label}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {cells.map((cell) => (
                        <div
                          key={cell.key}
                          className="rounded-2xl border border-border bg-surface px-2 py-3 min-h-[60px]"
                        >
                          {cell.label ? (
                            <>
                              <div className="text-xs text-muted-foreground">{cell.label}</div>
                              <div className="mt-1 text-lg">{cell.emoji || ""}</div>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()
            ) : (
              <p className="text-sm text-muted-foreground">Check in to see your calendar here.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Analytics;
