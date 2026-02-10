import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import type { JournalEntry } from "@/types";

const prompts = [
  "What is one thing you need today?",
  "What helped you feel steady recently?",
  "Describe a small win from this week.",
  "What would you tell a friend feeling this way?",
];

const Journal = () => {
  const { addJournalEntry, settings, journals } = useUser();
  const [promptIndex, setPromptIndex] = useState(0);
  const [entry, setEntry] = useState("");

  const handleSave = async () => {
    if (!entry.trim()) return;
    const newEntry: JournalEntry = {
      id: String(Date.now()),
      prompt: prompts[promptIndex],
      entry: entry.trim(),
      createdAt: new Date().toISOString(),
    };
    await addJournalEntry(newEntry);
    setEntry("");
    setPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Journal</h1>
        <p className="text-sm text-muted-foreground">Write gently. No pressure, just space.</p>
      </div>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6">
          <p className="text-sm font-semibold text-foreground">Prompt</p>
          <p className="mt-2 text-base text-foreground">{prompts[promptIndex]}</p>
          <Textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Start writing here..."
            className="mt-4 min-h-[140px] rounded-2xl bg-card"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={handleSave} className="rounded-xl">
              Save entry
            </Button>
            <Button variant="ghost" onClick={() => setPromptIndex((prev) => (prev + 1) % prompts.length)}>
              New prompt
            </Button>
          </div>
          {settings.privateMode && (
            <p className="mt-3 text-xs text-muted-foreground">Private mode is on. This entry stays on this device.</p>
          )}
        </CardContent>
      </Card>

      <section>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Recent reflections</h2>
        {settings.privateMode ? (
          <Card className="card-elevated rounded-2xl">
            <CardContent className="p-5 text-sm text-muted-foreground">
              Private mode is on. Journal history is not synced.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {journals.slice(0, 4).map((item) => (
              <Card key={item.id} className="card-elevated rounded-2xl">
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.prompt}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.entry}</p>
                </CardContent>
              </Card>
            ))}
            {!journals.length && (
              <Card className="card-elevated rounded-2xl">
                <CardContent className="p-5 text-sm text-muted-foreground">
                  It is okay to start slow. I am here when you are ready.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Journal;
