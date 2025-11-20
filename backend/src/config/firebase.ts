import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'achieving-coach-dev-1763154191';

console.log('🔧 Firebase Config:');
console.log(`  - Project ID: ${projectId}`);
console.log(`  - Environment: ${process.env.NODE_ENV}`);

// Initialize Firebase Admin with Application Default Credentials
// In Cloud Run, this automatically uses the service account
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: projectId,
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error);
  }
}

// Initialize Firestore
const db = new Firestore({
  projectId: projectId,
});

const auth = admin.auth();

export { admin, db, auth };
