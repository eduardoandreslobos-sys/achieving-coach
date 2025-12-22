import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BarChart3, CheckCircle, Users, Calendar, Zap, Shield, BookOpen, Award, FileSignature, Sparkles, Target, Settings, Lock, Globe } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GoogleCalendarLogo, ZoomLogo, SlackLogo, MicrosoftTeamsLogo } from '@/components/icons/IntegrationLogos';

export const metadata: Metadata = {
  title: 'Features – Coaching Tools, Analytics & AI Insights | AchievingCoach',
  description: 'Explore AchievingCoach features: client dashboards, ICF simulator, 12+ coaching tools, real-time analytics, AI reports, and secure integrations.',
  keywords: ['coaching tools', 'ICF competency evaluation', 'client progress tracking', 'coaching session management', 'coaching analytics', 'AI coaching reports'],
  openGraph: {
    title: 'AchievingCoach Features – Coaching Tools, Analytics & AI Insights',
    description: 'Explore AchievingCoach features: client dashboards, ICF simulator, 12+ coaching tools, real-time analytics, AI reports, and secure integrations.',
    url: 'https://achievingcoach.com/features',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Coaching Platform Features & Tools',
  description: 'Explore AchievingCoach features: client dashboards, ICF simulator, 12+ coaching tools, real-time analytics, AI reports, and secure integrations.',
  url: 'https://achievingcoach.com/features',
};

export default function FeaturesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        <Navbar />
        <main role="main">
          {/* Hero */}
          <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Coaching Platform Features to Power Your Practice
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                AchievingCoach offers a full suite of features to manage and scale your coaching practice. Everything you need to deliver exceptional coaching outcomes is built into our platform.
              </p>
            </div>
          </section>

          {/* Comprehensive Coaching Management */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Coaching Management</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Keep every client engagement on track with organized, intuitive management tools.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Profiles & Journeys</h3>
                  <p className="text-gray-600">
                    Track each client's entire coaching journey in one place. View goals, session notes, action plans, and progress over time with visual timelines.
                  </p>
                </article>

                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Scheduling & Notes</h3>
                  <p className="text-gray-600">
                    Schedule sessions with an integrated calendar including automated timezone handling and reminders. Take live notes and log key insights.
                  </p>
                </article>

                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Portal</h3>
                  <p className="text-gray-600">
                    Provide coachees with a secure personal portal to complete exercises, review summaries, track goals, and celebrate achievements.
                  </p>
                </article>

                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileSignature className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Signature Workflows</h3>
                  <p className="text-gray-600">
                    Streamline paperwork with built-in digital signatures. Sign coaching agreements, confidentiality forms, and session acknowledgments electronically.
                  </p>
                </article>

                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Specific Dashboards</h3>
                  <p className="text-gray-600">
                    Tailored experiences for every role. Coaches get a 360° dashboard of their practice, while coachees see their own progress dashboard.
                  </p>
                </article>

                <article className="bg-gray-50 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">9-Phase Methodology</h3>
                  <p className="text-gray-600">
                    Structured process from initial contracting through final evaluation. Built-in framework ensures consistency and quality across all programs.
                  </p>
                </article>
              </div>
            </div>
          </section>

          {/* Professional Coaching Tools */}
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Professional Coaching Tools & Resources</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Deliver world-class coaching with a rich library of tools and content.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">12+ Coaching Tools</h3>
                        <p className="text-gray-600">
                          Wheel of Life, DISC personality assessment, Values Clarification, GROW Model, Resilience Scale, Career Compass, and more.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">ICF Competency Simulator</h3>
                        <p className="text-gray-600">
                          Practice coaching scenarios and get feedback aligned to ICF Core Competencies. Perfect for certification preparation.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready-Made Templates</h3>
                        <p className="text-gray-600">
                          Goal-setting worksheets, development plans, feedback forms, and more. All customizable for each client.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {['Wheel of Life', 'DISC Assessment', 'GROW Model', 'Values', 'Resilience', 'Career Compass', 'Habit Loop', 'Stakeholder Map', 'Limiting Beliefs'].map((tool, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100">
                      <p className="text-sm font-medium text-gray-700">{tool}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* AI-Powered Reporting */}
          <section className="py-20 px-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered
                  </div>
                  <h2 className="text-4xl font-bold mb-6">Analytics & AI-Powered Reporting</h2>
                  <p className="text-xl text-primary-100 mb-8">
                    Make your coaching measurable and data-driven with robust analytics and insightful reports generated automatically.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Real-Time Progress Analytics</h4>
                        <p className="text-primary-200">Session counts, goal completion rates, client engagement levels at a glance.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">AI-Generated Insights</h4>
                        <p className="text-primary-200">Auto-generated session summaries, key discussion points, and action items.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary-200 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Process & Final Reports</h4>
                        <p className="text-primary-200">Comprehensive reports aggregating data on goals, competencies, and progress.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Analytics Dashboard</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary-600">24</p>
                        <p className="text-sm text-gray-500">Active Clients</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-green-600">87%</p>
                        <p className="text-sm text-gray-500">Goal Completion</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-purple-600">156</p>
                        <p className="text-sm text-gray-500">Sessions This Month</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-orange-600">4.9</p>
                        <p className="text-sm text-gray-500">Avg. Rating</p>
                      </div>
                    </div>
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-primary-600" />
                        <span className="text-sm font-medium text-primary-700">AI Insight</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Client engagement increased 23% this month. Top focus areas: leadership presence and communication."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Integrations */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Integrations & Automation</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  AchievingCoach plays nicely with the tools you already use and automates routine tasks.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <GoogleCalendarLogo className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-500 mt-1">Seamless scheduling</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ZoomLogo className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Zoom</h3>
                  <p className="text-sm text-gray-500 mt-1">One-click video calls</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <SlackLogo className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Slack</h3>
                  <p className="text-sm text-gray-500 mt-1">Instant notifications</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <MicrosoftTeamsLogo className="w-10 h-10" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Microsoft Teams</h3>
                  <p className="text-sm text-gray-500 mt-1">Enterprise ready</p>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <Zap className="w-8 h-8 text-primary-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Automated Workflows</h3>
                    <p className="text-gray-600 text-sm">
                      When a client completes an exercise, the platform notifies you and logs the results automatically.
                    </p>
                  </div>
                  <div>
                    <Settings className="w-8 h-8 text-primary-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Open API</h3>
                    <p className="text-gray-600 text-sm">
                      Sync data with your HR systems, CRM, or learning platforms with our comprehensive API.
                    </p>
                  </div>
                  <div>
                    <Calendar className="w-8 h-8 text-primary-600 mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Smart Reminders</h3>
                    <p className="text-gray-600 text-sm">
                      Automated session reminders and follow-ups via email or Slack notifications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Security & Privacy</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We understand the sensitive nature of coaching conversations. AchievingCoach is built with enterprise-grade security.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-xl text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise-Grade Security</h3>
                  <p className="text-gray-600">
                    256-bit encryption in transit and at rest. Regular security audits and penetration testing.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy & Compliance</h3>
                  <p className="text-gray-600">
                    GDPR compliant and HIPAA-ready. SOC 2 Type II certified for security and confidentiality.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Confidentiality by Design</h3>
                  <p className="text-gray-600">
                    Your coaching notes are only visible to you and your client. We never sell or share personal data.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ready to Elevate Your Coaching Practice?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join hundreds of professional coaches who have transformed their practice with AchievingCoach.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg">
                  Start Your 14-Day Free Trial
                </Link>
                <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all">
                  View Pricing
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
