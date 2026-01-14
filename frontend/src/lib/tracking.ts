/**
 * Comprehensive Event Tracking Library
 * Supports GA4, Hotjar, and Clarity
 */

import { hotjarEvents } from '@/components/analytics/Hotjar';
import { clarityEvents } from '@/components/analytics/MicrosoftClarity';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// ============================================
// Core Tracking Functions
// ============================================

/**
 * Track an event across all analytics platforms
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }

  // Hotjar event
  hotjarEvents.event(eventName);

  // Clarity tag
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        clarityEvents.setTag(key, String(value));
      }
    });
  }
};

/**
 * Track page view (for SPA navigation)
 */
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }

  // Hotjar state change for SPA
  hotjarEvents.stateChange(path);
};

/**
 * Identify user across platforms
 */
export const identifyUser = (
  userId: string,
  traits?: {
    email?: string;
    name?: string;
    role?: 'coach' | 'coachee' | 'admin';
    plan?: string;
    createdAt?: string;
  }
) => {
  // GA4 User ID
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-9J43WG4NL7', {
      user_id: userId,
    });
    window.gtag('set', 'user_properties', {
      user_role: traits?.role,
      subscription_plan: traits?.plan,
    });
  }

  // Hotjar identify
  hotjarEvents.identify(userId, traits as Record<string, string | number | boolean>);

  // Clarity identify
  clarityEvents.identify(userId);
  if (traits?.role) {
    clarityEvents.setTag('user_role', traits.role);
  }
  if (traits?.plan) {
    clarityEvents.setTag('subscription_plan', traits.plan);
  }
};

// ============================================
// E-commerce / Conversion Tracking
// ============================================

export const trackSignUp = (method: string, userRole: string) => {
  trackEvent('sign_up', { method, user_role: userRole });
  hotjarEvents.tagRecording(['signup', userRole]);
};

export const trackLogin = (method: string) => {
  trackEvent('login', { method });
};

export const trackPurchase = (
  transactionId: string,
  value: number,
  currency: string = 'USD',
  planName: string
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: [
        {
          item_id: planName.toLowerCase().replace(/\s+/g, '-'),
          item_name: planName,
          price: value,
          quantity: 1,
        },
      ],
    });
  }
  hotjarEvents.tagRecording(['purchase', planName]);
  clarityEvents.upgrade('purchase');
};

export const trackTrialStart = (planName: string) => {
  trackEvent('trial_start', { plan_name: planName });
  hotjarEvents.tagRecording(['trial', planName]);
};

// ============================================
// Tool Engagement Tracking
// ============================================

export const trackToolStarted = (toolId: string, toolName: string) => {
  trackEvent('tool_started', { tool_id: toolId, tool_name: toolName });
  hotjarEvents.tagRecording(['tool', toolId]);
  clarityEvents.setTag('current_tool', toolId);
};

export const trackToolCompleted = (
  toolId: string,
  toolName: string,
  durationSeconds?: number,
  completionRate?: number
) => {
  trackEvent('tool_completed', {
    tool_id: toolId,
    tool_name: toolName,
    duration_seconds: durationSeconds,
    completion_rate: completionRate,
  });
};

export const trackToolAbandoned = (
  toolId: string,
  toolName: string,
  progressPercent: number
) => {
  trackEvent('tool_abandoned', {
    tool_id: toolId,
    tool_name: toolName,
    progress_percent: progressPercent,
  });
};

// ============================================
// Session & Coaching Tracking
// ============================================

export const trackSessionBooked = (sessionType: string, coachId?: string) => {
  trackEvent('session_booked', { session_type: sessionType, coach_id: coachId });
};

export const trackSessionCompleted = (
  sessionId: string,
  durationMinutes: number,
  sessionType: string
) => {
  trackEvent('session_completed', {
    session_id: sessionId,
    duration_minutes: durationMinutes,
    session_type: sessionType,
  });
};

export const trackSessionCancelled = (sessionId: string, reason?: string) => {
  trackEvent('session_cancelled', { session_id: sessionId, cancellation_reason: reason });
};

// ============================================
// Engagement Tracking
// ============================================

export const trackMessageSent = (conversationType: 'coach' | 'coachee') => {
  trackEvent('message_sent', { conversation_type: conversationType });
};

export const trackGoalCreated = (goalType?: string) => {
  trackEvent('goal_created', { goal_type: goalType });
};

export const trackGoalCompleted = (goalId: string, daysToComplete?: number) => {
  trackEvent('goal_completed', { goal_id: goalId, days_to_complete: daysToComplete });
};

export const trackReflectionCreated = () => {
  trackEvent('reflection_created', {});
};

export const trackCoacheeInvited = () => {
  trackEvent('coachee_invited', {});
};

export const trackCoacheeJoined = (inviteSource: string) => {
  trackEvent('coachee_joined', { invite_source: inviteSource });
};

// ============================================
// Content Engagement
// ============================================

export const trackBlogPostViewed = (slug: string, category?: string) => {
  trackEvent('blog_post_viewed', { post_slug: slug, category: category });
};

export const trackResourceDownloaded = (resourceName: string, resourceType: string) => {
  trackEvent('resource_downloaded', { resource_name: resourceName, resource_type: resourceType });
};

export const trackVideoPlayed = (videoId: string, videoTitle: string) => {
  trackEvent('video_played', { video_id: videoId, video_title: videoTitle });
};

// ============================================
// Scroll Depth Tracking
// ============================================

let scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };

export const initScrollTracking = () => {
  if (typeof window === 'undefined') return;

  // Reset on page change
  scrollDepthTracked = { 25: false, 50: false, 75: false, 100: false };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    const thresholds = [25, 50, 75, 100] as const;
    thresholds.forEach((threshold) => {
      if (scrollPercent >= threshold && !scrollDepthTracked[threshold]) {
        scrollDepthTracked[threshold] = true;
        trackEvent('scroll_depth', {
          percent: threshold,
          page_path: window.location.pathname,
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// ============================================
// Time on Page Tracking
// ============================================

let pageStartTime: number;

export const startTimeTracking = () => {
  pageStartTime = Date.now();
};

export const trackTimeOnPage = () => {
  if (pageStartTime) {
    const timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
    trackEvent('time_on_page', {
      seconds: timeSpent,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
    });
  }
};

// ============================================
// Error Tracking
// ============================================

export const trackError = (
  errorMessage: string,
  errorSource: string,
  errorStack?: string
) => {
  trackEvent('error_occurred', {
    error_message: errorMessage.substring(0, 100),
    error_source: errorSource,
    error_stack: errorStack?.substring(0, 200),
  });
};

// ============================================
// Feature Flag / Experiment Tracking
// ============================================

export const trackExperimentViewed = (experimentId: string, variant: string) => {
  trackEvent('experiment_viewed', {
    experiment_id: experimentId,
    variant: variant,
  });
};

// ============================================
// Search Tracking
// ============================================

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }
};
