import type { ChatContextTag, CheckIn, JournalEntry, SafetyPlan, UserProfile, UserSettings, WeeklyGoal } from "@/types";

export interface LocalUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface StoredUser extends LocalUser {
  password: string;
  createdAt: string;
}

export interface UserDataStore {
  profile: UserProfile;
  settings: UserSettings;
  weeklyGoal: WeeklyGoal | null;
  checkins: CheckIn[];
  journals: JournalEntry[];
  chatTags: ChatContextTag[];
  reports: Array<{ id: string; postId: number; category: string; createdAt: string }>;
  safetyPlan: SafetyPlan;
}

const AUTH_USERS_KEY = "sahaay.auth.users";
const AUTH_CURRENT_KEY = "sahaay.auth.current";
const DATA_PREFIX = "sahaay.data.";

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const DEFAULT_SETTINGS: UserSettings = {
  fontScale: 1,
  reduceMotion: false,
  remindersEnabled: false,
  reminderTime: "20:00",
  privateMode: false,
  offlineSync: true,
};

export const createDefaultProfile = (user: LocalUser): UserProfile => ({
  id: user.uid,
  name: user.displayName ?? "",
  email: user.email,
  goals: [],
  baselineMood: "neutral",
  createdAt: new Date().toISOString(),
  onboardingComplete: false,
});

const getUserDataKey = (uid: string) => `${DATA_PREFIX}${uid}`;

const readUsers = () => safeParse<StoredUser[]>(localStorage.getItem(AUTH_USERS_KEY), []);

const writeUsers = (users: StoredUser[]) => {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
};

const toLocalUser = (user: StoredUser): LocalUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
});

const generateUid = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getCurrentUser = (): LocalUser | null => {
  const uid = localStorage.getItem(AUTH_CURRENT_KEY);
  if (!uid) return null;
  const users = readUsers();
  const stored = users.find((item) => item.uid === uid);
  return stored ? toLocalUser(stored) : null;
};

export const setCurrentUser = (uid: string | null) => {
  if (!uid) {
    localStorage.removeItem(AUTH_CURRENT_KEY);
    return;
  }
  localStorage.setItem(AUTH_CURRENT_KEY, uid);
};

export const createUser = (email: string, password: string, displayName?: string): LocalUser => {
  const users = readUsers();
  const existing = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const user: StoredUser = {
    uid: generateUid(),
    email,
    password,
    displayName: displayName?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeUsers(users);
  setCurrentUser(user.uid);
  ensureUserData(toLocalUser(user));
  return toLocalUser(user);
};

export const authenticateUser = (email: string, password: string): LocalUser => {
  const users = readUsers();
  const stored = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!stored || stored.password !== password) {
    throw new Error("Invalid email or password.");
  }
  setCurrentUser(stored.uid);
  ensureUserData(toLocalUser(stored));
  return toLocalUser(stored);
};

export const updateStoredUserName = (uid: string, displayName: string) => {
  const users = readUsers();
  const index = users.findIndex((item) => item.uid === uid);
  if (index === -1) return;
  users[index] = { ...users[index], displayName };
  writeUsers(users);
};

export const getUserData = (uid: string): UserDataStore | null => {
  return safeParse<UserDataStore | null>(localStorage.getItem(getUserDataKey(uid)), null);
};

export const ensureUserData = (user: LocalUser): UserDataStore => {
  const existing = getUserData(user.uid);
  if (existing) return existing;

  const created: UserDataStore = {
    profile: createDefaultProfile(user),
    settings: { ...DEFAULT_SETTINGS },
    weeklyGoal: null,
    checkins: [],
    journals: [],
    chatTags: [],
    reports: [],
    safetyPlan: {
      updatedAt: new Date().toISOString(),
      reasonsToLive: [],
      warningSigns: [],
      triggers: [],
      copingSteps: [],
      safePlaces: [],
      contacts: [],
      resources: [],
      groundingNotes: "",
    },
  };
  setUserData(user.uid, created);
  return created;
};

export const setUserData = (uid: string, data: UserDataStore) => {
  localStorage.setItem(getUserDataKey(uid), JSON.stringify(data));
};

export const updateUserData = (uid: string, updates: Partial<UserDataStore>) => {
  const current = getUserData(uid);
  if (!current) return;
  const next = { ...current, ...updates };
  setUserData(uid, next);
};

export const addCheckIn = (uid: string, checkIn: CheckIn) => {
  const current = getUserData(uid);
  if (!current) return;
  const next = { ...current, checkins: [checkIn, ...current.checkins] };
  setUserData(uid, next);
};

export const addJournal = (uid: string, entry: JournalEntry) => {
  const current = getUserData(uid);
  if (!current) return;
  const next = { ...current, journals: [entry, ...current.journals] };
  setUserData(uid, next);
};

export const addChatTag = (uid: string, tag: ChatContextTag) => {
  const current = getUserData(uid);
  if (!current) return;
  const next = { ...current, chatTags: [tag, ...current.chatTags] };
  setUserData(uid, next);
};

export const addReport = (uid: string, report: { postId: number; category: string }) => {
  const current = getUserData(uid);
  if (!current) return;
  const nextReport = {
    id: `${report.postId}-${Date.now()}`,
    postId: report.postId,
    category: report.category,
    createdAt: new Date().toISOString(),
  };
  const next = { ...current, reports: [nextReport, ...current.reports] };
  setUserData(uid, next);
};

export const clearUserData = (uid: string) => {
  localStorage.removeItem(getUserDataKey(uid));
};
