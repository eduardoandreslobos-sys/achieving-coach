import { PlanTier } from './subscription';

// Feature SKUs - unique identifiers for each feature
export type FeatureSKU =
  // Client Management
  | 'clients.manage'
  | 'clients.unlimited'
  | 'clients.portal'
  | 'clients.digital_signatures'

  // Sessions
  | 'sessions.scheduling'
  | 'sessions.calendar_sync'
  | 'sessions.reminders'
  | 'sessions.notes'

  // Coaching Tools
  | 'tools.basic' // 10 tools
  | 'tools.full_library' // 12+ tools
  | 'tools.wheel_of_life'
  | 'tools.disc_assessment'
  | 'tools.grow_framework'
  | 'tools.smart_goals'
  | 'tools.values_clarification'
  | 'tools.limiting_beliefs'
  | 'tools.stakeholder_mapping'
  | 'tools.resilience_scale'
  | 'tools.emotional_trigger'
  | 'tools.feedback_feedforward'
  | 'tools.habit_loop'
  | 'tools.career_compass'

  // ICF Simulator
  | 'icf_simulator.access'
  | 'icf_simulator.ai_feedback'

  // Analytics
  | 'analytics.basic'
  | 'analytics.advanced'
  | 'analytics.ai_insights'
  | 'analytics.automated_reports'
  | 'analytics.roi_metrics'

  // CRM
  | 'crm.leads'
  | 'crm.pipeline'
  | 'crm.bant'
  | 'crm.activities'

  // Directory
  | 'directory.profile'
  | 'directory.featured'
  | 'directory.inquiries'

  // Messaging
  | 'messaging.basic'
  | 'messaging.unlimited'

  // Branding
  | 'branding.custom'
  | 'branding.white_label'

  // Support
  | 'support.email'
  | 'support.priority'
  | 'support.dedicated_manager'

  // Enterprise
  | 'enterprise.multi_coach'
  | 'enterprise.sso'
  | 'enterprise.api_access'
  | 'enterprise.custom_integrations'
  | 'enterprise.sla';

// Feature metadata
export interface FeatureDefinition {
  sku: FeatureSKU;
  name: string;
  description: string;
  category: FeatureCategory;
}

export type FeatureCategory =
  | 'clients'
  | 'sessions'
  | 'tools'
  | 'icf_simulator'
  | 'analytics'
  | 'crm'
  | 'directory'
  | 'messaging'
  | 'branding'
  | 'support'
  | 'enterprise';

// Features available per plan
export const PLAN_FEATURES: Record<PlanTier, FeatureSKU[]> = {
  core: [
    // Client Management (up to 15)
    'clients.manage',

    // Sessions
    'sessions.scheduling',
    'sessions.calendar_sync',
    'sessions.reminders',
    'sessions.notes',

    // Basic Tools (10)
    'tools.basic',
    'tools.wheel_of_life',
    'tools.grow_framework',
    'tools.smart_goals',
    'tools.values_clarification',
    'tools.limiting_beliefs',
    'tools.stakeholder_mapping',
    'tools.resilience_scale',
    'tools.emotional_trigger',
    'tools.feedback_feedforward',

    // Basic Analytics
    'analytics.basic',

    // Basic Messaging
    'messaging.basic',

    // Email Support
    'support.email',
  ],

  pro: [
    // All Core features plus...

    // Client Management (unlimited)
    'clients.manage',
    'clients.unlimited',
    'clients.portal',
    'clients.digital_signatures',

    // Sessions (all)
    'sessions.scheduling',
    'sessions.calendar_sync',
    'sessions.reminders',
    'sessions.notes',

    // Full Tool Library (12+)
    'tools.basic',
    'tools.full_library',
    'tools.wheel_of_life',
    'tools.disc_assessment',
    'tools.grow_framework',
    'tools.smart_goals',
    'tools.values_clarification',
    'tools.limiting_beliefs',
    'tools.stakeholder_mapping',
    'tools.resilience_scale',
    'tools.emotional_trigger',
    'tools.feedback_feedforward',
    'tools.habit_loop',
    'tools.career_compass',

    // ICF Simulator
    'icf_simulator.access',
    'icf_simulator.ai_feedback',

    // Advanced Analytics
    'analytics.basic',
    'analytics.advanced',
    'analytics.ai_insights',
    'analytics.automated_reports',

    // CRM
    'crm.leads',
    'crm.pipeline',
    'crm.bant',
    'crm.activities',

    // Directory
    'directory.profile',
    'directory.inquiries',

    // Full Messaging
    'messaging.basic',
    'messaging.unlimited',

    // Custom Branding
    'branding.custom',

    // Priority Support
    'support.email',
    'support.priority',
  ],

  enterprise: [
    // All Pro features plus...

    // Client Management (unlimited)
    'clients.manage',
    'clients.unlimited',
    'clients.portal',
    'clients.digital_signatures',

    // Sessions (all)
    'sessions.scheduling',
    'sessions.calendar_sync',
    'sessions.reminders',
    'sessions.notes',

    // Full Tool Library
    'tools.basic',
    'tools.full_library',
    'tools.wheel_of_life',
    'tools.disc_assessment',
    'tools.grow_framework',
    'tools.smart_goals',
    'tools.values_clarification',
    'tools.limiting_beliefs',
    'tools.stakeholder_mapping',
    'tools.resilience_scale',
    'tools.emotional_trigger',
    'tools.feedback_feedforward',
    'tools.habit_loop',
    'tools.career_compass',

    // ICF Simulator
    'icf_simulator.access',
    'icf_simulator.ai_feedback',

    // Full Analytics
    'analytics.basic',
    'analytics.advanced',
    'analytics.ai_insights',
    'analytics.automated_reports',
    'analytics.roi_metrics',

    // Full CRM
    'crm.leads',
    'crm.pipeline',
    'crm.bant',
    'crm.activities',

    // Featured Directory
    'directory.profile',
    'directory.featured',
    'directory.inquiries',

    // Full Messaging
    'messaging.basic',
    'messaging.unlimited',

    // Full Branding
    'branding.custom',
    'branding.white_label',

    // Full Support
    'support.email',
    'support.priority',
    'support.dedicated_manager',

    // Enterprise Features
    'enterprise.multi_coach',
    'enterprise.sso',
    'enterprise.api_access',
    'enterprise.custom_integrations',
    'enterprise.sla',
  ],
};

