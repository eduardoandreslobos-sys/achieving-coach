import { Timestamp } from 'firebase/firestore';

// ============================================
// CRM Types - Salesforce Aligned
// Based on Salesforce Lead & Opportunity model
// ============================================

// ============================================
// Opportunity Stages (Salesforce Standard)
// ============================================

export type OpportunityStage =
  | 'prospecting'      // 10% - Initial identification
  | 'qualification'    // 25% - Validating BANT
  | 'needs_analysis'   // 40% - Discovery call completed
  | 'proposal'         // 60% - Proposal sent
  | 'negotiation'      // 90% - Terms in discussion
  | 'closed_won'       // 100% - Client confirmed
  | 'closed_lost';     // 0% - Opportunity lost

export const STAGE_PROBABILITIES: Record<OpportunityStage, number> = {
  prospecting: 10,
  qualification: 25,
  needs_analysis: 40,
  proposal: 60,
  negotiation: 90,
  closed_won: 100,
  closed_lost: 0,
};

export const STAGE_LABELS: Record<OpportunityStage, string> = {
  prospecting: 'Prospección',
  qualification: 'Calificación',
  needs_analysis: 'Análisis de Necesidades',
  proposal: 'Propuesta',
  negotiation: 'Negociación',
  closed_won: 'Cerrado Ganado',
  closed_lost: 'Cerrado Perdido',
};

export const STAGE_DESCRIPTIONS: Record<OpportunityStage, string> = {
  prospecting: 'Identificación inicial del prospecto',
  qualification: 'Validando presupuesto, autoridad, necesidad y tiempo',
  needs_analysis: 'Sesión de descubrimiento completada',
  proposal: 'Propuesta de coaching enviada',
  negotiation: 'Discutiendo términos y condiciones',
  closed_won: 'Cliente confirmado y listo para comenzar',
  closed_lost: 'Oportunidad no concretada',
};

export const STAGE_COLORS: Record<OpportunityStage, string> = {
  prospecting: 'bg-slate-100 text-slate-800',
  qualification: 'bg-blue-100 text-blue-800',
  needs_analysis: 'bg-purple-100 text-purple-800',
  proposal: 'bg-amber-100 text-amber-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-emerald-100 text-emerald-800',
  closed_lost: 'bg-red-100 text-red-800',
};

export const STAGE_ORDER: OpportunityStage[] = [
  'prospecting',
  'qualification',
  'needs_analysis',
  'proposal',
  'negotiation',
  'closed_won',
  'closed_lost',
];

// Stages that are still active (not closed)
export const ACTIVE_STAGES: OpportunityStage[] = [
  'prospecting',
  'qualification',
  'needs_analysis',
  'proposal',
  'negotiation',
];

// ============================================
// BANT Qualification (IBM/Salesforce Framework)
// ============================================

export type BANTBudget = 'unknown' | 'no' | 'maybe' | 'yes';
export type BANTAuthority = 'unknown' | 'influencer' | 'decision_maker';
export type BANTNeed = 'unknown' | 'low' | 'medium' | 'high';
export type BANTTimeline = 'unknown' | 'later' | 'soon' | 'immediate';

export interface BANTQualification {
  budget: BANTBudget;
  authority: BANTAuthority;
  need: BANTNeed;
  timeline: BANTTimeline;
  notes: {
    budget?: string;
    authority?: string;
    need?: string;
    timeline?: string;
  };
}

export const BANT_LABELS = {
  budget: {
    unknown: 'Desconocido',
    no: 'No tiene presupuesto',
    maybe: 'Posiblemente',
    yes: 'Tiene presupuesto',
  },
  authority: {
    unknown: 'Desconocido',
    influencer: 'Influenciador',
    decision_maker: 'Tomador de decisión',
  },
  need: {
    unknown: 'Desconocida',
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  },
  timeline: {
    unknown: 'Desconocido',
    later: 'Más adelante (>3 meses)',
    soon: 'Pronto (1-3 meses)',
    immediate: 'Inmediato (<1 mes)',
  },
} as const;

export const BANT_SCORES = {
  budget: { unknown: 0, no: 0, maybe: 5, yes: 10 },
  authority: { unknown: 0, influencer: 5, decision_maker: 10 },
  need: { unknown: 0, low: 2, medium: 5, high: 10 },
  timeline: { unknown: 0, later: 2, soon: 5, immediate: 10 },
} as const;

