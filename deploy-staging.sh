#!/bin/bash
set -e

echo "🚀 Deploying to STAGING..."

# Switch to staging
firebase use staging

# Deploy Firestore rules and indexes
echo "📝 Deploying Firestore rules and indexes..."
firebase deploy --only firestore --project achieving-coach-staging

echo "✅ Staging deployment complete!"
echo "📊 Console: https://console.firebase.google.com/project/achieving-coach-staging"
