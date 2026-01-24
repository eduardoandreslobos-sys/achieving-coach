import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  ClientHealthScore,
  HealthStatus,
  HealthAlert,
  HealthAlertType,
  ExpansionOpportunity,
  ExpansionType,
  ExpansionStatus,
  CoachReview,
  CreateReviewData,
  ReviewRequest,
  ReviewStatus,
  ReferralProgram,
  Referral,
  CreateReferralData,
  ReferralStatus,
  SuccessStory,
  CreateSuccessStoryData,
  SuccessStoryStatus,
  NPSSurvey,
  NPSCategory,
  CustomerSuccessMetrics,
  HEALTH_THRESHOLDS,
  ALERT_TRIGGERS,
  NPS_CATEGORIES,
  DEFAULT_REFERRAL_PROGRAM,
  DEFAULT_HEALTH_SCORE,
} from '@/types/customer-success';

// ============================================
// Collection References
// ============================================

const HEALTH_SCORES_COLLECTION = 'client_health_scores';
const EXPANSION_OPPORTUNITIES_COLLECTION = 'expansion_opportunities';
const REVIEWS_COLLECTION = 'coach_reviews';
const REVIEW_REQUESTS_COLLECTION = 'review_requests';
const REFERRAL_PROGRAMS_COLLECTION = 'referral_programs';
const REFERRALS_COLLECTION = 'referrals';
const SUCCESS_STORIES_COLLECTION = 'success_stories';
const NPS_SURVEYS_COLLECTION = 'nps_surveys';

// ============================================
// Health Score Management
// ============================================

/**
 * Calculate health status from total score
 */
export function getHealthStatus(totalScore: number): HealthStatus {
  if (totalScore >= HEALTH_THRESHOLDS.healthy.min) return 'healthy';
  if (totalScore >= HEALTH_THRESHOLDS.at_risk.min) return 'at_risk';
  return 'critical';
}

/**
 * Calculate NPS category from score
 */
export function getNPSCategory(score: number): NPSCategory {
  if (score >= NPS_CATEGORIES.promoter.min) return 'promoter';
  if (score >= NPS_CATEGORIES.passive.min) return 'passive';
  return 'detractor';
}

/**
 * Get health score for a client
 */
export async function getClientHealthScore(
  clientId: string,
  programId: string
): Promise<ClientHealthScore | null> {
  const q = query(
    collection(db, HEALTH_SCORES_COLLECTION),
    where('clientId', '==', clientId),
    where('programId', '==', programId),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ClientHealthScore;
}

/**
 * Create or update health score for a client
 */
export async function upsertClientHealthScore(
  clientId: string,
  coachId: string,
  programId: string,
  data: Partial<ClientHealthScore>
): Promise<string> {
  const existing = await getClientHealthScore(clientId, programId);

  if (existing) {
    const docRef = doc(db, HEALTH_SCORES_COLLECTION, existing.id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      lastCalculatedAt: serverTimestamp(),
    });
    return existing.id;
  }

  const docRef = doc(collection(db, HEALTH_SCORES_COLLECTION));
  const healthScore: Omit<ClientHealthScore, 'id'> = {
    clientId,
    coachId,
    programId,
    ...DEFAULT_HEALTH_SCORE,
    ...data,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    lastCalculatedAt: serverTimestamp() as Timestamp,
  } as Omit<ClientHealthScore, 'id'>;

  await setDoc(docRef, healthScore);
  return docRef.id;
}

/**
 * Calculate engagement score (0-30)
 */
export function calculateEngagementScore(
  sessionAttendanceRate: number,
  platformUsageFrequency: number,
  toolCompletionRate: number
): number {
  // Attendance: 0-15 points
  const attendanceScore = Math.min(15, (sessionAttendanceRate / 100) * 15);

  // Usage: 0-10 points (5+ logins/week = max)
  const usageScore = Math.min(10, (platformUsageFrequency / 5) * 10);

  // Tool completion: 0-5 points
  const toolScore = Math.min(5, (toolCompletionRate / 100) * 5);

  return Math.round(attendanceScore + usageScore + toolScore);
}

/**
 * Calculate progress score (0-40)
 */
