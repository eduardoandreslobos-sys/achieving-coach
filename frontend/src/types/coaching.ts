import { Timestamp } from 'firebase/firestore';

// ============ DIGITAL SIGNATURE ============

export interface DigitalSignature {
  oduid: string; // ID del usuario que firma
  name: string;
  email: string;
  role: 'coachee' | 'sponsor' | 'hr' | 'coach';
  signedAt: Timestamp;
  ipAddress?: string;
  userAgent?: string;
  // Hash único: SHA-256 de (oduid + programId + timestamp + role)
  signatureHash: string;
  // Texto que aceptó
  acceptedTerms: string[];
}

// ============ PARTICIPANT ============

export interface Participant {
  name: string;
  role: 'coachee' | 'sponsor' | 'hr' | 'coach' | 'other';
  position: string;
  email?: string;
  phone?: string;
}

// ============ 1. BACKGROUND INFO (Antecedentes) ============

export interface BackgroundInfo {
  // Coachee
  coacheeName?: string;
  coacheePosition?: string;
  coacheePhone?: string;
  coacheeEmail?: string;
  
  // Organización
  organizationName?: string;
  
  // Jefe directo / Sponsor
  supervisorName?: string;
  supervisorPosition?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  
  // RRHH (opcional)
  hrName?: string;
  hrPhone?: string;
  hrEmail?: string;
  
  // Coach
  coachName?: string;
  
  completedAt?: Timestamp;
}

// ============ 2. TRIPARTITE MEETING (Reunión Tripartita) ============

export interface TripartiteResponse {
  questionId: number;
  question: string;
  coacheeResponse: string;
  sponsorResponse: string;
  hrResponse?: string;
}

export interface TripartiteMeeting {
  date?: Timestamp;
  location?: string;
  participants: Participant[];
  responses: TripartiteResponse[];
  observations?: string;
  completedAt?: Timestamp;
}

export const TRIPARTITE_QUESTIONS = [
  { id: 1, question: '¿Qué necesitas mirar?', coacheeLabel: '¿Qué necesitas mirar?', sponsorLabel: '¿Qué necesita mirar?', hrLabel: '¿Qué requiere la organización del ejecutivo?' },
  { id: 2, question: '¿Por qué eso es relevante?', coacheeLabel: '¿Por qué eso es relevante para ti?', sponsorLabel: '¿Por qué eso es relevante para el ejecutivo y para el área?', hrLabel: '¿Por qué eso es relevante para la organización?' },
  { id: 3, question: '¿Cómo visualizan un final satisfactorio del proceso?', coacheeLabel: '¿Cómo visualizas un final satisfactorio?', sponsorLabel: '¿Cómo visualiza un final satisfactorio?', hrLabel: '¿Cómo visualiza un final satisfactorio?' },
  { id: 4, question: '¿Cómo nos podríamos dar cuenta de que vamos por el camino correcto? (Indicadores)', coacheeLabel: 'Indicadores de avance', sponsorLabel: 'Indicadores de avance', hrLabel: 'Indicadores de avance' },
  { id: 5, question: '¿Qué deseas conservar y potenciar?', coacheeLabel: '¿Qué deseas conservar y potenciar?', sponsorLabel: '¿Qué es deseable que conserve y potencie el ejecutivo?', hrLabel: '¿Qué es deseable que conserve y potencie?' },
  { id: 6, question: '¿De qué tendríamos que estar atentos? (Boicoteadores)', coacheeLabel: 'Boicoteadores personales', sponsorLabel: 'Boicoteadores personales y del área', hrLabel: 'Boicoteadores del sistema organizacional' },
  { id: 7, question: '¿Qué estás dispuesto/a a dar para que este proceso sea satisfactorio?', coacheeLabel: '¿Qué estás dispuesto/a a dar?', sponsorLabel: '¿Qué está dispuesto/a a dar?', hrLabel: '¿Qué está dispuesto/a a dar?' },
  { id: 8, question: 'Comparte al menos tres aspectos del coachee y sus circunstancias que hagan visible este punto de partida', coacheeLabel: 'Tres aspectos de tu punto de partida', sponsorLabel: 'Tres aspectos del punto de partida', hrLabel: 'Tres aspectos del punto de partida' },
  { id: 9, question: '¿Qué requieren de mí como coach?', coacheeLabel: '¿Qué requieres del coach?', sponsorLabel: '¿Qué requiere del coach?', hrLabel: '¿Qué requiere del coach?' },
  { id: 10, question: '¿Algún otro aspecto que consideren tomar en cuenta?', coacheeLabel: 'Otros aspectos', sponsorLabel: 'Otros aspectos', hrLabel: 'Otros aspectos' },
];

// ============ 3. COACHING AGREEMENT (Acuerdo de Coaching) ============

export interface CoachingAgreement {
  // Actores del acuerdo
  actors: Participant[];
  
  // Objetivos del proceso
  generalObjective: string;
  workDomains: string[];
  expectedResults: string[];
  competenciesToDevelop: string[];
  progressIndicators: string[];
  
