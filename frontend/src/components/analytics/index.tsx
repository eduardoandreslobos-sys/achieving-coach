'use client';

import GoogleAnalytics from './GoogleAnalytics';
import Hotjar from './Hotjar';
import MicrosoftClarity from './MicrosoftClarity';

/**
 * AnalyticsProvider - Loads all analytics scripts
 * Place this in your root layout for comprehensive tracking
 */
export default function AnalyticsProvider() {
  return (
    <>
      <GoogleAnalytics />
      <Hotjar />
      <MicrosoftClarity />
    </>
  );
}

// Re-export individual components for granular control
export { GoogleAnalytics, Hotjar, MicrosoftClarity };

// Re-export event utilities
export { hotjarEvents } from './Hotjar';
export { clarityEvents } from './MicrosoftClarity';