export const BANT_QUESTIONS = {
  budget: [
    '¿Ha considerado invertir en coaching profesional antes?',
    '¿Tiene un rango de inversión en mente para este proceso?',
    '¿La empresa apoyaría financieramente este proceso?',
  ],
  authority: [
    '¿Esta decisión la toma usted directamente?',
    '¿Hay otras personas involucradas en la decisión?',
    '¿Necesita aprobación de su empresa o jefe?',
  ],
  need: [
    '¿Qué situación específica le motivó a buscar un coach?',
    '¿Cómo impacta esta situación en su vida/trabajo actualmente?',
    '¿Qué tan urgente es resolver esto para usted?',
  ],
  timeline: [
    '¿Cuándo le gustaría comenzar el proceso de coaching?',
    '¿Hay algún evento o fecha límite que impulse esta decisión?',
    '¿Está listo para comprometerse con un programa ahora?',
  ],
} as const;

export const DEFAULT_BANT: BANTQualification = {
  budget: 'unknown',
  authority: 'unknown',
  need: 'unknown',
  timeline: 'unknown',
  notes: {},
};

// ============================================
// Lead Scoring (Salesforce Einstein-Inspired)
// ============================================

export type ScoreCategory = 'hot' | 'warm' | 'neutral' | 'cold';

export interface LeadScore {
  bantScore: number;        // 0-40 from BANT
  engagementScore: number;  // 0-30 from activities
  fitScore: number;         // 0-30 from profile match
  totalScore: number;       // 0-100 composite
  category: ScoreCategory;
}

export const SCORE_THRESHOLDS: Record<ScoreCategory, { min: number; max: number }> = {
  hot: { min: 80, max: 100 },
  warm: { min: 60, max: 79 },
  neutral: { min: 40, max: 59 },
  cold: { min: 0, max: 39 },
};

export const SCORE_LABELS: Record<ScoreCategory, string> = {
  hot: 'Caliente',
  warm: 'Tibio',
  neutral: 'Neutral',
  cold: 'Frío',
};

export const SCORE_COLORS: Record<ScoreCategory, string> = {
  hot: 'bg-red-100 text-red-800',
  warm: 'bg-orange-100 text-orange-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  cold: 'bg-blue-100 text-blue-800',
};

export const SCORE_ICONS: Record<ScoreCategory, string> = {
  hot: '🔥',
  warm: '🌡️',
  neutral: '🌤️',
  cold: '❄️',
};

// Engagement score points
export const ENGAGEMENT_POINTS = {
  viewed_profile: 5,
  submitted_inquiry: 10,
  responded_to_email: 10,
  scheduled_call: 15,
  attended_discovery_call: 20,
  requested_proposal: 15,
  opened_proposal: 10,
} as const;

// Fit score points
export const FIT_POINTS = {
  matches_specialty: 10,
  location_match: 5,
  budget_in_range: 10,
  has_referral: 15,
  industry_match: 5,
  language_match: 5,
} as const;

// ============================================
// Lead (Main CRM Entity)
// ============================================

export type LeadSource = 'directory' | 'referral' | 'website' | 'event' | 'social' | 'cold_outreach' | 'other';
export type LostReason = 'price' | 'timing' | 'competitor' | 'no_decision' | 'no_budget' | 'no_fit' | 'unresponsive' | 'other';

/**
 * Main Lead entity - equivalent to Salesforce Lead/Opportunity
 * Represents a potential client in the sales pipeline
 */
export interface Lead {
  id: string;
  coachId: string;

  // Contact Information
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  linkedInUrl?: string;
  photoURL?: string;

  // Pipeline (Salesforce-aligned)
  stage: OpportunityStage;
  probability: number;              // Auto-calculated from stage
  estimatedValue: number;           // Program value in currency
  currency: string;
  expectedCloseDate?: Timestamp;

  // BANT Qualification
  bant: BANTQualification;
  bantScore: number;                // 0-40 calculated

  // Scoring
  engagementScore: number;          // 0-30 based on activities
  fitScore: number;                 // 0-30 based on profile match
  totalScore: number;               // 0-100 composite
  scoreCategory: ScoreCategory;

  // Source & Attribution
  source: LeadSource;
  sourceDetail?: string;            // "Referral from Maria Garcia"
  referredBy?: string;              // User ID if internal
  inquiryId?: string;               // Link to original inquiry
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;

  // Context & Notes
  notes: string;
  interestAreas: string[];          // Specialties interested in
  goals?: string;                   // What they want to achieve
  challenges?: string;              // Current challenges
  tags: string[];

  // Program Details (for proposal stage)
  proposedProgram?: {
    name: string;
    duration: string;               // "3 months"
    sessionsCount: number;
    frequency: string;              // "Weekly"
    totalPrice: number;
    proposalUrl?: string;
    proposalSentAt?: Timestamp;
  };

