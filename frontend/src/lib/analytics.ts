// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

type EventName = 
  | 'sign_up'
  | 'login'
  | 'tool_started'
  | 'tool_completed'
  | 'session_booked'
  | 'session_completed'
  | 'coachee_invited'
  | 'coachee_joined'
  | 'message_sent'
  | 'goal_created'
  | 'goal_completed'
  | 'reflection_created'
  | 'program_started'
  | 'icf_simulation_completed';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

export const trackEvent = (eventName: EventName, params?: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
};

// Auth Events
export const trackSignUp = (method: string, userRole: string) => {
  trackEvent('sign_up', { method, user_role: userRole });
};

export const trackLogin = (method: string) => {
  trackEvent('login', { method });
};

// Tool Events
export const trackToolStarted = (toolId: string, toolName: string) => {
  trackEvent('tool_started', { tool_id: toolId, tool_name: toolName });
};

export const trackToolCompleted = (toolId: string, toolName: string, durationSeconds?: number) => {
  trackEvent('tool_completed', { tool_id: toolId, tool_name: toolName, duration_seconds: durationSeconds });
};

// Session Events
export const trackSessionBooked = (sessionType: string) => {
  trackEvent('session_booked', { session_type: sessionType });
};

export const trackSessionCompleted = (sessionId: string, durationMinutes: number) => {
  trackEvent('session_completed', { session_id: sessionId, duration_minutes: durationMinutes });
};

// Coaching Events
export const trackCoacheeInvited = () => {
  trackEvent('coachee_invited', {});
};

export const trackCoacheeJoined = (coachId: string) => {
  trackEvent('coachee_joined', { coach_id: coachId });
};

export const trackProgramStarted = (programId: string) => {
  trackEvent('program_started', { program_id: programId });
};

// Engagement Events
export const trackMessageSent = () => {
  trackEvent('message_sent', {});
};

export const trackGoalCreated = () => {
  trackEvent('goal_created', {});
};

export const trackGoalCompleted = (goalId: string) => {
  trackEvent('goal_completed', { goal_id: goalId });
};

export const trackReflectionCreated = () => {
  trackEvent('reflection_created', {});
};

export const trackICFSimulationCompleted = (score: number, competency: string) => {
  trackEvent('icf_simulation_completed', { score, competency });
};
