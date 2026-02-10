import { getFirestore } from "../../config/firebase.js";

export interface JournalEntryInput {
  prompt: string;
  entry: string;
  createdAt?: string;
}

const collection = () => getFirestore().collection("journals");

export const createJournalEntry = async (userId: string, input: JournalEntryInput) => {
  const createdAt = input.createdAt || new Date().toISOString();
  const doc = await collection().add({
    userId,
    prompt: input.prompt,
    entry: input.entry,
    createdAt,
  });
  return { id: doc.id, prompt: input.prompt, entry: input.entry, createdAt };
};

export const listJournalEntries = async (userId: string) => {
  const snapshot = await collection().where("userId", "==", userId).limit(50).get();
  const entries = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return entries.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
};
