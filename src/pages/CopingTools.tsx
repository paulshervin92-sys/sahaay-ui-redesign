import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Mountain, Sparkles, Dumbbell, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import { EVIDENCE_BASED_COPING_TOOLS } from "@/lib/copingToolsData";
import type { RecommendedTool } from "@/lib/copingRecommendation";
import { apiFetch } from "@/lib/api";

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

  const [recommendedTools, setRecommendedTools] = useState<RecommendedTool[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    apiFetch<{ recommendations: RecommendedTool[] }>("/api/coping/recommendations")
      .then((result) => {
        const iconMap = new Map(EVIDENCE_BASED_COPING_TOOLS.map((tool) => [tool.id, tool]));
        const merged = result.recommendations.map((tool) => {
          const meta = iconMap.get(tool.id);
          return {
            ...tool,
            icon: meta?.icon ?? Sparkles,
            color: meta?.color ?? "bg-peach text-peach-foreground",
          };
        });
        setRecommendedTools(merged);
      })
      .catch(() => setRecommendedTools([]));
  }, []);

  useEffect(() => {
    if (!profile?.baselineMood) return;
    setMoodFocus(
      profile.baselineMood === "anxious"
        ? "anxious"
        : profile.baselineMood === "sad"
          ? "sad"
          : profile.baselineMood === "happy"
            ? "happy"
            : "neutral",
    );
  }, [profile?.baselineMood]);

  /**
   * Filter tools based on user's mood focus selection
   * This lets users manually override AI recommendations if desired
   */
  const prioritizedTools = useMemo(() => {
    // Start with AI recommendations
    let filtered = [...recommendedTools];
    
    // Apply mood focus filter if user selected specific mood
    if (moodFocus !== "neutral") {
      // Boost tools that support the selected mood
      filtered = filtered.map(tool => ({
        ...tool,
        score: tool.supportedMoods.includes(moodFocus) 
          ? tool.score + 10 // Boost score for mood-matching tools
          : tool.score
      }));
      
      // Re-sort after boosting
      filtered.sort((a, b) => b.score - a.score);
    }
    
    return filtered;
  }, [recommendedTools, moodFocus]);

  /**
   * Breathing exercise handlers
   */
  const clearBreathingTimers = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const scheduleBreathPhase = (phase: "inhale" | "hold" | "exhale", delayMs: number) => {
    const id = window.setTimeout(() => setBreathPhase(phase), delayMs);
    timeoutsRef.current.push(id);
  };

  const startBreathing = () => {
    clearBreathingTimers();
    setBreathPhase("inhale");
    scheduleBreathPhase("hold", 4000);
    scheduleBreathPhase("exhale", 8000);
    scheduleBreathPhase("inhale", 12000);
  };

  const startBoxBreathing = () => {
    clearBreathingTimers();
    setBreathPhase("inhale");
    scheduleBreathPhase("hold", 4000);
    scheduleBreathPhase("exhale", 8000);
    scheduleBreathPhase("hold", 12000);
    scheduleBreathPhase("inhale", 16000);
  };

  const start478Breathing = () => {
    clearBreathingTimers();
    setBreathPhase("inhale");
    scheduleBreathPhase("hold", 4000);
    scheduleBreathPhase("exhale", 11000); // 4 + 7
    scheduleBreathPhase("inhale", 19000); // 4 + 7 + 8
  };

  useEffect(() => {
    return () => clearBreathingTimers();
  }, []);

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
            key={tool.id}
            className="card-elevated group cursor-pointer rounded-2xl"
            onClick={() => {
              setActiveTool(tool.type);
              if (tool.type === "breathing") startBreathing();
              if (tool.type === "box-breathing") startBoxBreathing();
              if (tool.type === "478-breathing") start478Breathing();
            }}
          >
            <CardContent className="flex items-start gap-4 p-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110 icon-tilt`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-semibold text-foreground">{tool.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                {/* AI EXPLAINABILITY: Show recommendation reason */}
                {tool.score >= 50 && (
                  <p className="mt-2 text-xs text-primary/80 italic">
                    💡 {tool.reason}
                  </p>
                )}
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
            <div className={`flex h-36 w-36 items-center justify-center rounded-full bg-primary/20 transition-all [transition-duration:4s] ease-in-out ${breathPhase === "inhale" ? "scale-125" : breathPhase === "exhale" ? "scale-90" : "scale-100"}`}>
              <span className="text-lg font-medium text-primary capitalize">{breathPhase === "idle" ? "Ready" : breathPhase}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {breathPhase === "inhale" && "Breathe in slowly… 4 seconds"}
              {breathPhase === "hold" && "Hold gently… 4 seconds"}
              {breathPhase === "exhale" && "Release slowly… 4 seconds"}
              {breathPhase === "idle" && "Click the button to begin"}
            </p>
            {breathPhase === "idle" && (
              <Button onClick={startBreathing} className="rounded-xl">Start</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Box Breathing Dialog */}
      <Dialog open={activeTool === "box-breathing"} onOpenChange={() => { setActiveTool(null); setBreathPhase("idle"); }}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-mint to-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Box Breathing (4-4-4-4)</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-xl bg-primary/20 transition-all [transition-duration:4s] ease-in-out ${breathPhase === "inhale" ? "scale-125" : breathPhase === "exhale" ? "scale-90" : "scale-100"}`}>
              <span className="text-lg font-medium text-primary capitalize">{breathPhase === "idle" ? "Ready" : breathPhase}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {breathPhase === "inhale" && "Breathe in through nose… 4 seconds"}
              {breathPhase === "hold" && breathPhase === "hold" && "Hold… 4 seconds"}
              {breathPhase === "exhale" && "Exhale through mouth… 4 seconds"}
              {breathPhase === "idle" && "Used by Navy SEALs for stress management"}
            </p>
            {breathPhase === "idle" && (
              <Button onClick={startBoxBreathing} className="rounded-xl">Start Box Breathing</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 4-7-8 Breathing Dialog */}
      <Dialog open={activeTool === "478-breathing"} onOpenChange={() => { setActiveTool(null); setBreathPhase("idle"); }}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-mint to-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">4-7-8 Breathing</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full bg-primary/20 transition-all [transition-duration:7s] ease-in-out ${breathPhase === "inhale" ? "scale-125" : breathPhase === "exhale" ? "scale-90" : "scale-100"}`}>
              <span className="text-lg font-medium text-primary capitalize">{breathPhase === "idle" ? "Ready" : breathPhase}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {breathPhase === "inhale" && "Breathe in quietly through nose… 4 seconds"}
              {breathPhase === "hold" && "Hold your breath… 7 seconds"}
              {breathPhase === "exhale" && "Exhale completely through mouth… 8 seconds"}
              {breathPhase === "idle" && "Dr. Weil's technique for deep relaxation"}
            </p>
            {breathPhase === "idle" && (
              <Button onClick={start478Breathing} className="rounded-xl">Start 4-7-8</Button>
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
            <DialogTitle className="font-display text-xl text-foreground text-center">Movement Reset</DialogTitle>
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

      {/* Body Scan Dialog */}
      <Dialog open={activeTool === "body-scan"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-lavender to-mint/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Body Scan Meditation</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Close your eyes and notice sensations in each area:
            </p>
            {[
              "🧠 Head and face - release jaw tension",
              "💆 Neck and shoulders - let them drop",
              "🫁 Chest and breathing - notice the rhythm",
              "🤲 Arms and hands - feel their weight",
              "🦵 Legs and feet - grounded and stable",
            ].map((area, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground shadow-sm animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
                {area}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Progressive Muscle Relaxation Dialog */}
      <Dialog open={activeTool === "pmr"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-lavender to-mint/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Progressive Muscle Relaxation</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Tense each muscle group for 5 seconds, then release:
            </p>
            {[
              "✊ Hands - make tight fists, then release",
              "💪 Arms - flex biceps, then let go",
              "😤 Face - scrunch face tight, then relax",
              "🫸 Shoulders - raise to ears, then drop",
              "🦵 Legs - tighten thighs, then soften",
              "🦶 Feet - curl toes down, then release",
            ].map((step, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {step}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cognitive Reframing Dialog */}
      <Dialog open={activeTool === "cognitive-reframing"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-lavender/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Cognitive Reframing</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Challenge unhelpful thoughts with these questions:
            </p>
            {[
              "🤔 What evidence supports this thought?",
              "🔍 What evidence contradicts it?",
              "💭 What would I tell a friend thinking this?",
              "🌈 Is there another way to view this situation?",
              "📊 Am I predicting the future or stating facts?",
              "✨ What's a more balanced perspective?",
            ].map((question, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {question}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Thought Journaling Dialog */}
      <Dialog open={activeTool === "thought-journaling"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-blue-50 to-peach/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Thought Journaling</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Write freely to gain distance from difficult thoughts:
            </p>
            {[
              "📝 What am I thinking right now?",
              "😟 What emotion am I feeling?",
              "⚡ What triggered this thought?",
              "🎯 Is this thought helpful or accurate?",
              "🌱 What do I need right now?",
            ].map((prompt, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground shadow-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                {prompt}
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-4 italic">
              💡 Tip: Head to the Journal page to save your thoughts
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gratitude Reflection Dialog */}
      <Dialog open={activeTool === "gratitude"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-peach/40 to-lavender/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Gratitude Reflection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Notice three things you're grateful for right now:
            </p>
            {[
              "1️⃣ Something small (a warm drink, sunlight, a comfy chair)",
              "2️⃣ Someone who cares about you",
              "3️⃣ Something about yourself (your resilience, kindness, strength)",
            ].map((prompt, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground leading-relaxed shadow-sm animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                {prompt}
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-4">
              Even on hard days, small moments of gratitude can help shift perspective. 🌸
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Self-Compassion Dialog */}
      <Dialog open={activeTool === "self-compassion"} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-peach/40 to-lavender/40 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center">Self-Compassion Break</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Speak to yourself as you would a dear friend:
            </p>
            {[
              "💙 This is a moment of suffering. It's okay to feel this way.",
              "🌍 Everyone struggles sometimes. I'm not alone in this.",
              "🤲 May I be kind to myself in this moment.",
              "🌱 May I give myself the compassion I need.",
              "✨ I'm doing the best I can, and that's enough.",
            ].map((phrase, i) => (
              <div key={i} className="rounded-2xl bg-card/80 p-4 text-sm font-medium text-foreground leading-relaxed shadow-sm animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                {phrase}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CopingTools;
