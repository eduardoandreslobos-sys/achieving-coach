import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

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


// Función completa que actualiza assignments y notifica al coach
export async function saveToolResultComplete(
  userProfile: any,
  toolId: string,
  toolName: string,
  category: string,
  results: any
) {
  try {
    if (!userProfile?.uid || !toolId) {
      console.warn('Tool result save skipped: missing required fields');
      return;
    }

    const userId = userProfile.uid;
    const userName = userProfile.displayName || userProfile.email || 'Unknown User';
    const coachId = userProfile.role === 'coachee' 
      ? userProfile.coacheeInfo?.coachId 
      : userId;

    // 1. Guardar resultado
    await addDoc(collection(db, 'tool_results'), {
      userId,
      userName,
      toolId,
      toolName: toolName || 'Unknown Tool',
      category: category || 'general',
      coachId,
      results: results || {},
      completedAt: serverTimestamp(),
    });

    // 2. Si es coachee, actualizar assignment y notificar al coach
    if (userProfile.role === 'coachee' && coachId) {
      const assignmentQuery = query(
        collection(db, 'tool_assignments'),
        where('coacheeId', '==', userId),
        where('toolId', '==', toolId),
        where('completed', '==', false)
      );
      
      const assignmentSnapshot = await getDocs(assignmentQuery);
      
      if (!assignmentSnapshot.empty) {
        const assignmentDoc = assignmentSnapshot.docs[0];
        
        // Actualizar a completado
        await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
          completed: true,
          completedAt: serverTimestamp(),
        });

        // Notificar al coach
        await addDoc(collection(db, 'notifications'), {
          userId: coachId,
          type: 'tool_completed',
          title: 'Tool Completed',
          message: `${userName} completed ${toolName}`,
          read: false,
          createdAt: serverTimestamp(),
          actionUrl: `/coach/clients/${userId}`,
        });
      }
    }

    // 3. Log la actividad
    await logActivity(
      userId,
      userName,
      'tool_completed',
      `Completed ${toolName || 'tool'}`,
      { toolId, category }
    );

  } catch (error) {
    console.error('Error saving tool result:', error);
  }
}
