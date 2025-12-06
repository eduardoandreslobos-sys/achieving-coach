'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, Users, TrendingUp, Award, ArrowRight, CheckCircle, Play, BarChart3, FileText, Clock, Shield } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function HomePage() {
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About</Link>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Log In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center text-white mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Elevate Your Coaching Practice
            </h1>
            <p className="text-xl lg:text-2xl mb-8 leading-relaxed text-white/90">
              An end-to-end platform for professional coaches to manage coaching practices, track client progress, and acquire structured development exercises.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-xl transition-all text-lg font-semibold">
              Start Your 14-day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Video/Demo Preview */}
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gray-100 aspect-video">
              <Image
                src={LANDING_IMAGES.analytics.src}
                alt="Platform demo preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-all">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 text-primary-600 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A Smarter Way to Coach */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">A Smarter Way to Coach</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AchievingCoach provides the tools you need to deliver exceptional results, maintain professional standards, and grow your practice.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Client Progress Tracking"
              description="Monitor client growth with real-time analytics and visual progress reports."
              iconColor="bg-blue-500"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="ICF Competency Evaluation"
              description="Assess and track your coaching against all ICF core competencies."
              iconColor="bg-purple-500"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Development Library"
              description="Access a curated library of coaching tools and frameworks."
              iconColor="bg-pink-500"
            />
            <FeatureCard
              icon={<Clock className="w-6 h-6" />}
              title="Seamless Session Management"
              description="Organize session notes, files, and communications all in one place."
              iconColor="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Why Professionals Choose AchievingCoach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src={LANDING_IMAGES.trust.src}
                alt={LANDING_IMAGES.trust.alt}
                width={LANDING_IMAGES.trust.width}
                height={LANDING_IMAGES.trust.height}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Professionals Choose AchievingCoach
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're more than just a tool; we're a partner in your professional journey. Save time on admin, focus on what you do best, and deliver results your clients will love.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Maintain Professional Standards</h3>
                    <p className="text-gray-600">Stay ICF-compliant with tools that keep you aligned with industry best practices.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Improve Client Outcomes</h3>
                    <p className="text-gray-600">Structured exercises and real-time insights help you track and improve results.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save Hours Every Week</h3>
                    <p className="text-gray-600">Automate scheduling, notes, and follow-ups to reclaim your valuable time.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Coaches Worldwide</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it. Here's what certified professionals are saying about our platform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Maria S., PCC"
              role="Executive Coach"
              image={LANDING_IMAGES.hero.src}
              quote="This platform significantly improved how I manage my coaching practice. The ICF competency tools are outstanding."
            />
            <TestimonialCard
              name="David L., ACC"
              role="Career Coach"
              image={LANDING_IMAGES.hero.src}
              quote="Finally, a coaching platform that gets it right. My clients love the structured exercises and I love the analytics."
            />
            <TestimonialCard
              name="Chloe R., MCC"
              role="Leadership Coach"
              image={LANDING_IMAGES.hero.src}
              quote="The analytics dashboard and client portal are incredibly intuitive. This has truly transformed my practice."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of coaches using our AI-powered tools to deliver exceptional results and grow their practice.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-2xl transition-all text-lg font-semibold">
            Start Your 14-day Free Trial
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
            <p>© 2024 AchievingCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeatureCard({ icon, title, description, iconColor }: any) {
  return (
    <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, image, quote }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400"></div>
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">"{quote}"</p>
    </div>
  );
}
