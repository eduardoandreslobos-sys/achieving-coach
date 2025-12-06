import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Contact Us - Get Support & Demos',
  description: 'Contact AchievingCoach for support, schedule a demo, or learn more about our professional coaching platform. 24-hour response time guaranteed.',
  keywords: [
    'contact achievingcoach',
    'coaching platform support',
    'schedule coaching demo',
    'coaching software inquiry',
    'customer support',
  ],
  path: '/contact',
});
