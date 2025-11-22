#!/bin/sh

# Crear el archivo de configuración de Firebase en runtime
cat > /app/public/firebase-config.js << EOF
window.__FIREBASE_CONFIG__ = {
  apiKey: "${NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${NEXT_PUBLIC_FIREBASE_APP_ID}"
};
EOF

# Iniciar Next.js
npm start
