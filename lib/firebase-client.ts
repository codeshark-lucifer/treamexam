import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp | undefined;
if (typeof window !== "undefined" || (firebaseConfig.apiKey && firebaseConfig.projectId)) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error("Firebase app initialization error:", error);
  }
}

// Services - Only initialize if app is available
export const auth = (app ? getAuth(app) : null) as unknown as Auth;
export const rtdb = (app && firebaseConfig.databaseURL ? getDatabase(app) : null) as unknown as Database;
export const db = (app ? getFirestore(app) : null) as unknown as Firestore;
export const storage = (app ? getStorage(app) : null) as unknown as FirebaseStorage;

export default app;