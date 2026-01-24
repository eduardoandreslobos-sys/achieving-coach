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
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Lead,
  CreateLeadData,
  LeadFilters,
  OpportunityStage,
  BANTQualification,
  LeadScore,
  ScoreCategory,
  LeadActivity,
  CreateActivityData,
  ActivityType,
  LeadTask,
  CreateTaskData,
  TaskStatus,
  PipelineMetrics,
  StageMetrics,
  StageTransitionResult,
  STAGE_PROBABILITIES,
  STAGE_REQUIREMENTS,
  BANT_SCORES,
  SCORE_THRESHOLDS,
  DEFAULT_BANT,
  DEFAULT_LEAD,
  STALE_THRESHOLD_DAYS,
  ACTIVE_STAGES,
  STAGE_ORDER,
} from '@/types/crm';
import { CoachInquiry } from '@/types/directory';
import { getInquiryById, markInquiryAsConverted } from './directory.service';

// ============================================
// Collection References
// ============================================

const LEADS_COLLECTION = 'leads';
const LEAD_ACTIVITIES_COLLECTION = 'lead_activities';
const LEAD_TASKS_COLLECTION = 'lead_tasks';

// ============================================
// Lead CRUD Operations
// ============================================

/**
 * Create a new lead
 */
export async function createLead(
  coachId: string,
  data: CreateLeadData
): Promise<Lead> {
  const leadRef = doc(collection(db, LEADS_COLLECTION));
  const now = Timestamp.now();

  const lead: Omit<Lead, 'id'> = {
    coachId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    jobTitle: data.jobTitle,
    linkedInUrl: data.linkedInUrl,
    source: data.source,
    sourceDetail: data.sourceDetail,
    referredBy: data.referredBy,
    inquiryId: data.inquiryId,
    notes: data.notes || '',
    interestAreas: data.interestAreas || [],
    tags: data.tags || [],

    // Pipeline
    stage: 'prospecting',
    probability: STAGE_PROBABILITIES.prospecting,
    estimatedValue: data.estimatedValue || 0,
    currency: data.currency || 'USD',

    // BANT
    bant: DEFAULT_BANT,
    bantScore: 0,

    // Scoring
    engagementScore: data.inquiryId ? 10 : 0, // +10 if from inquiry
    fitScore: 0,
    totalScore: data.inquiryId ? 10 : 0,
    scoreCategory: 'cold',

    // Tracking
    engagementHistory: [],
    canRecontact: true,
    isStale: false,
    daysInCurrentStage: 0,

    // Timestamps
    createdAt: serverTimestamp() as Timestamp,
    updatedAt: serverTimestamp() as Timestamp,
    stageChangedAt: now,
    lastActivityAt: now,
  };

  await setDoc(leadRef, lead);

  const createdLead = { id: leadRef.id, ...lead };

  // Create initial activity
  await addActivity(leadRef.id, coachId, {
    type: data.inquiryId ? 'inquiry_received' : 'note',
    subject: data.inquiryId ? 'Consulta recibida del directorio' : 'Lead creado manualmente',
    description: data.notes || '',
  });

  return createdLead;
}

/**
 * Get lead by ID
 */
