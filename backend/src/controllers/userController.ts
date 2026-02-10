import type { Response } from "express";
import { getFirestore } from "../config/firebase.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

const profilesCollection = () => getFirestore().collection("profiles");
const settingsCollection = () => getFirestore().collection("settings");

export const getProfile = async (req: AuthRequest, res: Response) => {
  const doc = await profilesCollection().doc(req.userId as string).get();
  return res.json({ profile: doc.data() ?? null });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  await profilesCollection().doc(req.userId as string).set(req.body, { merge: true });
  const doc = await profilesCollection().doc(req.userId as string).get();
  return res.json({ profile: doc.data() ?? null });
};

export const getSettings = async (req: AuthRequest, res: Response) => {
  const doc = await settingsCollection().doc(req.userId as string).get();
  return res.json({ settings: doc.data() ?? null });
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  await settingsCollection().doc(req.userId as string).set(req.body, { merge: true });
  const doc = await settingsCollection().doc(req.userId as string).get();
  return res.json({ settings: doc.data() ?? null });
};

export const exportUserData = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const [profileDoc, settingsDoc, weeklyDoc, safetyDoc, checkinsSnap, journalsSnap] = await Promise.all([
    profilesCollection().doc(userId).get(),
    settingsCollection().doc(userId).get(),
    getFirestore().collection("weeklyGoals").doc(userId).get(),
    getFirestore().collection("safetyPlans").doc(userId).get(),
    getFirestore().collection("checkinsDaily").where("userId", "==", userId).get(),
    getFirestore().collection("journals").where("userId", "==", userId).get(),
  ]);

  return res.json({
    profile: profileDoc.data() ?? null,
    settings: settingsDoc.data() ?? null,
    weeklyGoal: weeklyDoc.data() ?? null,
    safetyPlan: safetyDoc.data() ?? null,
    checkins: checkinsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    journals: journalsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  });
};

const deleteByQuery = async (collectionName: string, userId: string) => {
  const collection = getFirestore().collection(collectionName);
  const snapshot = await collection.where("userId", "==", userId).get();
  const batch = getFirestore().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
};

export const deleteUserData = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  await Promise.all([
    profilesCollection().doc(userId).delete(),
    settingsCollection().doc(userId).delete(),
    getFirestore().collection("weeklyGoals").doc(userId).delete(),
    getFirestore().collection("safetyPlans").doc(userId).delete(),
    getFirestore().collection("reminders").doc(userId).delete(),
  ]);

  await Promise.all([
    deleteByQuery("journals", userId),
    deleteByQuery("checkinsDaily", userId),
    deleteByQuery("chatMessages", userId),
    deleteByQuery("notificationSubscriptions", userId),
    deleteByQuery("reports", userId),
  ]);

  return res.json({ ok: true });
};
