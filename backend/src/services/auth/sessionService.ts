import { getFirestore } from "../../config/firebase.js";
import { env } from "../../config/env.js";
import { DateTime } from "luxon";
import crypto from "crypto";

const collection = () => getFirestore().collection("sessions");

export const createSession = async (userId: string) => {
  const sessionId = crypto.randomUUID();
  const expiresAt = DateTime.utc().plus({ hours: env.SESSION_TTL_HOURS }).toJSDate();
  await collection().doc(sessionId).set({ userId, expiresAt });
  return { sessionId, expiresAt };
};

export const getSession = async (sessionId: string) => {
  const snap = await collection().doc(sessionId).get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (!data?.expiresAt) return null;
  if (DateTime.fromJSDate(data.expiresAt.toDate?.() ?? data.expiresAt) <= DateTime.utc()) {
    await collection().doc(sessionId).delete();
    return null;
  }
  return { userId: data.userId as string, expiresAt: data.expiresAt };
};

export const deleteSession = async (sessionId: string) => {
  await collection().doc(sessionId).delete();
};
