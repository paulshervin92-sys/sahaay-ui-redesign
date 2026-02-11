import { getFirestore } from "../../config/firebase.js";
import { getDayKey } from "../../utils/date.js";

export type Mood = "happy" | "calm" | "neutral" | "sad" | "anxious" | "frustrated";

export interface CheckInInput {
  mood: Mood;
  note?: string;
  sentimentScore?: number;
  createdAt?: string;
  moodLabel?: string;
}

const dailyCollection = () => getFirestore().collection("checkinsDaily");

export const upsertDailyCheckIn = async (userId: string, timezone: string, input: CheckInInput) => {
  const createdAt = input.createdAt ? new Date(input.createdAt) : new Date();
  const dayKey = getDayKey(createdAt, timezone);
  const docId = `${userId}_${dayKey}`;
  const docRef = dailyCollection().doc(docId);
  const snap = await docRef.get();

  const entry = {
    mood: input.mood,
    moodLabel: input.moodLabel ?? null,
    note: input.note ?? "",
    sentimentScore: typeof input.sentimentScore === "number" ? input.sentimentScore : null,
    createdAt: createdAt.toISOString(),
  };

  if (!snap.exists) {
    await docRef.set({
      userId,
      dayKey,
      timezone,
      entries: [entry],
      lastMood: input.mood,
      updatedAt: new Date().toISOString(),
    });
    return { dayKey, entryCount: 1 };
  }

  await docRef.update({
    entries: [entry],
    lastMood: input.mood,
    lastMoodLabel: input.moodLabel ?? null,
    updatedAt: new Date().toISOString(),
  });

  return { dayKey, entryCount: 1 };
};

export interface DailyCheckInRecord {
  id: string;
  userId: string;
  dayKey: string;
  timezone: string;
  entries: CheckInInput[];
  lastMood: Mood;
  lastMoodLabel?: string | null;
  updatedAt: string;
}

export const getDailyCheckIns = async (userId: string): Promise<DailyCheckInRecord[]> => {
  const snapshot = await dailyCollection().where("userId", "==", userId).get();
  const records = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<DailyCheckInRecord, "id">) }));
  return records.sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));
};
