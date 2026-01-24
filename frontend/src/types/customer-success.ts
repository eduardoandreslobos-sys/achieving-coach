import { Timestamp } from 'firebase/firestore';

// ============================================
// Customer Success Types
// Post-sale lifecycle management
// ============================================

// ============================================
// Client Health Score
// ============================================

export type HealthStatus = 'healthy' | 'at_risk' | 'critical';
export type EngagementTrend = 'improving' | 'stable' | 'declining';
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';

/**
 * Client Health Score - comprehensive health tracking
 * Based on engagement, progress, and sentiment
 */
export interface ClientHealthScore {
  id: string;
  clientId: string;
  coachId: string;
  programId: string;

  // Engagement Score (0-30 points)
  engagement: {
    sessionAttendanceRate: number;      // % of sessions attended
    platformUsageFrequency: number;     // Logins per week
    toolCompletionRate: number;         // % of assigned tools completed
    responseTime: number;               // Avg hours to respond to coach
    score: number;                      // Calculated 0-30
  };

  // Progress Score (0-40 points)
  progress: {
    goalsProgress: number;              // % progress on goals
    milestonesAchieved: number;         // Number of milestones hit
    milestonesTotal: number;            // Total milestones
    reflectionsSubmitted: number;       // Reflections completed
    commitmentsFulfilled: number;       // % of commitments met
    score: number;                      // Calculated 0-40
  };

  // Sentiment Score (0-30 points)
  sentiment: {
    lastNPSScore?: number;              // 0-10 NPS
    lastNPSDate?: Timestamp;
    recentFeedback: FeedbackSentiment;
    engagementTrend: EngagementTrend;
    coachRating?: number;               // 1-5 if given
    score: number;                      // Calculated 0-30
  };

  // Total Health
  totalScore: number;                   // 0-100
  healthStatus: HealthStatus;
  previousScore?: number;
  scoreTrend: EngagementTrend;

  // Renewal Information
  programStartDate: Timestamp;
  programEndDate: Timestamp;
  daysToRenewal: number;
  renewalProbability: number;           // 0-100%
  renewalStatus: 'not_due' | 'approaching' | 'due' | 'overdue' | 'renewed' | 'churned';

  // Alerts
  activeAlerts: HealthAlert[];

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastCalculatedAt: Timestamp;
}

export interface HealthAlert {
  id: string;
  type: HealthAlertType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  suggestedAction: string;
  createdAt: Timestamp;
  acknowledgedAt?: Timestamp;
  resolvedAt?: Timestamp;
}

export type HealthAlertType =
  | 'low_attendance'
  | 'low_engagement'
  | 'declining_progress'
  | 'negative_feedback'
  | 'renewal_approaching'
  | 'renewal_overdue'
  | 'no_recent_session'
  | 'goal_at_risk'
  | 'milestone_missed'
  | 'low_nps';

export const HEALTH_STATUS_LABELS: Record<HealthStatus, string> = {
  healthy: 'Saludable',
  at_risk: 'En Riesgo',
  critical: 'Crítico',
};

