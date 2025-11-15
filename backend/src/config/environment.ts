import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  nodeEnv: process.env.NODE_ENV || 'development',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID!,
    storageBucket: process.env.STORAGE_BUCKET!,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
  },
};
