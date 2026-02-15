import { getFirestore } from "../../config/firebase.js";
import { getUserEmailById } from "../auth/authService.js";
import { sendEventReminder } from "../../utils/email.js";
import { scheduleEmail } from "../../utils/scheduler.js";

export interface JournalEntryInput {
  prompt: string;
  entry: string;
  createdAt?: string;
  eventTime?: string; // ISO string for event reminder (optional)
}

const collection = () => getFirestore().collection("journals");

export const createJournalEntry = async (userId: string, input: JournalEntryInput) => {
  const createdAt = input.createdAt || new Date().toISOString();
  const doc = await collection().add({
    userId,
    prompt: input.prompt,
    entry: input.entry,
    createdAt,
    eventTime: input.eventTime || null,
  });

  // Schedule email reminder if eventTime is provided and in the future
  if (input.eventTime) {
    const eventDate = new Date(input.eventTime);
    if (!isNaN(eventDate.getTime()) && eventDate > new Date()) {
      const email = await getUserEmailById(userId);
      if (email) {
        scheduleEmail({
          id: `journal_event_${doc.id}`,
          date: eventDate,
          callback: async () => {
            await sendEventReminder({
              to: email,
              subject: "Sahaay Event Reminder",
              text: `You have an event: ${input.prompt}\n\n${input.entry}`,
            });
          },
        });
      }
    }
  }
  return { id: doc.id, prompt: input.prompt, entry: input.entry, createdAt, eventTime: input.eventTime };
};

export const listJournalEntries = async (userId: string) => {
  const snapshot = await collection().where("userId", "==", userId).limit(50).get();
  const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return entries.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
};
