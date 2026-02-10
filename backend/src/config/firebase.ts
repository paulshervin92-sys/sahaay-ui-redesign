import admin from "firebase-admin";
import { env } from "./env.js";

const getServiceAccount = () => {
  if (!env.FIREBASE_SERVICE_ACCOUNT_JSON) return undefined;
  try {
    return JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON) as admin.ServiceAccount;
  } catch {
    return undefined;
  }
};

export const getFirebaseApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = getServiceAccount();
  if (serviceAccount) {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: env.FIREBASE_PROJECT_ID,
    });
  }

  return admin.initializeApp({
    projectId: env.FIREBASE_PROJECT_ID,
  });
};

export const getFirestore = () => {
  return admin.firestore(getFirebaseApp());
};
