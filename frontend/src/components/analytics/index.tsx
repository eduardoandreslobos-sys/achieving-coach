'use client';

import GoogleAnalytics from './GoogleAnalytics';
import Hotjar from './Hotjar';
import MicrosoftClarity from './MicrosoftClarity';
import Contentsquare from './Contentsquare';

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
      <Contentsquare />
    </>
  );
}

// Re-export individual components for granular control
export { GoogleAnalytics, Hotjar, MicrosoftClarity, Contentsquare };

// Re-export event utilities
export { hotjarEvents } from './Hotjar';
export { clarityEvents } from './MicrosoftClarity';
