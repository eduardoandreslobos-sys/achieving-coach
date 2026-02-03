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
  
  // ===== Fases del Proceso CE =====
  
  // Fase 1: Antecedentes
  backgroundInfo?: BackgroundInfo;
  
  // Fase 2: Reunión tripartita
  tripartiteMeeting?: TripartiteMeeting;
  
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
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  
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

export const PROGRAM_PHASES = [
  { id: 1, name: 'Antecedentes', description: 'Antecedentes generales del proceso', icon: 'FileText' },
  { id: 2, name: 'Reunión Tripartita', description: 'Alineación con sponsor y RRHH', icon: 'Users' },
  { id: 3, name: 'Acuerdo', description: 'Acuerdo de coaching y firmas', icon: 'FileSignature' },
  { id: 4, name: 'Calendario', description: 'Calendarización de sesiones', icon: 'Calendar' },
  { id: 5, name: 'Sesiones 1-3', description: 'Primeras sesiones del proceso', icon: 'Play' },
  { id: 6, name: 'Reporte Proceso', description: 'Seguimiento mid-process', icon: 'ClipboardList' },
  { id: 7, name: 'Sesión Observada', description: 'Observación en contexto real', icon: 'Eye' },
  { id: 8, name: 'Sesiones 5-6', description: 'Sesiones finales', icon: 'PlayCircle' },
  { id: 9, name: 'Informe Final', description: 'Cierre del proceso', icon: 'Award' },
];

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
