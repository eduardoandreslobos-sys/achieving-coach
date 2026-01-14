'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';

export default function MicrosoftClarity() {
  const projectId = analyticsConfig.clarity.projectId;

  if (!projectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${projectId}");
      `}
    </Script>
  );
}

// Clarity utilities
export const clarityEvents = {
  // Set custom tags for the session
  setTag: (key: string, value: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('set', key, value);
    }
  },

  // Identify a user
  identify: (customId: string, customSessionId?: string, customPageId?: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('identify', customId, customSessionId, customPageId);
    }
  },

  // Consent management
  consent: () => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('consent');
    }
  },

  // Upgrade session priority
  upgrade: (reason: string) => {
    if (typeof window !== 'undefined' && window.clarity) {
      window.clarity('upgrade', reason);
    }
  },
};

declare global {
  interface Window {
    clarity?: (...args: any[]) => void;
  }
}
