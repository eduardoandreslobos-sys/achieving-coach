'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';

export default function Hotjar() {
  const { siteId, version } = analyticsConfig.hotjar;

  if (!siteId) return null;

  return (
    <Script id="hotjar" strategy="afterInteractive">
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${siteId},hjsv:${version}};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
  );
}

// Hotjar event tracking utilities
export const hotjarEvents = {
  // Identify user for session recordings
  identify: (userId: string, attributes?: Record<string, string | number | boolean>) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('identify', userId, attributes);
    }
  },

  // Tag a recording
  tagRecording: (tags: string[]) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('tagRecording', tags);
    }
  },

  // Trigger an event
  event: (eventName: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('event', eventName);
    }
  },

  // Trigger a feedback poll
  trigger: (surveyId: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('trigger', surveyId);
    }
  },

  // Update state (useful for SPAs)
  stateChange: (relativePath: string) => {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('stateChange', relativePath);
    }
  },
};

// Type declaration for Hotjar
declare global {
  interface Window {
    hj?: (...args: any[]) => void;
  }
}