  // Plan de acción inicial
  initialActionPlan?: string;
  
  // Responsabilidades (editables por coach)
  coachResponsibilities: string[];
  coacheeResponsibilities: string[];
  sponsorResponsibilities: string[];
  hrResponsibilities?: string[];
  
  // === TÉRMINOS QUE ACEPTA EL COACHEE ===
  
  // Promesa de confidencialidad
  confidentialityNote: string;
  
  // Acerca de las sesiones
  totalSessions: number;
  includesObservedSession: boolean;
  sessionAttendancePolicy: string; // Asistencia y cancelación
  
  // Vigencia del acuerdo
  validFrom: Timestamp;
  validUntil: Timestamp;
  
  // === FIRMAS DIGITALES ===
  signatures: DigitalSignature[];
  
  // Estado
  status: 'draft' | 'pending_signatures' | 'signed' | 'active';
  createdAt?: Timestamp;
  completedAt?: Timestamp;
}

// ============ 4. SESSION CALENDAR ============

export interface SessionCalendarEntry {
  sessionNumber: number;
  date?: Timestamp;
  time?: string;
  location?: string;
  type: SessionType;
  notes?: string;
}

// ============ 5. SESSION AGREEMENT (Acuerdo de Sesión - Pauta inicial) ============
// Se muestra al coach al iniciar cada sesión

export interface SessionAgreement {
  // Enganche con sesión anterior (primera sesión: con reunión tripartita)
  previousSessionLink: string;
  
  // Qué se trabajará en la sesión y su relevancia
  sessionFocus: string;
  relevanceToProcess: string;
  
  // Prácticas o competencias observables
  practicesOrCompetencies: string;
  
  // Indicadores particulares para la sesión
  sessionIndicators: string;
  
  // Contexto para experiencias de aprendizaje
  learningContext: string;
  
  completedAt?: Timestamp;
}

// ============ 5. SESSION REPORT (Tabla de Seguimiento por Sesión) ============
// Campos específicos pueden variar por número de sesión

export interface SessionReport {
  sessionNumber: number;
  
  // Tema de la sesión y prácticas elegidas
  sessionTopic: string;
  practicesWorked: string;
  
  // Enganche con sesión anterior
  previousSessionLink: string;
  
  // Contextos donde se trabaja la práctica
  practiceContext: string;
  
  // Indicadores de avance
  progressIndicators: string;
  
  // Descubrimientos y aprendizajes
  discoveriesAndLearnings: string;
  
  // Tareas para próxima sesión
  tasksForNextSession: string;
  
  // Observaciones
  observations: string;
  
  completedAt?: Timestamp;
}

// ============ 6. OBSERVED MEETING (Sesión 4: Reunión Observada) ============

export interface ObservedMeetingReport {
  // Integrantes de la reunión observada
  meetingParticipants: {
    name: string;
    role: string;
  }[];
  
  // Antecedentes de la reunión
  meetingBackground: string;
  
  // Horarios
  startTime: string;
  endTime: string;
  
  // Observación del armado e inicio
  setupObservations: string;
  setupNotes: string;
  
  // Prácticas y competencias observadas
  practicesObserved: string;
  practicesNotes: string;
  
  // Áreas de aprendizaje identificadas
  learningAreas: string;
  
  completedAt?: Timestamp;
}

// ============ 7. PROCESS REPORT (Auto-generado después de sesión 3) ============

export interface ProcessReport {
  // Auto-generado, pero editable
  autoGenerated: boolean;
  aiGenerated?: boolean;
  generatedAt?: Timestamp;
  
  // Temas centrales (extraídos de sesiones 1-3)
  centralThemes: string;
  
  // Aspectos del coachee
  coacheeAspects: {
    conservativeForces: string;
    transformativeForces: string;
  };
  
  // Contexto organizacional
  organizationalContext: {
    conservativeForces: string;
    transformativeForces: string;
  };
  
  // Prácticas de nuevos aprendizajes
  newPractices: {
    name: string;
    context: string;
  }[];
  
  // Descubrimientos relevantes
  relevantDiscoveries: string;
  
  // Observaciones
  observations: string;
  
  // Editado por coach
  editedByCoach: boolean;
  editedAt?: Timestamp;
}

// ============ 8. FINAL REPORT (Auto-generado al completar) ============

export interface FinalReport {
  // Auto-generado, pero editable
  autoGenerated: boolean;
  aiGenerated?: boolean;
  generatedAt?: Timestamp;
  
  // Datos del punto de partida (de tripartita)
  startingPointData: string;
  
  // Tres aspectos del punto de cierre
  closingAspects: string;
  
  // Prácticas incorporadas
  incorporatedPractices: string;
  
  // Brechas a reforzar
  gapsToReinforce: string;
  
  // Recomendaciones de sostenibilidad
  sustainabilityRecommendations: string;
  
  // Observaciones finales
  finalObservations: string;
  
  // Editado por coach
  editedByCoach: boolean;
  editedAt?: Timestamp;
  completedAt?: Timestamp;
}

