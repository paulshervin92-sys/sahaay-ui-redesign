import { getFirestore } from "../../config/firebase.js";

const collection = () => getFirestore().collection("safetyPlans");

export const getSafetyPlan = async (userId: string) => {
  const doc = await collection().doc(userId).get();
  return doc.exists ? doc.data() : null;
};

export const upsertSafetyPlan = async (userId: string, plan: any) => {
  await collection().doc(userId).set(plan, { merge: true });
  const doc = await collection().doc(userId).get();
  return doc.data();
};
