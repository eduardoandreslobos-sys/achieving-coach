import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Check if Firebase is properly configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = firebaseConfig.apiKey;
  return !!(
    apiKey &&
    apiKey.length > 10 &&
    !apiKey.includes('dummy') &&
    !apiKey.includes('test') &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.length > 0
  );
};

// Flag to check if Firebase is available
export const isFirebaseAvailable = isFirebaseConfigured();

// Initialize Firebase app
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

// Only initialize if we have valid configuration
if (isFirebaseAvailable) {
  try {
    if (typeof window !== 'undefined') {
      // Client-side initialization
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
    } else {
      // Server-side initialization
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
    }

    if (app) {
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
      storageInstance = getStorage(app);
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    // Don't throw - allow app to work without Firebase
  }
} else {
  // Log warning only in development and only once
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.info(
      '%c[Firebase] Running without Firebase configuration. Some features may be unavailable.',
      'color: #FFA500'
    );
  }
}

// Export with fallback handling - consumers should check isFirebaseAvailable
export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
export const storage = storageInstance as FirebaseStorage;