// ============ COACHING TYPE ============

export type CoachingType = 'individual' | 'corporate';

// ============ INDIVIDUAL COACHING: SESIÓN DE ALINEACIÓN ============
// Reemplaza la Reunión Tripartita para coaching individual

export interface AlignmentSession {
  date?: Timestamp;
  location?: string;

  // Objetivos personales del coachee
  personalGoals: string;

  // Situación actual
  currentSituation: string;

  // Visión de éxito
  successVision: string;

  // Indicadores de avance
  progressIndicators: string;

  // Fortalezas a potenciar
  strengthsToLeverage: string;

  // Áreas de mejora
  areasToImprove: string;

  // Compromisos iniciales
  initialCommitments: string;

  // Observaciones
  observations?: string;

  completedAt?: Timestamp;
}

// ============ COACHING PROGRAM (Principal) ============

export interface CoachingProgram {
  id: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  title: string;
  description?: string;
  overallGoals: string[];
  duration: number;
  sessionsPlanned: number;
  status: 'draft' | 'pending_acceptance' | 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: Timestamp;
  endDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // ===== Tipo de Coaching =====
  coachingType: CoachingType; // 'individual' o 'corporate'

  // ===== Fases del Proceso CE =====

  // Fase 1: Antecedentes
  backgroundInfo?: BackgroundInfo;

  // Fase 2: Reunión tripartita (corporate) O Sesión de Alineación (individual)
  tripartiteMeeting?: TripartiteMeeting;
  alignmentSession?: AlignmentSession; // Solo para coaching individual

  // Fase 3: Acuerdo de coaching (incluye términos y firmas)
  agreement?: CoachingAgreement;

  // Fase 4: Calendarización
  sessionCalendar?: SessionCalendarEntry[];

  // Fase 7: Reporte de proceso (auto-generado después de sesión 3)
  processReport?: ProcessReport;

  // Fase 8: Informe final (auto-generado al completar)
  finalReport?: FinalReport;

  // Tracking
  currentPhase: number;
  phasesCompleted: number[];
}

// ============ SESSION ============

export type SessionType = 'kickstarter' | 'regular' | 'reflection' | 'observed';

// ============ SESSION STATUS ============

export type SessionStatus =
  | 'pending_confirmation'  // Esperando confirmación del coachee
  | 'scheduled'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'rejected';  // Coachee rechazó la sesión

// ============ SESSION CONFIRMATION ============

export interface SessionConfirmation {
  confirmedAt?: Timestamp;
  confirmedBy?: string;
  rejectedAt?: Timestamp;
  rejectedBy?: string;
  rejectionReason?: string;
}

// ============ SESSION CANCELLATION ============

export interface SessionCancellation {
  cancelledAt: Timestamp;
  cancelledBy: string;  // userId
  cancelledByRole: 'coach' | 'coachee';
  reason: string;
}

// ============ SESSION RESCHEDULE ============

export interface RescheduleEntry {
  requestedAt: Timestamp;
  requestedBy: string;  // userId
  requestedByRole: 'coach' | 'coachee';
  originalDate: Timestamp;
  proposedDate: Timestamp;
  proposedStartTime: string;
  proposedEndTime: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected';
  respondedAt?: Timestamp;
  responseNote?: string;
}

// ============ SESSION SHARING ============

export interface SessionSharing {
  agreementSharedWithCoachee: boolean;  // Compartir Acuerdo de Sesión
  reportSharedWithCoachee: boolean;     // Compartir Reporte (excepto coachNotes)
  sharedAt?: Timestamp;                  // Cuándo se compartió
}

// ============ SESSION ============

export interface Session {
  id: string;
  programId: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  sessionNumber: number;
  type: SessionType;
  title: string;
  scheduledDate: Timestamp;
  scheduledTime: string;
  duration: number;
  location?: string;
  status?: SessionStatus;

  // Confirmation, cancellation, and reschedule
  confirmation?: SessionConfirmation;
  cancellation?: SessionCancellation;
  rescheduleHistory?: RescheduleEntry[];
  currentRescheduleRequest?: RescheduleEntry;

  // Vinculación con fase del programa
  phaseId?: number; // 5 = Sesiones 1-3, 7 = Sesión Observada, 8 = Sesiones 5-6

  // Estructura de sesión
  goal: string;
  agenda: string[];
  activities: string[];
  keyTopics: string[];
  homework?: string;

  // Legacy (compatibilidad)
  objective: string;
  preSesionAnalysis?: PreSessionAnalysis;
  actionPlan?: ActionPlan;

  // Contenido
  notes?: string;
  transcript?: string;
  summary?: string;

  // Review existente
  review?: SessionReview;

  // ===== NUEVOS CAMPOS CE =====

  // Acuerdo de sesión (pauta inicial para el coach)
  sessionAgreement?: SessionAgreement;

  // Tabla de seguimiento de la sesión
  sessionReport?: SessionReport;