export const HEALTH_STATUS_COLORS: Record<HealthStatus, string> = {
  healthy: 'bg-emerald-100 text-emerald-800',
  at_risk: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

export const HEALTH_THRESHOLDS = {
  healthy: { min: 70, max: 100 },
  at_risk: { min: 40, max: 69 },
  critical: { min: 0, max: 39 },
} as const;

export const ALERT_TRIGGERS = {
  low_attendance: { threshold: 70, message: 'Tasa de asistencia menor al 70%' },
  low_engagement: { threshold: 3, message: 'Menos de 3 logins por semana' },
  no_recent_session: { days: 21, message: 'Sin sesión en los últimos 21 días' },
  renewal_approaching: { days: 30, message: 'Renovación en menos de 30 días' },
  low_nps: { threshold: 7, message: 'NPS menor a 7' },
} as const;

// ============================================
// Expansion Opportunities (Upsell/Cross-sell)
// ============================================

export type ExpansionType = 'renewal' | 'upsell' | 'cross_sell' | 'referral';
export type ExpansionStatus = 'identified' | 'approached' | 'negotiating' | 'won' | 'lost';

export interface ExpansionOpportunity {
  id: string;
  clientId: string;
  coachId: string;
  clientName: string;                   // Denormalized

  type: ExpansionType;
  status: ExpansionStatus;

  // Opportunity Details
  title: string;
  description: string;
  estimatedValue: number;
  currency: string;
  probability: number;                  // 0-100%
  expectedCloseDate?: Timestamp;

  // For renewals
  currentProgramId?: string;
  currentProgramEndDate?: Timestamp;
  renewalType?: 'same' | 'upgrade' | 'downgrade';

  // For upsell/cross-sell
  proposedProduct?: string;             // "Coaching Grupal", "Mentoría"
  proposedDuration?: string;

  // Tracking
  triggerEvent: string;                 // What triggered this opportunity
  notes: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approachedAt?: Timestamp;
  closedAt?: Timestamp;
  lostReason?: string;
}

export const EXPANSION_TYPE_LABELS: Record<ExpansionType, string> = {
  renewal: 'Renovación',
  upsell: 'Upsell',
  cross_sell: 'Cross-sell',
  referral: 'Referido',
};

export const EXPANSION_STATUS_LABELS: Record<ExpansionStatus, string> = {
  identified: 'Identificada',
  approached: 'Contactado',
  negotiating: 'En Negociación',
  won: 'Ganada',
  lost: 'Perdida',
};

export const EXPANSION_TRIGGERS = [
  { trigger: 'program_completed', opportunity: 'renewal', value: 100 },
  { trigger: 'high_health_score', opportunity: 'upsell', value: 50 },
  { trigger: 'goal_achieved', opportunity: 'cross_sell', value: 30 },
  { trigger: 'referral_given', opportunity: 'referral', value: 20 },
] as const;

// ============================================
// Reviews & Ratings
// ============================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CoachReview {
  id: string;
  coachId: string;
  clientId: string;
  programId?: string;

  // Client Info (for display)
  clientName: string;
  clientPhotoURL?: string;
  clientTitle?: string;
  clientCompany?: string;
  isAnonymous: boolean;

  // Ratings (1-5)
  overallRating: number;
  communicationRating: number;
  resultsRating: number;
  recommendationRating: number;
  valueRating: number;

  // Content
  title: string;
  content: string;
  highlights: string[];                 // "Comunicación", "Resultados", etc.
  wouldRecommend: boolean;

  // Context
  programType: string;                  // "Ejecutivo", "Personal", etc.
  programDuration: string;              // "3 meses", "6 meses"
  goalsAchieved?: string[];

  // Verification & Moderation
  verifiedClient: boolean;              // Client verified in platform
  status: ReviewStatus;
  moderationNotes?: string;
  isPublic: boolean;
  isFeatured: boolean;

  // Coach Response
  coachResponse?: string;
  coachRespondedAt?: Timestamp;

  // Timestamps
  createdAt: Timestamp;
  approvedAt?: Timestamp;
  updatedAt: Timestamp;
}

export interface ReviewRequest {
  id: string;
  coachId: string;
  clientId: string;
  programId: string;
  clientEmail: string;
  clientName: string;

  status: 'pending' | 'sent' | 'completed' | 'declined' | 'expired';

  sentAt?: Timestamp;
  completedAt?: Timestamp;
  reviewId?: string;                    // Link to created review

  remindersSent: number;
  lastReminderAt?: Timestamp;

  createdAt: Timestamp;
  expiresAt: Timestamp;
}

export const REVIEW_HIGHLIGHTS = [
  'Comunicación excepcional',
  'Resultados tangibles',
  'Metodología efectiva',
  'Compromiso total',
  'Transformación personal',
  'Desarrollo profesional',
  'Escucha activa',
  'Preguntas poderosas',
] as const;

