import { Router, Request, Response } from 'express';
import { GrowSessionService } from '../services/GrowSessionService';

export function createGrowSessionRoutes(growService: GrowSessionService): Router {
  const router = Router();

  router.post('/', async (req: Request, res: Response) => {
    try {
      const { coacheeId, coachId, sessionDate } = req.body;
      if (!coacheeId || !coachId || !sessionDate) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      const session = await growService.createSession({
        coacheeId,
        coachId,
        sessionDate: new Date(sessionDate),
      });
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      console.error('Error creating GROW session:', error);
      res.status(500).json({ success: false, error: 'Failed to create session' });
    }
  });

  router.get('/:sessionId', async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = await growService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }
      res.json({ success: true, data: session });
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch session' });
    }
  });

  router.get('/coachee/:coacheeId', async (req: Request, res: Response) => {
    try {
      const { coacheeId } = req.params;
      const sessions = await growService.getSessionsByCoachee(coacheeId);
      res.json({ success: true, data: sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
    }
  });

  router.patch('/:sessionId', async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const updates = req.body;
      const session = await growService.updateSession(sessionId, updates);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }
      res.json({ success: true, data: session });
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ success: false, error: 'Failed to update session' });
    }
  });

  router.post('/:sessionId/complete', async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = await growService.completeSession(sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }
      res.json({ success: true, data: session });
    } catch (error) {
      console.error('Error completing session:', error);
      res.status(500).json({ success: false, error: 'Failed to complete session' });
    }
  });

  router.delete('/:sessionId', async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const deleted = await growService.deleteSession(sessionId);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }
      res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
      console.error('Error deleting session:', error);
      res.status(500).json({ success: false, error: 'Failed to delete session' });
    }
  });

  return router;
}