  // Solo para sesión tipo 'observed'
  observedMeetingReport?: ObservedMeetingReport;

  // ===== COMPARTIR CON COACHEE =====
  sharing?: SessionSharing;

  actualDuration?: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============ INTERFACES EXISTENTES (Sin cambios) ============

export interface SessionReview {
  achievements: string[];
  insights: string[];
  nextSteps: string[];
  coacheeProgress: number;
  sessionQuality: number;
  notes?: string;
}

export interface PreSessionAnalysis {
  competencies: { name: string; keyPoints: string[]; }[];
  desiredResults: { description: string; relatedCompetencies: string[]; }[];
  obstacles: { description: string; indicators: string[]; }[];
}

export interface ActionPlan {
  objective: string;
  actions: { action: string; deadline: string; indicators: string[]; }[];
  supportStrategy: string;
  obstacleStrategy: string;
}

export interface SessionNote {
  id: string;
  sessionId: string;
  timestamp: Timestamp;
  content: string;
  type: 'note' | 'transcript' | 'action-item';
  speaker?: 'coach' | 'coachee';
}

export interface ValueProposition {
  coachingType: string;
  targetAudience: string;
  desiredOutcome: string;
  problemSolved: string;
  pitch?: string;
}

// ============ TEMPLATES ============

export interface SessionTemplate {
  type: SessionType;
  defaultDuration: number;
  defaultTitle: string;
  suggestedAgenda: string[];
  suggestedActivities: string[];
}

export const SESSION_TEMPLATES: Record<SessionType, SessionTemplate> = {
  kickstarter: {
    type: 'kickstarter',
    defaultDuration: 60,
    defaultTitle: 'Sesión 1 - Inicio del Proceso',
    suggestedAgenda: [
      'Enganche con reunión tripartita',
      'Cerrar acuerdo de coaching de proceso',
      'Establecer prácticas o competencias observables',
      'Definir indicadores de la sesión',
      'Contextualizar experiencias de aprendizaje',
    ],
    suggestedActivities: [
      'Revisión del acuerdo de coaching',
      'Clarificar expectativas',
      'Establecer métricas de éxito',
      'Crear contexto de confianza',
    ],
  },
  regular: {
    type: 'regular',
    defaultDuration: 60,
    defaultTitle: 'Sesión de Coaching',
    suggestedAgenda: [
      'Enganche con sesión anterior',
      'Establecer foco de la sesión',
      'Trabajar prácticas o competencias',
      'Identificar indicadores de avance',
      'Definir tareas para próxima sesión',
    ],
    suggestedActivities: [
      'Articular puente con lo ya vivido',
      'Escucha activa y preguntas poderosas',
      'Experiencias de aprendizaje',
      'Registro de descubrimientos',
    ],
  },
  reflection: {
    type: 'reflection',
    defaultDuration: 60,
    defaultTitle: 'Sesión de Cierre',
    suggestedAgenda: [
      'Enganche con sesión anterior',
      'Revisar objetivos del proceso',
      'Identificar prácticas incorporadas',
      'Reconocer brechas a reforzar',
      'Recomendaciones de sostenibilidad',
    ],
    suggestedActivities: [
      'Evaluación de progreso',
      'Celebrar logros',
      'Capturar aprendizajes clave',
      'Crear plan de sostenibilidad',
    ],
  },
  observed: {
    type: 'observed',
    defaultDuration: 90,
    defaultTitle: 'Sesión 4 - Reunión Observada',
    suggestedAgenda: [
      'Coordinación con participantes',
      'Observación del contexto real de trabajo',
      'Foco en competencias trabajadas',
      'Registro de fenómenos significativos',
      'Identificar áreas de aprendizaje',
    ],
    suggestedActivities: [
      'Observación invisible',
      'Registro de dinámicas de equipo',
      'Identificar aplicación de prácticas',
      'Documentar áreas de mejora',
    ],
  },
};

// ============ FASES DEL PROGRAMA ============

// ============ FASES DEL PROGRAMA CON REQUISITOS ============

export interface PhaseRequirement {
  id: number;
  name: string;
  description: string;
  icon: string;
  // Requisitos para completar esta fase
  requirements: {
    description: string;
    check: (program: CoachingProgram, sessions: Session[]) => boolean;
  }[];
  // Qué sesiones pertenecen a esta fase (si aplica)
  sessionNumbers?: number[];
  // Si la fase se auto-completa cuando se cumplen los requisitos
  autoComplete?: boolean;
}

// Helper para obtener nombre de fase según tipo de coaching
export function getPhaseName(phaseId: number, coachingType: CoachingType): string {
  if (coachingType === 'individual') {
    switch (phaseId) {
      case 2: return 'Sesión de Alineación';
      case 7: return 'Sesión de Reflexión';
      default: break;
    }
  }
  return PROGRAM_PHASES.find(p => p.id === phaseId)?.name || '';
}

// Helper para obtener descripción de fase según tipo de coaching
export function getPhaseDescription(phaseId: number, coachingType: CoachingType): string {
  if (coachingType === 'individual') {
    switch (phaseId) {
      case 2: return 'Alineación de objetivos personales';
      case 7: return 'Reflexión y consolidación de aprendizajes';
      default: break;
    }
  }
  return PROGRAM_PHASES.find(p => p.id === phaseId)?.description || '';
}

export const PROGRAM_PHASES: PhaseRequirement[] = [
  {
    id: 1,
    name: 'Antecedentes',
    description: 'Antecedentes generales del proceso',
    icon: 'FileText',
    requirements: [
      {
        description: 'Completar información de antecedentes',
        check: (p) => !!p.backgroundInfo?.completedAt
      }
    ],
    autoComplete: true
  },
  {
    id: 2,
    name: 'Reunión Tripartita',
    description: 'Alineación con sponsor y RRHH',
    icon: 'Users',
    requirements: [
      {
        // Para corporate: tripartiteMeeting, para individual: alignmentSession
        description: 'Completar reunión/sesión de alineación',
        check: (p) => p.coachingType === 'individual'
          ? !!p.alignmentSession?.completedAt
          : !!p.tripartiteMeeting?.completedAt
      }
    ],
    autoComplete: true
  },
  {
    id: 3,
    name: 'Acuerdo',
    description: 'Acuerdo de coaching y firmas',
    icon: 'FileSignature',
    requirements: [
      {
        description: 'Crear acuerdo de coaching',
        check: (p) => !!p.agreement?.createdAt
      },
      {
        description: 'Firma del Coach',
        check: (p) => p.agreement?.signatures?.some(s => s.role === 'coach') ?? false
      },
      {
        description: 'Firma del Coachee',
        check: (p) => p.agreement?.signatures?.some(s => s.role === 'coachee') ?? false
      },
      {
        // Solo requerido para corporate
        description: 'Firma del Sponsor',
        check: (p) => p.coachingType === 'individual'
          ? true // No requerido para individual
          : (p.agreement?.signatures?.some(s => s.role === 'sponsor') ?? false)
      }
    ],
    autoComplete: true
  },
  {
    id: 4,
    name: 'Calendario',
    description: 'Calendarización de sesiones',
    icon: 'Calendar',
    requirements: [
      {
        description: 'Programar al menos 6 sesiones',
        check: (p) => (p.sessionCalendar?.length ?? 0) >= 6
      }
    ],
    autoComplete: true
  },
  {
    id: 5,
    name: 'Sesiones 1-3',
    description: 'Primeras sesiones del proceso',
    icon: 'Play',
    sessionNumbers: [1, 2, 3],
    requirements: [
      {
        description: 'Completar Sesión 1',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 1 && s.status === 'completed')
      },
      {
        description: 'Completar Sesión 2',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 2 && s.status === 'completed')
      },
      {
        description: 'Completar Sesión 3',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 3 && s.status === 'completed')
      }
    ],
    autoComplete: true
  },
  {
    id: 6,
    name: 'Reporte Proceso',
    description: 'Seguimiento mid-process',
    icon: 'ClipboardList',
    requirements: [
      {
        description: 'Generar reporte de proceso',
        check: (p) => !!p.processReport?.generatedAt
      },
      {
        description: 'Revisar y aprobar reporte',
        check: (p) => p.processReport?.editedByCoach === true
      }
    ],
    autoComplete: false // Coach debe revisar manualmente
  },
  {
    id: 7,
    name: 'Sesión Observada',
    description: 'Observación en contexto real',
    icon: 'Eye',
    sessionNumbers: [4],
    requirements: [
      {
        // Para individual: solo completar sesión 4 (sin reporte de observación)
        description: 'Completar Sesión 4',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 4 && s.status === 'completed')
      },
      {
        // Solo requerido para corporate
        description: 'Completar reporte de observación',
        check: (p, sessions) => p.coachingType === 'individual'
          ? true // No requerido para individual
          : sessions.some(s => s.sessionNumber === 4 && !!s.observedMeetingReport?.completedAt)
      }
    ],
    autoComplete: true
  },
  {
    id: 8,
    name: 'Sesiones 5-6',
    description: 'Sesiones finales',
    icon: 'PlayCircle',
    sessionNumbers: [5, 6],
    requirements: [
      {
        description: 'Completar Sesión 5',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 5 && s.status === 'completed')
      },
      {
        description: 'Completar Sesión 6',
        check: (_, sessions) => sessions.some(s => s.sessionNumber === 6 && s.status === 'completed')
      }
    ],
    autoComplete: true
  },
  {
    id: 9,
    name: 'Informe Final',
    description: 'Cierre del proceso',
    icon: 'Award',
    requirements: [
      {
        description: 'Generar informe final',
        check: (p) => !!p.finalReport?.generatedAt
      },
      {
        description: 'Revisar y completar informe',
        check: (p) => !!p.finalReport?.completedAt
      }
    ],
    autoComplete: false // Coach debe completar manualmente
  }
];

