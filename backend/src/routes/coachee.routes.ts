import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { CoacheeService } from '../services/coachee.service';
import { CoachService } from '../services/coach.service';

const router = Router();
const coacheeService = new CoacheeService();
const coachService = new CoachService();

// Obtener perfil del coachee actual
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const coachee = await coacheeService.getCoacheeByUserId(req.user!.uid);
    
    if (!coachee) {
      return res.status(404).json({ error: 'Coachee profile not found' });
    }

    const stats = await coacheeService.getCoacheeStats(coachee.id);
    res.json({ ...coachee, stats });
  } catch (error: any) {
    console.error('Error fetching coachee profile:', error);
    res.status(500).json({ error: 'Failed to fetch coachee profile' });
  }
});

// Obtener todos los coachees del coach actual
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Primero obtener el perfil de coach del usuario actual
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    
    if (!coach) {
      return res.status(403).json({ error: 'You must be a coach to view coachees' });
    }

    const { status, search } = req.query;

    let coachees;
    if (search) {
      coachees = await coacheeService.searchCoachees(coach.id, search as string);
    } else {
      coachees = await coacheeService.getCoacheesByCoach(coach.id, status as string);
    }

    res.json(coachees);
  } catch (error: any) {
    console.error('Error fetching coachees:', error);
    res.status(500).json({ error: 'Failed to fetch coachees' });
  }
});

// Obtener coachee por ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const coachee = await coacheeService.getCoacheeById(req.params.id);
    
    if (!coachee) {
      return res.status(404).json({ error: 'Coachee not found' });
    }

    // Verificar que el coach actual tiene acceso a este coachee
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    if (coach && coachee.coachId !== coach.id) {
      return res.status(403).json({ error: 'Not authorized to view this coachee' });
    }

    const stats = await coacheeService.getCoacheeStats(coachee.id);
    res.json({ ...coachee, stats });
  } catch (error: any) {
    console.error('Error fetching coachee:', error);
    res.status(500).json({ error: 'Failed to fetch coachee' });
  }
});

// Crear/invitar un coachee (usado por coaches)
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    // Verificar que el usuario es un coach
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    if (!coach) {
      return res.status(403).json({ error: 'Only coaches can add coachees' });
    }

    const coachee = await coacheeService.createCoachee({
      userId: req.body.userId || '', // Puede estar vacío si es una invitación
      email: req.body.email,
      displayName: req.body.displayName || req.body.email.split('@')[0],
      coachId: coach.id,
      programId: req.body.programId,
      notes: req.body.notes,
      tags: req.body.tags,
    });

    res.status(201).json(coachee);
  } catch (error: any) {
    console.error('Error creating coachee:', error);
    res.status(500).json({ error: 'Failed to create coachee' });
  }
});

// Actualizar coachee
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const coachee = await coacheeService.getCoacheeById(req.params.id);
    if (!coachee) {
      return res.status(404).json({ error: 'Coachee not found' });
    }

    // Verificar permisos: el coach asignado o el propio coachee
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    const isCoach = coach && coachee.coachId === coach.id;
    const isOwnProfile = coachee.userId === req.user!.uid;

    if (!isCoach && !isOwnProfile) {
      return res.status(403).json({ error: 'Not authorized to update this coachee' });
    }

    const updated = await coacheeService.updateCoachee(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error('Error updating coachee:', error);
    res.status(500).json({ error: 'Failed to update coachee' });
  }
});

// Eliminar coachee
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const coachee = await coacheeService.getCoacheeById(req.params.id);
    if (!coachee) {
      return res.status(404).json({ error: 'Coachee not found' });
    }

    // Solo el coach asignado puede eliminar
    const coach = await coachService.getCoachByUserId(req.user!.uid);
    if (!coach || coachee.coachId !== coach.id) {
      return res.status(403).json({ error: 'Not authorized to delete this coachee' });
    }

    await coacheeService.deleteCoachee(req.params.id);
    res.json({ message: 'Coachee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting coachee:', error);
    res.status(500).json({ error: 'Failed to delete coachee' });
  }
});

// Obtener estadísticas de un coachee
router.get('/:id/stats', authenticate, async (req: AuthRequest, res) => {
  try {
    const stats = await coacheeService.getCoacheeStats(req.params.id);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching coachee stats:', error);
    res.status(500).json({ error: 'Failed to fetch coachee stats' });
  }
});

export default router;
