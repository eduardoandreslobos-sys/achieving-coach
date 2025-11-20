export interface HabitLoop {
  id: string;
  habitName: string;
  cue: string;
  routine: string;
  reward: string;
  frequency: 'daily' | 'weekly' | 'occasional';
  type: 'positive' | 'negative' | 'neutral';
  createdAt: Date;
}

export interface HabitAnalysis {
  habitLoop: HabitLoop;
  triggers: string[];
  alternativeRoutines: string[];
  betterRewards: string[];
  actionPlan: string;
}

export const HABIT_TYPES = ['positive', 'negative', 'neutral'] as const;
export const HABIT_FREQUENCIES = ['daily', 'weekly', 'occasional'] as const;
