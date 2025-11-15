import { Router } from 'express';
import { auth, db } from '../config/firebase';

const router = Router();

// Verificar token y obtener usuario
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userDoc.data(),
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Crear perfil de usuario después del registro
router.post('/create-profile', async (req, res) => {
  try {
    const { uid, email, displayName, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ error: 'UID and email are required' });
    }

    const userData = {
      email,
      displayName: displayName || email.split('@')[0],
      role: role || 'coachee',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').doc(uid).set(userData);

    res.status(201).json({ uid, ...userData });
  } catch (error: any) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

export default router;
