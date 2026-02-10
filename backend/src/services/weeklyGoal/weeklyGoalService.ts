import { getFirestore } from "../../config/firebase.js";

const collection = () => getFirestore().collection("weeklyGoals");

export const getWeeklyGoal = async (userId: string) => {
  const doc = await collection().doc(userId).get();
  return doc.exists ? doc.data() : null;
};

export const upsertWeeklyGoal = async (userId: string, goal: any) => {
  await collection().doc(userId).set(goal, { merge: true });
  const doc = await collection().doc(userId).get();
  return doc.data();
};
