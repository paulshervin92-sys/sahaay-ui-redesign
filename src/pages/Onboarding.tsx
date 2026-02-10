import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Mood } from "@/types";

const goalOptions = [
  "Sleep better",
  "Reduce anxiety",
  "Build a routine",
  "Process emotions",
  "Feel more connected",
  "Handle stress at work",
];

const moods: { label: string; value: Mood }[] = [
  { label: "Happy", value: "happy" },
  { label: "Calm", value: "calm" },
  { label: "Neutral", value: "neutral" },
  { label: "Sad", value: "sad" },
  { label: "Anxious", value: "anxious" },
  { label: "Frustrated", value: "frustrated" },
];

const Onboarding = () => {
  const { profile, updateProfile, updateSettings } = useUser();
  const [name, setName] = useState(profile?.name ?? "");
  const [baselineMood, setBaselineMood] = useState<Mood>(profile?.baselineMood ?? "neutral");
  const [goals, setGoals] = useState<string[]>(profile?.goals ?? []);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleGoal = (goal: string) => {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const handleContinue = async () => {
    if (!user) return;

    // Update local context so the UI can immediately redirect.
    await updateProfile({
      name,
      baselineMood,
      goals,
      onboardingComplete: true,
    });
    await updateSettings({
      remindersEnabled,
      reminderTime,
    });

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted p-6">
      <Card className="card-elevated w-full max-w-2xl rounded-3xl">
        <CardContent className="p-8 md:p-10">
          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Let us personalize your space</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              A few gentle questions to help Sahaay support you better.
            </p>
          </div>

          <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground" htmlFor="name">
                What should we call you?
              </label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Your goals</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {goalOptions.map((goal) => (
                  <label key={goal} className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-sm">
                    <Checkbox checked={goals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                    <span className="text-foreground">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">How are you feeling these days?</label>
              <Select value={baselineMood} onValueChange={(value) => setBaselineMood(value as Mood)}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select a mood" />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Daily gentle reminder</label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remindersEnabled}
                    onChange={(e) => setRemindersEnabled(e.target.checked)}
                  />
                  Enable daily reminder
                </label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-[140px]"
                />
              </div>
              <p className="text-xs text-muted-foreground">You can change this anytime in settings.</p>
            </div>

            <Button type="button" onClick={handleContinue} className="w-full rounded-xl">
              Continue to dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
