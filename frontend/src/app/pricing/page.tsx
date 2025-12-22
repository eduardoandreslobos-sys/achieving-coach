import { Metadata } from 'next';
import Link from 'next/link';
import { Check, HelpCircle, Sparkles } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Pricing – Plans for Coaches, Teams & Enterprises | AchievingCoach',
  description: 'Compare AchievingCoach pricing. Free 14-day trial, no credit card. Core $29/mo, Pro $59/mo, custom Enterprise plans. No long-term contracts.',
  keywords: ['coaching software pricing', 'coaching platform cost', 'coaching software free trial', 'coaching platform plans'],
  openGraph: {
    title: 'AchievingCoach Pricing – Plans for Coaches, Teams & Enterprises',
    description: 'Compare AchievingCoach pricing. Free 14-day trial, no credit card. Core $29/mo, Pro $59/mo, custom Enterprise plans.',
    url: 'https://achievingcoach.com/pricing',
  },
};

const plans = [
  {
    name: 'Core',
    price: '$29',
    period: '/month',
    description: 'Essential tools for solo coaches',
    features: [
      'Up to 15 active coaching clients',
      'Session scheduling & management',
      '10 coaching tools included',
      'Basic progress analytics dashboard',
      'Email support',
    ],
    cta: 'Start Free Trial',
    href: '/sign-up?plan=core',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/month',
    description: 'Advanced features for growing practices',
    features: [
      'Unlimited clients',
      'All Core features',
      '12+ coaching tools (full library)',
      'ICF Competency Simulator access',
      'Advanced analytics & AI-powered reporting',
      'Priority email & chat support',
      'Custom branding for client portal',
    ],
    cta: 'Start Free Trial',
    href: '/sign-up?plan=pro',
    popular: true,
  },
  {
    name: 'Organization',
    price: 'Custom',
    period: '',
    description: 'For coaching firms and enterprises',
    features: [
      'All Pro features',
      'Multi-coach team management',
      'Team-wide analytics & reporting',
      'Single Sign-On (SSO)',
      'Dedicated Customer Success Manager',
      'Custom integrations (HRIS/CRM)',
      'Service Level Agreement (SLA)',
    ],
    cta: 'Contact Sales',
    href: '/contact?type=enterprise',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes. Upgrade or downgrade your plan at any time with no penalty. Changes take effect immediately, and we prorate any difference.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'All major credit cards (Visa, MasterCard, American Express) and PayPal. For Organization plans, we can accommodate invoicing.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'No. All plans are month-to-month subscription. Cancel online at any time, and you will not be billed for the next cycle.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes. We offer a 30-day money-back guarantee. If you\'re not satisfied, cancel within 30 days and request a full refund – no questions asked.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose a plan that fits your coaching needs. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-2'
                    : 'bg-white border-2 border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-yellow-400 text-yellow-900 text-sm font-semibold rounded-full">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.popular ? 'text-primary-100' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-lg ml-1 ${plan.popular ? 'text-primary-200' : 'text-gray-500'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-primary-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-primary-50' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block w-full py-3 px-6 text-center font-semibold rounded-xl transition-all ${
                    plan.popular
                      ? 'bg-white text-primary-600 hover:bg-primary-50'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-8">
            All plans include: 14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Not sure which plan is right for you? Here are answers to common questions.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Hundreds of coaches have transformed their practice with AchievingCoach. Join them today.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg"
          >
            Start Your 14-Day Free Trial
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
