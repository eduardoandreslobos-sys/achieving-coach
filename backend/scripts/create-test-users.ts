/**
 * Script to create test users for E2E testing
 * Run with: npx ts-node scripts/create-test-users.ts
 */

import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID || 'achieving-coach-dev-1763154191';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: projectId,
  });
}

const auth = admin.auth();
const db = new Firestore({ projectId });

interface TestUser {
  email: string;
  password: string;
  displayName: string;
  role: 'coach' | 'coachee' | 'admin';
}

const testUsers: TestUser[] = [
  {
    email: 'test-coach@achievingcoach.com',
    password: 'TestPassword123',
    displayName: 'Test Coach',
    role: 'coach',
  },
  {
    email: 'test-coachee@achievingcoach.com',
    password: 'TestPassword123',
    displayName: 'Test Coachee',
    role: 'coachee',
  },
  {
    email: 'test-admin@achievingcoach.com',
    password: 'TestPassword123',
    displayName: 'Test Admin',
    role: 'admin',
  },
];

async function createTestUser(user: TestUser): Promise<void> {
  try {
    // Check if user already exists
    try {
      const existingUser = await auth.getUserByEmail(user.email);
      console.log(`User ${user.email} already exists with UID: ${existingUser.uid}`);

      // Update password to ensure it matches
      await auth.updateUser(existingUser.uid, {
        password: user.password,
      });
      console.log(`  Password updated for ${user.email}`);

      // Update Firestore document
      await db.collection('users').doc(existingUser.uid).set({
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        updatedAt: new Date(),
      }, { merge: true });

      return;
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Create new user
    const userRecord = await auth.createUser({
      email: user.email,
      password: user.password,
      displayName: user.displayName,
      emailVerified: true,
    });

    console.log(`Created user ${user.email} with UID: ${userRecord.uid}`);

    // Create Firestore document for the user
    await db.collection('users').doc(userRecord.uid).set({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`  Firestore document created for ${user.email} with role: ${user.role}`);
  } catch (error) {
    console.error(`Error creating user ${user.email}:`, error);
  }
}

async function main() {
  console.log('Creating test users for E2E testing...');
  console.log(`Project ID: ${projectId}\n`);

  for (const user of testUsers) {
    await createTestUser(user);
  }

  console.log('\n✅ Test users created successfully!');
  console.log('\nCredentials:');
  for (const user of testUsers) {
    console.log(`  ${user.role}: ${user.email} / ${user.password}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
