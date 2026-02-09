import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, TrendingUp, Sparkles } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "😤", label: "Frustrated" },
];

const insights = [
  { text: "You felt calmer 3 days in a row", icon: TrendingUp, color: "bg-mint text-mint-foreground" },
  { text: "5-day check-in streak! 🔥", icon: Flame, color: "bg-peach text-peach-foreground" },
  { text: "Your top coping tool: Breathing", icon: Sparkles, color: "bg-lavender text-lavender-foreground" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Greeting */}
      <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-lavender via-secondary to-mint shadow-sm">
        <CardContent className="p-6 md:p-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {greeting}, Paul 🌱
          </h1>
          <p className="mt-2 text-muted-foreground">
            How are you feeling today?
          </p>
        </CardContent>
      </Card>

      {/* Mood Quick Select */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Quick Check-in
        </h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {moods.map((mood) => (
            <button
              key={mood.label}
              onClick={() => navigate("/chat")}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:scale-105 hover:border-primary/30"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {mood.emoji}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Streak */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-peach">
            <Flame className="h-6 w-6 text-peach-foreground" />
          </div>
          <div>
            <p className="font-display text-xl font-bold text-foreground">5 Days</p>
            <p className="text-sm text-muted-foreground">Check-in streak — keep it going!</p>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          Your Insights
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {insights.map((insight, i) => (
            <Card
              key={i}
              className="rounded-2xl border-border/50 shadow-sm transition-all hover:shadow-md"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardContent className="flex items-start gap-3 p-5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${insight.color}`}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {insight.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
