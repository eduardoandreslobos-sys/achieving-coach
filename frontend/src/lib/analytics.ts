// Google Analytics 4 Event Tracking

export const GA_ID = 'G-9J43WG4NL7';

// Page view
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }
};

// Custom events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Conversion events
export const trackSignUp = () => {
  event({
    action: 'sign_up',
    category: 'engagement',
    label: 'User Registration',
  });
};

export const trackFreeTrial = () => {
  event({
    action: 'begin_trial',
    category: 'conversion',
    label: 'Free Trial Started',
  });
};

export const trackPurchase = (value: number, plan: string) => {
  event({
    action: 'purchase',
    category: 'conversion',
    label: plan,
    value: value,
  });
};

export const trackBlogRead = (title: string) => {
  event({
    action: 'blog_read',
    category: 'engagement',
    label: title,
  });
};

export const trackToolUsed = (toolName: string) => {
  event({
    action: 'tool_used',
    category: 'engagement',
    label: toolName,
  });
};

export const trackContactForm = () => {
  event({
    action: 'contact_form_submit',
    category: 'lead',
    label: 'Contact Form',
  });
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