export async function getLeadById(leadId: string): Promise<Lead | null> {
  const docRef = doc(db, LEADS_COLLECTION, leadId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Lead;
}

/**
 * Get all leads for a coach with optional filters
 */
export async function getLeads(
  coachId: string,
  filters?: LeadFilters
): Promise<Lead[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  // Stage filter
  if (filters?.stages && filters.stages.length > 0) {
    constraints.push(where('stage', 'in', filters.stages));
  }

  // Score category filter
  if (filters?.scoreCategories && filters.scoreCategories.length > 0) {
    constraints.push(where('scoreCategory', 'in', filters.scoreCategories));
  }

  // Source filter
  if (filters?.sources && filters.sources.length > 0) {
    constraints.push(where('source', 'in', filters.sources));
  }

  // Stale filter
  if (filters?.isStale !== undefined) {
    constraints.push(where('isStale', '==', filters.isStale));
  }

  // Add ordering
  constraints.push(orderBy('updatedAt', 'desc'));

  const q = query(collection(db, LEADS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  let leads = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Lead[];

  // Client-side filtering for text search
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    leads = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.company?.toLowerCase().includes(searchLower) ||
      lead.notes.toLowerCase().includes(searchLower)
    );
  }

  // Client-side filtering for tags
  if (filters?.tags && filters.tags.length > 0) {
    leads = leads.filter(lead =>
      filters.tags!.some(tag => lead.tags.includes(tag))
    );
  }

  return leads;
}

/**
 * Get leads by stage for pipeline view
 */
export async function getLeadsByStage(coachId: string): Promise<Record<OpportunityStage, Lead[]>> {
  const leads = await getLeads(coachId);

  const byStage: Record<OpportunityStage, Lead[]> = {
    prospecting: [],
    qualification: [],
    needs_analysis: [],
    proposal: [],
    negotiation: [],
    closed_won: [],
    closed_lost: [],
  };

  leads.forEach(lead => {
    byStage[lead.stage].push(lead);
  });

  return byStage;
}

/**
 * Update lead data
 */
export async function updateLead(
  leadId: string,
  data: Partial<Lead>
): Promise<void> {
  const leadRef = doc(db, LEADS_COLLECTION, leadId);

  await updateDoc(leadRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string): Promise<void> {
  const batch = writeBatch(db);

  // Delete lead
  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  batch.delete(leadRef);

  // Delete associated activities
  const activitiesQuery = query(
    collection(db, LEAD_ACTIVITIES_COLLECTION),
    where('leadId', '==', leadId)
  );
  const activitiesSnapshot = await getDocs(activitiesQuery);
  activitiesSnapshot.docs.forEach(doc => batch.delete(doc.ref));

  // Delete associated tasks
  const tasksQuery = query(
    collection(db, LEAD_TASKS_COLLECTION),
    where('leadId', '==', leadId)
  );
  const tasksSnapshot = await getDocs(tasksQuery);
  tasksSnapshot.docs.forEach(doc => batch.delete(doc.ref));

  await batch.commit();
}

// ============================================
// Stage Management
// ============================================

/**
 * Validate stage transition
 */
export function validateStageTransition(
  lead: Lead,
  newStage: OpportunityStage
): StageTransitionResult {
  const result: StageTransitionResult = {
    allowed: true,
    warnings: [],
    requirements: [],
    suggestedActions: [],
  };

  const requirements = STAGE_REQUIREMENTS[newStage];
  if (!requirements) return result;

  // Check BANT score
  if (requirements.requiredBantScore && lead.bantScore < requirements.requiredBantScore) {
    result.warnings.push(
      `Se recomienda un BANT score de al menos ${requirements.requiredBantScore} (actual: ${lead.bantScore})`
    );
    result.suggestedActions.push('Completar la calificación BANT');
  }

  // Check required fields
  if (requirements.requiredFields) {
    requirements.requiredFields.forEach(field => {
      const value = lead[field];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        result.requirements.push(`Campo requerido: ${field}`);
        result.allowed = false;
      }
    });
  }

  // For closed_lost, require a reason
  if (newStage === 'closed_lost' && !lead.lostReason) {
    result.requirements.push('Debe especificar una razón de pérdida');
    result.allowed = false;
  }

  return result;
}

/**
 * Update lead stage
 */
export async function updateLeadStage(
  leadId: string,
  newStage: OpportunityStage,
  reason?: string
): Promise<void> {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');

  const previousStage = lead.stage;
  const now = Timestamp.now();

  const updates: Partial<Lead> = {
    stage: newStage,
    probability: STAGE_PROBABILITIES[newStage],
    stageChangedAt: now,
    daysInCurrentStage: 0,
    updatedAt: serverTimestamp() as Timestamp,
    lastActivityAt: now,
  };

  // Add lost reason if closing as lost
  if (newStage === 'closed_lost' && reason) {
    updates.lostReason = reason as Lead['lostReason'];
    updates.lostReasonDetail = reason;
  }

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, updates);

  // Create stage change activity
  await addActivity(leadId, lead.coachId, {
    type: 'stage_change',
    subject: `Etapa cambiada: ${previousStage} → ${newStage}`,
    description: reason || '',
  }, previousStage, newStage);
}