export interface CreateReviewData {
  overallRating: number;
  communicationRating: number;
  resultsRating: number;
  recommendationRating: number;
  valueRating: number;
  title: string;
  content: string;
  highlights: string[];
  wouldRecommend: boolean;
  isAnonymous: boolean;
  programType: string;
  programDuration: string;
  goalsAchieved?: string[];
}

// ============================================
// Referral Program
// ============================================

export type RewardType = 'discount' | 'credit' | 'cash' | 'free_session';
export type ReferralStatus = 'pending' | 'signed_up' | 'converted' | 'expired' | 'rewarded';
export type RewardStatus = 'pending' | 'eligible' | 'paid' | 'expired';

export interface ReferralProgram {
  coachId: string;
  referralCode: string;                 // Unique code: "COACH-JUAN-2024"
  referralLink: string;                 // Shareable link

  // Incentives for referrer (existing client)
  referrerReward: {
    type: RewardType;
    value: number;
    description: string;                // "10% descuento en próxima sesión"
  };

  // Incentives for referred (new client)
  referredReward: {
    type: RewardType;
    value: number;
    description: string;                // "Primera sesión gratis"
  };

  // Program Settings
  isActive: boolean;
  maxReferralsPerClient: number;        // 0 = unlimited
  expirationDays: number;               // Days until referral expires
  requiresPurchase: boolean;            // Referrer must have active program

  // Stats
  totalReferrals: number;
  successfulConversions: number;
  pendingRewards: number;
  totalRewardsEarned: number;
  conversionRate: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Referral {
  id: string;
  coachId: string;
  referrerId: string;                   // Client who referred
  referrerName: string;
  referrerEmail: string;

  // Referred Person
  referredName: string;
  referredEmail: string;
  referredPhone?: string;

  // Status
  status: ReferralStatus;
  leadId?: string;                      // If converted to lead
  clientId?: string;                    // If converted to client

  // Rewards
  referrerRewardStatus: RewardStatus;
  referrerRewardAmount?: number;
  referrerRewardPaidAt?: Timestamp;

  referredRewardStatus: RewardStatus;
  referredRewardApplied?: boolean;

  // Tracking
  referralCode: string;
  source?: string;                      // "email", "whatsapp", "social"

  // Timestamps
  createdAt: Timestamp;
  signedUpAt?: Timestamp;
  convertedAt?: Timestamp;
  expiresAt: Timestamp;
}

export interface CreateReferralData {
  referredName: string;
  referredEmail: string;
  referredPhone?: string;
  source?: string;
}

// ============================================
// Success Stories / Testimonials
// ============================================

export type SuccessStoryStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected';

export interface SuccessStoryMetric {
  label: string;                        // "Productividad"
  before: string;                       // "60%"
  after: string;                        // "95%"
  improvement?: string;                 // "+35%"
}

export interface SuccessStory {
  id: string;
  coachId: string;
  clientId: string;
  programId?: string;

  // Client Info
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  clientPhotoURL?: string;
  isAnonymous: boolean;

  // Story Content
  title: string;
  summary: string;                      // Short version for cards
  challenge: string;                    // Initial situation
  solution: string;                     // Coaching process
  results: string;                      // Outcomes achieved
  quote: string;                        // Client quote

  // Media
  videoURL?: string;
  additionalImages?: string[];

  // Metrics (optional quantifiable results)
  metrics: SuccessStoryMetric[];

  // Tags & Categorization
  tags: string[];
  industry?: string;
  programType: string;
  duration: string;

  // Approval Flow
  status: SuccessStoryStatus;
  clientApproved: boolean;
  clientApprovedAt?: Timestamp;
  adminApproved: boolean;
  adminApprovedAt?: Timestamp;
  rejectionReason?: string;