  // Closed Won Details
  wonDetails?: {
    programId?: string;             // Link to created program
    contractSignedAt?: Timestamp;
    firstSessionDate?: Timestamp;
    actualValue: number;
  };

  // Closed Lost Details
  lostReason?: LostReason;
  lostReasonDetail?: string;
  competitorName?: string;
  canRecontact: boolean;
  recontactDate?: Timestamp;

  // Engagement Tracking
  engagementHistory: string[];      // IDs of engagement events

  // Timestamps & Activity
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActivityAt?: Timestamp;
  lastContactedAt?: Timestamp;
  nextFollowUpDate?: Timestamp;
  stageChangedAt?: Timestamp;
  daysInCurrentStage: number;

  // Computed/Denormalized
  coachName?: string;               // For admin views
  isStale: boolean;                 // No activity in threshold days
}

/**
 * Form data for creating a new lead
 */
export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  linkedInUrl?: string;
  source: LeadSource;
  sourceDetail?: string;
  referredBy?: string;
  inquiryId?: string;
  notes?: string;
  interestAreas?: string[];
  estimatedValue?: number;
  currency?: string;
  tags?: string[];
}

/**
 * Filters for querying leads
 */
export interface LeadFilters {
  stages?: OpportunityStage[];
  scoreCategories?: ScoreCategory[];
  sources?: LeadSource[];
  tags?: string[];
  search?: string;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  isStale?: boolean;
  hasFollowUp?: boolean;
  followUpOverdue?: boolean;
}

// ============================================
// Activities (Salesforce Task/Event Model)
// ============================================

export type ActivityType =
  | 'call'              // Phone call
  | 'email_sent'        // Email sent
  | 'email_received'    // Email received
  | 'meeting'           // In-person meeting
  | 'video_call'        // Video call
  | 'discovery_call'    // Discovery session
  | 'proposal_sent'     // Proposal sent
  | 'proposal_viewed'   // Proposal was viewed
  | 'note'              // Internal note
  | 'stage_change'      // Stage changed (auto)
  | 'score_change'      // Score changed (auto)
  | 'task_completed'    // Task was completed
  | 'inquiry_received'  // Initial inquiry
  | 'follow_up';        // Follow-up contact

export type ActivityOutcome = 'positive' | 'neutral' | 'negative' | 'no_answer';

export interface LeadActivity {
  id: string;
  leadId: string;
  coachId: string;
  type: ActivityType;
  subject: string;
  description: string;
  outcome?: ActivityOutcome;

  // For stage changes (auto-generated)
  previousStage?: OpportunityStage;
  newStage?: OpportunityStage;

  // For score changes (auto-generated)
  previousScore?: number;
  newScore?: number;

  // Scheduling
  scheduledAt?: Timestamp;
  completedAt?: Timestamp;
  durationMinutes?: number;

  // Metadata
  createdAt: Timestamp;
  createdBy: string;
  isAutomatic: boolean;           // System-generated activity
}

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  call: 'Llamada',
  email_sent: 'Email enviado',
  email_received: 'Email recibido',
  meeting: 'Reunión',
  video_call: 'Videollamada',
  discovery_call: 'Sesión Discovery',
  proposal_sent: 'Propuesta enviada',
  proposal_viewed: 'Propuesta vista',
  note: 'Nota',
  stage_change: 'Cambio de etapa',
  score_change: 'Cambio de score',
  task_completed: 'Tarea completada',
  inquiry_received: 'Consulta recibida',
  follow_up: 'Seguimiento',
};

export const ACTIVITY_ICONS: Record<ActivityType, string> = {
  call: 'Phone',
  email_sent: 'Send',
  email_received: 'Mail',
  meeting: 'Users',
  video_call: 'Video',
  discovery_call: 'Compass',
  proposal_sent: 'FileText',
  proposal_viewed: 'Eye',
  note: 'StickyNote',
  stage_change: 'ArrowRight',
  score_change: 'TrendingUp',
  task_completed: 'CheckCircle',
  inquiry_received: 'MessageSquare',
  follow_up: 'RefreshCw',
};

export interface CreateActivityData {
  type: ActivityType;
  subject: string;
  description?: string;
  outcome?: ActivityOutcome;
  scheduledAt?: Timestamp;
  completedAt?: Timestamp;
  durationMinutes?: number;
}

// ============================================
// Tasks (Salesforce Task Model)
// ============================================

export type TaskType = 'call' | 'email' | 'meeting' | 'follow_up' | 'send_proposal' | 'review' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'cancelled';

