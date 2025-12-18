import { Timestamp } from 'firebase/firestore';

export interface CoachingProgram {
  id: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  title: string;
  description?: string;
  overallGoals: string[];
  duration: number;
  sessionsPlanned: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type SessionType = 'kickstarter' | 'regular' | 'reflection';

export interface SessionTemplate {
  type: SessionType;
  defaultDuration: number;
  defaultTitle: string;
  suggestedAgenda: string[];
  suggestedActivities: string[];
}

export interface Session {
  id: string;
  programId: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  sessionNumber: number;
  type: SessionType;
  title: string;
  scheduledDate: Timestamp;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  
  // Session Structure
  goal: string;
  agenda: string[];
  activities: string[];
  keyTopics: string[];
  homework?: string;
  
  // Legacy fields
  objective: string;
  preSesionAnalysis?: PreSessionAnalysis;
  actionPlan?: ActionPlan;
  
  // Session content
  notes?: string;
  transcript?: string;
  summary?: string;
  
  // Post-session review
  review?: SessionReview;
  
  actualDuration?: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SessionReview {
  achievements: string[];
  insights: string[];
  nextSteps: string[];
  coacheeProgress: number; // 1-10
  sessionQuality: number; // 1-10
  notes?: string;
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
  objective: string;
  actions: {
    action: string;
    deadline: string;
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

// New: Value Proposition
export interface ValueProposition {
  coachingType: string;
  targetAudience: string;
  desiredOutcome: string;
  problemSolved: string;
  pitch?: string; // Generated from formula
}

// Default templates
export const SESSION_TEMPLATES: Record<SessionType, SessionTemplate> = {
  kickstarter: {
    type: 'kickstarter',
    defaultDuration: 30,
    defaultTitle: 'Kickstarter Session - Getting Started',
    suggestedAgenda: [
      'Introduction and relationship building',
      'Explore coaching goals and expectations',
      'Discuss how we\'ll measure value and success',
      'Co-create the coaching program structure',
      'Set expectations and boundaries',
    ],
    suggestedActivities: [
      'Share backgrounds and experiences',
      'Clarify coaching vs. other services',
      'Create initial success metrics',
      'Design communication preferences',
    ],
  },
  regular: {
    type: 'regular',
    defaultDuration: 60,
    defaultTitle: 'Coaching Session',
    suggestedAgenda: [
      'Check-in and review since last session',
      'Explore current challenge or topic',
      'Deep dive into specific area',
      'Identify actions and next steps',
      'Session review and reflection',
    ],
    suggestedActivities: [
      'Active listening and powerful questions',
      'Goal exploration and clarification',
      'Identify limiting beliefs or barriers',
      'Create action plan',
      'Accountability check-in',
    ],
  },
  reflection: {
    type: 'reflection',
    defaultDuration: 60,
    defaultTitle: 'Reflection & Review Session',
    suggestedAgenda: [
      'Review overall program goals',
      'Celebrate achievements and progress',
      'Reflect on key insights and learnings',
      'Discuss challenges and how they were overcome',
      'Plan next steps and future goals',
    ],
    suggestedActivities: [
      'Progress assessment against initial goals',
      'Identify transformation and growth',
      'Capture key "aha" moments',
      'Create sustainability plan',
      'Future visioning',
    ],
  },
};