// Helper para obtener requisitos pendientes de una fase
export function getPendingRequirements(
  phaseId: number,
  program: CoachingProgram,
  sessions: Session[]
): string[] {
  const phase = PROGRAM_PHASES.find(p => p.id === phaseId);
  if (!phase) return [];

  return phase.requirements
    .filter(req => !req.check(program, sessions))
    .map(req => req.description);
}

// Helper para verificar si una fase está completa
export function isPhaseComplete(
  phaseId: number,
  program: CoachingProgram,
  sessions: Session[]
): boolean {
  const phase = PROGRAM_PHASES.find(p => p.id === phaseId);
  if (!phase) return false;

  return phase.requirements.every(req => req.check(program, sessions));
}

// Helper para obtener la siguiente fase que debería estar activa
export function getNextActivePhase(
  program: CoachingProgram,
  sessions: Session[]
): number {
  for (const phase of PROGRAM_PHASES) {
    if (!isPhaseComplete(phase.id, program, sessions)) {
      return phase.id;
    }
  }
  return 9; // Todas completadas
}

// Helper para obtener el % de progreso de una fase
export function getPhaseProgress(
  phaseId: number,
  program: CoachingProgram,
  sessions: Session[]
): number {
  const phase = PROGRAM_PHASES.find(p => p.id === phaseId);
  if (!phase || phase.requirements.length === 0) return 0;

  const completed = phase.requirements.filter(req => req.check(program, sessions)).length;
  return Math.round((completed / phase.requirements.length) * 100);
}

