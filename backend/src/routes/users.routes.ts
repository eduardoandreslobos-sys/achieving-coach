import { Router } from 'express';
import { db } from '../config/firebase';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Obtener perfil del usuario actual
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user!.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Actualizar perfil
router.put('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const { displayName, photoURL } = req.body;

    await db
      .collection('users')
      .doc(req.user!.uid)
      .update({
        displayName,
        photoURL,
        updatedAt: new Date(),
      });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
