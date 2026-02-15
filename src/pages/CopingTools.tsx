import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Mountain, Sparkles, Dumbbell, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import { getToolsForEmotion } from "@/lib/emotionBasedCopingTools";
import { MINI_GAME_COMPONENTS } from "@/components/MiniGames";
import type { InteractiveCopingTool } from "@/lib/emotionBasedCopingTools";
import type { Mood } from "@/types";



const CopingTools = () => {

  const [activeEmotionTool, setActiveEmotionTool] = useState<InteractiveCopingTool | null>(null);
  const [gameProgress, setGameProgress] = useState<any>(null);
  const { profile } = useUser();
  const [moodFocus, setMoodFocus] = useState<Mood>(profile?.baselineMood ?? "neutral");
  const emotionTools = useMemo(() => getToolsForEmotion(moodFocus), [moodFocus]);
  const moodLabel = useMemo(() => {
    const labels: Record<Mood, string> = {
      happy: "Happy",
      calm: "Calm",
      neutral: "Not sure",
      sad: "Sad",
      anxious: "Anxious",
      frustrated: "Frustrated",
    };
    return labels[moodFocus] ?? "Not sure";
  }, [moodFocus]);



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
          { label: "Frustrated", value: "frustrated" },
          { label: "Calm", value: "calm" },
          { label: "Happy", value: "happy" },
          { label: "Not sure", value: "neutral" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMoodFocus(item.value as Mood)}
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


      <div className="space-y-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-foreground animate-fade-in">Mini games for {moodLabel}</h2>
          <p className="text-sm text-muted-foreground animate-fade-in">Pick one tool to start a short, engaging exercise.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {emotionTools.map((tool, idx) => (
            <Card
              key={tool.id}
              className="card-elevated group rounded-2xl transition-transform duration-500 ease-out hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tool.color} transition-transform group-hover:scale-110 icon-tilt`}>
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                    <span className="rounded-full border border-border px-2 py-1">Priority {tool.priority}</span>
                    <span className="rounded-full border border-border px-2 py-1">{tool.durationMinutes} min</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-semibold text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  {tool.gamification.hasProgress && <span className="rounded-full border border-border px-2 py-1">Progress</span>}
                  {tool.gamification.hasRewards && <span className="rounded-full border border-border px-2 py-1">Rewards</span>}
                  {tool.gamification.hasLevels && <span className="rounded-full border border-border px-2 py-1">Levels</span>}
                </div>
                <Button onClick={() => setActiveEmotionTool(tool)} className="rounded-xl">Start mini game</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>




      {/* Emotion Tool Dialog (only new 30 tools) */}
      <Dialog open={Boolean(activeEmotionTool)} onOpenChange={() => { setActiveEmotionTool(null); setGameProgress(null); }}>
        <DialogContent className="rounded-3xl border-0 bg-gradient-to-br from-surface to-secondary/30 sm:max-w-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-foreground text-center animate-fade-in">
              {activeEmotionTool?.title}
            </DialogTitle>
          </DialogHeader>
          {activeEmotionTool && (
            <div className="space-y-5 py-2">
              <div className="rounded-2xl bg-card/70 p-4 text-sm text-foreground animate-fade-in">
                {activeEmotionTool.description}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-card/70 p-4 animate-fade-in">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How to play</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground">
                    {activeEmotionTool.instructions.map((step) => (
                      <li key={step} className="rounded-xl bg-card/80 px-3 py-2 animate-fade-in">{step}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-card/70 p-4 animate-fade-in">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Benefits</p>
                  <ul className="mt-3 space-y-2 text-sm text-foreground">
                    {activeEmotionTool.benefits.map((benefit) => (
                      <li key={benefit} className="rounded-xl bg-card/80 px-3 py-2 animate-fade-in">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-border px-2 py-1">Priority {activeEmotionTool.priority}</span>
                  <span className="rounded-full border border-border px-2 py-1">{activeEmotionTool.durationMinutes} min</span>
                  <span className="rounded-full border border-border px-2 py-1">{activeEmotionTool.type}</span>
                </div>
                <Button className="rounded-xl animate-fade-in" onClick={() => {
                  setGameProgress({ started: true, toolId: activeEmotionTool.id });
                }}>Begin</Button>
              </div>
            </div>
          )}
          {/* Mini-game content for the 30 tools */}
          {gameProgress?.started && gameProgress.toolId === activeEmotionTool?.id && (
            <div className="mt-4 p-4 rounded-xl bg-primary/10 text-primary text-center animate-fade-in">
              {MINI_GAME_COMPONENTS[activeEmotionTool.id] ? (
                React.createElement(MINI_GAME_COMPONENTS[activeEmotionTool.id], { tool: activeEmotionTool })
              ) : (
                <p>Mini-game coming soon for {activeEmotionTool.title}!</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CopingTools;
