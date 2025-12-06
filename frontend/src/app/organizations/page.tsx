import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Building2, Users, BarChart3, Shield, Zap, CheckCircle } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
  title: 'Enterprise Coaching Platform for Organizations',
  description: 'Scale your organizational coaching programs with enterprise features: multi-coach management, ROI analytics, compliance tracking, and dedicated support.',
  keywords: [
    'enterprise coaching platform',
    'organizational coaching software',
    'corporate coaching tools',
    'coaching program management',
    'coaching ROI tracking',
    'team coaching platform',
  ],
  path: '/organizations',
});

export default function OrganizationsPage() {
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
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/organizations" className="text-sm text-gray-900 font-semibold" aria-current="page">For Organizations</Link>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
              <Link href="/contact" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700" aria-label="Request a demo">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 bg-white" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold mb-6">
            <Building2 className="w-4 h-4" aria-hidden="true" />
            For Organizations
          </div>
          <h1 id="hero-heading" className="text-5xl font-bold text-gray-900 mb-6">
            Scale Your Coaching Impact and Prove the ROI
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Enterprise coaching platform designed for organizations running coaching programs at scale. Manage multiple coaches, track organizational impact, and demonstrate clear ROI.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors" aria-label="Request a demo">
              Request a Demo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to run successful coaching programs at organizational scale
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Multi-Coach Management</h3>
              <p className="text-gray-600 text-sm">
                Centrally manage multiple internal and external coaches. Assign clients, track capacity, and ensure consistent quality across your coaching network.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ROI Analytics</h3>
              <p className="text-gray-600 text-sm">
                Measure and demonstrate the impact of your coaching programs with comprehensive analytics. Track engagement, progress, and business outcomes.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Compliance & Security</h3>
              <p className="text-gray-600 text-sm">
                Enterprise-grade security with SSO, role-based access control, audit logs, and compliance with GDPR, HIPAA, and SOC 2 standards.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Custom Branding</h3>
              <p className="text-gray-600 text-sm">
                White-label the platform with your organization's branding. Create a seamless experience that aligns with your company culture.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">API & Integrations</h3>
              <p className="text-gray-600 text-sm">
                Connect with your existing HR systems, HRIS platforms, and business tools. Custom integrations available for enterprise customers.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Dedicated Support</h3>
              <p className="text-gray-600 text-sm">
                Priority support with dedicated customer success manager, training sessions, and guaranteed SLA response times.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6 bg-white" aria-labelledby="roi-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="roi-heading" className="text-3xl font-bold text-gray-900 mb-6">
                Demonstrate Clear ROI on Your Coaching Investment
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our analytics dashboard helps you track and report on the business impact of your coaching programs. Show leadership exactly how coaching drives organizational success.
              </p>

              <ul className="space-y-4" role="list">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Program Utilization Metrics</div>
                    <p className="text-sm text-gray-600">Track engagement rates, session completion, and active participation across your organization.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Development Progress Tracking</div>
                    <p className="text-sm text-gray-600">Monitor goal achievement, competency development, and individual growth trajectories.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Business Impact Correlation</div>
                    <p className="text-sm text-gray-600">Connect coaching outcomes to business KPIs like retention, performance, and leadership readiness.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">87%</div>
                  <div className="text-gray-700">Average increase in employee engagement</div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="text-4xl font-bold text-primary-600 mb-2">62%</div>
                  <div className="text-gray-700">Reduction in leadership turnover</div>
                </div>

                <div>
                  <div className="text-4xl font-bold text-primary-600 mb-2">3.5x</div>
                  <div className="text-gray-700">Return on coaching investment</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="compliance-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="compliance-heading" className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Security & Compliance</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take data security seriously. Your coaching data is protected by industry-leading security measures.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Certified for security, availability, and confidentiality</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">Full compliance with EU data protection regulations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">HIPAA Ready</h3>
              <p className="text-sm text-gray-600">Healthcare-grade data protection standards</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">256-bit Encryption</h3>
              <p className="text-sm text-gray-600">Bank-level encryption for all data in transit and at rest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-white" aria-labelledby="use-cases-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="use-cases-heading" className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Organizations</h2>
            <p className="text-gray-600">Organizations worldwide use AchievingCoach for their coaching programs</p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership Development</h3>
              <p className="text-gray-600 text-sm mb-4">
                Develop your next generation of leaders with structured coaching programs that drive measurable growth.
              </p>
              <ul className="space-y-2" role="list">
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  High-potential identification
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Succession planning
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Executive onboarding
                </li>
              </ul>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Coaching</h3>
              <p className="text-gray-600 text-sm mb-4">
                Improve individual and team performance with targeted coaching interventions and ongoing support.
              </p>
              <ul className="space-y-2" role="list">
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Goal achievement
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Skill development
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Career transitions
                </li>
              </ul>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Culture Transformation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Drive organizational change and build desired culture through scalable coaching programs.
              </p>
              <ul className="space-y-2" role="list">
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Change management
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Team alignment
                </li>
                <li className="text-sm text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  Cultural values
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-primary-600 to-primary-700" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-heading" className="text-4xl font-bold mb-6">Ready to Transform Your Coaching Program?</h2>
          <p className="text-lg mb-8 text-white/90">
            Schedule a demo to see how AchievingCoach can help your organization achieve its coaching goals.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-2xl transition-all" aria-label="Request a demo">
            Request a Demo
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
