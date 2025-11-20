export type ActivityType = 
  | 'login'
  | 'tool_completed'
  | 'goal_created'
  | 'goal_updated'
  | 'message_sent'
  | 'session_attended'
  | 'reflection_written'
  | 'profile_updated';

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  metadata?: any;
  timestamp: Date;
  coachId?: string;
}

export interface ToolResult {
  id: string;
  userId: string;
  userName: string;
  coachId?: string;
  toolId: string;
  toolName: string;
  toolSlug: string;
  completedAt: Date;
  result: any;
  assignmentId?: string;
}

// Específico para cada herramienta
export interface WheelOfLifeResult {
  categories: {
    [key: string]: number;
  };
  overallScore: number;
  notes?: string;
}

export interface GROWResult {
  goal: string;
  reality: string;
  options: string[];
  willDo: string[];
  timeline?: string;
  notes?: string;
}

export interface ResilienceResult {
  categoryScores: {
    [category: string]: {
      score: number;
      maxScore: number;
      percentage: number;
    };
  };
  totalScore: number;
  totalMaxScore: number;
  overallPercentage: number;
  answers: { [questionId: string]: number };
}

export interface ValuesResult {
  topValues: string[];
  rankings: { [value: string]: number };
  reflections?: string;
}

export interface HabitLoopResult {
  habit: string;
  cue: string;
  routine: string;
  reward: string;
  newRoutine?: string;
  implementation?: string;
}

export interface LimitingBeliefsResult {
  beliefs: Array<{
    belief: string;
    evidence: string;
    reframe: string;
  }>;
}

export interface CareerCompassResult {
  currentRole: string;
  idealRole: string;
  strengths: string[];
  interests: string[];
  values: string[];
  actionSteps: string[];
}
