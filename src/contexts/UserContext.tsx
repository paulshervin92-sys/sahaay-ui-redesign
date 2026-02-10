import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SETTINGS,
  addChatTag as storeChatTag,
  addCheckIn as storeCheckIn,
  addJournal as storeJournal,
  clearUserData,
  ensureUserData,
  type UserDataStore,
  updateStoredUserName,
  updateUserData,
} from "@/lib/localStore";
import type { ChatContextTag, CheckIn, JournalEntry, SafetyPlan, UserProfile, UserSettings, WeeklyGoal } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface UserContextValue {
  profile: UserProfile | null;
  settings: UserSettings;
  weeklyGoal: WeeklyGoal | null;
  checkIns: CheckIn[];
  journals: JournalEntry[];
  chatTags: ChatContextTag[];
  safetyPlan: SafetyPlan | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateWeeklyGoal: (goal: WeeklyGoal) => Promise<void>;
  addCheckIn: (checkIn: CheckIn) => Promise<void>;
  addJournalEntry: (entry: JournalEntry) => Promise<void>;
  addChatTag: (tag: ChatContextTag) => Promise<void>;
  updateSafetyPlan: (plan: SafetyPlan) => Promise<void>;
  exportData: () => Promise<void>;
  deleteAllData: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const scheduleNotification = (time: string) => {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const scheduled = new Date();
  scheduled.setHours(hours, minutes, 0, 0);

  if (scheduled <= now) {
    scheduled.setDate(scheduled.getDate() + 1);
  }

  const delay = scheduled.getTime() - now.getTime();
  return window.setTimeout(() => {
    new Notification("Gentle check-in", {
      body: "How are you feeling today? A small check-in can help.",
    });
  }, delay);
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({ ...DEFAULT_SETTINGS });
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [chatTags, setChatTags] = useState<ChatContextTag[]>([]);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const reminderTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setSettings({ ...DEFAULT_SETTINGS });
      setWeeklyGoal(null);
      setCheckIns([]);
      setJournals([]);
      setChatTags([]);
      setSafetyPlan(null);
      setLoading(false);
      return;
    }

    const stored = ensureUserData(user);
    setProfile(stored.profile);
    setSettings({ ...DEFAULT_SETTINGS, ...stored.settings });
    setWeeklyGoal(stored.weeklyGoal ?? null);
    setCheckIns(stored.checkins ?? []);
    setJournals(stored.journals ?? []);
    setChatTags(stored.chatTags ?? []);
    setSafetyPlan(stored.safetyPlan ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontScale * 16}px`;
    if (settings.reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [settings.fontScale, settings.reduceMotion]);

  useEffect(() => {
    if (reminderTimer.current) {
      window.clearTimeout(reminderTimer.current);
    }
    if (settings.remindersEnabled) {
      reminderTimer.current = scheduleNotification(settings.reminderTime);
    }
  }, [settings.reminderTime, settings.remindersEnabled]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    ensureUserData(user);
    const nextProfile: UserProfile = {
      ...(profile ?? {
        id: user.uid,
        name: user.displayName ?? "",
        email: user.email ?? "",
        goals: [],
        baselineMood: "neutral",
        createdAt: new Date().toISOString(),
        onboardingComplete: false,
      }),
      ...updates,
    };
    updateUserData(user.uid, { profile: nextProfile });
    setProfile(nextProfile);
    if (typeof nextProfile.name === "string") {
      updateStoredUserName(user.uid, nextProfile.name);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user) return;
    ensureUserData(user);
    const nextSettings: UserSettings = {
      ...settings,
      ...updates,
    };
    updateUserData(user.uid, { settings: nextSettings });
    setSettings(nextSettings);
  };

  const updateWeeklyGoal = async (goal: WeeklyGoal) => {
    if (!user) return;
    ensureUserData(user);
    updateUserData(user.uid, { weeklyGoal: goal });
    setWeeklyGoal(goal);
  };

  const addCheckIn = async (checkIn: CheckIn) => {
    if (!user) return;
    ensureUserData(user);
    storeCheckIn(user.uid, checkIn);
    setCheckIns((prev) => [checkIn, ...prev]);
  };

  const addJournalEntry = async (entry: JournalEntry) => {
    if (!user) return;
    ensureUserData(user);
    storeJournal(user.uid, entry);
    setJournals((prev) => [entry, ...prev]);
  };

  const addChatTag = async (tag: ChatContextTag) => {
    if (!user) return;
    if (settings.privateMode) return;
    ensureUserData(user);
    storeChatTag(user.uid, tag);
    setChatTags((prev) => [tag, ...prev]);
  };

  const updateSafetyPlan = async (plan: SafetyPlan) => {
    if (!user) return;
    ensureUserData(user);
    const nextPlan = { ...plan, updatedAt: new Date().toISOString() };
    updateUserData(user.uid, { safetyPlan: nextPlan });
    setSafetyPlan(nextPlan);
  };

  const exportData = async () => {
    if (!user) return;
    const stored = ensureUserData(user);
    const exportPayload: UserDataStore = {
      ...stored,
      profile: profile ?? stored.profile,
      settings: settings ?? stored.settings,
      weeklyGoal: weeklyGoal ?? stored.weeklyGoal,
      checkins: checkIns.length ? checkIns : stored.checkins,
      journals: journals.length ? journals : stored.journals,
      chatTags: chatTags.length ? chatTags : stored.chatTags,
      safetyPlan: safetyPlan ?? stored.safetyPlan,
    };

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
    clearUserData(user.uid);
    setProfile(null);
    setSettings({ ...DEFAULT_SETTINGS });
    setWeeklyGoal(null);
    setCheckIns([]);
    setJournals([]);
    setChatTags([]);
    setSafetyPlan(null);
  };

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      settings,
      weeklyGoal,
      checkIns,
      journals,
      chatTags,
      safetyPlan,
      loading,
      updateProfile,
      updateSettings,
      updateWeeklyGoal,
      addCheckIn,
      addJournalEntry,
      addChatTag,
      updateSafetyPlan,
      exportData,
      deleteAllData,
    }),
    [profile, settings, weeklyGoal, checkIns, journals, chatTags, safetyPlan, loading],
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
