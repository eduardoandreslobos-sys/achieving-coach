import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: 'AchievingCoach - Professional Coaching Platform for Organizations',
  description: 'Transform your coaching practice with AchievingCoach. Professional tools including GROW Model, DISC Assessment, Wheel of Life, and more. Trusted by coaches and organizations worldwide. Start your 14-day free trial.',
  keywords: [
    'coaching platform',
    'professional coaching software',
    'coaching tools',
    'GROW model',
    'DISC assessment',
    'wheel of life',
    'corporate coaching',
    'coaching management',
    'ICF coaching tools',
    'coaching SaaS'
  ],
  openGraph: {
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Professional coaching tools and client management for coaches and organizations. GROW, DISC, Wheel of Life, and 10+ tools included.',
    url: 'https://achievingcoach.com',
    siteName: 'AchievingCoach',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'AchievingCoach - Professional Coaching Platform Dashboard',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Transform your coaching practice with professional tools and client management.',
    images: ['/twitter-home.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com',
  },
};

export default function Home() {
  redirect('/dashboard');
}
