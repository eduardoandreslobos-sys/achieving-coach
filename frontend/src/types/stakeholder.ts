import { Timestamp } from 'firebase/firestore';

// ============ STAKEHOLDER TYPES ============

export type StakeholderRole = 'sponsor' | 'hr' | 'manager' | 'peer' | 'direct_report' | 'other';

export type StakeholderStatus = 'pending' | 'active' | 'expired';

export type StakeholderPermission = 
  | 'view_progress'      // Ver progreso general
  | 'view_goals'         // Ver objetivos
  | 'view_reports'       // Ver reportes
  | 'complete_360'       // Completar 360° feedback
  | 'participate_tripartite' // Participar en tripartita
  | 'leave_feedback';    // Dejar comentarios

// Permisos por defecto según rol
export const DEFAULT_PERMISSIONS: Record<StakeholderRole, StakeholderPermission[]> = {
  sponsor: ['view_progress', 'view_goals', 'view_reports', 'complete_360', 'participate_tripartite', 'leave_feedback'],
  hr: ['view_progress', 'view_goals', 'view_reports', 'complete_360', 'participate_tripartite', 'leave_feedback'],
  manager: ['view_progress', 'view_goals', 'complete_360', 'participate_tripartite', 'leave_feedback'],
  peer: ['complete_360', 'leave_feedback'],
  direct_report: ['complete_360', 'leave_feedback'],
  other: ['complete_360'],
};

export const STAKEHOLDER_ROLE_LABELS: Record<StakeholderRole, string> = {
  sponsor: 'Sponsor / Patrocinador',
  hr: 'Recursos Humanos',
  manager: 'Jefe Directo',
  peer: 'Par / Colega',
  direct_report: 'Reporte Directo',
  other: 'Otro',
};

// ============ STAKEHOLDER INTERFACE ============

export interface Stakeholder {
  id: string;
  
  // Información básica
  name: string;
  email: string;
  phone?: string;
  position?: string;
  role: StakeholderRole;
  
  // Relación con el programa
  programId: string;
  coacheeId: string;
  coachId: string;
  
  // Acceso
  accessToken: string;           // Token único para acceso
  tokenExpiresAt: Timestamp;     // Expiración del token
  status: StakeholderStatus;
  permissions: StakeholderPermission[];
  
  // Invitación
  invitedAt: Timestamp;
  invitedBy: string;             // Coach ID
  lastAccessAt?: Timestamp;
  accessCount: number;
  
  // Email tracking
  invitationEmailSent: boolean;
  invitationEmailSentAt?: Timestamp;
  remindersSent: number;
  lastReminderAt?: Timestamp;
  
  // Actividad
  completedActions: StakeholderAction[];
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface StakeholderAction {
  type: 'viewed_progress' | 'completed_360' | 'left_feedback' | 'viewed_report';
  timestamp: Timestamp;
  details?: string;
}

// ============ STAKEHOLDER FEEDBACK ============

export interface StakeholderFeedback {
  id: string;
  stakeholderId: string;
  programId: string;
  coacheeId: string;
  
  // Contenido
  type: 'general' | 'progress_observation' | 'concern' | 'praise';
  content: string;
  isAnonymous: boolean;
  
  // Visibilidad
  visibleToCoach: boolean;
  visibleToCoachee: boolean;
  
  // Metadata
  createdAt: Timestamp;
}

// ============ STAKEHOLDER INVITATION EMAIL ============

export interface StakeholderInvitationData {
  stakeholderName: string;
  stakeholderEmail: string;
  stakeholderRole: StakeholderRole;
  coacheeName: string;
  coachName: string;
  programTitle: string;
  portalUrl: string;
  expiresAt: Date;
}

// ============ PORTAL VIEW DATA ============

export interface StakeholderPortalData {
  stakeholder: Stakeholder;
  coacheeName: string;
  coachName: string;
  programTitle: string;
  programPhase: number;
  programProgress: number; // 0-100
  
  // Lo que puede ver según permisos
  goals?: {
    total: number;
    completed: number;
    items: { title: string; status: string }[];
  };
  
  sessionsCompleted?: number;
  totalSessions?: number;
  
  pendingActions: {
    type: string;
    title: string;
    dueDate?: Timestamp;
  }[];
  
  // 360 pendiente?
  pending360?: {
    campaignId: string;
    title: string;
    deadline: Timestamp;
  };
}
