import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Check } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
  title: 'Pricing Plans - Start at $29/month',
  description: 'Affordable coaching platform pricing from $29/month. Core, Pro, and Organization plans. 14-day free trial. No credit card required. ICF-compliant tools included.',
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

export default function PricingPage() {
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
              <Link href="/pricing" className="text-sm text-gray-900 font-semibold">Pricing</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find the Plan That's Right for You
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start with a 14-day free trial. No credit card required.
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
