import { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';

export const metadata: Metadata = generateMetadata({
  title: 'Coaching Resources, Guides & Best Practices',
  description: 'Expert coaching articles, how-to guides, and best practices for professional coaches. ICF competencies, client management, business growth tips, and more.',
  keywords: [
    'coaching blog',
    'coaching resources',
    'coaching best practices',
    'ICF coaching guides',
    'professional coaching tips',
    'coaching business growth',
  ],
  path: '/blog',
});
