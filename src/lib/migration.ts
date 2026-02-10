import { apiFetch } from "@/lib/api";
import type { CheckIn, JournalEntry, SafetyPlan, UserProfile, UserSettings, WeeklyGoal } from "@/types";

const AUTH_CURRENT_KEY = "sahaay.auth.current";
const AUTH_USERS_KEY = "sahaay.auth.users";
const DATA_PREFIX = "sahaay.data.";
const MIGRATION_FLAG_PREFIX = "sahaay.migrated.v1.";

interface LocalStoreData {
  profile?: UserProfile;
  settings?: UserSettings;
  weeklyGoal?: WeeklyGoal | null;
  checkins?: CheckIn[];
  journals?: JournalEntry[];
  safetyPlan?: SafetyPlan | null;
}

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export const migrateLocalDataToBackend = async (userId: string) => {
  const flagKey = `${MIGRATION_FLAG_PREFIX}${userId}`;
  if (localStorage.getItem(flagKey)) return false;

  const currentLocalId = localStorage.getItem(AUTH_CURRENT_KEY);
  if (!currentLocalId) return false;

  const localData = safeParse<LocalStoreData | null>(localStorage.getItem(`${DATA_PREFIX}${currentLocalId}`), null);
  if (!localData) return false;

  const timezone = localData.settings?.timezone || getTimezone();

  const tasks: Array<Promise<unknown>> = [];

  if (localData.profile) {
    tasks.push(
      apiFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: localData.profile.name,
          goals: localData.profile.goals,
          baselineMood: localData.profile.baselineMood,
          onboardingComplete: localData.profile.onboardingComplete,
        }),
      }),
    );
  }

  if (localData.settings) {
    tasks.push(
      apiFetch("/api/user/settings", {
        method: "PUT",
        body: JSON.stringify({ ...localData.settings, timezone }),
      }),
    );
  }

  if (localData.weeklyGoal) {
    tasks.push(
      apiFetch("/api/weekly-goal", {
        method: "PUT",
        body: JSON.stringify(localData.weeklyGoal),
      }),
    );
  }

  if (localData.safetyPlan) {
    tasks.push(
      apiFetch("/api/safety-plan", {
        method: "PUT",
        body: JSON.stringify(localData.safetyPlan),
      }),
    );
  }

  if (localData.checkins?.length) {
    localData.checkins.forEach((checkIn) => {
      tasks.push(
        apiFetch("/api/checkins", {
          method: "POST",
          body: JSON.stringify({
            mood: checkIn.mood,
            note: checkIn.note,
            timezone,
            createdAt: checkIn.createdAt,
          }),
        }),
      );
    });
  }

  if (localData.journals?.length) {
    localData.journals.forEach((entry) => {
      tasks.push(
        apiFetch("/api/journals", {
          method: "POST",
          body: JSON.stringify({
            prompt: entry.prompt,
            entry: entry.entry,
            createdAt: entry.createdAt,
          }),
        }),
      );
    });
  }

  await Promise.all(tasks);

  localStorage.setItem(flagKey, "true");
  localStorage.removeItem(`${DATA_PREFIX}${currentLocalId}`);
  localStorage.removeItem(AUTH_CURRENT_KEY);
  localStorage.removeItem(AUTH_USERS_KEY);

  return true;
};
