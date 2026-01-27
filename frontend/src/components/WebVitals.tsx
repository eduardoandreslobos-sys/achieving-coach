'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Core Web Vitals metrics
type MetricType = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

interface WebVitalsMetric {
  id: string;
  name: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
}

// Thresholds for 2026 Core Web Vitals
const thresholds: Record<MetricType, { good: number; poor: number }> = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 }, // New metric replacing FID
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: MetricType, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value.toFixed(metric.name === 'CLS' ? 3 : 0),
      rating: metric.rating,
      delta: metric.delta.toFixed(2),
    });
  }
}

export default function WebVitals() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      const handleMetric = (metric: { name: string; id: string; value: number; delta: number; navigationType: string }) => {
        const webVitalsMetric: WebVitalsMetric = {
          id: metric.id,
          name: metric.name as MetricType,
          value: metric.value,
          rating: getRating(metric.name as MetricType, metric.value),
          delta: metric.delta,
          navigationType: metric.navigationType,
        };
        sendToAnalytics(webVitalsMetric);
      };

      // Register all Core Web Vitals (2026)
      // Note: FID was replaced by INP as of March 2024
      onCLS(handleMetric);
      onFCP(handleMetric);
      onINP(handleMetric); // Primary metric for interactivity (replaced FID)
      onLCP(handleMetric);
      onTTFB(handleMetric);
    });
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
