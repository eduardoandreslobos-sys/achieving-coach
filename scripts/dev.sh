#!/bin/bash

echo "🚀 Starting AchievingCoach Development Environment"
echo ""

# Verificar que existe el service account key
if [ ! -f "$HOME/achieving-coach-backend-key.json" ]; then
  echo "❌ Error: Service account key not found"
  echo "Expected: $HOME/achieving-coach-backend-key.json"
  exit 1
fi

echo "✅ Environment configured"
echo ""
echo "Starting services..."
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:8080"
echo ""

npm run dev
