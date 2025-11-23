import { Timestamp } from 'firebase/firestore';

export interface CoachingProgram {
  id: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  title: string;
  description?: string;
  overallGoals: string[];
  duration: number; // meses
  sessionsPlanned: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Session {
  id: string;
  programId: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  sessionNumber: number;
  title: string;
  scheduledDate: Timestamp;
  scheduledTime: string; // "14:00"
  duration: number; // minutos
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  objective: string;
  preSesionAnalysis?: PreSessionAnalysis;
  actionPlan?: ActionPlan;
  notes?: string;
  transcript?: string;
  summary?: string;
  actualDuration?: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PreSessionAnalysis {
  competencies: {
    name: string;
    keyPoints: string[];
  }[];
  desiredResults: {
    description: string;
    relatedCompetencies: string[];
  }[];
  obstacles: {
    description: string;
    indicators: string[];
  }[];
}

export interface ActionPlan {
  objective: string; // QUÉ
  actions: {
    action: string; // CÓMO
    deadline: string; // CUÁNDO
    indicators: string[];
  }[];
  supportStrategy: string;
  obstacleStrategy: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  timestamp: Timestamp;
  content: string;
  type: 'note' | 'transcript' | 'action-item';
  speaker?: 'coach' | 'coachee';
}