// Plan limits
export interface PlanLimits {
  maxClients: number | null; // null = unlimited
  maxSessionsPerMonth: number | null;
  maxToolsAccess: number | null;
  maxStorageGB: number | null;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  core: {
    maxClients: 15,
    maxSessionsPerMonth: null, // unlimited
    maxToolsAccess: 10,
    maxStorageGB: 5,
  },
  pro: {
    maxClients: null, // unlimited
    maxSessionsPerMonth: null,
    maxToolsAccess: null, // all tools
    maxStorageGB: 50,
  },
  enterprise: {
    maxClients: null,
    maxSessionsPerMonth: null,
    maxToolsAccess: null,
    maxStorageGB: null, // unlimited
  },
};

// Feature definitions for UI
export const FEATURE_DEFINITIONS: Record<FeatureSKU, FeatureDefinition> = {
  // Client Management
  'clients.manage': {
    sku: 'clients.manage',
    name: 'Gestión de Clientes',
    description: 'Administra perfiles y progreso de tus coachees',
    category: 'clients',
  },
  'clients.unlimited': {
    sku: 'clients.unlimited',
    name: 'Clientes Ilimitados',
    description: 'Sin límite en el número de clientes activos',
    category: 'clients',
  },
  'clients.portal': {
    sku: 'clients.portal',
    name: 'Portal del Cliente',
    description: 'Espacio dedicado para que tus clientes accedan a ejercicios y progreso',
    category: 'clients',
  },
  'clients.digital_signatures': {
    sku: 'clients.digital_signatures',
    name: 'Firmas Digitales',
    description: 'Acuerdos de coaching con firma digital legalmente válida',
    category: 'clients',
  },

  // Sessions
  'sessions.scheduling': {
    sku: 'sessions.scheduling',
    name: 'Agendamiento de Sesiones',
    description: 'Programa y gestiona sesiones de coaching',
    category: 'sessions',
  },
  'sessions.calendar_sync': {
    sku: 'sessions.calendar_sync',
    name: 'Sincronización de Calendario',
    description: 'Integración con Google Calendar',
    category: 'sessions',
  },
  'sessions.reminders': {
    sku: 'sessions.reminders',
    name: 'Recordatorios Automáticos',
    description: 'Notificaciones automáticas para sesiones',
    category: 'sessions',
  },
  'sessions.notes': {
    sku: 'sessions.notes',
    name: 'Notas de Sesión',
    description: 'Toma notas durante las sesiones en tiempo real',
    category: 'sessions',
  },

  // Tools
  'tools.basic': {
    sku: 'tools.basic',
    name: 'Herramientas Básicas',
    description: '10 herramientas de coaching interactivas',
    category: 'tools',
  },
  'tools.full_library': {
    sku: 'tools.full_library',
    name: 'Biblioteca Completa',
    description: 'Acceso a las 12+ herramientas de coaching',
    category: 'tools',
  },
  'tools.wheel_of_life': {
    sku: 'tools.wheel_of_life',
    name: 'Rueda de la Vida',
    description: 'Evaluación visual del balance de vida',
    category: 'tools',
  },
  'tools.disc_assessment': {
    sku: 'tools.disc_assessment',
    name: 'Evaluación DISC',
    description: 'Análisis de personalidad y comportamiento',
    category: 'tools',
  },
  'tools.grow_framework': {
    sku: 'tools.grow_framework',
    name: 'Marco GROW',
    description: 'Hojas de trabajo estructuradas para sesiones',
    category: 'tools',
  },
  'tools.smart_goals': {
    sku: 'tools.smart_goals',
    name: 'Metas SMART',
    description: 'Sistema de definición y seguimiento de metas',
    category: 'tools',
  },
  'tools.values_clarification': {
    sku: 'tools.values_clarification',
    name: 'Clarificación de Valores',
    description: 'Herramienta para identificar valores personales',
    category: 'tools',
  },
  'tools.limiting_beliefs': {
    sku: 'tools.limiting_beliefs',
    name: 'Creencias Limitantes',
    description: 'Ejercicios para transformar creencias limitantes',
    category: 'tools',
  },
  'tools.stakeholder_mapping': {
    sku: 'tools.stakeholder_mapping',
    name: 'Mapeo de Stakeholders',
    description: 'Mapea relaciones clave de tus clientes',
    category: 'tools',
  },
  'tools.resilience_scale': {
    sku: 'tools.resilience_scale',
    name: 'Escala de Resiliencia',
    description: 'Mide resiliencia y potencial de crecimiento',
    category: 'tools',
  },
  'tools.emotional_trigger': {
    sku: 'tools.emotional_trigger',
    name: 'Diario de Triggers',
    description: 'Seguimiento de patrones emocionales',
    category: 'tools',
  },
  'tools.feedback_feedforward': {
    sku: 'tools.feedback_feedforward',
    name: 'Feedback-Feedforward',
    description: 'Marco estructurado de retroalimentación',
    category: 'tools',
  },
  'tools.habit_loop': {
    sku: 'tools.habit_loop',
    name: 'Analizador de Hábitos',
    description: 'Comprende y transforma patrones de comportamiento',
    category: 'tools',
  },
  'tools.career_compass': {
    sku: 'tools.career_compass',
    name: 'Brújula de Carrera',
    description: 'Herramienta de navegación y planificación de carrera',
    category: 'tools',
  },

  // ICF Simulator
  'icf_simulator.access': {
    sku: 'icf_simulator.access',
    name: 'Simulador ICF',
    description: 'Practica las 8 competencias core de ICF',
    category: 'icf_simulator',
  },
  'icf_simulator.ai_feedback': {
    sku: 'icf_simulator.ai_feedback',
    name: 'Feedback con IA',
    description: 'Retroalimentación detallada generada por IA',
    category: 'icf_simulator',
  },

  // Analytics
  'analytics.basic': {
    sku: 'analytics.basic',
    name: 'Analíticas Básicas',
    description: 'Dashboard con métricas esenciales',
    category: 'analytics',
  },
  'analytics.advanced': {
    sku: 'analytics.advanced',
    name: 'Analíticas Avanzadas',
    description: 'Métricas detalladas y KPIs personalizados',
    category: 'analytics',
  },
  'analytics.ai_insights': {
    sku: 'analytics.ai_insights',
    name: 'Insights con IA',
    description: 'Sugerencias automáticas basadas en análisis de sesiones',
    category: 'analytics',
  },
  'analytics.automated_reports': {
    sku: 'analytics.automated_reports',
    name: 'Reportes Automatizados',
    description: 'Genera reportes profesionales automáticamente',
    category: 'analytics',
  },
  'analytics.roi_metrics': {
    sku: 'analytics.roi_metrics',
    name: 'Métricas de ROI',
    description: 'Demuestra el impacto del coaching con métricas',
    category: 'analytics',
  },

  // CRM
  'crm.leads': {
    sku: 'crm.leads',
    name: 'Gestión de Leads',
    description: 'Administra prospectos y oportunidades',
    category: 'crm',
  },
  'crm.pipeline': {
    sku: 'crm.pipeline',
    name: 'Pipeline de Ventas',
    description: 'Visualiza y gestiona tu embudo de ventas',
    category: 'crm',
  },
  'crm.bant': {
    sku: 'crm.bant',
    name: 'Calificación BANT',
    description: 'Califica leads con el framework BANT',
    category: 'crm',
  },
  'crm.activities': {
    sku: 'crm.activities',
    name: 'Actividades y Tareas',
    description: 'Registra actividades y programa seguimientos',
    category: 'crm',
  },

  // Directory
  'directory.profile': {
    sku: 'directory.profile',
    name: 'Perfil en Directorio',
    description: 'Aparece en el directorio público de coaches',
    category: 'directory',
  },
  'directory.featured': {
    sku: 'directory.featured',
    name: 'Perfil Destacado',
    description: 'Mayor visibilidad en el directorio',
    category: 'directory',
  },
  'directory.inquiries': {
    sku: 'directory.inquiries',
    name: 'Recibir Consultas',
    description: 'Recibe mensajes de potenciales clientes',
    category: 'directory',
  },

  // Messaging
  'messaging.basic': {
    sku: 'messaging.basic',
    name: 'Mensajería Básica',
    description: 'Comunícate con tus coachees',
    category: 'messaging',
  },
  'messaging.unlimited': {
    sku: 'messaging.unlimited',
    name: 'Mensajería Ilimitada',
    description: 'Sin límites en mensajes',
    category: 'messaging',
  },

  // Branding
  'branding.custom': {
    sku: 'branding.custom',
    name: 'Branding Personalizado',
    description: 'Personaliza colores y logo',
    category: 'branding',
  },
  'branding.white_label': {
    sku: 'branding.white_label',
    name: 'White Label',
    description: 'Elimina la marca de AchievingCoach',
    category: 'branding',
  },

  // Support
  'support.email': {
    sku: 'support.email',
    name: 'Soporte por Email',
    description: 'Soporte técnico por correo electrónico',
    category: 'support',
  },
  'support.priority': {
    sku: 'support.priority',
    name: 'Soporte Prioritario',
    description: 'Respuesta prioritaria en menos de 24 horas',
    category: 'support',
  },
  'support.dedicated_manager': {
    sku: 'support.dedicated_manager',
    name: 'Account Manager',
    description: 'Gerente de cuenta dedicado',
    category: 'support',
  },

  // Enterprise
  'enterprise.multi_coach': {
    sku: 'enterprise.multi_coach',
    name: 'Multi-Coach',
    description: 'Gestiona múltiples coaches en una organización',
    category: 'enterprise',
  },
  'enterprise.sso': {
    sku: 'enterprise.sso',
    name: 'SSO',
    description: 'Single Sign-On con tu proveedor de identidad',
    category: 'enterprise',
  },
  'enterprise.api_access': {
    sku: 'enterprise.api_access',
    name: 'Acceso API',
    description: 'Integra con tus sistemas via API',
    category: 'enterprise',
  },
  'enterprise.custom_integrations': {
    sku: 'enterprise.custom_integrations',
    name: 'Integraciones Custom',
    description: 'Integraciones personalizadas para tu organización',
    category: 'enterprise',
  },
  'enterprise.sla': {
    sku: 'enterprise.sla',
    name: 'SLA Garantizado',
    description: 'Acuerdo de nivel de servicio garantizado',
    category: 'enterprise',
  },
};

