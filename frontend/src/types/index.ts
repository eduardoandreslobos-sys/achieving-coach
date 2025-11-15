export type UserRole = 'coachee' | 'coach' | 'supervisor' | 'org_admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  orgId?: string;
  createdAt: Date;
}

export interface Session {
  id: string;
  coachId: string;
  coacheeId: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  description: string;
  category: string;
}

export interface Assignment {
  id: string;
  toolId: string;
  coachId: string;
  coacheeId: string;
  assignedAt: Date;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'reviewed';
  responses?: any;
}
