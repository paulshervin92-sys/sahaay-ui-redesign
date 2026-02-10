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
  sentimentByDay: Array<{ dayKey: string; sentiment: number; normalizedMood: string; moodScore: number }>;
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
    const mood = Math.round(day.sentiment * 10);
    return { day: label, mood, stress: Math.max(0, 10 - mood) };
  });

  const monthlyData = (() => {
    const buckets: Record<string, { mood: number; stress: number; count: number }> = {};
    sentimentDays.forEach((day) => {
      const date = new Date(`${day.dayKey}T00:00:00`);
      const weekKey = `W${Math.ceil(date.getDate() / 7)}`;
      if (!buckets[weekKey]) {
        buckets[weekKey] = { mood: 0, stress: 0, count: 0 };
      }
      const mood = Math.round(day.sentiment * 10);
      buckets[weekKey].mood += mood;
      buckets[weekKey].stress += Math.max(0, 10 - mood);
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

  const insights = [
    analytics?.averageSentiment
      ? `Average sentiment this period: ${Math.round(analytics.averageSentiment * 100)}%.`
      : "Your stress levels tend to peak mid-week.",
    `Current streak: ${analytics?.streak ?? 0} days.`,
    "Weekends are your happiest days — you're doing great! 🌟",
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
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stress Bar Chart */}
      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stress levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--text-muted))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="stress" fill="hsl(var(--peach))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Gentle observations</h2>
        {settings.privateMode ? (
          <Card className="card-elevated rounded-2xl">
            <CardContent className="p-5 text-sm text-muted-foreground">
              Private mode is on. Insights will appear once you sync your check-ins.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {[weeklySummary, bestTime, ...insights].map((text, i) => (
              <Card key={i} className="card-elevated rounded-2xl">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Mood calendar</h2>
        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6">
            {calendarDays.length ? (
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {calendarDays.map((day) => (
                  <div key={day.id} className="rounded-2xl border border-border bg-surface px-2 py-3">
                    <div className="text-xs text-muted-foreground">{day.day}</div>
                    <div className="mt-1 text-lg" aria-label={day.mood}>{day.emoji}</div>
                  </div>
                ))}
              </div>
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
