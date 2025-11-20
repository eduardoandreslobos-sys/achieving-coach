export interface ResilienceQuestion {
  id: string;
  category: string;
  text: string;
}

export interface ResilienceAnswers {
  [questionId: string]: number;
}

export interface ResilienceResults {
  answers: ResilienceAnswers;
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
}

export const RESILIENCE_CATEGORIES = [
  'Emotional',
  'Physical',
  'Mental',
  'Social',
] as const;

export type ResilienceCategory = typeof RESILIENCE_CATEGORIES[number];
