import admin from "firebase-admin";
import { getFirebaseApp } from "../../config/firebase.js";

export const sendFcmPush = async (subscription: any, payload: { title: string; body: string }) => {
  const app = getFirebaseApp();
  const messaging = admin.messaging(app);
  if (!subscription?.token) return;

  await messaging.send({
    token: subscription.token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
  });
};
