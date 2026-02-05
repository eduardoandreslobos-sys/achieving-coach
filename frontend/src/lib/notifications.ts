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

  // Session Confirmation Required (sent to coachee)
  sessionConfirmationRequired: async (
    coacheeId: string,
    coachName: string,
    sessionDate: string,
    sessionId: string
  ) => {
    return createNotification({
      userId: coacheeId,
      type: 'session_scheduled',
      title: '📅 Nueva Sesión Programada',
      message: `${coachName} ha programado una sesión para el ${sessionDate}. Por favor confirma tu asistencia.`,
      actionUrl: `/sessions/${sessionId}`,
    });
  },

  // Session Confirmed (sent to coach)
  sessionConfirmed: async (
    coachId: string,
    coacheeName: string,
    sessionId: string
  ) => {
    return createNotification({
      userId: coachId,
      type: 'session_scheduled',
      title: '✅ Sesión Confirmada',
      message: `${coacheeName} ha confirmado su asistencia a la sesión.`,
      actionUrl: `/coach/sessions/${sessionId}`,
    });
  },

  // Session Rejected (sent to coach)
  sessionRejected: async (
    coachId: string,
    coacheeName: string,
    reason: string,
    sessionId: string
  ) => {
    return createNotification({
      userId: coachId,
      type: 'session_scheduled',
      title: '❌ Sesión Rechazada',
      message: `${coacheeName} ha rechazado la sesión: "${reason}"`,
      actionUrl: `/coach/sessions/${sessionId}`,
    });
  },

  // Session Cancelled (sent to the other party)
  sessionCancelled: async (
    userId: string,
    cancellerName: string,
    reason: string,
    sessionId: string,
    isCoach: boolean
  ) => {
    return createNotification({
      userId,
      type: 'session_scheduled',
      title: '🚫 Sesión Cancelada',
      message: `${cancellerName} ha cancelado la sesión: "${reason}"`,
      actionUrl: isCoach ? `/sessions/${sessionId}` : `/coach/sessions/${sessionId}`,
    });
  },

  // Reschedule Requested (sent to the other party)
  sessionRescheduleRequested: async (
    userId: string,
    requesterName: string,
    proposedDate: string,
    sessionId: string,
    isCoach: boolean
  ) => {
    return createNotification({
      userId,
      type: 'session_scheduled',
      title: '📅 Solicitud de Reprogramación',
      message: `${requesterName} solicita reprogramar la sesión para el ${proposedDate}`,
      actionUrl: isCoach ? `/sessions/${sessionId}` : `/coach/sessions/${sessionId}`,
    });
  },

  // Reschedule Accepted (sent to requester)
  sessionRescheduleAccepted: async (
    requesterId: string,
    sessionId: string,
    isCoach: boolean
  ) => {
    return createNotification({
      userId: requesterId,
      type: 'session_scheduled',
      title: '✅ Reprogramación Aceptada',
      message: 'Tu solicitud de reprogramación ha sido aceptada.',
      actionUrl: isCoach ? `/coach/sessions/${sessionId}` : `/sessions/${sessionId}`,
    });
  },

  // Reschedule Rejected (sent to requester)
  sessionRescheduleRejected: async (
    requesterId: string,
    responseNote: string,
    sessionId: string,
    isCoach: boolean
  ) => {
    return createNotification({
      userId: requesterId,
      type: 'session_scheduled',
      title: '❌ Reprogramación Rechazada',
      message: `Tu solicitud de reprogramación fue rechazada: "${responseNote}"`,
      actionUrl: isCoach ? `/coach/sessions/${sessionId}` : `/sessions/${sessionId}`,
    });
  },

  // Session Agreement Shared (sent to coachee)
  sessionAgreementShared: async (
    coacheeId: string,
    coachName: string,
    sessionId: string
  ) => {
    return createNotification({
      userId: coacheeId,
      type: 'notes_shared',
      title: '📋 Acuerdo de Sesión Compartido',
      message: `${coachName} ha compartido contigo el acuerdo de la sesión.`,
      actionUrl: `/sessions/${sessionId}`,
    });
  },

  // Session Report Shared (sent to coachee)
  sessionReportShared: async (
    coacheeId: string,
    coachName: string,
    sessionId: string
  ) => {
    return createNotification({
      userId: coacheeId,
      type: 'notes_shared',
      title: '📊 Informe de Sesión Compartido',
      message: `${coachName} ha compartido contigo el informe de la sesión.`,
      actionUrl: `/sessions/${sessionId}`,
    });
  },
};
