import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { GoalsService } from '../services/goals.service';

const router = Router();
const goalsService = new GoalsService();

// Obtener goals del usuario actual
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const goals = await goalsService.getGoalsByCoachee(req.user!.uid);
    res.json(goals);
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Crear nuevo goal
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const goal = await goalsService.createGoal(req.user!.uid, req.body);
    res.status(201).json(goal);
  } catch (error: any) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Actualizar goal
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const goal = await goalsService.updateGoal(req.params.id, req.body);
    res.json(goal);
  } catch (error: any) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Eliminar goal (soft delete)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    await goalsService.deleteGoal(req.params.id);
    res.json({ message: 'Goal archived successfully' });
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