  // Display Settings
  isPublic: boolean;
  isFeatured: boolean;
  displayOnProfile: boolean;
  displayOnDirectory: boolean;
  displayOrder?: number;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
}

export interface CreateSuccessStoryData {
  clientId: string;
  programId?: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string;
  quote: string;
  metrics?: SuccessStoryMetric[];
  tags?: string[];
  industry?: string;
  programType: string;
  duration: string;
  videoURL?: string;
  isAnonymous?: boolean;
}

// ============================================
// NPS Survey
// ============================================

export type NPSCategory = 'promoter' | 'passive' | 'detractor';

export interface NPSSurvey {
  id: string;
  coachId: string;
  clientId: string;
  programId: string;

  // NPS Score
  score: number;                        // 0-10
  category: NPSCategory;                // Calculated

  // Feedback
  feedback?: string;
  wouldRecommend: boolean;
  improvementSuggestions?: string;

  // Context
  surveyType: 'mid_program' | 'end_program' | 'periodic' | 'renewal';
  programPhase?: string;

  // Timestamps
  sentAt: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
}

export const NPS_CATEGORIES: Record<NPSCategory, { min: number; max: number; label: string }> = {
  promoter: { min: 9, max: 10, label: 'Promotor' },
  passive: { min: 7, max: 8, label: 'Pasivo' },
  detractor: { min: 0, max: 6, label: 'Detractor' },
};

export const NPS_COLORS: Record<NPSCategory, string> = {
  promoter: 'text-emerald-600',
  passive: 'text-amber-600',
  detractor: 'text-red-600',
};

// ============================================
// Customer Success Metrics
// ============================================

export interface CustomerSuccessMetrics {
  coachId: string;

  // Health Distribution
  healthDistribution: Record<HealthStatus, number>;
  avgHealthScore: number;

  // Retention
  retentionRate: number;                // % clients renewed
  churnRate: number;
  avgProgramDuration: number;           // Days

  // NPS
  avgNPS: number;
  npsDistribution: Record<NPSCategory, number>;
  npsResponseRate: number;

  // Reviews
  avgRating: number;
  totalReviews: number;
  reviewsThisMonth: number;

  // Referrals
  totalReferrals: number;
  referralConversionRate: number;
  revenueFromReferrals: number;

  // Expansion
  expansionRevenue: number;
  renewalRevenue: number;
  upsellRevenue: number;

  // Alerts
  clientsAtRisk: number;
  clientsCritical: number;
  renewalsDueThisMonth: number;

  // Period
  periodStart: Timestamp;
  periodEnd: Timestamp;
  calculatedAt: Timestamp;
}

// ============================================
// Default Values
// ============================================

export const DEFAULT_REFERRAL_PROGRAM: Partial<ReferralProgram> = {
  referrerReward: {
    type: 'discount',
    value: 10,
    description: '10% de descuento en tu próxima sesión',
  },
  referredReward: {
    type: 'discount',
    value: 10,
    description: '10% de descuento en tu primera sesión',
  },
  isActive: true,
  maxReferralsPerClient: 0,
  expirationDays: 90,
  requiresPurchase: false,
  totalReferrals: 0,
  successfulConversions: 0,
  pendingRewards: 0,
  totalRewardsEarned: 0,
  conversionRate: 0,
};

export const DEFAULT_HEALTH_SCORE: Partial<ClientHealthScore> = {
  engagement: {
    sessionAttendanceRate: 100,
    platformUsageFrequency: 0,
    toolCompletionRate: 0,
    responseTime: 24,
    score: 15,
  },
  progress: {
    goalsProgress: 0,
    milestonesAchieved: 0,
    milestonesTotal: 0,
    reflectionsSubmitted: 0,
    commitmentsFulfilled: 0,
    score: 0,
  },
  sentiment: {
    recentFeedback: 'neutral',
    engagementTrend: 'stable',
    score: 15,
  },
  totalScore: 30,
  healthStatus: 'healthy',
  scoreTrend: 'stable',
  renewalStatus: 'not_due',
  activeAlerts: [],
};