export function calculateProgressScore(
  goalsProgress: number,
  milestonesAchieved: number,
  milestonesTotal: number,
  commitmentsFulfilled: number
): number {
  // Goals progress: 0-20 points
  const goalsScore = Math.min(20, (goalsProgress / 100) * 20);

  // Milestones: 0-10 points
  const milestoneScore = milestonesTotal > 0
    ? Math.min(10, (milestonesAchieved / milestonesTotal) * 10)
    : 5;

  // Commitments: 0-10 points
  const commitmentScore = Math.min(10, (commitmentsFulfilled / 100) * 10);

  return Math.round(goalsScore + milestoneScore + commitmentScore);
}

/**
 * Calculate sentiment score (0-30)
 */
export function calculateSentimentScore(
  npsScore: number | undefined,
  feedback: 'positive' | 'neutral' | 'negative',
  trend: 'improving' | 'stable' | 'declining'
): number {
  // NPS: 0-15 points (mapped from 0-10)
  const npsPoints = npsScore !== undefined ? Math.min(15, (npsScore / 10) * 15) : 7.5;

  // Feedback: 0-10 points
  const feedbackPoints = feedback === 'positive' ? 10 : feedback === 'neutral' ? 5 : 0;

  // Trend: 0-5 points
  const trendPoints = trend === 'improving' ? 5 : trend === 'stable' ? 3 : 0;

  return Math.round(npsPoints + feedbackPoints + trendPoints);
}

/**
 * Recalculate health score for a client
 */
export async function recalculateHealthScore(
  clientId: string,
  coachId: string,
  programId: string,
  metrics: {
    sessionAttendanceRate: number;
    platformUsageFrequency: number;
    toolCompletionRate: number;
    goalsProgress: number;
    milestonesAchieved: number;
    milestonesTotal: number;
    commitmentsFulfilled: number;
    npsScore?: number;
    feedback: 'positive' | 'neutral' | 'negative';
    trend: 'improving' | 'stable' | 'declining';
    programEndDate: Timestamp;
  }
): Promise<ClientHealthScore> {
  const engagementScore = calculateEngagementScore(
    metrics.sessionAttendanceRate,
    metrics.platformUsageFrequency,
    metrics.toolCompletionRate
  );

  const progressScore = calculateProgressScore(
    metrics.goalsProgress,
    metrics.milestonesAchieved,
    metrics.milestonesTotal,
    metrics.commitmentsFulfilled
  );

  const sentimentScore = calculateSentimentScore(
    metrics.npsScore,
    metrics.feedback,
    metrics.trend
  );

  const totalScore = engagementScore + progressScore + sentimentScore;
  const healthStatus = getHealthStatus(totalScore);

  // Calculate days to renewal
  const now = new Date();
  const endDate = metrics.programEndDate.toDate();
  const daysToRenewal = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Determine renewal status
  let renewalStatus: ClientHealthScore['renewalStatus'] = 'not_due';
  if (daysToRenewal <= 0) renewalStatus = 'overdue';
  else if (daysToRenewal <= 30) renewalStatus = 'due';
  else if (daysToRenewal <= 60) renewalStatus = 'approaching';

  // Calculate renewal probability based on health score
  const renewalProbability = Math.min(100, Math.round(totalScore * 0.9 + 10));

  // Generate alerts
  const alerts: HealthAlert[] = [];

  if (metrics.sessionAttendanceRate < ALERT_TRIGGERS.low_attendance.threshold) {
    alerts.push({
      id: `attendance-${Date.now()}`,
      type: 'low_attendance',
      severity: 'warning',
      message: ALERT_TRIGGERS.low_attendance.message,
      suggestedAction: 'Contactar al cliente para entender las barreras de asistencia',
      createdAt: Timestamp.now(),
    });
  }

  if (metrics.platformUsageFrequency < ALERT_TRIGGERS.low_engagement.threshold) {
    alerts.push({
      id: `engagement-${Date.now()}`,
      type: 'low_engagement',
      severity: 'warning',
      message: ALERT_TRIGGERS.low_engagement.message,
      suggestedAction: 'Enviar recursos útiles y recordatorios de uso',
      createdAt: Timestamp.now(),
    });
  }

  if (daysToRenewal <= 30 && daysToRenewal > 0) {
    alerts.push({
      id: `renewal-${Date.now()}`,
      type: 'renewal_approaching',
      severity: 'info',
      message: `Renovación en ${daysToRenewal} días`,
      suggestedAction: 'Iniciar conversación de renovación',
      createdAt: Timestamp.now(),
    });
  }

  if (metrics.npsScore !== undefined && metrics.npsScore < ALERT_TRIGGERS.low_nps.threshold) {
    alerts.push({
      id: `nps-${Date.now()}`,
      type: 'low_nps',
      severity: 'critical',
      message: ALERT_TRIGGERS.low_nps.message,
      suggestedAction: 'Programar sesión de feedback inmediata',
      createdAt: Timestamp.now(),
    });
  }

  const healthScoreData: Partial<ClientHealthScore> = {
    engagement: {
      sessionAttendanceRate: metrics.sessionAttendanceRate,
      platformUsageFrequency: metrics.platformUsageFrequency,
      toolCompletionRate: metrics.toolCompletionRate,
      responseTime: 24, // Default, would need actual data
      score: engagementScore,
    },
    progress: {
      goalsProgress: metrics.goalsProgress,
      milestonesAchieved: metrics.milestonesAchieved,
      milestonesTotal: metrics.milestonesTotal,
      reflectionsSubmitted: 0, // Would need actual data
      commitmentsFulfilled: metrics.commitmentsFulfilled,
      score: progressScore,
    },
    sentiment: {
      lastNPSScore: metrics.npsScore,
      lastNPSDate: metrics.npsScore !== undefined ? Timestamp.now() : undefined,
      recentFeedback: metrics.feedback,
      engagementTrend: metrics.trend,
      score: sentimentScore,
    },
    totalScore,
    healthStatus,
    scoreTrend: metrics.trend,
    programStartDate: Timestamp.now(), // Would need actual data
    programEndDate: metrics.programEndDate,
    daysToRenewal,
    renewalProbability,
    renewalStatus,
    activeAlerts: alerts,
  };

  const id = await upsertClientHealthScore(clientId, coachId, programId, healthScoreData);
  return { id, ...healthScoreData } as ClientHealthScore;
}

