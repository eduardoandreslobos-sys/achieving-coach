import * as admin from 'firebase-admin';

// Initialize Firebase Admin with Application Default Credentials
// (Works automatically in Cloud Shell and GCP environments)
admin.initializeApp({
  projectId: 'achieving-coach-dev-17',
});

const auth = admin.auth();
const db = admin.firestore();

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'coach' | 'coachee';
  status: 'active';
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

async function fixMissingProfiles() {
  console.log('🔍 Starting profile fix script...\n');
  
  let totalUsers = 0;
  let usersWithProfile = 0;
  let usersFixed = 0;
  let errors = 0;

  try {
    // List all users from Firebase Auth
    const listUsersResult = await auth.listUsers();
    totalUsers = listUsersResult.users.length;
    
    console.log(`📊 Found ${totalUsers} users in Firebase Auth\n`);

    for (const user of listUsersResult.users) {
      try {
        // Check if user has profile in Firestore
        const profileDoc = await db.collection('users').doc(user.uid).get();
        
        if (profileDoc.exists) {
          const data = profileDoc.data();
          console.log(`✅ ${user.email} - Has profile (${data?.role || 'unknown'})`);
          usersWithProfile++;
        } else {
          console.log(`❌ ${user.email} - Missing profile`);
          
          // Create default profile
          const defaultProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: 'coachee', // Default to coachee
            status: 'active',
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
          };

          await db.collection('users').doc(user.uid).set(defaultProfile);
          console.log(`   ✅ Created default profile (role: coachee)`);
          usersFixed++;
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${user.email}:`, error);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Total users:           ${totalUsers}`);
    console.log(`Already had profile:   ${usersWithProfile}`);
    console.log(`Fixed (created):       ${usersFixed}`);
    console.log(`Errors:                ${errors}`);
    console.log('='.repeat(60) + '\n');

    if (usersFixed > 0) {
      console.log('✅ All missing profiles have been created!');
      console.log('💡 Users can now login and access their dashboards.');
    } else {
      console.log('✅ All users already have profiles!');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the script
fixMissingProfiles();
