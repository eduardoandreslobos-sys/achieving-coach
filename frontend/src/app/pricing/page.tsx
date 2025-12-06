'use client';

import Link from 'next/link';
import { Target, CheckCircle, ArrowRight, Users, Zap, Shield, BarChart } from 'lucide-react';
import { useState } from 'react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</Link>
              <Link href="/pricing" className="text-gray-900 font-semibold">Pricing</Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Resources</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact</Link>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Log In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Find the plan that's right for you
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Powerful tools to elevate your coaching practice. No client limits.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Annual
              <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-semibold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Core Plan */}
            <PricingCard
              name="Core"
              subtitle="For individual coaches"
              price={billingCycle === 'monthly' ? '$29' : '$23'}
              period="/mo"
              description={billingCycle === 'annual' ? 'Billed annually at $276' : 'Billed monthly'}
              features={[
                { text: 'Up to 25', label: 'Number of coachees' },
                { text: 'Up to 50', label: 'Sessions per month' },
                { text: '10 GB', label: 'Storage' },
                { text: 'Basic', label: 'Analytics Level' },
                { text: '—', label: 'ICF Competency Evaluation', disabled: true },
                { text: '—', label: 'Client-facing Portals', disabled: true },
                { text: '—', label: 'Team Management', disabled: true },
                { text: 'Standard Support', label: 'Support' }
              ]}
              cta="Get Started"
              ctaLink="/sign-up"
            />

            {/* Pro Plan - Most Popular */}
            <PricingCard
              name="Pro"
              subtitle="For established professionals"
              price={billingCycle === 'monthly' ? '$59' : '$47'}
              period="/mo"
              description={billingCycle === 'annual' ? 'Billed annually at $564' : 'Billed monthly'}
              popular
              features={[
                { text: 'Unlimited', label: 'Number of coachees' },
                { text: 'Unlimited', label: 'Sessions per month' },
                { text: '50 GB', label: 'Storage' },
                { text: 'Advanced', label: 'Analytics Level' },
                { text: '✓', label: 'ICF Competency Evaluation' },
                { text: '✓', label: 'Client-facing Portals' },
                { text: '—', label: 'Team Management', disabled: true },
                { text: 'Priority Support', label: 'Support' }
              ]}
              cta="Start Free Trial"
              ctaLink="/sign-up"
            />

            {/* Organization Plan */}
            <PricingCard
              name="Organization"
              subtitle="For coaching teams"
              price="Custom"
              description="Contact us for pricing"
              features={[
                { text: 'Unlimited', label: 'Number of coachees' },
                { text: 'Unlimited', label: 'Sessions per month' },
                { text: 'Custom', label: 'Storage' },
                { text: 'Enterprise', label: 'Analytics Level' },
                { text: '✓', label: 'ICF Competency Evaluation' },
                { text: '✓', label: 'Client-facing Portals' },
                { text: '✓', label: 'Team Management' },
                { text: 'Dedicated Account Manager', label: 'Support' }
              ]}
              cta="Contact Sales"
              ctaLink="/contact"
            />
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Enhance Your Experience with Add-ons</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AddOnCard
              icon={<Users className="w-6 h-6" />}
              title="Extra Coaches"
              description="Add more coach seats to your Organization plan."
              iconColor="bg-blue-500"
            />
            <AddOnCard
              icon={<Zap className="w-6 h-6" />}
              title="Supervision Seats"
              description="Dedicated seats for coaching supervisors to oversee your team."
              iconColor="bg-purple-500"
            />
            <AddOnCard
              icon={<Shield className="w-6 h-6" />}
              title="White-Label Branding"
              description="A fully branded client experience with your own domain."
              iconColor="bg-pink-500"
            />
            <AddOnCard
              icon={<BarChart className="w-6 h-6" />}
              title="Advanced Analytics"
              description="Unlock deeper insights with custom reports and dashboards."
              iconColor="bg-green-500"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Billing and Licensing FAQs</h2>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! We offer a 14-day free trial for our Pro plan with no credit card required. You can explore all features and decide if it's right for you."
            />
            <FAQItem
              question="What happens when my trial ends?"
              answer="After your trial, you'll be prompted to select a plan. If you don't choose a plan, your account will revert to our free tier with limited features."
            />
            <FAQItem
              question="How does the annual discount work?"
              answer="When you choose annual billing, you save 20% compared to monthly pricing. You'll be billed once per year at the discounted rate."
            />
            <FAQItem
              question="What is your cancellation policy?"
              answer="You can cancel anytime. For monthly plans, you won't be charged again. For annual plans, you'll retain access until the end of your billing period."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Coaching?</h2>
          <p className="text-xl mb-8 text-white/90">
            Start your free trial today and experience the difference professional tools can make.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-2xl transition-all text-lg font-semibold">
            Start Your 14-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AchievingCoach</span>
              </div>
              <p className="text-sm">The ultimate coaching platform for professionals.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2024 AchievingCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function PricingCard({ name, subtitle, price, period, description, popular, features, cta, ctaLink }: any) {
  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-primary-600 shadow-xl relative' : 'border border-gray-200 shadow-sm'}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600">{period}</span>}
        </div>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>

      <Link
        href={ctaLink}
        className={`block text-center w-full px-6 py-3 rounded-lg font-semibold transition-all mb-8 ${
          popular
            ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {cta}
      </Link>

      <div className="space-y-4">
        {features.map((feature: any, i: number) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-1">
              <div className={`text-sm font-medium ${feature.disabled ? 'text-gray-400' : 'text-gray-900'}`}>
                {feature.text}
              </div>
              <div className="text-xs text-gray-500">{feature.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddOnCard({ icon, title, description, iconColor }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <span className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  );
}
