import { openDB } from "idb";
import type { CheckIn, JournalEntry } from "@/types";

const DB_NAME = "sahaay_offline";
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("pendingCheckIns")) {
      db.createObjectStore("pendingCheckIns", { keyPath: "id" });
    }
    if (!db.objectStoreNames.contains("pendingJournals")) {
      db.createObjectStore("pendingJournals", { keyPath: "id" });
    }
  },
});

export const queueCheckIn = async (checkIn: CheckIn) => {
  const db = await dbPromise;
  await db.put("pendingCheckIns", checkIn);
};

export const queueJournal = async (entry: JournalEntry) => {
  const db = await dbPromise;
  await db.put("pendingJournals", entry);
};

export const getQueuedCheckIns = async () => {
  const db = await dbPromise;
  return db.getAll("pendingCheckIns");
};

export const getQueuedJournals = async () => {
  const db = await dbPromise;
  return db.getAll("pendingJournals");
};

export const clearQueuedCheckIns = async () => {
  const db = await dbPromise;
  await db.clear("pendingCheckIns");
};

export const clearQueuedJournals = async () => {
  const db = await dbPromise;
  await db.clear("pendingJournals");
};
