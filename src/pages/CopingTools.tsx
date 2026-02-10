import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Mountain, Sparkles, Dumbbell, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";

const tools = [
  {
    title: "Breathing",
    description: "Guided breathing to calm your nervous system",
    icon: Wind,
    color: "bg-mint text-mint-foreground",
    type: "breathing" as const,
  },
  {
    title: "Grounding",
    description: "5-4-3-2-1 senses technique to feel present",
    icon: Mountain,
    color: "bg-lavender text-lavender-foreground",
    type: "grounding" as const,
  },
  {
    title: "Affirmations",
    description: "Gentle reminders of your strength and worth",
    icon: Sparkles,
    color: "bg-peach text-peach-foreground",
    type: "affirmations" as const,
  },
  {
    title: "Quick Exercises",
    description: "Simple movements to release tension",
    icon: Dumbbell,
    color: "bg-secondary text-secondary-foreground",
    type: "exercises" as const,
  },
];

const affirmations = [
  "I am doing the best I can, and that is enough. 🌱",
  "I deserve rest, peace, and kindness.",
  "This feeling is temporary. I have survived hard days before.",
  "I am worthy of love and support.",
  "It's okay to take things one step at a time.",
];

const CopingTools = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<"idle" | "inhale" | "hold" | "exhale">("idle");
  const { profile } = useUser();
  const [moodFocus, setMoodFocus] = useState<"anxious" | "sad" | "happy" | "neutral">(
    profile?.baselineMood === "anxious"
      ? "anxious"
      : profile?.baselineMood === "sad"
        ? "sad"
        : profile?.baselineMood === "happy"
          ? "happy"
          : "neutral",
  );

  const startBreathing = () => {
    setBreathPhase("inhale");
    setTimeout(() => setBreathPhase("hold"), 4000);
    setTimeout(() => setBreathPhase("exhale"), 8000);
    setTimeout(() => setBreathPhase("inhale"), 12000);
  };

  const prioritizedTools = [...tools].sort((a, b) => {
    if (moodFocus === "anxious") return a.type === "breathing" ? -1 : b.type === "breathing" ? 1 : 0;
    if (moodFocus === "sad") return a.type === "affirmations" ? -1 : b.type === "affirmations" ? 1 : 0;
    if (moodFocus === "happy") return a.type === "exercises" ? -1 : b.type === "exercises" ? 1 : 0;
    return 0;
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Ways to feel better</h1>
        <p className="text-muted-foreground">Pick a tool that feels right for you right now.</p>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {[
          { label: "Anxious", value: "anxious" },
          { label: "Sad", value: "sad" },
          { label: "Happy", value: "happy" },
          { label: "Not sure", value: "neutral" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMoodFocus(item.value as "anxious" | "sad" | "happy" | "neutral")}
            className={`rounded-full border px-3 py-1.5 transition-all ${
              moodFocus === item.value
                ? "border-primary/40 bg-primary/10 text-foreground"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {prioritizedTools.map((tool) => (
          <Card
            key={tool.title}
            className="card-elevated group cursor-pointer rounded-2xl"
            onClick={() => {
              setActiveTool(tool.type);
              if (tool.type === "breathing") startBreathing();
            }}
          >
            <CardContent className="flex items-start gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110 icon-tilt`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{tool.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breathing Dialog */}
      <Dialog open={activeTool === "breathing"} onOpenChange={() => { setActiveTool(null); setBreathPhase("idle"); }}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-mint to-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Breathe with me</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full bg-primary/20 transition-all duration-[4s] ease-in-out ${breathPhase === "inhale" ? "scale-125" : breathPhase === "exhale" ? "scale-90" : "scale-100"}`}>
              <span className="text-lg font-medium text-primary capitalize">{breathPhase === "idle" ? "Ready" : breathPhase}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {breathPhase === "inhale" && "Breathe in slowly… 4 seconds"}
              {breathPhase === "hold" && "Hold gently… 4 seconds"}
              {breathPhase === "exhale" && "Release slowly… 4 seconds"}
              {breathPhase === "idle" && "Click the circle to begin"}
            </p>
            {breathPhase === "idle" && (
              <Button onClick={startBreathing} className="rounded-xl">Start</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Affirmations Dialog */}
      <Dialog open={activeTool === "affirmations"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-peach/40 to-lavender/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Daily Affirmations</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {affirmations.map((a, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground leading-relaxed shadow-sm animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                {a}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Grounding Dialog */}
      <Dialog open={activeTool === "grounding"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-lavender to-mint/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">5-4-3-2-1 Grounding</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              { n: 5, sense: "things you can see 👀" },
              { n: 4, sense: "things you can touch ✋" },
              { n: 3, sense: "things you can hear 👂" },
              { n: 2, sense: "things you can smell 🌸" },
              { n: 1, sense: "thing you can taste 👅" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-card/80 p-4 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">{item.n}</span>
                <span className="text-sm font-medium text-foreground">{item.sense}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Exercises Dialog */}
      <Dialog open={activeTool === "exercises"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-secondary to-mint/30 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Quick Exercises</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {[
              "🧘 Stretch your arms overhead for 10 seconds",
              "🚶 Walk around the room slowly for 1 minute",
              "💪 Do 5 gentle shoulder rolls",
              "🦶 Stand on one foot for 15 seconds",
              "🤲 Shake your hands and arms for 10 seconds",
            ].map((ex, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {ex}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CopingTools;
