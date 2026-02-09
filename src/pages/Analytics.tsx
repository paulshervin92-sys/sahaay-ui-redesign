import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const weeklyData = [
  { day: "Mon", mood: 7, stress: 4 },
  { day: "Tue", mood: 6, stress: 5 },
  { day: "Wed", mood: 5, stress: 7 },
  { day: "Thu", mood: 6, stress: 6 },
  { day: "Fri", mood: 8, stress: 3 },
  { day: "Sat", mood: 9, stress: 2 },
  { day: "Sun", mood: 8, stress: 3 },
];

const monthlyData = [
  { week: "W1", mood: 6.2, stress: 5.1 },
  { week: "W2", mood: 6.8, stress: 4.5 },
  { week: "W3", mood: 7.1, stress: 3.9 },
  { week: "W4", mood: 7.5, stress: 3.5 },
];

const insights = [
  "Your stress levels tend to peak mid-week.",
  "Weekends are your happiest days — you're doing great! 🌟",
  "Your overall mood has improved 12% this month.",
];

const Analytics = () => {
  const [range, setRange] = useState("weekly");
  const data = range === "weekly" ? weeklyData : monthlyData;
  const xKey = range === "weekly" ? "day" : "week";

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Mood Analytics</h1>
        <Tabs value={range} onValueChange={setRange}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="weekly" className="rounded-lg">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mood Line Chart */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 90%)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(230 10% 50%)" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(230 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Line type="monotone" dataKey="mood" stroke="hsl(245 58% 61%)" strokeWidth={3} dot={{ r: 5, fill: "hsl(245 58% 61%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stress Bar Chart */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="p-6">
          <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Stress Levels</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 15% 90%)" />
              <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="hsl(230 10% 50%)" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(230 10% 50%)" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Bar dataKey="stress" fill="hsl(25 85% 74%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Insights */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Insights</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {insights.map((text, i) => (
            <Card key={i} className="rounded-2xl border-border/50 shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-foreground leading-relaxed">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analytics;
