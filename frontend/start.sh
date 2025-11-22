#!/bin/sh

# Crear el directorio si no existe
mkdir -p /app/.next/static

# Crear el archivo de configuración de Firebase en runtime
cat > /app/.next/static/firebase-config.js << EOF
window.__FIREBASE_CONFIG__ = {
  apiKey: "${NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${NEXT_PUBLIC_FIREBASE_APP_ID}"
};
console.log('Firebase config loaded from runtime');
EOF

# También crearlo en public para desarrollo
mkdir -p /app/public
cat > /app/public/firebase-config.js << EOF
window.__FIREBASE_CONFIG__ = {
  apiKey: "${NEXT_PUBLIC_FIREBASE_API_KEY}",
  authDomain: "${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
  projectId: "${NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
  storageBucket: "${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${NEXT_PUBLIC_FIREBASE_APP_ID}"
};
console.log('Firebase config loaded from runtime (public)');
EOF

echo "Environment variables injected:"
echo "API Key: ${NEXT_PUBLIC_FIREBASE_API_KEY:0:20}..."
echo "Project ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID}"

# Iniciar Next.js
npm start
