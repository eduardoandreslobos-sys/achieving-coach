const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'achieving-coach-dev-1763154191'
});

async function listUsers() {
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    console.log('✅ Usuarios en Firebase Auth:\n');
    listUsersResult.users.forEach((user) => {
      console.log(`📧 ${user.email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Created: ${user.metadata.creationTime}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  process.exit();
}

listUsers();
