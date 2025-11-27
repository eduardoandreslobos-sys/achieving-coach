/**
 * Migration Script: Add organizationId to existing data
 * 
 * This script:
 * 1. Creates a default organization
 * 2. Updates all users with organizationId
 * 3. Updates all collections (sessions, goals, reflections, etc.)
 * 
 * Run with: npx ts-node backend/scripts/add-organization-id-migration.ts
 */

import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

// Default organization to create
const DEFAULT_ORG = {
  id: 'default-org',
  name: 'AchievingCoach Default',
  slug: 'default',
  plan: 'professional' as const,
  status: 'active' as const,
  limits: {
    coaches: 10,
    coachees: 100,
    storage: 50,
    programs: 20,
  },
  usage: {
    coaches: 0,
    coachees: 0,
    storage: 0,
    programs: 0,
  },
  branding: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
  settings: {
    allowSelfSignup: false,
    requireEmailVerification: true,
    ssoEnabled: false,
    defaultCoachRole: 'coach' as const,
    defaultCoacheeRole: 'coachee' as const,
  },
  contactInfo: {
    primaryContactName: 'Admin',
    primaryContactEmail: 'admin@achievingcoach.com',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'migration-script',
};

// Collections that need organizationId
const COLLECTIONS_TO_MIGRATE = [
  'users',
  'coaches',
  'coachees',
  'sessions',
  'goals',
  'reflections',
  'grow_sessions',
  'tool_assignments',
  'wheel_of_life',
  'disc_results',
  'activities',
  'tool_results',
];

/**
 * Create default organization if it doesn't exist
 */
async function createDefaultOrganization(): Promise<string> {
  console.log('📋 Step 1: Creating default organization...');
  
  const orgRef = db.collection('organizations').doc(DEFAULT_ORG.id);
  const orgDoc = await orgRef.get();
  
  if (orgDoc.exists) {
    console.log('✅ Default organization already exists');
    return DEFAULT_ORG.id;
  }
  
  await orgRef.set(DEFAULT_ORG);
  console.log('✅ Default organization created:', DEFAULT_ORG.id);
  
  return DEFAULT_ORG.id;
}

/**
 * Update collection with organizationId
 */
async function migrateCollection(
  collectionName: string,
  organizationId: string
): Promise<number> {
  console.log(`\n📋 Migrating collection: ${collectionName}`);
  
  const snapshot = await db.collection(collectionName).get();
  
  if (snapshot.empty) {
    console.log(`  ℹ️  Collection '${collectionName}' is empty, skipping`);
    return 0;
  }
  
  let updatedCount = 0;
  const batch = db.batch();
  let batchCount = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Skip if already has organizationId
    if (data.organizationId) {
      continue;
    }
    
    // Add organizationId
    batch.update(doc.ref, {
      organizationId,
      updatedAt: new Date(),
    });
    
    batchCount++;
    updatedCount++;
    
    // Firestore batch limit is 500
    if (batchCount >= 500) {
      await batch.commit();
      console.log(`  ✅ Committed batch of ${batchCount} documents`);
      batchCount = 0;
    }
  }
  
  // Commit remaining batch
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✅ Committed final batch of ${batchCount} documents`);
  }
  
  console.log(`  ✅ Updated ${updatedCount} documents in '${collectionName}'`);
  return updatedCount;
}

/**
 * Update Firebase Auth users with custom claims
 */
async function updateAuthUsers(organizationId: string): Promise<number> {
  console.log('\n📋 Step 3: Updating Firebase Auth users...');
  
  let updatedCount = 0;
  let nextPageToken: string | undefined;
  
  do {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    
    for (const userRecord of listUsersResult.users) {
      // Check if user already has organizationId in custom claims
      const customClaims = userRecord.customClaims || {};
      
      if (customClaims.organizationId) {
        continue;
      }
      
      // Set custom claims with organizationId and default role
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        ...customClaims,
        organizationId,
        role: 'coachee', // Default role, can be updated later
      });
      
      updatedCount++;
      console.log(`  ✅ Updated user: ${userRecord.email} (${userRecord.uid})`);
    }
    
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  
  console.log(`  ✅ Updated ${updatedCount} Firebase Auth users`);
  return updatedCount;
}

/**
 * Main migration function
 */
async function runMigration() {
  console.log('🚀 Starting migration: Add organizationId to existing data\n');
  console.log('⚠️  WARNING: This will modify data in Firestore');
  console.log('⚠️  Make sure you have a backup before proceeding\n');
  
  try {
    // Step 1: Create default organization
    const organizationId = await createDefaultOrganization();
    
    // Step 2: Migrate Firestore collections
    console.log('\n📋 Step 2: Migrating Firestore collections...');
    let totalUpdated = 0;
    
    for (const collectionName of COLLECTIONS_TO_MIGRATE) {
      const count = await migrateCollection(collectionName, organizationId);
      totalUpdated += count;
    }
    
    console.log(`\n  ✅ Total documents updated: ${totalUpdated}`);
    
    // Step 3: Update Firebase Auth users
    const authUpdatedCount = await updateAuthUsers(organizationId);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Migration completed successfully!');
    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`  - Organization created: ${organizationId}`);
    console.log(`  - Firestore documents updated: ${totalUpdated}`);
    console.log(`  - Auth users updated: ${authUpdatedCount}`);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
runMigration()
  .then(() => {
    console.log('\n✅ Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration script failed:', error);
    process.exit(1);
  });
