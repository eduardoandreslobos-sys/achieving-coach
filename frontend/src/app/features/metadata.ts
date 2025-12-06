import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Coaching Platform Features & Tools',
  description: 'Professional coaching tools including ICF competency evaluation, client progress tracking, session management, and analytics dashboard. ICF-compliant coaching software.',
  keywords: [
    'coaching tools',
    'ICF competency evaluation',
    'client progress tracking',
    'coaching session management',
    'coaching analytics',
    'professional coaching software',
    'coaching platform features',
  ],
  path: '/features',
});
