import { Router } from 'express';
import authRoutes from './auth.routes';
import usersRoutes from './users.routes';
import goalsRoutes from './goals.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/goals', goalsRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
