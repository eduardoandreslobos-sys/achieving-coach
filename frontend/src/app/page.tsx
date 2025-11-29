'use client';

import type { Metadata } from "next";
import Link from 'next/link';
import { Target, Users, TrendingUp, Calendar, MessageSquare, Award, ArrowRight, CheckCircle, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AchievingCoach</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              #1 Coaching Platform for Professionals
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Coaching Practice</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              All the tools you need to structure coaching sessions, track client progress, and deliver measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all text-lg font-semibold">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all text-lg font-semibold">
                Learn More
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Scale Your Coaching Practice</h2>
            <p className="text-xl text-gray-600">Professional tools built for modern coaches</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-7 h-7" />}
              title="Client Management"
              description="Manage unlimited clients, track progress, schedule sessions, and maintain detailed coaching records."
              color="from-blue-500 to-blue-600"
              link="/sign-up"
            />
            <FeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Professional Tools"
              description="GROW Model, DISC Assessment, Wheel of Life, Stakeholder Map, and 10+ proven coaching frameworks."
              color="from-purple-500 to-purple-600"
              link="/sign-up"
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="Growth Insights"
              description="Track progress, measure impact, and demonstrate ROI with comprehensive analytics and reports."
              color="from-pink-500 to-pink-600"
              link="/sign-up"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-gray-600">Three simple steps to transform your coaching practice</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="1"
              title="Create Account"
              description="Sign up for free and set up your coaching profile. No credit card required for the free trial."
            />
            <StepCard
              number="2"
              title="Add Clients"
              description="Import your clients or add them manually. Set up their goals and coaching programs."
            />
            <StepCard
              number="3"
              title="Start Coaching"
              description="Use GROW worksheets, track progress, schedule sessions, and deliver measurable results."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Loved by Coaches Worldwide</h2>
          <p className="text-xl opacity-90 mb-12">Join thousands of professional coaches using AchievingCoach</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="2,500+" label="Active Coaches" />
            <StatCard value="50,000+" label="Client Sessions" />
            <StatCard value="98%" label="Satisfaction Rate" />
            <StatCard value="4.9/5" label="Average Rating" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your coaching practice</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for trying out"
              features={[
                'Up to 5 clients',
                'GROW Model Worksheet',
                'Basic progress tracking',
                'Email support'
              ]}
              cta="Start Free"
              link="/sign-up"
            />
            <PricingCard
              name="Professional"
              price="$29"
              period="/month"
              description="For serious coaches"
              features={[
                'Unlimited clients',
                'All coaching tools',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'API access'
              ]}
              cta="Start Trial"
              link="/sign-up"
              popular
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="For coaching organizations"
              features={[
                'Everything in Professional',
                'Multi-coach accounts',
                'White-label solution',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantee'
              ]}
              cta="Contact Sales"
              link="/sign-up"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 2,500+ coaches who are already using AchievingCoach to deliver better results
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-xl transition-all text-lg font-semibold">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">AchievingCoach</span>
              </div>
              <p className="text-sm">The ultimate coaching platform for professionals.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
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
            <p>© 2025 AchievingCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureCard({ icon, title, description, color, link }: any) {
  return (
    <Link href={link} className="group">
      <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all h-full border border-gray-100">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: any) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-lg opacity-90">{label}</div>
    </div>
  );
}

function PricingCard({ name, price, period, description, features, cta, link, popular }: any) {
  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : 'shadow-sm'} relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <div className="mb-2">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          {period && <span className="text-gray-600">{period}</span>}
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={link} className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${
        popular
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}>
        {cta}
      </Link>
    </div>
  );
}
