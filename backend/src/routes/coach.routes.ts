import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { CoachService } from '../services/coach.service';

const router = Router();
const coachService = new CoachService();

// Obtener perfil del coach actual (basado en userId del token)
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    
    if (!coach) {
      return res.status(404).json({ error: 'Coach profile not found' });
    }

    const stats = await coachService.getCoachStats(coach.id);
    res.json({ ...coach, stats });
  } catch (error: any) {
    console.error('Error fetching coach profile:', error);
    res.status(500).json({ error: 'Failed to fetch coach profile' });
  }
});

// Obtener todos los coaches (para admin o listados)
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;
    const coaches = await coachService.getAllCoaches(status as string);
    res.json(coaches);
  } catch (error: any) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ error: 'Failed to fetch coaches' });
  }
});

// Obtener coach por ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const coach = await coachService.getCoachById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    const stats = await coachService.getCoachStats(coach.id);
    res.json({ ...coach, stats });
  } catch (error: any) {
    console.error('Error fetching coach:', error);
    res.status(500).json({ error: 'Failed to fetch coach' });
  }
});

// Crear perfil de coach
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Verificar si ya existe
    const existing = await coachService.getCoachByUserId(req.user!.uid);
    if (existing) {
      return res.status(400).json({ error: 'Coach profile already exists' });
    }

    const coach = await coachService.createCoach({
      userId: req.user!.uid,
      email: req.user!.email || req.body.email,
      displayName: req.body.displayName,
      bio: req.body.bio,
      specialties: req.body.specialties,
      certifications: req.body.certifications,
      hourlyRate: req.body.hourlyRate,
      currency: req.body.currency,
      timezone: req.body.timezone,
    });

    res.status(201).json(coach);
  } catch (error: any) {
    console.error('Error creating coach:', error);
    res.status(500).json({ error: 'Failed to create coach profile' });
  }
});

// Actualizar perfil de coach
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    // Verificar que el coach pertenece al usuario actual
    const coach = await coachService.getCoachById(req.params.id);
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    
    if (coach.userId !== req.user!.uid) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const updated = await coachService.updateCoach(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating coach:', error);
    res.status(500).json({ error: 'Failed to update coach profile' });
  }
});

// Actualizar mi perfil de coach
router.put('/me/update', authenticate, async (req: AuthRequest, res) => {
  try {
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    if (!coach) {
      return res.status(404).json({ error: 'Coach profile not found' });
    }

    const updated = await coachService.updateCoach(coach.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating coach:', error);
    res.status(500).json({ error: 'Failed to update coach profile' });
  }
});

// Obtener estadísticas del coach
router.get('/:id/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const stats = await coachService.getCoachStats(req.params.id);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching coach stats:', error);
    res.status(500).json({ error: 'Failed to fetch coach stats' });
  }
});

export default router;
