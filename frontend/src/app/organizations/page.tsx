import { Metadata } from 'next';
import Link from 'next/link';
import { Target } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
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

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/organizations" className="text-sm text-gray-900 font-semibold">For Organizations</Link>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
              <Link href="/contact" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Scale Your Coaching Impact and Prove the ROI
          </h1>
          <p className="text-lg text-gray-600">
            Enterprise coaching platform for organizations
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2024 AchievingCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
