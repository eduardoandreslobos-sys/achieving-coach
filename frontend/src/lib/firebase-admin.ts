import { initializeApp, getApps, cert, App } from 'firebase-admin/app';

let adminApp: App | undefined;

export function initAdmin(): App {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return adminApp;
  }

  // Check for service account credentials
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    try {
      const credentials = JSON.parse(serviceAccount);
      adminApp = initializeApp({
        credential: cert(credentials),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (error) {
      console.error('Error parsing Firebase service account:', error);
      // Fall back to default credentials
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    // Use default credentials (works in Firebase/GCP environment)
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }

  return adminApp;
}

export function getAdminApp(): App {
  if (!adminApp) {
    return initAdmin();
  }
  return adminApp;
}
