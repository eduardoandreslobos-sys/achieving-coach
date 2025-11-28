import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up - Start Your Free Trial | AchievingCoach',
  description: 'Create your free AchievingCoach account today. Get instant access to 10+ professional coaching tools, client management, and progress tracking. No credit card required for 14-day trial.',
  keywords: [
    'coaching platform sign up',
    'create coaching account',
    'free coaching tools trial',
    'coaching software free trial',
    'register coaching platform',
    'coaching account setup'
  ],
  openGraph: {
    title: 'Sign Up for AchievingCoach - 14-Day Free Trial',
    description: 'Start transforming your coaching practice today. No credit card required.',
    images: ['/og-signup.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://achievingcoach.com/sign-up',
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