// ============ TEXTOS POR DEFECTO ============

export const DEFAULT_CONFIDENTIALITY_NOTE = `Las conversaciones que se tengan entre el cliente o coachee y el coach son confidenciales y no se compartirán.

No obstante, se dejará establecido que, si existe la sospecha o claro entendimiento de parte del coach que su cliente tiene la intención de causar algún tipo de daño dentro de la organización, al equipo o a sí mismo, se considerará el siguiente protocolo excepcional a lo planteado en la promesa de confidencialidad: en primer término, una conversación con él o la coachee. De mantenerse esta intención, el segundo paso sería informar a los actores asociados al proceso.`;

export const DEFAULT_ATTENDANCE_POLICY = `Se especifica la relevancia de la puntualidad, el margen de espera en caso de que el cliente se atrase en llegar o conectarse a la sesión, qué sucederá con respecto a las cancelaciones, cuándo es posible reponer una sesión, lugares y condiciones logísticas mínimas y todo lo que el coach considere necesario como condiciones de satisfacción para sostener de manera impecable.`;

export const DEFAULT_COACH_RESPONSIBILITIES = [
  'Mantener la confidencialidad del proceso',
  'Preparar cada sesión con anticipación',
  'Proveer un espacio seguro de exploración',
  'Ofrecer retroalimentación constructiva',
  'Documentar el progreso del proceso',
];

export const DEFAULT_COACHEE_RESPONSIBILITIES = [
  'Asistir puntualmente a las sesiones',
  'Participar activamente en el proceso',
  'Completar las tareas acordadas entre sesiones',
  'Comunicar con anticipación cualquier impedimento',
  'Mantener apertura al aprendizaje',
];

export const DEFAULT_SPONSOR_RESPONSIBILITIES = [
  'Apoyar el proceso de desarrollo del coachee',
  'Facilitar los espacios necesarios para las sesiones',
  'Participar en las reuniones de seguimiento',
  'Proveer retroalimentación sobre cambios observados',
];

// ============ SESSION GUIDANCE (Guía por Número de Sesión) ============

export interface SessionGuidance {
  sessionNumber: number;
  title: string;
  description: string;
  agreementTips: string[];
  reportTips: string[];
  isSpecial?: boolean;
}

