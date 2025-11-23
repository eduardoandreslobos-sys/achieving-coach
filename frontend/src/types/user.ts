import { Timestamp } from 'firebase/firestore';
import { ValueProposition } from './coaching';

export type UserRole = 'coach' | 'coachee';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  
  // Coach-specific
  organization?: string;
  subscriptionStatus?: 'trial' | 'active' | 'expired' | 'canceled';
  trialEndsAt?: Timestamp;
  valueProposition?: ValueProposition;
  bio?: string;
  certifications?: string[];
  specialties?: string[];
  
  // Coachee-specific
  coacheeInfo?: {
    coachId: string;
    coachName: string;
    onboardingCompleted?: boolean;
    goals?: string[];
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