/**
 * Get all health scores for a coach
 */
export async function getCoachHealthScores(coachId: string): Promise<ClientHealthScore[]> {
  const q = query(
    collection(db, HEALTH_SCORES_COLLECTION),
    where('coachId', '==', coachId),
    orderBy('totalScore', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ClientHealthScore[];
}

/**
 * Get at-risk clients
 */
export async function getAtRiskClients(coachId: string): Promise<ClientHealthScore[]> {
  const q = query(
    collection(db, HEALTH_SCORES_COLLECTION),
    where('coachId', '==', coachId),
    where('healthStatus', 'in', ['at_risk', 'critical']),
    orderBy('totalScore', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ClientHealthScore[];
}

// ============================================
// Expansion Opportunities
// ============================================

/**
 * Create expansion opportunity
 */
export async function createExpansionOpportunity(
  coachId: string,
  clientId: string,
  clientName: string,
  data: {
    type: ExpansionType;
    title: string;
    description: string;
    estimatedValue: number;
    currency?: string;
    probability?: number;
    expectedCloseDate?: Timestamp;
    triggerEvent: string;
    currentProgramId?: string;
    currentProgramEndDate?: Timestamp;
  }
): Promise<string> {
  const docRef = doc(collection(db, EXPANSION_OPPORTUNITIES_COLLECTION));

  const opportunity: Omit<ExpansionOpportunity, 'id'> = {
    coachId,
    clientId,
    clientName,
    type: data.type,
    status: 'identified',
    title: data.title,
    description: data.description,
    estimatedValue: data.estimatedValue,
    currency: data.currency || 'USD',
    probability: data.probability || 50,
    expectedCloseDate: data.expectedCloseDate,
    triggerEvent: data.triggerEvent,
    currentProgramId: data.currentProgramId,
    currentProgramEndDate: data.currentProgramEndDate,
    notes: '',
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(docRef, opportunity);
  return docRef.id;
}

/**
 * Get expansion opportunities for a coach
 */
export async function getExpansionOpportunities(
  coachId: string,
  status?: ExpansionStatus[]
): Promise<ExpansionOpportunity[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, EXPANSION_OPPORTUNITIES_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ExpansionOpportunity[];
}

/**
 * Update expansion opportunity status
 */
export async function updateExpansionStatus(
  opportunityId: string,
  status: ExpansionStatus,
  notes?: string
): Promise<void> {
  const docRef = doc(db, EXPANSION_OPPORTUNITIES_COLLECTION, opportunityId);

  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (status === 'approached') {
    updates.approachedAt = serverTimestamp();
  } else if (status === 'won' || status === 'lost') {
    updates.closedAt = serverTimestamp();
    if (status === 'lost' && notes) {
      updates.lostReason = notes;
    }
  }

  await updateDoc(docRef, updates);
}

// ============================================
// Reviews
// ============================================

/**
 * Create a review
 */
export async function createReview(
  coachId: string,
  clientId: string,
  clientName: string,
  data: CreateReviewData,
  programId?: string
): Promise<string> {
  const docRef = doc(collection(db, REVIEWS_COLLECTION));

  const review: Omit<CoachReview, 'id'> = {
    coachId,
    clientId,
    programId,
    clientName: data.isAnonymous ? 'Cliente Anónimo' : clientName,
    isAnonymous: data.isAnonymous,
    overallRating: data.overallRating,
    communicationRating: data.communicationRating,
    resultsRating: data.resultsRating,
    recommendationRating: data.recommendationRating,
    valueRating: data.valueRating,
    title: data.title,
    content: data.content,
    highlights: data.highlights,
    wouldRecommend: data.wouldRecommend,
    programType: data.programType,
    programDuration: data.programDuration,
    goalsAchieved: data.goalsAchieved,
    verifiedClient: true,
    status: 'pending',
    isPublic: false,
    isFeatured: false,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(docRef, review);
  return docRef.id;
}

/**
 * Get reviews for a coach
 */
export async function getCoachReviews(
  coachId: string,
  status?: ReviewStatus[],
  publicOnly: boolean = false
): Promise<CoachReview[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  if (publicOnly) {
    constraints.push(where('isPublic', '==', true));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, REVIEWS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachReview[];
}

/**
 * Get public reviews for a coach (for directory)
 */
export async function getPublicReviews(coachId: string): Promise<CoachReview[]> {
  return getCoachReviews(coachId, ['approved'], true);
}

/**
 * Approve or reject a review (admin/coach)
 */
export async function moderateReview(
  reviewId: string,
  approved: boolean,
  makePublic: boolean = true,
  notes?: string
): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, reviewId);

  await updateDoc(docRef, {
    status: approved ? 'approved' : 'rejected',
    isPublic: approved && makePublic,
    approvedAt: approved ? serverTimestamp() : null,
    moderationNotes: notes,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Add coach response to review
 */
export async function addCoachResponse(
  reviewId: string,
  response: string
): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, reviewId);

  await updateDoc(docRef, {
    coachResponse: response,
    coachRespondedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Feature or unfeature a review
 */
export async function setReviewFeatured(
  reviewId: string,
  featured: boolean
): Promise<void> {
  const docRef = doc(db, REVIEWS_COLLECTION, reviewId);

  await updateDoc(docRef, {
    isFeatured: featured,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Create review request
 */
export async function createReviewRequest(
  coachId: string,
  clientId: string,
  programId: string,
  clientEmail: string,
  clientName: string
): Promise<string> {
  const docRef = doc(collection(db, REVIEW_REQUESTS_COLLECTION));

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days to complete

  const request: Omit<ReviewRequest, 'id'> = {
    coachId,
    clientId,
    programId,
    clientEmail,
    clientName,
    status: 'pending',
    remindersSent: 0,
    createdAt: serverTimestamp() as Timestamp,
    expiresAt: Timestamp.fromDate(expiresAt),
  };

  await setDoc(docRef, request);
  return docRef.id;
}

// ============================================
// Referral Program
// ============================================

/**
 * Get or create referral program for a coach
 */
export async function getOrCreateReferralProgram(coachId: string): Promise<ReferralProgram> {
  const docRef = doc(db, REFERRAL_PROGRAMS_COLLECTION, coachId);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as ReferralProgram;
  }

  // Create default program
  const referralCode = `COACH-${coachId.slice(0, 6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

  const program: ReferralProgram = {
    coachId,
    referralCode,
    referralLink: `/join?ref=${referralCode}`,
    ...DEFAULT_REFERRAL_PROGRAM,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  } as ReferralProgram;

  await setDoc(docRef, program);
  return program;
}

/**
 * Update referral program settings
 */
export async function updateReferralProgram(
  coachId: string,
  data: Partial<ReferralProgram>
): Promise<void> {
  const docRef = doc(db, REFERRAL_PROGRAMS_COLLECTION, coachId);

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Create a referral
 */
export async function createReferral(
  coachId: string,
  referrerId: string,
  referrerName: string,
  referrerEmail: string,
  data: CreateReferralData
): Promise<string> {
  const program = await getOrCreateReferralProgram(coachId);
  const docRef = doc(collection(db, REFERRALS_COLLECTION));

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + program.expirationDays);

  const referral: Omit<Referral, 'id'> = {
    coachId,
    referrerId,
    referrerName,
    referrerEmail,
    referredName: data.referredName,
    referredEmail: data.referredEmail,
    referredPhone: data.referredPhone,
    status: 'pending',
    referrerRewardStatus: 'pending',
    referredRewardStatus: 'pending',
    referralCode: program.referralCode,
    source: data.source,
    createdAt: serverTimestamp() as Timestamp,
    expiresAt: Timestamp.fromDate(expiresAt),
  };

  await setDoc(docRef, referral);

  // Update program stats
  await updateDoc(doc(db, REFERRAL_PROGRAMS_COLLECTION, coachId), {
    totalReferrals: program.totalReferrals + 1,
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Get referrals for a coach
 */
export async function getCoachReferrals(
  coachId: string,
  status?: ReferralStatus[]
): Promise<Referral[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, REFERRALS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Referral[];
}

/**
 * Update referral status
 */
export async function updateReferralStatus(
  referralId: string,
  status: ReferralStatus,
  leadId?: string,
  clientId?: string
): Promise<void> {
  const docRef = doc(db, REFERRALS_COLLECTION, referralId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return;

  const referral = snapshot.data() as Referral;

  const updates: Record<string, unknown> = { status };

  if (status === 'signed_up') {
    updates.signedUpAt = serverTimestamp();
    if (leadId) updates.leadId = leadId;
  } else if (status === 'converted') {
    updates.convertedAt = serverTimestamp();
    if (clientId) updates.clientId = clientId;
    updates.referrerRewardStatus = 'eligible';

    // Update program stats
    const program = await getOrCreateReferralProgram(referral.coachId);
    await updateDoc(doc(db, REFERRAL_PROGRAMS_COLLECTION, referral.coachId), {
      successfulConversions: program.successfulConversions + 1,
      conversionRate: ((program.successfulConversions + 1) / program.totalReferrals) * 100,
      pendingRewards: program.pendingRewards + 1,
      updatedAt: serverTimestamp(),
    });
  }

  await updateDoc(docRef, updates);
}

// ============================================
// Success Stories
// ============================================

/**
 * Create success story
 */
export async function createSuccessStory(
  coachId: string,
  data: CreateSuccessStoryData
): Promise<string> {
  const docRef = doc(collection(db, SUCCESS_STORIES_COLLECTION));

  const story: Omit<SuccessStory, 'id'> = {
    coachId,
    clientId: data.clientId,
    programId: data.programId,
    clientName: data.isAnonymous ? 'Cliente Anónimo' : '', // Will be filled from client data
    isAnonymous: data.isAnonymous || false,
    title: data.title,
    summary: data.summary,
    challenge: data.challenge,
    solution: data.solution,
    results: data.results,
    quote: data.quote,
    metrics: data.metrics || [],
    tags: data.tags || [],
    industry: data.industry,
    programType: data.programType,
    duration: data.duration,
    videoURL: data.videoURL,
    status: 'draft',
    clientApproved: false,
    adminApproved: false,
    isPublic: false,
    isFeatured: false,
    displayOnProfile: true,
    displayOnDirectory: false,
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(docRef, story);
  return docRef.id;
}

/**
 * Get success stories for a coach
 */
export async function getCoachSuccessStories(
  coachId: string,
  status?: SuccessStoryStatus[]
): Promise<SuccessStory[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, SUCCESS_STORIES_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as SuccessStory[];
}

/**
 * Get public success stories for directory
 */
export async function getPublicSuccessStories(coachId: string): Promise<SuccessStory[]> {
  const q = query(
    collection(db, SUCCESS_STORIES_COLLECTION),
    where('coachId', '==', coachId),
    where('status', '==', 'published'),
    where('isPublic', '==', true),
    orderBy('displayOrder', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as SuccessStory[];
}

/**
 * Update success story status
 */
export async function updateSuccessStoryStatus(
  storyId: string,
  status: SuccessStoryStatus,
  rejectionReason?: string
): Promise<void> {
  const docRef = doc(db, SUCCESS_STORIES_COLLECTION, storyId);

  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (status === 'published') {
    updates.publishedAt = serverTimestamp();
    updates.isPublic = true;
  } else if (status === 'rejected') {
    updates.rejectionReason = rejectionReason;
  }

  await updateDoc(docRef, updates);
}

/**
 * Client approves their success story
 */
export async function approveSuccessStoryAsClient(storyId: string): Promise<void> {
  const docRef = doc(db, SUCCESS_STORIES_COLLECTION, storyId);

  await updateDoc(docRef, {
    clientApproved: true,
    clientApprovedAt: serverTimestamp(),
    status: 'pending_approval', // Ready for admin review
    updatedAt: serverTimestamp(),
  });
}

// ============================================
// NPS Surveys
// ============================================

/**
 * Create NPS survey
 */
export async function createNPSSurvey(
  coachId: string,
  clientId: string,
  programId: string,
  surveyType: NPSSurvey['surveyType']
): Promise<string> {
  const docRef = doc(collection(db, NPS_SURVEYS_COLLECTION));

  const survey: Omit<NPSSurvey, 'id'> = {
    coachId,
    clientId,
    programId,
    score: 0,
    category: 'detractor',
    wouldRecommend: false,
    surveyType,
    sentAt: serverTimestamp() as Timestamp,
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(docRef, survey);
  return docRef.id;
}

/**
 * Complete NPS survey
 */
export async function completeNPSSurvey(
  surveyId: string,
  score: number,
  feedback?: string,
  improvementSuggestions?: string
): Promise<void> {
  const docRef = doc(db, NPS_SURVEYS_COLLECTION, surveyId);

  await updateDoc(docRef, {
    score,
    category: getNPSCategory(score),
    wouldRecommend: score >= 7,
    feedback,
    improvementSuggestions,
    completedAt: serverTimestamp(),
  });
}

/**
 * Get NPS surveys for a coach
 */
export async function getCoachNPSSurveys(coachId: string): Promise<NPSSurvey[]> {
  const q = query(
    collection(db, NPS_SURVEYS_COLLECTION),
    where('coachId', '==', coachId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as NPSSurvey[];
}

// ============================================
// Metrics & Analytics
// ============================================

/**
 * Get customer success metrics for a coach
 */
export async function getCustomerSuccessMetrics(coachId: string): Promise<CustomerSuccessMetrics> {
  const [healthScores, reviews, referrals, npsSurveys, opportunities] = await Promise.all([
    getCoachHealthScores(coachId),
    getCoachReviews(coachId, ['approved']),
    getCoachReferrals(coachId),
    getCoachNPSSurveys(coachId),
    getExpansionOpportunities(coachId),
  ]);

  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Health distribution
  const healthDistribution: Record<HealthStatus, number> = {
    healthy: 0,
    at_risk: 0,
    critical: 0,
  };

  healthScores.forEach(hs => {
    healthDistribution[hs.healthStatus]++;
  });

  const avgHealthScore = healthScores.length > 0
    ? healthScores.reduce((sum, hs) => sum + hs.totalScore, 0) / healthScores.length
    : 0;

  // NPS metrics
  const completedSurveys = npsSurveys.filter(s => s.completedAt);
  const npsDistribution: Record<NPSCategory, number> = {
    promoter: 0,
    passive: 0,
    detractor: 0,
  };

  completedSurveys.forEach(s => {
    npsDistribution[s.category]++;
  });

  const avgNPS = completedSurveys.length > 0
    ? completedSurveys.reduce((sum, s) => sum + s.score, 0) / completedSurveys.length
    : 0;

  // Review metrics
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
    : 0;

  const reviewsThisMonth = reviews.filter(r =>
    r.createdAt && r.createdAt.toDate() >= monthAgo
  ).length;

  // Referral metrics
  const convertedReferrals = referrals.filter(r => r.status === 'converted');

  // Expansion metrics
  const wonOpportunities = opportunities.filter(o => o.status === 'won');
  const expansionRevenue = wonOpportunities.reduce((sum, o) => sum + o.estimatedValue, 0);
  const renewalRevenue = wonOpportunities
    .filter(o => o.type === 'renewal')
    .reduce((sum, o) => sum + o.estimatedValue, 0);
  const upsellRevenue = wonOpportunities
    .filter(o => o.type === 'upsell' || o.type === 'cross_sell')
    .reduce((sum, o) => sum + o.estimatedValue, 0);

  // Retention metrics
  const renewedClients = healthScores.filter(hs => hs.renewalStatus === 'renewed').length;
  const totalClientsForRenewal = healthScores.filter(hs =>
    ['renewed', 'churned', 'overdue'].includes(hs.renewalStatus)
  ).length;

  const retentionRate = totalClientsForRenewal > 0
    ? (renewedClients / totalClientsForRenewal) * 100
    : 100;

  return {
    coachId,
    healthDistribution,
    avgHealthScore: Math.round(avgHealthScore),
    retentionRate: Math.round(retentionRate),
    churnRate: Math.round(100 - retentionRate),
    avgProgramDuration: 90, // Default, would need actual calculation
    avgNPS: Math.round(avgNPS * 10) / 10,
    npsDistribution,
    npsResponseRate: npsSurveys.length > 0
      ? (completedSurveys.length / npsSurveys.length) * 100
      : 0,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews: reviews.length,
    reviewsThisMonth,
    totalReferrals: referrals.length,
    referralConversionRate: referrals.length > 0
      ? (convertedReferrals.length / referrals.length) * 100
      : 0,
    revenueFromReferrals: convertedReferrals.reduce((sum, r) => sum + 1000, 0), // Would need actual values
    expansionRevenue,
    renewalRevenue,
    upsellRevenue,
    clientsAtRisk: healthDistribution.at_risk,
    clientsCritical: healthDistribution.critical,
    renewalsDueThisMonth: healthScores.filter(hs =>
      hs.renewalStatus === 'due' || hs.renewalStatus === 'approaching'
    ).length,
    periodStart: Timestamp.fromDate(monthAgo),
    periodEnd: Timestamp.now(),
    calculatedAt: Timestamp.now(),
  };
}

// ============================================
// Admin Functions
// ============================================

/**
 * Get all reviews pending moderation
 */
export async function getPendingReviews(): Promise<CoachReview[]> {
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CoachReview[];
}

/**
 * Get all success stories pending approval
 */
export async function getPendingSuccessStories(): Promise<SuccessStory[]> {
  const q = query(
    collection(db, SUCCESS_STORIES_COLLECTION),
    where('status', '==', 'pending_approval'),
    orderBy('createdAt', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as SuccessStory[];
}

/**
 * Admin approves success story
 */
export async function adminApproveSuccessStory(
  storyId: string,
  publish: boolean = true
): Promise<void> {
  const docRef = doc(db, SUCCESS_STORIES_COLLECTION, storyId);

  await updateDoc(docRef, {
    adminApproved: true,
    adminApprovedAt: serverTimestamp(),
    status: publish ? 'published' : 'approved',
    isPublic: publish,
    publishedAt: publish ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}
