import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Check, X } from 'lucide-react';
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
      {/* Navigation */}
      <nav className="border-b border-gray-100" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="AchievingCoach Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-900 font-semibold" aria-current="page">Pricing</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700" aria-label="Start free trial">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 bg-white" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="hero-heading" className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6 bg-gray-50" aria-labelledby="plans-heading">
        <div className="max-w-7xl mx-auto">
          <h2 id="plans-heading" className="sr-only">Pricing Plans</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Core Plan */}
            <article className="bg-white rounded-xl border border-gray-200 p-8">
              <header className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Core</h3>
                <p className="text-gray-600 text-sm">Essential tools for solo coaches</p>
              </header>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
              </div>
              <Link 
                href="/sign-up" 
                className="block w-full px-6 py-3 bg-gray-100 text-gray-900 text-center font-semibold rounded-lg hover:bg-gray-200 transition-colors mb-6"
                aria-label="Start Core plan free trial"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Up to 15 clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Session management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">10 coaching tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Basic analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-400 text-sm">ICF Simulator</span>
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-400 text-sm">Advanced analytics</span>
                </li>
              </ul>
            </article>

            {/* Pro Plan */}
            <article className="bg-white rounded-xl border-2 border-primary-600 p-8 relative shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <header className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
                <p className="text-gray-600 text-sm">Advanced features for growing practices</p>
              </header>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">$59</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Billed monthly</p>
              </div>
              <Link 
                href="/sign-up" 
                className="block w-full px-6 py-3 bg-primary-600 text-white text-center font-semibold rounded-lg hover:bg-primary-700 transition-colors mb-6"
                aria-label="Start Pro plan free trial"
              >
                Start Free Trial
              </Link>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Unlimited clients</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">All Core features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">15+ coaching tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">ICF Simulator access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Custom branding</span>
                </li>
              </ul>
            </article>

            {/* Organization Plan */}
            <article className="bg-white rounded-xl border border-gray-200 p-8">
              <header className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Organization</h3>
                <p className="text-gray-600 text-sm">For coaching firms and enterprises</p>
              </header>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Contact for pricing</p>
              </div>
              <Link 
                href="/contact" 
                className="block w-full px-6 py-3 bg-gray-100 text-gray-900 text-center font-semibold rounded-lg hover:bg-gray-200 transition-colors mb-6"
                aria-label="Contact sales for Organization plan"
              >
                Contact Sales
              </Link>
              <ul className="space-y-3" role="list">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">All Pro features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Multi-coach management</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Team analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">SSO integration</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">Custom integrations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-gray-700 text-sm">SLA guarantee</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </header>

          <div className="space-y-6">
            <article className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.
              </p>
            </article>

            <article className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and PayPal for monthly subscriptions.
              </p>
            </article>

            <article className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a long-term contract?</h3>
              <p className="text-gray-600">
                No contracts required. All plans are month-to-month and you can cancel anytime. No questions asked.
              </p>
            </article>

            <article className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Do you offer refunds?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join hundreds of coaches transforming their practice with AchievingCoach
          </p>
          <Link 
            href="/sign-up" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            aria-label="Start 14-day free trial"
          >
            Start Your 14-Day Free Trial
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6" role="contentinfo">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2024 AchievingCoach. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
