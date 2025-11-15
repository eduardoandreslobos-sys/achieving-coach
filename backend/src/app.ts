import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// CORS configuration for Cloud Shell
const corsOptions = {
  origin: [
    /^https:\/\/3000-cs-.*\.cloudshell\.dev$/,
    /^https:\/\/.*-dot-.*\.web\.app$/,
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

export default app;
