export type UserRole = 'coach' | 'coachee';
export type SubscriptionStatus = 'trial' | 'active' | 'canceled' | 'expired' | 'past_due';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
  organization?: string;
  createdAt?: any;
  updatedAt?: any;
  subscriptionStatus?: SubscriptionStatus;
  trialEndsAt?: any;
  subscriptionId?: string;
  coacheeInfo?: {
    coachId?: string;
    goals?: string[];
    onboardingCompleted?: boolean;
  };
}
