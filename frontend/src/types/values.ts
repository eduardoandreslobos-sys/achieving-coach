export interface Value {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface ValueRating {
  valueId: string;
  importance: number; // 1-5
  alignment: number;  // 1-5
}

export interface ValuesAssessment {
  ratings: Record<string, ValueRating>;
  topValues: string[];
  reflections: string;
  completedAt?: Date;
}

export const VALUE_CATEGORIES = [
  'Personal Growth',
  'Relationships',
  'Achievement',
  'Security',
  'Independence',
  'Service',
] as const;

export type ValueCategory = typeof VALUE_CATEGORIES[number];
