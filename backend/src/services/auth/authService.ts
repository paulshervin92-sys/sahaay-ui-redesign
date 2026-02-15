// Fetch user email by userId
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  const doc = await usersCollection().doc(userId).get();
  if (!doc.exists) return null;
  const data = doc.data();
  return data?.email || null;
};
import bcrypt from "bcryptjs";
import { getFirestore } from "../../config/firebase.js";
import { AppError } from "../../utils/appError.js";

const usersCollection = () => getFirestore().collection("users");
const profilesCollection = () => getFirestore().collection("profiles");
const settingsCollection = () => getFirestore().collection("settings");

export const registerUser = async (email: string, password: string, displayName?: string) => {
  const emailLower = email.trim().toLowerCase();
  const existing = await usersCollection().where("emailLower", "==", emailLower).limit(1).get();
  if (!existing.empty) {
    throw new AppError("Email already in use", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userRef = usersCollection().doc();
  const createdAt = new Date().toISOString();

  await userRef.set({
    email: email.trim(),
    emailLower,
    passwordHash,
    displayName: displayName?.trim() || "",
    createdAt,
  });

  await profilesCollection().doc(userRef.id).set({
    id: userRef.id,
    name: displayName?.trim() || "",
    email: email.trim(),
    goals: [],
    baselineMood: "neutral",
    createdAt,
    onboardingComplete: false,
  });

  await settingsCollection().doc(userRef.id).set({
    fontScale: 1,
    reduceMotion: false,
    remindersEnabled: false,
    reminderTime: "20:00",
    privateMode: false,
    offlineSync: true,
    timezone: "UTC",
  });

  return { userId: userRef.id, email: email.trim(), displayName: displayName?.trim() || "" };
};

export const authenticateUser = async (email: string, password: string) => {
  const emailLower = email.trim().toLowerCase();
  const existing = await usersCollection().where("emailLower", "==", emailLower).limit(1).get();
  if (existing.empty) {
    throw new AppError("Invalid email or password", 401);
  }

  const doc = existing.docs[0];
  const data = doc.data();
  const matches = await bcrypt.compare(password, data.passwordHash as string);
  if (!matches) {
    throw new AppError("Invalid email or password", 401);
  }

  return { userId: doc.id, email: data.email as string, displayName: data.displayName as string };
};
