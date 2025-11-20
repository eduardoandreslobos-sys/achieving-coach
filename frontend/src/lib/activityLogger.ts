import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logActivity(
  userId: string,
  userName: string,
  activityType: string,
  description: string,
  metadata?: any
) {
  try {
    // Validar que los campos requeridos no sean undefined
    if (!userId || !activityType) {
      console.warn('Activity logging skipped: missing required fields');
      return;
    }

    await addDoc(collection(db, 'activities'), {
      userId,
      userName: userName || 'Unknown User',
      activityType,
      description: description || '',
      metadata: metadata || {},
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // No lanzar el error para que no afecte la UX
  }
}

export async function saveToolResult(
  userId: string,
  userName: string,
  toolId: string,
  toolName: string,
  category: string,
  results: any
) {
  try {
    // Validar que los campos requeridos no sean undefined
    if (!userId || !toolId) {
      console.warn('Tool result save skipped: missing required fields');
      return;
    }

    await addDoc(collection(db, 'tool_results'), {
      userId,
      userName: userName || 'Unknown User',
      toolId,
      toolName: toolName || 'Unknown Tool',
      category: category || 'general',
      results: results || {},
      completedAt: serverTimestamp(),
    });

    // Log la actividad también
    await logActivity(
      userId,
      userName,
      'tool_completed',
      `Completed ${toolName || 'tool'}`,
      { toolId, category }
    );
  } catch (error) {
    console.error('Error saving tool result:', error);
    // No lanzar el error para que no afecte la UX
  }
}
