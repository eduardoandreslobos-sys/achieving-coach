import { Timestamp } from 'firebase/firestore';

export interface DISCStatement {
  dimension: 'D' | 'I' | 'S' | 'C';
  text: string;
}

export interface DISCQuestionGroup {
  groupId: number;
  statements: DISCStatement[];
}

export interface DISCResponse {
  groupId: number;
  mostLike: 'D' | 'I' | 'S' | 'C';
  leastLike: 'D' | 'I' | 'S' | 'C';
}

export interface DISCScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DISCCoordinates {
  control: number; // -100 to +100 (Adaptación to Control)
  affiliation: number; // -100 to +100 (Desapego to Afiliación)
}

export interface DISCProfileInfo {
  code: string; // e.g., "D", "Di", "DI", etc.
  name: string;
  description: string;
  strengths: string[];
  challenges: string[];
  workStyle: string;
  communication: string;
  motivation: string;
  stressResponse: string;
}

export interface DISCProfile {
  primaryStyle: string;
  scores: DISCScores;
  percentages: DISCScores;
  coordinates: DISCCoordinates;
  profileInfo: DISCProfileInfo;
}

export interface DISCResult {
  id: string;
  userId: string;
  coachId?: string;
  profile: DISCProfile;
  responses: DISCResponse[];
  completedAt: Timestamp;
  createdAt: Timestamp;
}