// ============================================
// BANT & Scoring
// ============================================

/**
 * Calculate BANT score from qualification
 */
export function calculateBANTScore(bant: BANTQualification): number {
  return (
    BANT_SCORES.budget[bant.budget] +
    BANT_SCORES.authority[bant.authority] +
    BANT_SCORES.need[bant.need] +
    BANT_SCORES.timeline[bant.timeline]
  );
}

/**
 * Determine score category from total score
 */
export function getScoreCategory(totalScore: number): ScoreCategory {
  if (totalScore >= SCORE_THRESHOLDS.hot.min) return 'hot';
  if (totalScore >= SCORE_THRESHOLDS.warm.min) return 'warm';
  if (totalScore >= SCORE_THRESHOLDS.neutral.min) return 'neutral';
  return 'cold';
}

/**
 * Calculate full lead score
 */
export function calculateLeadScore(lead: Lead): LeadScore {
  const bantScore = calculateBANTScore(lead.bant);
  const totalScore = Math.min(100, bantScore + lead.engagementScore + lead.fitScore);
  const category = getScoreCategory(totalScore);

  return {
    bantScore,
    engagementScore: lead.engagementScore,
    fitScore: lead.fitScore,
    totalScore,
    category,
  };
}

/**
 * Update BANT qualification for a lead
 */
export async function updateBANT(
  leadId: string,
  bant: BANTQualification
): Promise<void> {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');

  const bantScore = calculateBANTScore(bant);
  const totalScore = Math.min(100, bantScore + lead.engagementScore + lead.fitScore);
  const scoreCategory = getScoreCategory(totalScore);

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    bant,
    bantScore,
    totalScore,
    scoreCategory,
    updatedAt: serverTimestamp(),
  });

  // Create score change activity if significant change
  const previousScore = lead.totalScore;
  if (Math.abs(totalScore - previousScore) >= 10) {
    await addActivity(leadId, lead.coachId, {
      type: 'score_change',
      subject: `Score actualizado: ${previousScore} → ${totalScore}`,
      description: `BANT score: ${bantScore}`,
    });
  }
}

/**
 * Update engagement score for a lead
 */
