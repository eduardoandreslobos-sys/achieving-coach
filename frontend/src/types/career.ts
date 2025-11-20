export interface CareerCompass {
  id: string;
  currentRole: string;
  currentCompany: string;
  yearsExperience: number;
  dimensions: CareerDimensions;
  strengths: string[];
  interests: string[];
  values: string[];
  idealRole: string;
  pathOptions: CareerPath[];
  barriers: string[];
  supporters: string[];
  nextSteps: string[];
  createdAt: Date;
}

export interface CareerDimensions {
  skills: number;        // 1-10
  passion: number;       // 1-10
  marketDemand: number;  // 1-10
  compensation: number;  // 1-10
  impact: number;        // 1-10
  workLifeBalance: number; // 1-10
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  skillsNeeded: string[];
  pros: string[];
  cons: string[];
  viability: number; // 1-5
}

export const CAREER_DIMENSIONS = [
  { key: 'skills', label: 'Skills Match', description: 'How well do your skills match this direction?' },
  { key: 'passion', label: 'Passion', description: 'How excited are you about this work?' },
  { key: 'marketDemand', label: 'Market Demand', description: 'How strong is the job market for this?' },
  { key: 'compensation', label: 'Compensation', description: 'How satisfied are you with potential earnings?' },
  { key: 'impact', label: 'Impact', description: 'How much positive impact can you make?' },
  { key: 'workLifeBalance', label: 'Work-Life Balance', description: 'How sustainable is this long-term?' },
] as const;