export interface LeadTask {
  id: string;
  leadId: string;
  coachId: string;
  type: TaskType;
  title: string;
  description?: string;
  dueDate: Timestamp;
  priority: TaskPriority;
  status: TaskStatus;
  reminderAt?: Timestamp;
  createdAt: Timestamp;
  completedAt?: Timestamp;

  // Denormalized for list views
  leadName?: string;
  leadEmail?: string;
  leadStage?: OpportunityStage;
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  call: 'Llamar',
  email: 'Enviar email',
  meeting: 'Reunión',
  follow_up: 'Seguimiento',
  send_proposal: 'Enviar propuesta',
  review: 'Revisar',
  other: 'Otro',
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export interface CreateTaskData {
  type: TaskType;
  title: string;
  description?: string;
  dueDate: Timestamp;
  priority: TaskPriority;
  reminderAt?: Timestamp;
}

// ============================================
// Pipeline Metrics (Salesforce Dashboard)
// ============================================

export interface StageMetrics {
  count: number;
  value: number;
  avgDaysInStage: number;
}

export interface ConversionRates {
  inquiryToLead: number;
  leadToQualified: number;
  qualifiedToProposal: number;
  proposalToWon: number;
  overallWinRate: number;
}

export interface PipelineMetrics {
  // Pipeline Value
  totalPipelineValue: number;
  weightedPipelineValue: number;    // Sum of (value * probability)

  // Stage Distribution
  byStage: Record<OpportunityStage, StageMetrics>;

  // Conversion Rates
  conversionRates: ConversionRates;

  // Velocity
  avgSalesCycle: number;            // Days from prospecting to won
  avgTimePerStage: Record<OpportunityStage, number>;

  // Activity Metrics
  activitiesThisWeek: number;
  activitiesThisMonth: number;
  tasksOverdue: number;
  tasksDueToday: number;
  leadsNeedingAttention: number;    // No activity in 7+ days

  // Lead Score Distribution
  byScoreCategory: Record<ScoreCategory, number>;

  // Forecast
  expectedClosesThisMonth: {
    count: number;
    value: number;
  };
  expectedClosesNextMonth: {
    count: number;
    value: number;
  };

  // Win/Loss
  winsThisMonth: number;
  lossesThisMonth: number;
  revenueWonThisMonth: number;

