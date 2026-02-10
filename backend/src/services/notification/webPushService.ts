import webpush from "web-push";
import { env } from "../../config/env.js";

if (env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY && env.VAPID_SUBJECT) {
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
}

export const sendWebPush = async (subscription: any, payload: { title: string; body: string }) => {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) {
    return;
  }

  const pushPayload = JSON.stringify({ title: payload.title, body: payload.body });
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
    pushPayload,
  );
};
