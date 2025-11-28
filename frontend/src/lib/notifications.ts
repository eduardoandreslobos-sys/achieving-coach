import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import type { NotificationType } from '@/types/notification';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  actionUrl?: string;
}

/**
 * Create a notification for a user
 * Call this from frontend when an action occurs
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      data: params.data || {},
      actionUrl: params.actionUrl || '',
      read: false,
      createdAt: serverTimestamp(),
    });

    return notificationRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Notification helpers for common actions
export const notificationHelpers = {
  toolAssigned: async (coacheeId: string, coachName: string, toolName: string, toolSlug: string) => {
    return createNotification({
      userId: coacheeId,
      type: 'tool_assigned',
      title: 'New Tool Assigned',
      message: `${coachName} assigned you "${toolName}"`,
      actionUrl: `/tools/${toolSlug}`,
    });
  },

  toolCompleted: async (coachId: string, coacheeName: string, toolName: string, coacheeId: string) => {
    return createNotification({
      userId: coachId,
      type: 'tool_completed',
      title: 'Tool Completed',
      message: `${coacheeName} completed "${toolName}"`,
      actionUrl: `/coach/clients/${coacheeId}`,
    });
  },

  sessionScheduled: async (userId: string, partnerName: string, sessionDate: string) => {
    return createNotification({
      userId,
      type: 'session_scheduled',
      title: 'Session Scheduled',
      message: `Session with ${partnerName} on ${sessionDate}`,
      actionUrl: '/sessions',
    });
  },
};