export const SESSION_GUIDANCE: SessionGuidance[] = [
  {
    sessionNumber: 1,
    title: 'Sesión Inicial',
    description: 'Enganche con reunión tripartita y cierre del acuerdo de proceso',
    isSpecial: true,
    agreementTips: [
      'Generar anclaje con la reunión tripartita',
      'Cerrar el acuerdo de coaching de proceso',
      'Pedir al coachee que articule el puente entre lo vivido y lo que viene',
      'Establecer las bases de confianza y confidencialidad',
    ],
    reportTips: [
      'Registrar compromisos del acuerdo firmado',
      'Documentar expectativas iniciales del coachee',
      'Capturar el punto de partida según la tripartita',
    ],
  },
  {
    sessionNumber: 2,
    title: 'Sesión Regular',
    description: 'Desarrollo de prácticas y competencias',
    isSpecial: false,
    agreementTips: [
      'Generar anclaje con la sesión anterior',
      'Pedir al coachee que articule el puente entre lo vivido y lo que viene',
      'Integrar el objetivo con los objetivos del proceso',
      'Bajar a prácticas o competencias observables',
      'Plantear indicadores particulares para la sesión',
    ],
    reportTips: [
      'Documentar avance en prácticas trabajadas',
      'Registrar descubrimientos del coachee',
      'Definir tareas concretas para la próxima sesión',
    ],
  },
  {
    sessionNumber: 3,
    title: 'Sesión Regular',
    description: 'Consolidación pre-reporte de proceso',
    isSpecial: false,
    agreementTips: [
      'Generar anclaje con la sesión anterior',
      'Articular el puente con lo ya vivido',
      'Integrar el objetivo con los objetivos del proceso',
      'Bajar a prácticas o competencias observables',
      'Preparar contexto para el reporte de proceso',
    ],
    reportTips: [
      'Esta sesión alimenta el Reporte de Proceso',
      'Identificar fuerzas conservadoras y transformadoras',
      'Registrar prácticas de nuevos aprendizajes',
    ],
  },
  {
    sessionNumber: 4,
    title: 'Sesión Observada',
    description: 'Observación del coachee en contexto de trabajo real',
    isSpecial: true,
    agreementTips: [
      'Coordinarse y generar contexto para todos los participantes',
      'Pedir permiso para convertirse en observador prácticamente invisible',
      'El foco: recursos o competencias que se están trabajando',
      'Establecer qué fenómenos se busca observar',
    ],
    reportTips: [
      'Documentar integrantes y antecedentes de la reunión',
      'Registrar observaciones del armado e inicio',
      'Identificar presencia de prácticas trabajadas',
      'Definir áreas de aprendizaje observadas',
    ],
  },
  {
    sessionNumber: 5,
    title: 'Sesión Regular',
    description: 'Integración de aprendizajes post-observación',
    isSpecial: false,
    agreementTips: [
      'Generar anclaje con la sesión observada',
      'Articular el puente con los descubrimientos de la observación',
      'Integrar nuevas prácticas identificadas',
      'Fortalecer competencias observadas en contexto real',
    ],
    reportTips: [
      'Conectar hallazgos de la observación con el desarrollo',
      'Registrar nuevas prácticas a incorporar',
      'Documentar avances desde la perspectiva observada',
    ],
  },
  {
    sessionNumber: 6,
    title: 'Sesión de Cierre',
    description: 'Cierre del proceso y sostenibilidad',
    isSpecial: true,
    agreementTips: [
      'Revisar el camino recorrido desde la tripartita',
      'Identificar prácticas incorporadas',
      'Reconocer brechas a reforzar',
      'Establecer recomendaciones de sostenibilidad',
    ],
    reportTips: [
      'Esta sesión alimenta el Informe Final',
      'Documentar el punto de cierre vs punto de partida',
      'Registrar prácticas organizacionales incorporadas',
      'Definir recomendaciones para sostener aprendizajes',
    ],
  },
];

// Guidance para coaching individual (sesión 4 es Reflexión, no Observada)
export const SESSION_GUIDANCE_INDIVIDUAL: SessionGuidance[] = SESSION_GUIDANCE.map(g => {
  if (g.sessionNumber === 4) {
    return {
      ...g,
      title: 'Sesión de Reflexión',
      description: 'Reflexión y consolidación de aprendizajes',
      isSpecial: false,
      agreementTips: [
        'Generar anclaje con la sesión anterior',
        'Reflexionar sobre el progreso del proceso',
        'Identificar patrones de aprendizaje',
        'Consolidar prácticas que están funcionando',
      ],
      reportTips: [
        'Documentar reflexiones del coachee',
        'Registrar patrones identificados',
        'Capturar insights significativos',
      ],
    };
  }
  return g;
});

// Helper para obtener guía según número de sesión y tipo de coaching
export function getSessionGuidance(sessionNumber: number, coachingType: CoachingType = 'corporate'): SessionGuidance | undefined {
  const guidance = coachingType === 'individual' ? SESSION_GUIDANCE_INDIVIDUAL : SESSION_GUIDANCE;
  return guidance.find(g => g.sessionNumber === sessionNumber);
}

// ============ FIELD PLACEHOLDERS (Placeholders Mejorados) ============

