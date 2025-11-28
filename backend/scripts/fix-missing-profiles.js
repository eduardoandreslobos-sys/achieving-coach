const admin = require('firebase-admin');

// Initialize with correct Firebase project ID (production)
admin.initializeApp({
  projectId: 'achieving-coach-dev-1763154191',
});

const auth = admin.auth();
const db = admin.firestore();

async function fixMissingProfiles() {
  console.log('🔍 Starting profile fix script...');
  console.log('Firebase Project: achieving-coach-dev-1763154191\n');
  
  let totalUsers = 0;
  let usersWithProfile = 0;
  let usersFixed = 0;
  let errors = 0;

  try {
    const listUsersResult = await auth.listUsers();
    totalUsers = listUsersResult.users.length;
    
    console.log(`📊 Found ${totalUsers} users in Firebase Auth\n`);

    for (const user of listUsersResult.users) {
      try {
        const profileDoc = await db.collection('users').doc(user.uid).get();
        
        if (profileDoc.exists) {
          const data = profileDoc.data();
          console.log(`✅ ${user.email} - Has profile (${data?.role || 'unknown'})`);
          usersWithProfile++;
        } else {
          console.log(`❌ ${user.email} - Missing profile`);
          
          const defaultProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            role: 'coachee',
            status: 'active',
            createdAt: admin.firestore.Timestamp.now(),
            updatedAt: admin.firestore.Timestamp.now(),
          };

          await db.collection('users').doc(user.uid).set(defaultProfile);
          console.log(`   ✅ Created default profile (role: coachee)`);
          usersFixed++;
        }
      } catch (error) {
        console.error(`   ❌ Error processing ${user.email}:`, error.message);
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
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

fixMissingProfiles();
