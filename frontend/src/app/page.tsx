'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout';
import Image from 'next/image';
import { Target, BarChart3, Award, BookOpen, Calendar, Sparkles, Shield, Users, CheckCircle } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';
import { organizationSchema, softwareApplicationSchema, webPageSchema } from '@/lib/schema';

export default function HomePage() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageSchema(
              'Executive Coaching Platform & AI Coaching Tools',
              'All-in-one executive coaching platform with 9-phase methodology, AI-powered insights, and 12+ professional tools.',
              'https://achievingcoach.com'
            )
          ),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero */}
        <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white" aria-labelledby="hero-heading">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Coaching Platform
            </div>
            <h1 id="hero-heading" className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              All-in-One Executive Coaching Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Elevate your coaching practice with AchievingCoach, the platform built for professional coaches, their coachees, and forward-thinking organizations. Manage every aspect of coaching with a structured <strong>9-phase methodology</strong> and <strong>AI-powered insights</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl">
                Start Your 14-Day Free Trial
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/features" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all">
                Explore Features
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required • Cancel anytime</p>
          </div>
        </section>

        {/* Product Screenshot */}
        <section className="py-12 px-6 bg-white" aria-label="Platform preview">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src={LANDING_IMAGES.analytics.src}
                alt={LANDING_IMAGES.analytics.alt}
                width={LANDING_IMAGES.analytics.width}
                height={LANDING_IMAGES.analytics.height}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-gray-50" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="features-heading" className="text-4xl font-bold text-gray-900 mb-4">
                A Smarter Way to Coach
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to deliver exceptional results, maintain professional standards, and grow your coaching business.
              </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor each client's growth with real-time analytics and visual progress reports. Track goals, milestones, and session feedback at a glance.
                </p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ICF Competency Evaluation</h3>
                <p className="text-gray-600">
                  Assess and track your coaching skills against all ICF core competencies. Stay credential-ready with our ICF-aligned simulator.
                </p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">12+ Professional Tools</h3>
                <p className="text-gray-600">
                  Access Wheel of Life, DISC, Values Clarification, GROW Model, Resilience Scale, and more. Assign structured activities for deeper impact.
                </p>
              </article>

              <article className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seamless Session Management</h3>
                <p className="text-gray-600">
                  Organize notes, files, and communications in one secure workspace. Digital signatures for agreements and session summaries.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-24 px-6 bg-white" aria-labelledby="why-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="why-heading" className="text-4xl font-bold text-gray-900 mb-4">
                Why Professional Coaches Choose AchievingCoach
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're more than software – we're a partner in your success.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="text-center p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Maintain Professional Standards</h3>
                <p className="text-gray-600">
                  Stay ICF-compliant with tools aligned to industry best practices. Our 9-phase methodology ensures a consistent, ethical coaching process every time.
                </p>
              </article>

              <article className="text-center p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Improve Client Outcomes</h3>
                <p className="text-gray-600">
                  Deliver measurable results that clients and their employers love. Use structured exercises, assessments, and real-time progress insights.
                </p>
              </article>

              <article className="text-center p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Save Hours Every Week</h3>
                <p className="text-gray-600">
                  Automate administrative tasks. Our AI assistant generates session summaries and detailed progress reports for you. Less paperwork, more coaching.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* AI Feature Highlight */}
        <section className="py-24 px-6 bg-gradient-to-r from-primary-600 to-primary-800" aria-labelledby="ai-heading">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  AI-Powered
                </div>
                <h2 id="ai-heading" className="text-4xl font-bold mb-6">
                  Intelligent Reports, Zero Effort
                </h2>
                <p className="text-xl text-primary-100 mb-6">
                  Our AI assistant analyzes your coaching sessions and automatically generates comprehensive progress reports, session summaries, and actionable insights.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-200" />
                    <span>Auto-generated session summaries</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-200" />
                    <span>Process reports after milestone sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-200" />
                    <span>Final reports with key insights</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary-200" />
                    <span>Editable by coach before sharing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">AI Process Report</p>
                      <p className="text-sm text-gray-500">Auto-generated after Session 3</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-700">Central Themes</p>
                      <p className="text-gray-600">Leadership presence, communication clarity, team delegation...</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-700">Key Progress</p>
                      <p className="text-green-600">Improved active listening, stronger boundaries...</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-700">Recommendations</p>
                      <p className="text-blue-600">Continue practicing delegation with weekly check-ins...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-6 bg-gray-50" aria-labelledby="testimonials-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-4xl font-bold text-gray-900 mb-4">
                Trusted by Coaches Worldwide
              </h2>
              <p className="text-xl text-gray-600">
                Join 500+ coaches in 30+ countries who trust AchievingCoach
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "This platform significantly improved how I manage my coaching practice. The ICF competency tools are outstanding."
                </blockquote>
                <footer>
                  <p className="font-semibold text-gray-900">Maria S.</p>
                  <p className="text-sm text-gray-500">PCC, Executive Coach</p>
                </footer>
              </article>

              <article className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "Finally, a coaching platform that gets it right. My clients love the structured exercises and I love the analytics."
                </blockquote>
                <footer>
                  <p className="font-semibold text-gray-900">David L.</p>
                  <p className="text-sm text-gray-500">ACC, Career Coach</p>
                </footer>
              </article>

              <article className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6">
                  "The analytics dashboard and client portal are incredibly intuitive. AchievingCoach has truly transformed my practice."
                </blockquote>
                <footer>
                  <p className="font-semibold text-gray-900">Chloe R.</p>
                  <p className="text-sm text-gray-500">MCC, Leadership Coach</p>
                </footer>
              </article>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-white" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Coaching Business?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of coaches using our AI-powered tools to elevate their coaching and scale their impact.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl text-lg">
              Start Your 14-Day Free Trial
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <p className="mt-4 text-gray-500">No credit card required • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-8 h-8 text-primary-400" />
                  <span className="text-xl font-bold text-white">AchievingCoach</span>
                </div>
                <p className="text-sm">
                  The all-in-one executive coaching platform with AI-powered insights.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/organizations" className="hover:text-white transition-colors">For Organizations</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© {new Date().getFullYear()} AchievingCoach. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