  // Period
  periodStart: Timestamp;
  periodEnd: Timestamp;
  calculatedAt: Timestamp;
}

// ============================================
// Stage Transition Validation
// ============================================

export interface StageTransitionResult {
  allowed: boolean;
  warnings: string[];
  requirements: string[];
  suggestedActions: string[];
}

export const STAGE_REQUIREMENTS: Partial<Record<OpportunityStage, {
  requiredBantScore?: number;
  requiredFields?: (keyof Lead)[];
  requiredActivities?: ActivityType[];
  minDaysInPrevious?: number;
}>> = {
  qualification: {
    requiredFields: ['email', 'name'],
  },
  needs_analysis: {
    requiredBantScore: 20,
    requiredFields: ['phone'],
  },
  proposal: {
    requiredBantScore: 30,
    requiredActivities: ['discovery_call'],
  },
  negotiation: {
    requiredBantScore: 40,
    requiredFields: ['estimatedValue'],
  },
  closed_won: {
    requiredFields: ['estimatedValue', 'expectedCloseDate'],
  },
  closed_lost: {
    requiredFields: ['lostReason'],
  },
};

// ============================================
// Stage Guidance (Salesforce Path)
// ============================================

export interface StageGuidance {
  keyActions: string[];
  tipsForSuccess: string[];
  commonMistakes: string[];
  nextStagePrep: string[];
}

export const STAGE_GUIDANCE: Record<OpportunityStage, StageGuidance> = {
  prospecting: {
    keyActions: [
      'Verificar información de contacto',
      'Investigar perfil en LinkedIn',
      'Identificar conexiones en común',
    ],
    tipsForSuccess: [
      'Responde a inquiries en menos de 24 horas',
      'Personaliza tu primer mensaje',
      'Muestra genuino interés en su situación',
    ],
    commonMistakes: [
      'Enviar mensajes genéricos',
      'No investigar antes del primer contacto',
      'Tardar demasiado en responder',
    ],
    nextStagePrep: [
      'Preparar preguntas de calificación BANT',
      'Tener disponibilidad para llamada',
    ],
  },
  qualification: {
    keyActions: [
      'Completar evaluación BANT',
      'Determinar fit con tu especialidad',
      'Agendar llamada de descubrimiento',
    ],
    tipsForSuccess: [
      'Usa preguntas abiertas para entender necesidades',
      'Valida el presupuesto tempranamente',
      'Identifica al tomador de decisión',
    ],
    commonMistakes: [
      'Asumir que todos los leads son buenos',
      'No preguntar sobre presupuesto',
      'Invertir tiempo en leads no calificados',
    ],
    nextStagePrep: [
      'Preparar agenda para sesión discovery',
      'Revisar notas de calificación',
    ],
  },
  needs_analysis: {
    keyActions: [
      'Realizar sesión de descubrimiento',
      'Documentar metas y desafíos',
      'Validar expectativas del proceso',
    ],
    tipsForSuccess: [
      'Escucha más de lo que hablas',
      'Haz preguntas poderosas',
      'Conecta sus metas con tu metodología',
    ],
    commonMistakes: [
      'Hablar demasiado de ti mismo',
      'No profundizar en el "por qué"',
      'Olvidar documentar la conversación',
    ],
    nextStagePrep: [
      'Preparar propuesta personalizada',
      'Definir programa recomendado',
    ],
  },
  proposal: {
    keyActions: [
      'Enviar propuesta personalizada',
      'Presentar opciones de programa',
      'Establecer próximos pasos claros',
    ],
    tipsForSuccess: [
      'Personaliza la propuesta a sus metas',
      'Ofrece 2-3 opciones de programa',
      'Incluye testimonios relevantes',
    ],
    commonMistakes: [
      'Enviar propuestas genéricas',
      'No dar seguimiento después de enviar',
      'No establecer fecha límite',
    ],
    nextStagePrep: [
      'Preparar respuestas a objeciones comunes',
      'Tener contrato listo',
    ],
  },
  negotiation: {
    keyActions: [
      'Resolver objeciones finales',
      'Acordar términos específicos',
      'Preparar contrato para firma',
    ],
    tipsForSuccess: [
      'Escucha las objeciones sin defensividad',
      'Ofrece flexibilidad donde sea posible',
      'Mantén el valor de tu servicio',
    ],
    commonMistakes: [
      'Ceder demasiado en precio',
      'No establecer fecha de decisión',
      'Perseguir leads que no están listos',
    ],
    nextStagePrep: [
      'Preparar proceso de onboarding',
      'Confirmar disponibilidad de horarios',
    ],
  },
  closed_won: {
    keyActions: [
      'Celebrar y agradecer',
      'Iniciar proceso de onboarding',
      'Programar primera sesión',
    ],
    tipsForSuccess: [
      'Envía bienvenida personalizada',
      'Establece expectativas claras',
      'Solicita referidos mientras el entusiasmo es alto',
    ],
    commonMistakes: [
      'No dar seguimiento post-firma',
      'Demorar el inicio del programa',
      'No documentar el proceso exitoso',
    ],
    nextStagePrep: [
      'Crear programa en la plataforma',
      'Enviar materiales de preparación',
    ],
  },
  closed_lost: {
    keyActions: [
      'Documentar razón de pérdida',
      'Agradecer por el tiempo',
      'Dejar puerta abierta para futuro',
    ],
    tipsForSuccess: [
      'Pide feedback honesto',
      'No tomes el rechazo personalmente',
      'Mantén la relación profesional',
    ],
    commonMistakes: [
      'No documentar la razón de pérdida',
      'Quemar puentes con el prospecto',
      'No aprender del proceso',
    ],
    nextStagePrep: [
      'Analizar patrones de pérdida',
      'Ajustar proceso si es necesario',
    ],
  },
};

// ============================================
// Default Values
// ============================================

export const DEFAULT_LEAD: Partial<Lead> = {
  stage: 'prospecting',
  probability: STAGE_PROBABILITIES.prospecting,
  bant: DEFAULT_BANT,
  bantScore: 0,
  engagementScore: 0,
  fitScore: 0,
  totalScore: 0,
  scoreCategory: 'cold',
  currency: 'USD',
  estimatedValue: 0,
  notes: '',
  interestAreas: [],
  tags: [],
  engagementHistory: [],
  canRecontact: true,
  isStale: false,
  daysInCurrentStage: 0,
};

// Stale threshold in days
export const STALE_THRESHOLD_DAYS = 7;

// Days in stage warning thresholds
export const STAGE_WARNING_DAYS: Record<OpportunityStage, number> = {
  prospecting: 3,
  qualification: 7,
  needs_analysis: 14,
  proposal: 7,
  negotiation: 14,
  closed_won: 0,
  closed_lost: 0,
};
