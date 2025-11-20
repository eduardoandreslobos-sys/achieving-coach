#!/bin/bash

# Exit on error
set -e

PROJECT_ID="triple-shift-478220-b2"
REGION="us-central1"
BACKEND_SERVICE="achieving-coach-backend"
FRONTEND_SERVICE="achieving-coach-frontend"

echo "🚀 Starting deployment to Google Cloud Run..."

# Build and deploy backend
echo "📦 Building and deploying backend..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/$BACKEND_SERVICE
gcloud run deploy $BACKEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$BACKEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --port 8080

# Get backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed to: $BACKEND_URL"

# Build and deploy frontend
echo "📦 Building and deploying frontend..."
cd ../frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/$FRONTEND_SERVICE
gcloud run deploy $FRONTEND_SERVICE \
  --image gcr.io/$PROJECT_ID/$FRONTEND_SERVICE \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL/api" \
  --port 3000

# Get frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format 'value(status.url)')
echo "✅ Frontend deployed to: $FRONTEND_URL"

echo ""
echo "🎉 Deployment complete!"
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
