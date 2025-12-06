import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'About Us - Professional Coaching Platform',
  description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools, our journey since 2021, and our commitment to ICF standards.',
  keywords: [
    'about achievingcoach',
    'coaching platform company',
    'professional coaching software',
    'ICF compliant platform',
    'coaching technology',
  ],
  path: '/about',
});
