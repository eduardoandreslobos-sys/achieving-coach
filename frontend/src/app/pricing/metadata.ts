import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Pricing Plans - Start at $25/month',
  description: 'Affordable coaching platform pricing from $25/month. Core, Pro, and Organization plans. 14-day free trial. No credit card required. ICF-compliant tools included.',
  keywords: [
    'coaching software pricing',
    'coaching platform cost',
    'affordable coaching tools',
    'coaching software free trial',
    'coaching platform plans',
    'professional coaching pricing',
  ],
  path: '/pricing',
});
