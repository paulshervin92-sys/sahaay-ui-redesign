import { getFirestore } from "../../config/firebase.js";
import { getNextRunAt } from "../../utils/date.js";
import { sendWebPush } from "./webPushService.js";
import { sendFcmPush } from "./fcmService.js";

const reminderCollection = () => getFirestore().collection("reminders");
const subscriptionCollection = () => getFirestore().collection("notificationSubscriptions");

export const upsertReminder = async (userId: string, timezone: string, time: string, enabled: boolean) => {
  const docRef = reminderCollection().doc(userId);
  const nextRunAt = enabled ? getNextRunAt(time, timezone) : null;
  await docRef.set({ userId, timezone, time, enabled, nextRunAt }, { merge: true });
};

export const registerSubscription = async (userId: string, payload: any) => {
  const docRef = subscriptionCollection().doc(`${userId}_${payload.type}`);
  await docRef.set({ userId, ...payload, createdAt: new Date().toISOString() }, { merge: true });
};

const dispatchToUser = async (userId: string, title: string, body: string) => {
  const subs = await subscriptionCollection().where("userId", "==", userId).get();
  await Promise.all(
    subs.docs.map(async (doc) => {
      const data = doc.data();
      if (data.type === "webpush") {
        await sendWebPush(data, { title, body });
      }
      if (data.type === "fcm") {
        await sendFcmPush(data, { title, body });
      }
    }),
  );
};

export const runDueReminders = async () => {
  const now = new Date();
  const due = await reminderCollection().where("enabled", "==", true).where("nextRunAt", "<=", now).get();
  for (const doc of due.docs) {
    const data = doc.data();
    await dispatchToUser(data.userId, "Gentle check-in", "How are you feeling today? A small check-in can help.");
    const nextRunAt = getNextRunAt(data.time, data.timezone || "UTC");
    await doc.ref.update({ nextRunAt });
  }
};

export const startReminderScheduler = () => {
  setInterval(() => {
    runDueReminders().catch(() => null);
  }, 60000);
};