export const FIELD_PLACEHOLDERS = {
  sessionAgreement: {
    previousSessionLink: 'Describe cómo conecta esta sesión con la anterior o la reunión tripartita. ¿Qué tareas quedaron pendientes? ¿Qué se trabajó anteriormente?',
    sessionFocus: '¿Qué se trabajará en la sesión y por qué es relevante para el proceso? ¿Cuál es el tema principal o desafío a abordar?',
    relevanceToProcess: '¿Cómo se conecta este tema con los objetivos generales del programa de coaching?',
    practicesOrCompetencies: 'Baja el objetivo a prácticas o competencias observables. ¿Qué conductas concretas se trabajarán?',
    sessionIndicators: '¿Cómo sabremos que la sesión fue exitosa? Define indicadores particulares para esta sesión.',
    learningContext: 'Contexto para las experiencias de aprendizaje. ¿En qué situaciones o ejercicios se practicará?',
  },
  sessionReport: {
    sessionTopic: 'Tema central y prácticas elegidas para trabajar. ¿Qué se abordó en la sesión?',
    previousSessionLink: 'Articulación del puente con la sesión anterior. ¿Cómo se conectó lo vivido con lo nuevo?',
    practiceContext: 'Contextos o circunstancias donde se trabaja la práctica. ¿En qué situaciones aplica?',
    progressIndicators: 'Indicadores de avance observados. ¿Cómo evidenciamos el progreso?',
    discoveriesAndLearnings: 'Descubrimientos y aprendizajes de la sesión. ¿Qué insights surgieron?',
    tasksForNextSession: 'Tareas propuestas para la próxima sesión. ¿Qué debe practicar el coachee?',
    observations: 'Observaciones adicionales del coach sobre la sesión.',
  },
  processReport: {
    centralThemes: 'Temas centrales que se están tratando en el proceso. ¿Cuáles son los hilos conductores?',
    conservativeForces: 'Aspectos que resisten el cambio. ¿Qué mantiene al coachee en su zona de confort?',
    transformativeForces: 'Aspectos que impulsan el cambio. ¿Qué recursos tiene el coachee para transformarse?',
    systemConservative: 'Contexto organizacional que resiste. ¿Qué aspectos del sistema dificultan el cambio?',
    systemTransformative: 'Contexto organizacional que impulsa. ¿Qué aspectos del sistema facilitan el cambio?',
    relevantDiscoveries: 'Descubrimientos relevantes del proceso hasta ahora.',
  },
  finalReport: {
    startingPointData: 'Referencia a los 3 aspectos de la reunión tripartita que marcaron el punto de partida.',
    closingAspects: '3 aspectos del coachee que hacen visible el punto de cierre del proceso.',
    incorporatedPractices: 'Prácticas organizacionales que el coachee ha adoptado.',
    gapsToReinforce: 'Áreas o brechas que el coachee debiera reforzar a futuro.',
    sustainabilityRecommendations: 'Recomendaciones para sostener los aprendizajes en el tiempo.',
  },
};

// ============ FIELD TOOLTIPS (Tooltips para Labels) ============

export const FIELD_TOOLTIPS = {
  sessionAgreement: {
    previousSessionLink: 'El enganche permite dar continuidad al proceso. En la sesión 1, conecta con la reunión tripartita. En sesiones posteriores, conecta con lo trabajado previamente.',
    sessionFocus: 'Define claramente qué se trabajará. Debe estar alineado con los objetivos del programa.',
    relevanceToProcess: 'Explica por qué este tema es importante dentro del contexto general del coaching.',
    practicesOrCompetencies: 'Integra el objetivo con los objetivos del proceso, bajándolo a conductas observables que se puedan practicar.',
    sessionIndicators: 'Indicadores específicos para esta sesión. ¿Qué señales mostrarán que se avanzó?',
    learningContext: 'Situaciones reales o simuladas donde el coachee puede practicar lo aprendido.',
  },
  sessionReport: {
    sessionTopic: '¿Qué prácticas se eligieron para trabajar en esta sesión?',
    previousSessionLink: '¿Cómo se conecta esta sesión con la anterior?',
    practiceContext: '¿En qué circunstancias concretas se trabaja la práctica?',
    progressIndicators: '¿Cómo evidenciamos el progreso del coachee?',
    discoveriesAndLearnings: '¿Qué aprendizajes surgieron durante la sesión?',
    tasksForNextSession: '¿Qué tareas o ejercicios se proponen para antes de la próxima sesión?',
  },
  processReport: {
    conservativeForces: 'Fuerzas que mantienen el status quo en el coachee.',
    transformativeForces: 'Fuerzas que impulsan el desarrollo y cambio en el coachee.',
    systemConservative: 'Elementos del contexto organizacional que resisten el cambio.',
    systemTransformative: 'Elementos del contexto organizacional que facilitan el cambio.',
  },
  finalReport: {
    startingPointData: 'Los 3 aspectos de la reunión tripartita que definieron el punto de partida.',
    closingAspects: '3 aspectos observables que evidencian el cierre exitoso del proceso.',
    incorporatedPractices: 'Nuevas prácticas que el coachee ha integrado a su desempeño.',
    gapsToReinforce: 'Áreas de oportunidad que quedaron pendientes o requieren seguimiento.',
  },
};

// ============ COACHEE PROGRESS REPORT ============

export interface SessionSummary {
  id: string;
  sessionNumber: number;
  date: Timestamp;
  status: SessionStatus;
  topic?: string;
}

export interface ToolSummary {
  id: string;
  name: string;
  completedAt?: Timestamp;
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface GoalSummary {
  id: string;
  title: string;
  progress: number;
  status: string;
}

export interface CoacheeProgressReport {
  coachee: {
    id: string;
    name: string;
    email: string;
  };
  program?: {
    id: string;
    name: string;
    startDate: Timestamp;
    status: string;
    progress: number;  // porcentaje
  };
  sessions: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
    list: SessionSummary[];
  };
  tools: {
    total: number;
    completed: number;
    list: ToolSummary[];
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
    list: GoalSummary[];
  };
  generatedAt: Timestamp;
}
