const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Firebase config (usa las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Leer el CSV
const csvPath = path.join(__dirname, '../frontend/src/data/disc-questions.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const groups = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const groupId = parseInt(values[0]);
    const dimension = values[1];
    const text = values[2];
    
    if (!groups[groupId]) {
      groups[groupId] = {
        groupId,
        statements: [],
      };
    }
    
    groups[groupId].statements.push({
      dimension,
      text,
    });
  }
  
  return Object.values(groups);
}

async function uploadQuestions() {
  console.log('📊 Subiendo preguntas DISC a Firestore...');
  
  const questionGroups = parseCSV(csvContent);
  const batch = writeBatch(db);
  
  // Crear colección: discQuestions
  questionGroups.forEach((group) => {
    const docRef = doc(db, 'discQuestions', `group_${group.groupId}`);
    batch.set(docRef, group);
  });
  
  await batch.commit();
  
  console.log('✅ 28 grupos de preguntas subidos exitosamente!');
  console.log('📋 Total statements:', questionGroups.reduce((acc, g) => acc + g.statements.length, 0));
  
  process.exit(0);
}

uploadQuestions().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
