export type Mood = "happy" | "calm" | "neutral" | "sad" | "anxious" | "frustrated";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  goals: string[];
  baselineMood: Mood;
  createdAt: string;
  onboardingComplete: boolean;
}

export interface UserSettings {
  fontScale: number;
  reduceMotion: boolean;
  remindersEnabled: boolean;
  reminderTime: string;
  privateMode: boolean;
  offlineSync: boolean;
  timezone?: string;
}

export interface CheckIn {
  id: string;
  mood: Mood;
  moodLabel?: string | null;
  note?: string;
  createdAt: string;
}

export interface WeeklyGoal {
  title: string;
  targetPerWeek: number;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  entry: string;
  createdAt: string;
}

export interface ChatContextTag {
  id: string;
  label: string;
  source: string;
  createdAt: string;
}

export interface SafetyContact {
  id: string;
  name: string;
  relation?: string;
  phone?: string;
}

export interface SafetyResource {
  id: string;
  name: string;
  phone?: string;
  url?: string;
  note?: string;
}

export interface SafetyPlan {
  updatedAt: string;
  reasonsToLive: string[];
  warningSigns: string[];
  triggers: string[];
  copingSteps: string[];
  safePlaces: string[];
  contacts: SafetyContact[];
  resources: SafetyResource[];
  groundingNotes?: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  text: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
  category: "support" | "wins" | "questions" | "venting";
  isModerator?: boolean;
}
