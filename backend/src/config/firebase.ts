import dotenv from 'dotenv';
import path from 'path';
import admin from 'firebase-admin';

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../../.env') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('🔧 Firebase Config:');
console.log('  - Project ID:', projectId);
console.log('  - Credentials Path:', credentialsPath);

if (!projectId) {
  throw new Error('FIREBASE_PROJECT_ID not configured');
}

if (!credentialsPath) {
  throw new Error('GOOGLE_APPLICATION_CREDENTIALS not configured');
}

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId,
});

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

console.log('✅ Firebase initialized successfully');

export default app;