// Helper functions
// TODO: Revertir a 'false' cuando Stripe esté activo en producción
// Temporalmente se otorga acceso Pro a todos los coaches para fase de testing
const DEFAULT_PLAN_WHEN_NO_SUBSCRIPTION: PlanTier = 'pro';

export function hasFeature(planId: PlanTier | null, feature: FeatureSKU): boolean {
  const effectivePlan = planId || DEFAULT_PLAN_WHEN_NO_SUBSCRIPTION;
  return PLAN_FEATURES[effectivePlan]?.includes(feature) || false;
}

export function getPlanLimit(planId: PlanTier | null, limit: keyof PlanLimits): number | null {
  const effectivePlan = planId || DEFAULT_PLAN_WHEN_NO_SUBSCRIPTION;
  return PLAN_LIMITS[effectivePlan]?.[limit] ?? null;
}

export function getFeaturesByCategory(
  planId: PlanTier,
  category: FeatureCategory
): FeatureDefinition[] {
  const planFeatures = PLAN_FEATURES[planId] || [];
  return planFeatures
    .filter((sku) => FEATURE_DEFINITIONS[sku]?.category === category)
    .map((sku) => FEATURE_DEFINITIONS[sku]);
}

export function getMissingFeatures(
  currentPlan: PlanTier,
  targetPlan: PlanTier
): FeatureSKU[] {
  const currentFeatures = new Set(PLAN_FEATURES[currentPlan] || []);
  const targetFeatures = PLAN_FEATURES[targetPlan] || [];
  return targetFeatures.filter((feature) => !currentFeatures.has(feature));
}
