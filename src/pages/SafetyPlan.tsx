import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Plus, Trash2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import type { SafetyContact, SafetyPlan, SafetyResource } from "@/types";
import { apiFetch } from "@/lib/api";

interface Helpline {
  name: string;
  number: string;
}

const emptyPlan: SafetyPlan = {
  updatedAt: "",
  reasonsToLive: [],
  warningSigns: [],
  triggers: [],
  copingSteps: [],
  safePlaces: [],
  contacts: [],
  resources: [],
  groundingNotes: "",
};

const toLines = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const fromLines = (items: string[]) => items.join("\n");

const createContact = (): SafetyContact => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: "",
  relation: "",
  phone: "",
});

const createResource = (): SafetyResource => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: "",
  phone: "",
  url: "",
  note: "",
});

const SafetyPlanPage = () => {
  const { safetyPlan, updateSafetyPlan } = useUser();
  const [reasonsText, setReasonsText] = useState("");
  const [warningText, setWarningText] = useState("");
  const [triggerText, setTriggerText] = useState("");
  const [copingText, setCopingText] = useState("");
  const [placesText, setPlacesText] = useState("");
  const [groundingNotes, setGroundingNotes] = useState("");
  const [contacts, setContacts] = useState<SafetyContact[]>([]);
  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [helplines, setHelplines] = useState<Helpline[]>([]);

  useEffect(() => {
    const plan = safetyPlan ?? emptyPlan;
    setReasonsText(fromLines(plan.reasonsToLive));
    setWarningText(fromLines(plan.warningSigns));
    setTriggerText(fromLines(plan.triggers));
    setCopingText(fromLines(plan.copingSteps));
    setPlacesText(fromLines(plan.safePlaces));
    setGroundingNotes(plan.groundingNotes ?? "");
    setContacts(plan.contacts.length ? plan.contacts : []);
    setResources(plan.resources.length ? plan.resources : []);
    setSavedAt(plan.updatedAt ? new Date(plan.updatedAt).toLocaleString() : null);
  }, [safetyPlan]);

  useEffect(() => {
    apiFetch<{ helplines: Helpline[] }>("/api/config/helplines")
      .then((result) => setHelplines(result.helplines || []))
      .catch(() => setHelplines([]));
  }, []);

  const filledPreview = useMemo(() => {
    const plan = safetyPlan ?? emptyPlan;
    return (
      plan.copingSteps.length ||
      plan.contacts.length ||
      plan.reasonsToLive.length ||
      plan.warningSigns.length
    );
  }, [safetyPlan]);

  const handleSave = async () => {
    const nextPlan: SafetyPlan = {
      updatedAt: new Date().toISOString(),
      reasonsToLive: toLines(reasonsText),
      warningSigns: toLines(warningText),
      triggers: toLines(triggerText),
      copingSteps: toLines(copingText),
      safePlaces: toLines(placesText),
      contacts: contacts.filter((c) => c.name.trim()),
      resources: resources.filter((r) => r.name.trim()),
      groundingNotes: groundingNotes.trim(),
    };
    await updateSafetyPlan(nextPlan);
    setSavedAt(new Date(nextPlan.updatedAt).toLocaleString());
  };

  const updateContact = (id: string, field: keyof SafetyContact, value: string) => {
    setContacts((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const updateResource = (id: string, field: keyof SafetyResource, value: string) => {
    setResources((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Safety plan</h1>
          <p className="text-sm text-muted-foreground">
            Build a private plan that shows up when you need extra support.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          {savedAt ? `Saved ${savedAt}` : "Not saved yet"}
        </div>
      </div>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm font-semibold text-foreground">Your plan</p>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Reasons to live</label>
            <Textarea
              value={reasonsText}
              onChange={(event) => setReasonsText(event.target.value)}
              placeholder="One per line"
              className="min-h-[90px] rounded-2xl bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Warning signs</label>
            <Textarea
              value={warningText}
              onChange={(event) => setWarningText(event.target.value)}
              placeholder="One per line"
              className="min-h-[90px] rounded-2xl bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Triggers</label>
            <Textarea
              value={triggerText}
              onChange={(event) => setTriggerText(event.target.value)}
              placeholder="One per line"
              className="min-h-[90px] rounded-2xl bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Coping steps that help</label>
            <Textarea
              value={copingText}
              onChange={(event) => setCopingText(event.target.value)}
              placeholder="One per line"
              className="min-h-[90px] rounded-2xl bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Safe places</label>
            <Textarea
              value={placesText}
              onChange={(event) => setPlacesText(event.target.value)}
              placeholder="One per line"
              className="min-h-[90px] rounded-2xl bg-card"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground">Grounding notes</label>
            <Textarea
              value={groundingNotes}
              onChange={(event) => setGroundingNotes(event.target.value)}
              placeholder="Short reminder or script you can read later"
              className="min-h-[80px] rounded-2xl bg-card"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Trusted contacts</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setContacts((prev) => [...prev, createContact()])}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {contacts.length === 0 && (
            <p className="text-xs text-muted-foreground">Add someone you trust so you can reach out quickly.</p>
          )}
          {contacts.map((contact) => (
            <div key={contact.id} className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-3">
              <Input
                value={contact.name}
                onChange={(event) => updateContact(contact.id, "name", event.target.value)}
                placeholder="Name"
                className="rounded-xl"
              />
              <Input
                value={contact.relation ?? ""}
                onChange={(event) => updateContact(contact.id, "relation", event.target.value)}
                placeholder="Relation"
                className="rounded-xl"
              />
              <div className="flex gap-2">
                <Input
                  value={contact.phone ?? ""}
                  onChange={(event) => updateContact(contact.id, "phone", event.target.value)}
                  placeholder="Phone"
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setContacts((prev) => prev.filter((item) => item.id !== contact.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Local resources</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setResources((prev) => [...prev, createResource()])}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          {resources.length === 0 && (
            <p className="text-xs text-muted-foreground">Add local helplines, clinics, or online resources.</p>
          )}
          {resources.map((resource) => (
            <div key={resource.id} className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-3">
              <Input
                value={resource.name}
                onChange={(event) => updateResource(resource.id, "name", event.target.value)}
                placeholder="Resource"
                className="rounded-xl"
              />
              <Input
                value={resource.phone ?? ""}
                onChange={(event) => updateResource(resource.id, "phone", event.target.value)}
                placeholder="Phone"
                className="rounded-xl"
              />
              <div className="flex gap-2">
                <Input
                  value={resource.url ?? ""}
                  onChange={(event) => updateResource(resource.id, "url", event.target.value)}
                  placeholder="Website"
                  className="rounded-xl"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setResources((prev) => prev.filter((item) => item.id !== resource.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={resource.note ?? ""}
                onChange={(event) => updateResource(resource.id, "note", event.target.value)}
                placeholder="Notes"
                className="min-h-[70px] rounded-xl md:col-span-3"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <p className="text-sm font-semibold text-foreground">Crisis support</p>
          {helplines.map((contact) => (
            <div key={contact.name} className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.number}</p>
              </div>
              <a href={`tel:${contact.number}`} className="inline-flex items-center gap-2 text-sm text-primary">
                <Phone className="h-4 w-4" />
                Call
              </a>
            </div>
          ))}
          {!helplines.length && (
            <p className="text-xs text-muted-foreground">Add local helplines in your safety plan for quick access.</p>
          )}
        </CardContent>
      </Card>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Surface this plan automatically</p>
            <p className="text-xs text-muted-foreground">
              We will show quick actions when mood trends downward or crisis keywords appear.
            </p>
          </div>
          <Button onClick={handleSave} className="rounded-xl">
            Save safety plan
          </Button>
        </CardContent>
      </Card>

      {filledPreview && safetyPlan && (
        <Card className="card-elevated rounded-2xl">
          <CardContent className="p-6 space-y-2">
            <p className="text-sm font-semibold text-foreground">Quick preview</p>
            {safetyPlan.copingSteps.length > 0 && (
              <p className="text-xs text-muted-foreground">Coping: {safetyPlan.copingSteps.slice(0, 3).join(", ")}</p>
            )}
            {safetyPlan.contacts.length > 0 && (
              <p className="text-xs text-muted-foreground">Contacts: {safetyPlan.contacts.slice(0, 2).map((c) => c.name).join(", ")}</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            You are not alone. If you are in immediate danger, contact local emergency services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyPlanPage;
