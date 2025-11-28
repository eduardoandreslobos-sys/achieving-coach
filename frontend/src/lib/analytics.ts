export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

const isGALoaded = () => typeof window !== 'undefined' && typeof window.gtag !== 'undefined';

export const pageview = (url: string) => {
  if (!isGALoaded() || !GA_TRACKING_ID) return;
  window.gtag('config', GA_TRACKING_ID, { page_path: url });
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!isGALoaded()) return;
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackSignUp = (method: string = 'email') => {
  event({ action: 'sign_up', category: 'engagement', label: method });
};

export const trackToolUsage = (toolName: string) => {
  event({ action: 'use_tool', category: 'engagement', label: toolName });
};

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}
