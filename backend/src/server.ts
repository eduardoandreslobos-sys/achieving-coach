import express from 'express';
import cors from 'cors';
import { Firestore } from '@google-cloud/firestore';
import admin from 'firebase-admin';

// Import existing services and routes
import { GoalsService } from './services/goals.service';
import { createGoalsRoutes } from './routes/goals.routes';
import { createAuthRoutes } from './routes/auth.routes';
import { createUsersRoutes } from './routes/users.routes';

// Import NEW GROW services and routes
import { GrowSessionService } from './services/GrowSessionService';
import { createGrowSessionRoutes } from './routes/growSessions';

// Import config
import { config } from './config/environment';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: config.firebase.projectId,
  });
}

// Initialize Firestore
const db = new Firestore({
  projectId: config.firebase.projectId,
});

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Initialize existing services
const goalsService = new GoalsService(db);

// Initialize NEW GROW service
const growService = new GrowSessionService(db);

// Setup existing routes
app.use('/api/v1/auth', createAuthRoutes());
app.use('/api/v1/users', createUsersRoutes());
app.use('/api/v1/goals', createGoalsRoutes(goalsService));

// Setup NEW GROW routes
app.use('/api/v1/grow-sessions', createGrowSessionRoutes(growService));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔥 Firebase Project: ${config.firebase.projectId}`);
});

export default app;
