'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, Users, TrendingUp, Award, ArrowRight, CheckCircle, Star, BarChart3, FileText } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AchievingCoach</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
              <a href="#platform" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Platform</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</a>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Sign In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all font-medium shadow-sm">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={LANDING_IMAGES.hero.src}
            alt={LANDING_IMAGES.hero.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/95 via-primary-800/90 to-purple-900/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-current" />
              Trusted by 2,500+ Professional Coaches
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Elevate Your Coaching Practice with Professional Tools
            </h1>
            <p className="text-xl lg:text-2xl mb-8 leading-relaxed text-white/90">
              The complete platform for ICF-certified coaches to manage clients, track progress, and deliver transformational coaching experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-full hover:shadow-xl transition-all text-lg font-semibold">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#platform" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-full hover:bg-white/10 backdrop-blur-sm transition-all text-lg font-semibold">
                See Platform
              </a>
            </div>
            <p className="text-sm text-white/70 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Everything You Need to Scale Your Practice</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Professional coaching tools, client management, and analytics built for modern coaches</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-7 h-7" />}
              title="Client Management"
              description="Manage unlimited clients, track progress, schedule sessions, and maintain detailed coaching records in one centralized platform."
              color="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Target className="w-7 h-7" />}
              title="Professional Tools"
              description="GROW Model, DISC Assessment, Wheel of Life, Stakeholder Map, and 10+ proven coaching frameworks ready to use."
              color="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={<TrendingUp className="w-7 h-7" />}
              title="Growth Analytics"
              description="Track progress, measure impact, and demonstrate ROI with comprehensive analytics and exportable reports."
              color="from-pink-500 to-pink-600"
            />
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section id="platform" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">A Platform Built for Professional Coaches</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Powerful features that help you deliver better coaching outcomes</p>
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
                  <BarChart3 className="w-4 h-4" />
                  Analytics & Reporting
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Track Progress with Comprehensive Analytics</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Monitor engagement rates, goal completion, and client progress with intuitive dashboards. Export professional reports to demonstrate ROI.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Real-time session volume and engagement metrics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Goal completion tracking across all clients</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Exportable PDF reports for stakeholders</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <Image
                    src={LANDING_IMAGES.analytics.src}
                    alt={LANDING_IMAGES.analytics.alt}
                    width={LANDING_IMAGES.analytics.width}
                    height={LANDING_IMAGES.analytics.height}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ICF Standards */}
          <div className="mb-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <Image
                    src={LANDING_IMAGES.icfEvaluation.src}
                    alt={LANDING_IMAGES.icfEvaluation.alt}
                    width={LANDING_IMAGES.icfEvaluation.width}
                    height={LANDING_IMAGES.icfEvaluation.height}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-4">
                  <Award className="w-4 h-4" />
                  ICF Standards
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Built on ICF Core Competencies</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Practice and track all 8 ICF core competencies. Get personalized development recommendations based on your coaching patterns.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Competency evaluation matrix with progress tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">ICF Simulator for practice and skill development</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Suggested development plans based on assessments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-4">
                  <FileText className="w-4 h-4" />
                  Session Management
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Seamless Session & File Management</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Manage coaching sessions with live notes, time-stamped highlights, and organized file attachments. Everything in one place.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Live session notes with timestamp highlights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">File attachments with drag & drop support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Coach reflection and action planning tools</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                  <Image
                    src={LANDING_IMAGES.sessionManagement.src}
                    alt={LANDING_IMAGES.sessionManagement.alt}
                    width={LANDING_IMAGES.sessionManagement.width}
                    height={LANDING_IMAGES.sessionManagement.height}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={LANDING_IMAGES.trust.src}
                alt={LANDING_IMAGES.trust.alt}
                width={LANDING_IMAGES.trust.width}
                height={LANDING_IMAGES.trust.height}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Trusted by Professional Coaches Worldwide</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of ICF-certified coaches who trust AchievingCoach to manage their practice and deliver exceptional results.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <StatCard value="2,500+" label="Active Coaches" />
                <StatCard value="50,000+" label="Sessions Completed" />
                <StatCard value="98%" label="Satisfaction Rate" />
                <StatCard value="4.9/5" label="Average Rating" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your coaching practice</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingCard
              name="Starter"
              price="Free"
              description="Perfect for trying out"
              features={[
                'Up to 5 clients',
                'GROW Model & Basic Tools',
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
                'All coaching tools & frameworks',
                'Advanced analytics & reports',
                'Priority support',
                'Custom branding',
                'ICF Simulator access'
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
      <section className="py-24 bg-gradient-to-br from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 2,500+ coaches who are already using AchievingCoach to deliver better results
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-full hover:shadow-2xl transition-all text-lg font-semibold">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-white/70 mt-6">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
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
                <li><a href="#platform" className="hover:text-white transition-colors">Platform</a></li>
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
function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all h-full">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: any) {
  return (
    <div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function PricingCard({ name, price, period, description, features, cta, link, popular }: any) {
  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-primary-600 shadow-xl scale-105' : 'shadow-sm'} relative transition-all hover:shadow-md`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-sm font-semibold rounded-full">
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
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={link} className={`block text-center px-6 py-3 rounded-full font-semibold transition-all ${
        popular
          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-lg'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}>
        {cta}
      </Link>
    </div>
  );
}
