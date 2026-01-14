'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/config/analytics';

export default function Contentsquare() {
  const siteId = analyticsConfig.contentsquare.siteId;

  if (!siteId) return null;

  return (
    <Script
      src={`https://t.contentsquare.net/uxa/${siteId}.js`}
      strategy="afterInteractive"
    />
  );
}
