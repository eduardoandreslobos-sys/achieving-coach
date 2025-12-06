import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, BarChart3, CheckCircle, Users, Calendar, Zap } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';
import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
  title: 'Coaching Platform Features & Tools',
  description: 'Professional coaching tools including ICF competency evaluation, client progress tracking, session management, and analytics dashboard. ICF-compliant coaching software.',
  keywords: [
    'coaching tools',
    'ICF competency evaluation',
    'client progress tracking',
    'coaching session management',
    'coaching analytics',
    'professional coaching software',
    'coaching platform features',
  ],
  path: '/features',
});

export default function FeaturesPage() {
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
              <Link href="/features" className="text-sm text-gray-900 font-semibold" aria-current="page">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
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
            The Operating System for Professional Coaching
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Everything you need to deliver exceptional coaching results, maintain professional standards, and scale your practice.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700" aria-label="Start 14-day free trial">
            Start Your 14-day Free Trial
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Workspaces */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="workspaces-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="workspaces-heading" className="text-3xl font-bold text-gray-900 mb-4">Four Powerful Workspaces</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Organized spaces for every aspect of your coaching practice
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-12">
            <article>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold mb-4">
                  <BarChart3 className="w-4 h-4" aria-hidden="true" />
                  Client Management
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Every Client Journey</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive client profiles with progress tracking, session notes, and goal management. 
                  See the full picture of each client's development.
                </p>
              </div>
              <Image
                src={LANDING_IMAGES.sessionManagement.src}
                alt={LANDING_IMAGES.sessionManagement.alt}
                width={LANDING_IMAGES.sessionManagement.width}
                height={LANDING_IMAGES.sessionManagement.height}
                className="rounded-xl shadow-lg border border-gray-200"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article>

            <article>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold mb-4">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  ICF Tools
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">ICF Competency Evaluation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Practice and perfect your coaching skills with our ICF-aligned simulator. 
                  Get instant feedback on all core competencies.
                </p>
              </div>
              <Image
                src={LANDING_IMAGES.icfEvaluation.src}
                alt={LANDING_IMAGES.icfEvaluation.alt}
                width={LANDING_IMAGES.icfEvaluation.width}
                height={LANDING_IMAGES.icfEvaluation.height}
                className="rounded-xl shadow-lg border border-gray-200"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article>

            <article>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold mb-4">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Sessions
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Seamless Session Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Schedule, document, and review coaching sessions with ease. 
                  Keep all session materials and notes organized in one place.
                </p>
              </div>
              <Image
                src={LANDING_IMAGES.analytics.src}
                alt={LANDING_IMAGES.analytics.alt}
                width={LANDING_IMAGES.analytics.width}
                height={LANDING_IMAGES.analytics.height}
                className="rounded-xl shadow-lg border border-gray-200"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article>

            <article>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold mb-4">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  Stakeholder Mapping
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Organizational Context</h3>
                <p className="text-gray-600 leading-relaxed">
                  Map relationships and influences for organizational coaching. 
                  Understand the full ecosystem around your clients.
                </p>
              </div>
              <Image
                src={LANDING_IMAGES.stakeholderMap.src}
                alt={LANDING_IMAGES.stakeholderMap.alt}
                width={LANDING_IMAGES.stakeholderMap.width}
                height={LANDING_IMAGES.stakeholderMap.height}
                className="rounded-xl shadow-lg border border-gray-200"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </article>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a professional coaching practice
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Real-time insights into client progress, session trends, and practice growth metrics.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Goal Tracking</h3>
              <p className="text-gray-600 text-sm">
                Set, monitor, and celebrate client goals with visual progress indicators and milestones.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Scheduling</h3>
              <p className="text-gray-600 text-sm">
                Integrated calendar with automated reminders and timezone handling for global clients.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Client Portal</h3>
              <p className="text-gray-600 text-sm">
                Secure portal where clients access resources, complete assignments, and track their progress.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Coaching Tools Library</h3>
              <p className="text-gray-600 text-sm">
                15+ professional coaching tools including Wheel of Life, DISC, Values Clarification, and more.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6" role="listitem">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Compliant</h3>
              <p className="text-gray-600 text-sm">
                Bank-level encryption, GDPR compliant, and built with coaching confidentiality in mind.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="how-it-works-heading">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Get started in minutes, not hours</p>
          </header>

          <ol className="grid md:grid-cols-3 gap-12" role="list">
            <li className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-label="Step 1">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up & Set Up</h3>
              <p className="text-gray-600">
                Create your account and customize your coaching practice profile in under 5 minutes.
              </p>
            </li>

            <li className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-label="Step 2">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Invite Clients</h3>
              <p className="text-gray-600">
                Send secure invitation links to your clients. They'll get instant access to their portal.
              </p>
            </li>

            <li className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-label="Step 3">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Coaching</h3>
              <p className="text-gray-600">
                Use our tools, track progress, and deliver exceptional results with confidence.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-6 bg-white" aria-labelledby="integrations-heading">
        <div className="max-w-5xl mx-auto text-center">
          <h2 id="integrations-heading" className="text-3xl font-bold text-gray-900 mb-4">Integrates With Your Workflow</h2>
          <p className="text-gray-600 mb-12">
            Connect with the tools you already use every day
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" role="list">
            <div className="flex flex-col items-center gap-3" role="listitem">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-10 h-10 text-gray-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700">Google Calendar</span>
            </div>
            
            <div className="flex flex-col items-center gap-3" role="listitem">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700">Zoom</span>
            </div>
            
            <div className="flex flex-col items-center gap-3" role="listitem">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <Zap className="w-10 h-10 text-gray-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700">Slack</span>
            </div>
            
            <div className="flex flex-col items-center gap-3" role="listitem">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-gray-600" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-gray-700">Microsoft Teams</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-primary-600 to-primary-700" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-heading" className="text-4xl font-bold mb-6">Ready to Elevate Your Practice?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join hundreds of professional coaches using AchievingCoach
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-2xl transition-all" aria-label="Start 14-day free trial">
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
