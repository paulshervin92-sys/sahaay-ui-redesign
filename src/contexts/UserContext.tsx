import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CheckIn, JournalEntry, SafetyPlan, UserProfile, UserSettings, WeeklyGoal } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";
import { migrateLocalDataToBackend } from "@/lib/migration";

interface UserContextValue {
  profile: UserProfile | null;
  settings: UserSettings;
  weeklyGoal: WeeklyGoal | null;
  checkIns: CheckIn[];
  journals: JournalEntry[];
  safetyPlan: SafetyPlan | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateWeeklyGoal: (goal: WeeklyGoal) => Promise<void>;
  addCheckIn: (checkIn: CheckIn) => Promise<void>;
  addJournalEntry: (entry: JournalEntry) => Promise<void>;
  updateSafetyPlan: (plan: SafetyPlan) => Promise<void>;
  exportData: () => Promise<void>;
  deleteAllData: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const getBrowserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

const DEFAULT_SETTINGS: UserSettings = {
  fontScale: 1,
  reduceMotion: false,
  remindersEnabled: false,
  reminderTime: "20:00",
  privateMode: false,
  offlineSync: true,
  timezone: getBrowserTimezone(),
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({ ...DEFAULT_SETTINGS });
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  const mapCheckIns = (dailyDocs: Array<{ id: string; entries?: CheckIn[] }>) => {
    const entries: CheckIn[] = [];
    dailyDocs.forEach((doc) => {
      (doc.entries || []).forEach((entry) => {
        entries.push({
          id: `${doc.id}-${entry.createdAt}`,
          mood: entry.mood,
          note: entry.note,
          createdAt: entry.createdAt,
        });
      });
    });
    return entries.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  };

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSettings({ ...DEFAULT_SETTINGS });
      setWeeklyGoal(null);
      setCheckIns([]);
      setJournals([]);
      setSafetyPlan(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const hydrate = async () => {
      await migrateLocalDataToBackend(user.uid);
      const [profileRes, settingsRes, goalRes, checkinsRes, journalsRes, planRes] = await Promise.all([
        apiFetch<{ profile: UserProfile | null }>("/api/user/profile"),
        apiFetch<{ settings: UserSettings | null }>("/api/user/settings"),
        apiFetch<{ goal: WeeklyGoal | null }>("/api/weekly-goal"),
        apiFetch<{ checkIns: Array<{ id: string; entries?: CheckIn[] }> }>("/api/checkins"),
        apiFetch<{ entries: JournalEntry[] }>("/api/journals"),
        apiFetch<{ plan: SafetyPlan | null }>("/api/safety-plan"),
      ]);

      setProfile(profileRes.profile ?? null);
      setSettings({ ...DEFAULT_SETTINGS, ...(settingsRes.settings ?? {}) });
      setWeeklyGoal(goalRes.goal ?? null);
      setCheckIns(mapCheckIns(checkinsRes.checkIns || []));
      setJournals(journalsRes.entries ?? []);
      setSafetyPlan(planRes.plan ?? null);
    };

    hydrate()
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontScale * 16}px`;
    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [settings.fontScale, settings.reduceMotion]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const result = await apiFetch<{ profile: UserProfile | null }>("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    setProfile(result.profile ?? null);
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    const timezone = updates.timezone || settings.timezone || getBrowserTimezone();
    const result = await apiFetch<{ settings: UserSettings | null }>("/api/user/settings", {
      method: "PUT",
      body: JSON.stringify({ ...updates, timezone }),
    });
    const nextSettings = { ...DEFAULT_SETTINGS, ...(result.settings ?? {}) };
    setSettings(nextSettings);
    if (typeof updates.remindersEnabled === "boolean" || typeof updates.reminderTime === "string") {
      await apiFetch("/api/notifications/reminder", {
        method: "POST",
        body: JSON.stringify({
          enabled: nextSettings.remindersEnabled,
          time: nextSettings.reminderTime,
          timezone: nextSettings.timezone || timezone,
        }),
      });
    }
  };

  const updateWeeklyGoal = async (goal: WeeklyGoal) => {
    if (!user) return;
    const result = await apiFetch<{ goal: WeeklyGoal | null }>("/api/weekly-goal", {
      method: "PUT",
      body: JSON.stringify(goal),
    });
    setWeeklyGoal(result.goal ?? goal);
  };

  const addCheckIn = async (checkIn: CheckIn) => {
    if (!user) return;
    const timezone = settings.timezone || getBrowserTimezone();
    await apiFetch("/api/checkins", {
      method: "POST",
      body: JSON.stringify({
        mood: checkIn.mood,
        note: checkIn.note,
        timezone,
      }),
    });
    setCheckIns((prev) => [checkIn, ...prev]);
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    if (!user) return;
    const result = await apiFetch<{ entry: JournalEntry }>("/api/journals", {
      method: "POST",
      body: JSON.stringify(entry),
    });
    setJournals((prev) => [result.entry, ...prev]);
  };

  const updateSafetyPlan = async (plan: SafetyPlan) => {
    if (!user) return;
    const nextPlan = { ...plan, updatedAt: new Date().toISOString() };
    const result = await apiFetch<{ plan: SafetyPlan | null }>("/api/safety-plan", {
      method: "PUT",
      body: JSON.stringify(nextPlan),
    });
    setSafetyPlan(result.plan ?? nextPlan);
  };

  const exportData = async () => {
    if (!user) return;
    const exportPayload = await apiFetch<unknown>("/api/user/export");
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sahaay-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const deleteAllData = async () => {
    if (!user) return;
    await apiFetch("/api/user", { method: "DELETE" });
    setProfile(null);
    setSettings({ ...DEFAULT_SETTINGS });
    setWeeklyGoal(null);
    setCheckIns([]);
    setJournals([]);
    setSafetyPlan(null);
  };

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      settings,
      weeklyGoal,
      checkIns,
      journals,
      safetyPlan,
      loading,
      updateProfile,
      updateSettings,
      updateWeeklyGoal,
      addCheckIn,
      addJournalEntry,
      updateSafetyPlan,
      exportData,
      deleteAllData,
    }),
    [profile, settings, weeklyGoal, checkIns, journals, safetyPlan, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
};
