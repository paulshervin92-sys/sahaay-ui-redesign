import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flame, TrendingUp, Sparkles, Bell, NotebookPen, Trophy, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { apiFetch } from "@/lib/api";
import { useStreak } from "@/hooks/useStreak";
import type { CheckIn, Mood, WeeklyGoal } from "@/types";

const moods: { emoji: string; label: string; value: Mood }[] = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
  { emoji: "😤", label: "Frustrated", value: "frustrated" },
];

const insights = [
  { text: "You felt calmer 3 days in a row", icon: TrendingUp, color: "bg-mint text-mint-foreground" },
  { text: "5-day check-in streak! 🔥", icon: Flame, color: "bg-peach text-peach-foreground" },
  { text: "Your top coping tool: Breathing", icon: Sparkles, color: "bg-lavender text-lavender-foreground" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, settings, addCheckIn, weeklyGoal, updateWeeklyGoal, checkIns, safetyPlan } = useUser();
  const [note, setNote] = useState("");
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [goalTitle, setGoalTitle] = useState(weeklyGoal?.title ?? "");
  const [goalTarget, setGoalTarget] = useState<number>(weeklyGoal?.targetPerWeek ?? 4);
  const [analyticsStreak, setAnalyticsStreak] = useState<number | null>(null);
  const [dailySummary, setDailySummary] = useState<string | null>(null);
  const { streak, rewards, loading: streakLoading } = useStreak();

  useEffect(() => {
    const timezone = settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    apiFetch<{ analytics: { streak: number } }>(`/api/analytics?timezone=${encodeURIComponent(timezone)}`)
      .then((result) => setAnalyticsStreak(result.analytics.streak))
      .catch(() => setAnalyticsStreak(null));
  }, [settings.timezone]);

  useEffect(() => {
    apiFetch<{ summary: { summary?: string } | null }>("/api/chat/summary/today")
      .then((result) => setDailySummary(result.summary?.summary ?? null))
      .catch(() => setDailySummary(null));
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  useEffect(() => {
    if (weeklyGoal) {
      setGoalTitle(weeklyGoal.title);
      setGoalTarget(weeklyGoal.targetPerWeek);
    }
  }, [weeklyGoal]);

  const latestMood = checkIns[0]?.mood ?? profile?.baselineMood ?? "neutral";
  const latestMoodLabel = checkIns[0]?.moodLabel || latestMood;

  const checkInStreak = useMemo(() => {
    if (!checkIns.length) return 0;
    const days = Array.from(
      new Set(
        checkIns.map((item) => new Date(item.createdAt).toDateString()),
      ),
    );
    let count = 0;
    let cursor = new Date();
    for (; ;) {
      const key = cursor.toDateString();
      if (days.includes(key)) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [checkIns]);

  const streakValue = analyticsStreak ?? checkInStreak;

  const weeklyCount = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 6);
    const dayKeys = new Set(
      checkIns
        .filter((item) => new Date(item.createdAt) >= weekAgo)
        .map((item) => new Date(item.createdAt).toDateString()),
    );
    return dayKeys.size;
  }, [checkIns]);

  const moodTimeline = useMemo(() => {
    return checkIns.slice(0, 7).reverse().map((item) => {
      const mood = moods.find((m) => m.value === item.mood);
      return {
        id: item.id,
        mood: mood?.emoji ?? "🙂",
        label: mood?.label ?? item.mood,
        date: new Date(item.createdAt).toLocaleDateString(undefined, { weekday: "short" }),
      };
    });
  }, [checkIns]);

  const showSupportPlan = useMemo(() => {
    if (!safetyPlan) return false;
    const lowMoods = new Set(["sad", "anxious", "frustrated"]);
    const recent = checkIns.slice(0, 3);
    const lowCount = recent.filter((item) => lowMoods.has(item.mood)).length;
    return lowCount >= 2 || lowMoods.has(latestMood);
  }, [checkIns, latestMood, safetyPlan]);

  const handleCheckIn = async () => {
    if (!selectedMood) return;
    const newCheckIn: CheckIn = {
      id: String(Date.now()),
      mood: selectedMood,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    await addCheckIn(newCheckIn);
    setNote("");
    setSelectedMood(null);
    if (selectedMood === "anxious" || selectedMood === "sad") {
      navigate("/coping");
    }
  };

  const suggestion =
    latestMood === "anxious"
      ? { title: "Try a breathing tool", description: "A 60-second reset can help your body settle.", action: "/coping" }
      : latestMood === "sad"
        ? { title: "Gentle affirmations", description: "Short reminders to be kind to yourself.", action: "/coping" }
        : latestMood === "happy"
          ? { title: "Celebrate your streak", description: "Small wins build momentum.", action: "/dashboard" }
          : { title: "Talk it out", description: "Sahaay is here when you want to share.", action: "/chat" };

  const todaysPlan = {
    tool:
      latestMood === "anxious"
        ? "Breathing"
        : latestMood === "sad"
          ? "Affirmations"
          : latestMood === "frustrated"
            ? "Grounding"
            : "Quick Exercises",
    prompt: "What is one thing you need today?",
    goal: weeklyGoal?.title || "Complete a gentle check-in",
  };

  const handleSaveGoal = async () => {
    if (!goalTitle.trim()) return;
    const goal: WeeklyGoal = {
      title: goalTitle.trim(),
      targetPerWeek: goalTarget,
      updatedAt: new Date().toISOString(),
    };
    await updateWeeklyGoal(goal);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Primary action */}
      <Card className="overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-lavender via-secondary to-mint shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <CardContent className="p-6 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {greeting}, {profile?.name || "friend"}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                How are you feeling right now? Pick one to begin.
              </p>
            </div>
            <div className="rounded-2xl bg-surface/70 px-4 py-3 text-sm text-foreground shadow-sm">
              Your next gentle step: a quick check-in 🌿
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
            {moods.map((mood) => (
              <button
                key={mood.label}
                onClick={() => setSelectedMood(mood.value)}
                aria-label={`Select mood: ${mood.label} ${mood.emoji}`}
                className={`card-elevated group flex flex-col items-center gap-2 rounded-2xl p-5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${selectedMood === mood.value ? "ring-2 ring-primary/40" : ""
                  }`}
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {mood.emoji}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-surface/70 p-4">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional: add a note about what is influencing your mood..."
              className="min-h-[90px] rounded-2xl bg-card"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button onClick={handleCheckIn} disabled={!selectedMood}>
                Save check-in
              </Button>
              <Button variant="ghost" onClick={() => navigate("/chat")}> 
                Talk to Sahaay
              </Button>
              <Button variant="ghost" onClick={() => navigate("/journal")}> 
                Journal instead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak summary cards moved here */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface shadow rounded-xl p-4 flex flex-col items-center">
          <Flame className="text-orange-400 mb-1" size={28} />
          <div className="text-2xl font-bold">{typeof streak?.currentStreak === 'number' ? streak.currentStreak : 0} days</div>
          <div className="text-xs text-muted-foreground">Current streak</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-4 flex flex-col items-center">
          <Trophy className="text-green-400 mb-1" size={28} />
          <div className="text-2xl font-bold">{typeof streak?.longestStreak === 'number' ? streak.longestStreak : 0} days</div>
          <div className="text-xs text-muted-foreground">Longest streak</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-4 flex flex-col items-center">
          <Shield className="text-blue-400 mb-1" size={28} />
          <div className="text-2xl font-bold">{typeof streak?.freezeShields === 'number' ? streak.freezeShields : 0}</div>
          <div className="text-xs text-muted-foreground">Freeze shields</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-4 flex flex-col items-center">
          <Sparkles className="text-purple-400 mb-1" size={28} />
          <div className="text-2xl font-bold">{rewards?.activePremiumUntil ? 'Active' : 'Inactive'}</div>
          <div className="text-xs text-muted-foreground">Premium status</div>
        </div>
      </div>

      {/* Secondary insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-elevated rounded-2xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach">
              <Flame className="h-6 w-6 text-peach-foreground" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-foreground">{streakValue} Days</p>
              <p className="text-sm text-muted-foreground">Check-in streak — steady and strong.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated rounded-2xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint">
              <TrendingUp className="h-6 w-6 text-mint-foreground" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-foreground">Mood focus</p>
              <p className="text-sm text-muted-foreground">Latest mood: {latestMoodLabel}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {showSupportPlan && (
        <Card className="card-elevated rounded-2xl">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-sm font-semibold text-foreground">Need extra support?</p>
              <p className="text-sm text-muted-foreground">Your safety plan is ready with steps and contacts.</p>
            </div>
            <Button onClick={() => navigate("/safety")} className="rounded-xl">
              Open safety plan
            </Button>
          </CardContent>
        </Card>
      )}

      {dailySummary && (
        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground">What we talked about today</p>
            <p className="mt-2 text-sm text-muted-foreground">{dailySummary}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground">Today’s plan</p>
            <p className="mt-1 text-sm text-muted-foreground">A gentle plan based on your recent mood.</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2">
                <span>Coping tool</span>
                <span className="font-semibold text-foreground">{todaysPlan.tool}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2">
                <span>Prompt</span>
                <span className="font-semibold text-foreground">{todaysPlan.prompt}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2">
                <span>Gentle goal</span>
                <span className="font-semibold text-foreground">{todaysPlan.goal}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => navigate("/coping")}>Open tools</Button>
              <Button variant="ghost" onClick={() => navigate("/journal")}>Open journal</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground">Weekly goal</p>
            <p className="mt-1 text-sm text-muted-foreground">Small, steady steps. Track your weekly habit.</p>
            <div className="mt-4 space-y-3">
              <Input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="Example: Check in 4 days this week"
              />
              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Target / week</label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(Number(e.target.value))}
                  className="w-24"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-surface px-2 py-1">{weeklyCount}/{goalTarget} days</span>
                <span className="rounded-full border border-border bg-surface px-2 py-1">Streak: {typeof streak?.currentStreak === 'number' ? streak.currentStreak : 0}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={handleSaveGoal}>Save goal</Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>Refresh</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">{suggestion.title}</p>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate(suggestion.action)}>Open</Button>
            <Button variant="ghost" onClick={() => navigate("/coping")}>
              See all tools
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
