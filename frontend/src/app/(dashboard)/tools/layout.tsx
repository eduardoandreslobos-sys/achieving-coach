import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Coaching Tools - 10+ Professional Assessment & Development Tools',
  description: 'Access professional coaching tools including GROW Worksheet, DISC Assessment, Wheel of Life, Values Clarification, Career Compass, Resilience Scale, and more. ICF-aligned tools for coaches and coachees.',
  keywords: [
    'coaching tools',
    'GROW model worksheet',
    'DISC assessment online',
    'wheel of life tool',
    'values clarification exercise',
    'career coaching tools',
    'resilience assessment',
    'ICF coaching tools',
    'professional development tools',
    'coaching exercises'
  ],
  openGraph: {
    title: 'Professional Coaching Tools | AchievingCoach',
    description: '10+ professional coaching tools including GROW, DISC, Wheel of Life, and Values Clarification. Designed for ICF-certified coaches.',
    images: ['/og-tools.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com/tools',
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