export async function updateEngagementScore(
  leadId: string,
  points: number,
  eventType: string
): Promise<void> {
  const lead = await getLeadById(leadId);
  if (!lead) return;

  const newEngagementScore = Math.min(30, lead.engagementScore + points);
  const totalScore = Math.min(100, lead.bantScore + newEngagementScore + lead.fitScore);
  const scoreCategory = getScoreCategory(totalScore);

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    engagementScore: newEngagementScore,
    totalScore,
    scoreCategory,
    engagementHistory: [...lead.engagementHistory, eventType],
    lastActivityAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update fit score for a lead
 */
export async function updateFitScore(
  leadId: string,
  fitScore: number
): Promise<void> {
  const lead = await getLeadById(leadId);
  if (!lead) return;

  const totalScore = Math.min(100, lead.bantScore + lead.engagementScore + fitScore);
  const scoreCategory = getScoreCategory(totalScore);

  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    fitScore,
    totalScore,
    scoreCategory,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Recalculate all scores for a coach's leads
 */
export async function recalculateAllScores(coachId: string): Promise<void> {
  const leads = await getLeads(coachId);
  const batch = writeBatch(db);

  leads.forEach(lead => {
    const score = calculateLeadScore(lead);
    const leadRef = doc(db, LEADS_COLLECTION, lead.id);
    batch.update(leadRef, {
      bantScore: score.bantScore,
      totalScore: score.totalScore,
      scoreCategory: score.category,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

// ============================================
// Activities
// ============================================

/**
 * Add activity to a lead
 */
export async function addActivity(
  leadId: string,
  coachId: string,
  data: CreateActivityData,
  previousStage?: OpportunityStage,
  newStage?: OpportunityStage
): Promise<LeadActivity> {
  const activityRef = doc(collection(db, LEAD_ACTIVITIES_COLLECTION));

  const activity: Omit<LeadActivity, 'id'> = {
    leadId,
    coachId,
    type: data.type,
    subject: data.subject,
    description: data.description || '',
    outcome: data.outcome,
    scheduledAt: data.scheduledAt,
    completedAt: data.completedAt,
    durationMinutes: data.durationMinutes,
    previousStage,
    newStage,
    createdAt: serverTimestamp() as Timestamp,
    createdBy: coachId,
    isAutomatic: ['stage_change', 'score_change'].includes(data.type),
  };

  await setDoc(activityRef, activity);

  // Update lead's last activity
  const leadRef = doc(db, LEADS_COLLECTION, leadId);
  await updateDoc(leadRef, {
    lastActivityAt: serverTimestamp(),
    isStale: false,
  });

  // Update engagement score for certain activity types
  const engagementPoints: Record<string, number> = {
    discovery_call: 20,
    proposal_sent: 15,
    meeting: 10,
    video_call: 10,
    call: 5,
    email_sent: 3,
    email_received: 5,
  };

  if (engagementPoints[data.type]) {
    await updateEngagementScore(leadId, engagementPoints[data.type], data.type);
  }

  return { id: activityRef.id, ...activity };
}

/**
 * Get activities for a lead
 */
export async function getLeadActivities(
  leadId: string,
  limitCount: number = 50
): Promise<LeadActivity[]> {
  const q = query(
    collection(db, LEAD_ACTIVITIES_COLLECTION),
    where('leadId', '==', leadId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadActivity[];
}

/**
 * Get recent activities for a coach
 */
export async function getRecentActivities(
  coachId: string,
  limitCount: number = 20
): Promise<LeadActivity[]> {
  const q = query(
    collection(db, LEAD_ACTIVITIES_COLLECTION),
    where('coachId', '==', coachId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadActivity[];
}

// ============================================
// Tasks
// ============================================

/**
 * Create a task for a lead
 */
export async function createTask(
  leadId: string,
  coachId: string,
  data: CreateTaskData,
  leadName?: string,
  leadEmail?: string,
  leadStage?: OpportunityStage
): Promise<LeadTask> {
  const taskRef = doc(collection(db, LEAD_TASKS_COLLECTION));

  const task: Omit<LeadTask, 'id'> = {
    leadId,
    coachId,
    type: data.type,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    reminderAt: data.reminderAt,
    status: 'pending',
    leadName,
    leadEmail,
    leadStage,
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(taskRef, task);
  return { id: taskRef.id, ...task };
}

/**
 * Get tasks for a lead
 */
export async function getLeadTasks(leadId: string): Promise<LeadTask[]> {
  const q = query(
    collection(db, LEAD_TASKS_COLLECTION),
    where('leadId', '==', leadId),
    orderBy('dueDate', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadTask[];
}

/**
 * Get all tasks for a coach
 */
export async function getCoachTasks(
  coachId: string,
  status?: TaskStatus[]
): Promise<LeadTask[]> {
  let constraints: QueryConstraint[] = [
    where('coachId', '==', coachId),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  constraints.push(orderBy('dueDate', 'asc'));

  const q = query(collection(db, LEAD_TASKS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadTask[];
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(coachId: string): Promise<LeadTask[]> {
  const now = Timestamp.now();

  const q = query(
    collection(db, LEAD_TASKS_COLLECTION),
    where('coachId', '==', coachId),
    where('status', '==', 'pending'),
    where('dueDate', '<', now),
    orderBy('dueDate', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadTask[];
}

/**
 * Get tasks due today
 */
export async function getTasksDueToday(coachId: string): Promise<LeadTask[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const q = query(
    collection(db, LEAD_TASKS_COLLECTION),
    where('coachId', '==', coachId),
    where('status', '==', 'pending'),
    where('dueDate', '>=', Timestamp.fromDate(today)),
    where('dueDate', '<', Timestamp.fromDate(tomorrow)),
    orderBy('dueDate', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as LeadTask[];
}

/**
 * Complete a task
 */
export async function completeTask(taskId: string): Promise<void> {
  const taskRef = doc(db, LEAD_TASKS_COLLECTION, taskId);
  const taskDoc = await getDoc(taskRef);

  if (!taskDoc.exists()) throw new Error('Task not found');

  const task = taskDoc.data() as LeadTask;

  await updateDoc(taskRef, {
    status: 'completed',
    completedAt: serverTimestamp(),
  });

  // Create activity for completed task
  await addActivity(task.leadId, task.coachId, {
    type: 'task_completed',
    subject: `Tarea completada: ${task.title}`,
    description: task.description || '',
  });
}

/**
 * Cancel a task
 */
export async function cancelTask(taskId: string): Promise<void> {
  const taskRef = doc(db, LEAD_TASKS_COLLECTION, taskId);

  await updateDoc(taskRef, {
    status: 'cancelled',
  });
}

/**
 * Update task
 */
export async function updateTask(
  taskId: string,
  data: Partial<LeadTask>
): Promise<void> {
  const taskRef = doc(db, LEAD_TASKS_COLLECTION, taskId);
  await updateDoc(taskRef, data);
}

// ============================================
// Conversion
// ============================================

/**
 * Convert inquiry to lead
 */
export async function convertInquiryToLead(inquiryId: string): Promise<Lead> {
  const inquiry = await getInquiryById(inquiryId);
  if (!inquiry) throw new Error('Inquiry not found');

  if (inquiry.status === 'converted') {
    throw new Error('Inquiry already converted');
  }

  // Create lead from inquiry data
  const lead = await createLead(inquiry.coachId, {
    name: inquiry.prospectName,
    email: inquiry.prospectEmail,
    phone: inquiry.prospectPhone,
    company: inquiry.prospectCompany,
    jobTitle: inquiry.prospectRole,
    source: inquiry.source,
    sourceDetail: inquiry.sourceDetail,
    referredBy: inquiry.referredBy,
    inquiryId: inquiry.id,
    notes: inquiry.message,
    interestAreas: inquiry.interestAreas,
  });

  // Mark inquiry as converted
  await markInquiryAsConverted(inquiryId, lead.id);

  // Set initial engagement based on inquiry urgency
  let engagementBonus = 0;
  if (inquiry.urgency === 'immediate') engagementBonus = 15;
  else if (inquiry.urgency === 'soon') engagementBonus = 10;

  if (engagementBonus > 0) {
    await updateEngagementScore(lead.id, engagementBonus, 'inquiry_urgency');
  }

  return lead;
}

/**
 * Convert lead to client (closed won)
 */
export async function convertLeadToClient(
  leadId: string,
  programId?: string,
  actualValue?: number
): Promise<void> {
  const lead = await getLeadById(leadId);
  if (!lead) throw new Error('Lead not found');

  const now = Timestamp.now();

  await updateDoc(doc(db, LEADS_COLLECTION, leadId), {
    stage: 'closed_won',
    probability: 100,
    stageChangedAt: now,
    wonDetails: {
      programId,
      contractSignedAt: now,
      actualValue: actualValue || lead.estimatedValue,
    },
    updatedAt: serverTimestamp(),
  });

  // Create activity
  await addActivity(leadId, lead.coachId, {
    type: 'stage_change',
    subject: 'Lead convertido a cliente',
    description: programId ? `Programa creado: ${programId}` : 'Cliente confirmado',
  }, lead.stage, 'closed_won');
}

// ============================================
// Pipeline Metrics
// ============================================

/**
 * Get pipeline metrics for a coach
 */
export async function getPipelineMetrics(coachId: string): Promise<PipelineMetrics> {
  const leads = await getLeads(coachId);
  const activities = await getRecentActivities(coachId, 100);
  const tasks = await getCoachTasks(coachId, ['pending']);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0);

  // Initialize stage metrics
  const byStage: Record<OpportunityStage, StageMetrics> = {} as Record<OpportunityStage, StageMetrics>;
  STAGE_ORDER.forEach(stage => {
    byStage[stage] = { count: 0, value: 0, avgDaysInStage: 0 };
  });

  // Initialize score category counts
  const byScoreCategory: Record<ScoreCategory, number> = {
    hot: 0,
    warm: 0,
    neutral: 0,
    cold: 0,
  };

  // Calculate stage metrics
  let totalPipelineValue = 0;
  let weightedPipelineValue = 0;
  let totalDaysInStage: Record<OpportunityStage, number[]> = {} as Record<OpportunityStage, number[]>;
  let winsThisMonth = 0;
  let lossesThisMonth = 0;
  let revenueWonThisMonth = 0;
  let leadsNeedingAttention = 0;

  STAGE_ORDER.forEach(stage => {
    totalDaysInStage[stage] = [];
  });

  leads.forEach(lead => {
    byStage[lead.stage].count++;
    byStage[lead.stage].value += lead.estimatedValue;
    byScoreCategory[lead.scoreCategory]++;

    if (ACTIVE_STAGES.includes(lead.stage)) {
      totalPipelineValue += lead.estimatedValue;
      weightedPipelineValue += lead.estimatedValue * (lead.probability / 100);
    }

    totalDaysInStage[lead.stage].push(lead.daysInCurrentStage);

    // Check for stale leads
    if (lead.lastActivityAt) {
      const lastActivity = lead.lastActivityAt.toDate();
      const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000));
      if (daysSinceActivity > STALE_THRESHOLD_DAYS && ACTIVE_STAGES.includes(lead.stage)) {
        leadsNeedingAttention++;
      }
    }

    // Count wins/losses this month
    if (lead.stageChangedAt) {
      const changedAt = lead.stageChangedAt.toDate();
      if (changedAt >= monthAgo) {
        if (lead.stage === 'closed_won') {
          winsThisMonth++;
          revenueWonThisMonth += lead.wonDetails?.actualValue || lead.estimatedValue;
        } else if (lead.stage === 'closed_lost') {
          lossesThisMonth++;
        }
      }
    }
  });

  // Calculate average days in stage
  STAGE_ORDER.forEach(stage => {
    const days = totalDaysInStage[stage];
    byStage[stage].avgDaysInStage = days.length > 0
      ? Math.round(days.reduce((a, b) => a + b, 0) / days.length)
      : 0;
  });

  // Calculate activities this week/month
  const activitiesThisWeek = activities.filter(a =>
    a.createdAt && a.createdAt.toDate() >= weekAgo
  ).length;

  const activitiesThisMonth = activities.filter(a =>
    a.createdAt && a.createdAt.toDate() >= monthAgo
  ).length;

  // Calculate overdue and due today
  const overdueTasks = tasks.filter(t =>
    t.dueDate && t.dueDate.toDate() < now
  );

  const tasksDueToday = tasks.filter(t => {
    if (!t.dueDate) return false;
    const dueDate = t.dueDate.toDate();
    return dueDate.toDateString() === now.toDateString();
  });

  // Calculate expected closes
  const expectedClosesThisMonth = leads.filter(l =>
    ACTIVE_STAGES.includes(l.stage) &&
    l.expectedCloseDate &&
    l.expectedCloseDate.toDate() <= monthEnd
  );

  const expectedClosesNextMonth = leads.filter(l =>
    ACTIVE_STAGES.includes(l.stage) &&
    l.expectedCloseDate &&
    l.expectedCloseDate.toDate() > monthEnd &&
    l.expectedCloseDate.toDate() <= nextMonthEnd
  );

  // Calculate conversion rates (simplified)
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l =>
    ['needs_analysis', 'proposal', 'negotiation', 'closed_won'].includes(l.stage)
  ).length;
  const proposalLeads = leads.filter(l =>
    ['proposal', 'negotiation', 'closed_won'].includes(l.stage)
  ).length;
  const wonLeads = leads.filter(l => l.stage === 'closed_won').length;

  return {
    totalPipelineValue,
    weightedPipelineValue,
    byStage,
    conversionRates: {
      inquiryToLead: 0, // Would need inquiry data
      leadToQualified: totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0,
      qualifiedToProposal: qualifiedLeads > 0 ? (proposalLeads / qualifiedLeads) * 100 : 0,
      proposalToWon: proposalLeads > 0 ? (wonLeads / proposalLeads) * 100 : 0,
      overallWinRate: totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0,
    },
    avgSalesCycle: 0, // Would need historical data
    avgTimePerStage: Object.fromEntries(
      STAGE_ORDER.map(stage => [stage, byStage[stage].avgDaysInStage])
    ) as Record<OpportunityStage, number>,
    activitiesThisWeek,
    activitiesThisMonth,
    tasksOverdue: overdueTasks.length,
    tasksDueToday: tasksDueToday.length,
    leadsNeedingAttention,
    byScoreCategory,
    expectedClosesThisMonth: {
      count: expectedClosesThisMonth.length,
      value: expectedClosesThisMonth.reduce((sum, l) => sum + l.estimatedValue, 0),
    },
    expectedClosesNextMonth: {
      count: expectedClosesNextMonth.length,
      value: expectedClosesNextMonth.reduce((sum, l) => sum + l.estimatedValue, 0),
    },
    winsThisMonth,
    lossesThisMonth,
    revenueWonThisMonth,
    periodStart: Timestamp.fromDate(monthAgo),
    periodEnd: Timestamp.now(),
    calculatedAt: Timestamp.now(),
  };
}

/**
 * Get stalled deals (no activity for X days)
 */
export async function getStalledDeals(
  coachId: string,
  daysThreshold: number = STALE_THRESHOLD_DAYS
): Promise<Lead[]> {
  const leads = await getLeads(coachId, { stages: ACTIVE_STAGES });
  const now = new Date();
  const threshold = new Date(now.getTime() - daysThreshold * 24 * 60 * 60 * 1000);

  return leads.filter(lead => {
    if (!lead.lastActivityAt) return true;
    return lead.lastActivityAt.toDate() < threshold;
  });
}

/**
 * Update stale status for all leads
 */
export async function updateStaleStatus(coachId: string): Promise<void> {
  const stalledDeals = await getStalledDeals(coachId);
  const batch = writeBatch(db);

  stalledDeals.forEach(lead => {
    const leadRef = doc(db, LEADS_COLLECTION, lead.id);
    batch.update(leadRef, { isStale: true });
  });

  await batch.commit();
}

// ============================================
// Admin Functions
// ============================================

/**
 * Get all leads (admin view)
 */
export async function getAllLeads(): Promise<Lead[]> {
  const q = query(
    collection(db, LEADS_COLLECTION),
    orderBy('updatedAt', 'desc'),
    limit(500)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Lead[];
}

/**
 * Get leads by coach (admin view)
 */
export async function getLeadsByCoach(coachId: string): Promise<Lead[]> {
  return getLeads(coachId);
}

/**
 * Get pipeline metrics for all coaches (admin)
 */
export async function getGlobalPipelineMetrics(): Promise<{
  totalLeads: number;
  totalPipelineValue: number;
  byStage: Record<OpportunityStage, number>;
  byCoach: { coachId: string; leadCount: number; pipelineValue: number }[];
}> {
  const leads = await getAllLeads();

  const byStage: Record<OpportunityStage, number> = {} as Record<OpportunityStage, number>;
  STAGE_ORDER.forEach(stage => { byStage[stage] = 0; });

  const coachStats: Record<string, { leadCount: number; pipelineValue: number }> = {};

  let totalPipelineValue = 0;

  leads.forEach(lead => {
    byStage[lead.stage]++;

    if (ACTIVE_STAGES.includes(lead.stage)) {
      totalPipelineValue += lead.estimatedValue;
    }

    if (!coachStats[lead.coachId]) {
      coachStats[lead.coachId] = { leadCount: 0, pipelineValue: 0 };
    }
    coachStats[lead.coachId].leadCount++;
    if (ACTIVE_STAGES.includes(lead.stage)) {
      coachStats[lead.coachId].pipelineValue += lead.estimatedValue;
    }
  });

  return {
    totalLeads: leads.length,
    totalPipelineValue,
    byStage,
    byCoach: Object.entries(coachStats).map(([coachId, stats]) => ({
      coachId,
      ...stats,
    })),
  };
}
