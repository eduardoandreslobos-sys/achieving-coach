import express from 'express';
import cors from 'cors';
import { Firestore } from '@google-cloud/firestore';
import admin from 'firebase-admin';

// Import routes
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';

// Import NEW GROW services and routes
import { GrowSessionService } from './services/GrowSessionService';
import { createGrowSessionRoutes } from './routes/growSessions';

// Import config
import { config } from './config/environment';

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check (before Firebase initialization)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Initialize Firebase Admin (after health check)
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: config.firebase.projectId,
    });
    console.log('✅ Firebase initialized');
  }
} catch (error) {
  console.error('⚠️  Firebase initialization error:', error);
}

// Initialize Firestore
const db = new Firestore({
  projectId: config.firebase.projectId,
});

// Initialize services
const growService = new GrowSessionService(db);

// Setup routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
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
const PORT = parseInt(process.env.PORT || '8080', 10);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔥 Firebase Project: ${config.firebase.projectId}`);
});

export default app;
