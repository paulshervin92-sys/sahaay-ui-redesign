import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  type Firestore,
} from "firebase/firestore";

let app: FirebaseApp | undefined;

export const initFirebase = () => {
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }

  return app;
};

export const firebaseApp = initFirebase();
export const auth = getAuth(firebaseApp);

const globalFirestore = globalThis as typeof globalThis & { __sahaayFirestore?: Firestore };

const initFirestore = () => {
  if (globalFirestore.__sahaayFirestore) {
    return globalFirestore.__sahaayFirestore;
  }

  try {
    const existing = getFirestore(firebaseApp);
    globalFirestore.__sahaayFirestore = existing;
    return existing;
  } catch {
    const created = initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
    globalFirestore.__sahaayFirestore = created;
    return created;
  }
};

export const db = initFirestore();
