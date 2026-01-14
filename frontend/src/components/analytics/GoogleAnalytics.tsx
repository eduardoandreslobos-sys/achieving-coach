'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';

export default function GoogleAnalytics() {
  const GA_ID = analyticsConfig.googleAnalytics.measurementId;

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
          });

          // Enhanced measurement - scroll tracking
          gtag('config', '${GA_ID}', {
            'custom_map': {
              'dimension1': 'user_type',
              'dimension2': 'coaching_tool',
              'metric1': 'session_duration'
            }
          });
        `}
      </Script>
    </>
  );
}
