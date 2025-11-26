export interface Coachee {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  coachId: string;
  programId?: string | null;
  status: 'active' | 'paused' | 'completed';
  enrolledAt: Date;
  completedAt?: Date | null;
  notes?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCoacheeDTO {
  userId: string;
  email: string;
  displayName: string;
  coachId: string;
  programId?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateCoacheeDTO {
  displayName?: string;
  programId?: string | null;
  status?: 'active' | 'paused' | 'completed';
  notes?: string;
  tags?: string[];
  completedAt?: Date | null;
}
