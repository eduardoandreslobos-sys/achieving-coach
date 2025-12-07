import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, CheckCircle, Users, Calendar, Zap, Shield } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';
import { generateMetadata as genMeta } from '@/lib/metadata';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoogleCalendarLogo, ZoomLogo, SlackLogo, MicrosoftTeamsLogo } from '@/components/icons/IntegrationLogos';

export const metadata: Metadata = genMeta({
  title: 'Coaching Platform Features & Tools',
  description: 'Professional coaching tools including ICF competency evaluation, client progress tracking, session management, and analytics dashboard.',
  keywords: ['coaching tools', 'ICF competency evaluation', 'client progress tracking', 'coaching session management', 'coaching analytics'],
  path: '/features',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Coaching Platform Features & Tools',
  description: 'Professional coaching tools including ICF competency evaluation, client progress tracking, session management, and analytics dashboard.',
  url: 'https://achievingcoach.com/features',
};

const features = [
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Real-time insights into client progress, session trends, and practice growth metrics.', bgColor: 'bg-primary-100', textColor: 'text-primary-600' },
  { icon: CheckCircle, title: 'Goal Tracking', description: 'Set, monitor, and celebrate client goals with visual progress indicators.', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  { icon: Calendar, title: 'Smart Scheduling', description: 'Integrated calendar with automated reminders and timezone handling.', bgColor: 'bg-green-100', textColor: 'text-green-600' },
  { icon: Users, title: 'Client Portal', description: 'Secure portal where clients access resources and track progress.', bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
  { icon: Zap, title: 'Coaching Tools Library', description: '15+ professional tools including Wheel of Life, DISC, Values Clarification.', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
  { icon: Shield, title: 'Secure & Compliant', description: 'Bank-level encryption, GDPR compliant, built with confidentiality in mind.', bgColor: 'bg-red-100', textColor: 'text-red-600' },
];

const integrations = [
  { name: 'Google Calendar', Logo: GoogleCalendarLogo },
  { name: 'Zoom', Logo: ZoomLogo },
  { name: 'Slack', Logo: SlackLogo },
  { name: 'Microsoft Teams', Logo: MicrosoftTeamsLogo },
];

export default function FeaturesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <Navbar />

        <main role="main">
          {/* Hero */}
          <section className="relative py-24 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900" aria-labelledby="hero-heading">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Operating System for Professional Coaching</h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Everything you need to deliver exceptional coaching results and scale your practice.</p>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all">
                Start Your 14-day Free Trial
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </section>

          {/* Workspaces */}
          <section className="py-20 px-6 bg-gray-50" aria-labelledby="workspaces-heading">
            <div className="max-w-7xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="workspaces-heading" className="text-3xl font-bold text-gray-900 mb-4">Four Powerful Workspaces</h2>
                <p className="text-gray-600">Organized spaces for every aspect of your coaching practice</p>
              </header>
              <div className="grid md:grid-cols-2 gap-12">
                <article>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold text-sm mb-4">
                    <BarChart3 className="w-4 h-4" /> Client Management
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Every Client Journey</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">Comprehensive client profiles with progress tracking, session notes, and goal management.</p>
                  <Image src={LANDING_IMAGES.sessionManagement.src} alt={LANDING_IMAGES.sessionManagement.alt} width={600} height={400} className="rounded-xl shadow-lg border border-gray-200" loading="lazy" />
                </article>
                <article>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm mb-4">
                    <CheckCircle className="w-4 h-4" /> ICF Tools
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">ICF Competency Evaluation</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">Practice and perfect your coaching skills with our ICF-aligned simulator.</p>
                  <Image src={LANDING_IMAGES.icfEvaluation.src} alt={LANDING_IMAGES.icfEvaluation.alt} width={600} height={400} className="rounded-xl shadow-lg border border-gray-200" loading="lazy" />
                </article>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 px-6 bg-white" aria-labelledby="features-heading">
            <div className="max-w-7xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
                <p className="text-gray-600">Everything you need to run a professional coaching practice</p>
              </header>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <article key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Integrations */}
          <section className="py-20 px-6 bg-gray-50" aria-labelledby="integrations-heading">
            <div className="max-w-5xl mx-auto text-center">
              <h2 id="integrations-heading" className="text-3xl font-bold text-gray-900 mb-4">Integrates With Your Workflow</h2>
              <p className="text-gray-600 mb-12">Connect with the tools you already use every day</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <integration.Logo className="w-12 h-12" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900" aria-labelledby="cta-heading">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Elevate Your Practice?</h2>
              <p className="text-lg text-gray-300 mb-8">Join hundreds of professional coaches using AchievingCoach</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all">Start Your 14-Day Free Trial</Link>
                <Link href="/pricing" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">View Pricing</Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
