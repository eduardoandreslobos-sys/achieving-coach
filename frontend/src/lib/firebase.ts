import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase app
let app: FirebaseApp;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} else {
  // Server-side: create a dummy app for build time
  // This won't actually be used since all Firebase calls are client-side
  if (!getApps().length && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
  } else if (getApps().length) {
    app = getApps()[0];
  } else {
    // Dummy initialization for build time
    app = initializeApp({
      apiKey: 'build-time-dummy',
      authDomain: 'build-time-dummy',
      projectId: 'build-time-dummy',
      storageBucket: 'build-time-dummy',
      messagingSenderId: 'build-time-dummy',
      appId: 'build-time-dummy',
    });
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
