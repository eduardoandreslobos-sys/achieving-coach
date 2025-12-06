'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, CheckCircle } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="AchievingCoach Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-gray-700 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-700 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-sm text-gray-700 hover:text-gray-900">About</Link>
              <Link href="/sign-in" className="text-sm text-gray-700 hover:text-gray-900">Log In</Link>
              <Link href="/sign-up" className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="hero-heading" className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Elevate Your Coaching Practice
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            An end-to-end platform for professional coaches to manage coaching practices, track client progress, and acquire structured development exercises.
          </p>
          <Link href="/sign-up" className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
            Start Your 14-day Free Trial →
          </Link>
        </div>
      </section>

      {/* Product Mockup */}
      <section className="py-12 px-6" aria-label="Platform preview">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-xl">
            <div className="aspect-video relative">
              <Image
                src={LANDING_IMAGES.analytics.src}
                alt={LANDING_IMAGES.analytics.alt}
                width={LANDING_IMAGES.analytics.width}
                height={LANDING_IMAGES.analytics.height}
                className="object-cover opacity-90"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform" aria-label="Play video">
                  <svg className="w-6 h-6 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl font-bold text-gray-900 mb-4">A Smarter Way to Coach</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AchievingCoach provides the tools you need to deliver exceptional results, maintain professional standards, and grow your practice.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" aria-hidden="true">
                <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Client Progress Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor client growth with real-time analytics and visual progress reports.
              </p>
            </article>

            <article className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" aria-hidden="true">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">ICF Competency Evaluation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Assess and track your coaching against all ICF core competencies.
              </p>
            </article>

            <article className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" aria-hidden="true">
                <svg className="w-8 h-8 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Development Library</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access a curated library of coaching tools and frameworks.
              </p>
            </article>

            <article className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center" aria-hidden="true">
                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Seamless Session Management</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Organize session notes, files, and communications all in one place.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 px-6" aria-labelledby="why-choose-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden">
              <Image
                src={LANDING_IMAGES.trust.src}
                alt={LANDING_IMAGES.trust.alt}
                width={LANDING_IMAGES.trust.width}
                height={LANDING_IMAGES.trust.height}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <h2 id="why-choose-heading" className="text-3xl font-bold text-gray-900 mb-6">
                Why Professionals Choose AchievingCoach
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're more than just a tool; we're a partner in your professional journey. Save time on admin, focus on what you do best, and deliver results your clients will love.
              </p>

              <ul className="space-y-6">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Maintain Professional Standards</h3>
                    <p className="text-sm text-gray-600">Stay ICF-compliant with tools that keep you aligned with industry best practices.</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Improve Client Outcomes</h3>
                    <p className="text-sm text-gray-600">Structured exercises and real-time insights help you track and improve results.</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save Hours Every Week</h3>
                    <p className="text-sm text-gray-600">Automate scheduling, notes, and follow-ups to reclaim your valuable time.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="testimonials-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 mb-4">Loved by Coaches Worldwide</h2>
            <p className="text-gray-600">
              Don't just take our word for it. Here's what certified professionals are saying about our platform.
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full" aria-hidden="true"></div>
                <div>
                  <div className="font-semibold text-gray-900">Maria S., PCC</div>
                  <div className="text-sm text-gray-600">Executive Coach</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "This platform significantly improved how I manage my coaching practice. The ICF competency tools are outstanding."
              </p>
            </article>

            <article className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full" aria-hidden="true"></div>
                <div>
                  <div className="font-semibold text-gray-900">David L., ACC</div>
                  <div className="text-sm text-gray-600">Career Coach</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "Finally, a coaching platform that gets it right. My clients love the structured exercises and I love the analytics."
              </p>
            </article>

            <article className="bg-white rounded-xl p-6 border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full" aria-hidden="true"></div>
                <div>
                  <div className="font-semibold text-gray-900">Chloe R., MCC</div>
                  <div className="text-sm text-gray-600">Leadership Coach</div>
                </div>
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "The analytics dashboard and client portal are incredibly intuitive. This has truly transformed my practice."
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 to-primary-600" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-heading" className="text-4xl font-bold mb-6">
            Ready to Transform Your Coaching Business?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Join hundreds of coaches using our AI-powered tools to deliver exceptional results and grow their practice.
          </p>
          <Link href="/sign-up" className="inline-block px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all">
            Start Your 14-Day Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-6" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-semibold text-white">AchievingCoach</span>
              </div>
              <p className="text-sm text-gray-500">Professional coaching platform for certified coaches</p>
            </div>
            <nav aria-label="Product links">
              <h3 className="font-semibold text-white mb-3 text-sm">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </nav>
            <nav aria-label="Company links">
              <h3 className="font-semibold text-white mb-3 text-sm">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </nav>
            <nav aria-label="Legal links">
              <h3 className="font-semibold text-white mb-3 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </nav>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2024 AchievingCoach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
