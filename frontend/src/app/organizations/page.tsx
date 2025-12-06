'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, ArrowRight, Users, BarChart3, Shield, CheckCircle, TrendingUp, Award, Lock, FileText } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function OrganizationsPage() {
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Resources</Link>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Log In</Link>
              <Link href="/contact" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md">
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Scale Your Coaching Impact and Prove the ROI
          </h1>
          <p className="text-xl mb-8 text-white/90">
            AchievingCoach provides the visibility, analytics, and control you need to manage world-class organizational coaching programs.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-xl transition-all text-lg font-semibold">
            Request a Demo
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Screenshot with Dashboard */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <Image
              src={LANDING_IMAGES.analytics.src}
              alt="Organization dashboard with coaching metrics and analytics"
              width={LANDING_IMAGES.analytics.width}
              height={LANDING_IMAGES.analytics.height}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Trusted by Organizations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600 font-medium mb-6">
            Trusted by leading organizations and executive coaching firms worldwide
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* Centralized Program Oversight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Centralized Program Oversight</h2>
              <p className="text-lg text-gray-600 mb-6">
                Gain a unified, real-time view of all coaching engagements. Effortlessly manage multiple coaches, track client cohorts, and ensure program consistency from a single, powerful dashboard.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Unified Dashboard</h3>
                    <p className="text-gray-600 text-sm">See all coaching activities in one place.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Cohort Tracking</h3>
                    <p className="text-gray-600 text-sm">Monitor group progress and engagement levels.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Standardized Reporting</h3>
                    <p className="text-gray-600 text-sm">Ensure consistency across all coaches and programs.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Measure What Matters */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100"></div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Measure What Matters: ROI & Analytics</h2>
              <p className="text-lg text-gray-600 mb-6">
                Connect coaching success to business results. Our powerful analytics engine helps you track leadership growth, measure program effectiveness, and demonstrate tangible ROI to stakeholders.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quantitative Insights</h3>
                    <p className="text-gray-600 text-sm">Identify valuable insights against key performance indicators.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Data-Driven Insights</h3>
                    <p className="text-gray-600 text-sm">Identify trends and opportunities across your coaching programs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Stakeholder Reports</h3>
                    <p className="text-gray-600 text-sm">Generate beautiful, easy-to-understand reports.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Ensure Compliance & Consistency */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Ensure Compliance & Consistency</h2>
              <p className="text-lg text-gray-600 mb-6">
                Maintain the highest standards of quality and governance. Our platform helps you implement coaching best practices, track ICF competencies, and keep secure, audit-ready records of all coaching interactions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">ICF Competency Tracking</h3>
                    <p className="text-gray-600 text-sm">Align coaching with international standards.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Secure Record-Keeping</h3>
                    <p className="text-gray-600 text-sm">Protect sensitive data with enterprise-grade security.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Audit Trails</h3>
                    <p className="text-gray-600 text-sm">Maintain a complete history of coaching activities for governance.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <Image
                src={LANDING_IMAGES.icfEvaluation.src}
                alt="ICF competency tracking dashboard"
                width={LANDING_IMAGES.icfEvaluation.width}
                height={LANDING_IMAGES.icfEvaluation.height}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Enterprise Scale</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Security, customization, and support designed for large organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Enterprise Security"
              description="SOC 2 compliance, SSO, advanced permissions, and audit logs."
              iconColor="bg-blue-600"
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Multi-Coach Management"
              description="Manage unlimited coaches and track performance across your organization."
              iconColor="bg-purple-600"
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Custom Analytics"
              description="Build custom dashboards and reports tailored to your KPIs."
              iconColor="bg-pink-600"
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="White-Label Options"
              description="Brand the platform with your logo, colors, and custom domain."
              iconColor="bg-green-600"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="Dedicated Support"
              description="Priority support with a dedicated account manager."
              iconColor="bg-indigo-600"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="API Access"
              description="Integrate with your existing HR and learning systems."
              iconColor="bg-orange-600"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Elevate Your Organization's Coaching?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Let's discuss how AchievingCoach can help you scale your programs, prove impact, and develop world-class leaders. Book a personalized consultation with our team.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-2xl transition-all text-lg font-semibold">
            Book a Consultation
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
                <li><Link href="/organizations" className="hover:text-white transition-colors">For Organizations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
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

function FeatureCard({ icon, title, description, iconColor }: any) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
