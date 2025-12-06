import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Enterprise Coaching Platform for Organizations',
  description: 'Scale your organizational coaching programs with enterprise features: multi-coach management, ROI analytics, compliance tracking, and dedicated support.',
  keywords: [
    'enterprise coaching platform',
    'organizational coaching software',
    'corporate coaching tools',
    'coaching program management',
    'coaching ROI tracking',
    'team coaching platform',
  ],
  path: '/organizations',
});
