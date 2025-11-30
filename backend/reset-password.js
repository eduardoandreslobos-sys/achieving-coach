const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'achieving-coach-dev-1763154191'
});

async function resetPassword() {
  const email = 'test3@achievingcoach.com';
  const newPassword = 'Test123456';
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      password: newPassword
    });
    console.log('✅ Password reset for ' + email);
    console.log('New password: ' + newPassword);
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  process.exit();
}

resetPassword();
