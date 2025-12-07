'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target } from 'lucide-react';
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
              'Professional Coaching Platform',
              'End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.',
              'https://achievingcoach.com'
            )
          ),
        }}
      />

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
                <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
                <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Log In</Link>
                <Link href="/sign-up" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors">
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-24 px-6 bg-white" aria-labelledby="hero-heading">
          <div className="max-w-3xl mx-auto text-center">
            <h1 id="hero-heading" className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Elevate Your Coaching Practice
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              An end-to-end platform for professional coaches to manage coaching practices, track client progress, and acquire structured development exercises.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Start Your 14-day Free Trial
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Product Screenshot */}
        <section className="py-12 px-6 bg-gray-50" aria-label="Platform preview">
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

        {/* Features */}
        <section className="py-24 px-6 bg-white" aria-labelledby="features-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="features-heading" className="text-4xl font-bold text-gray-900 mb-4">
                A Smarter Way to Coach
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AchievingCoach provides the tools you need to deliver exceptional results, maintain professional standards, and grow your practice.
              </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <article className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Client Progress Tracking</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Monitor client growth with real-time analytics and visual progress reports.
                </p>
              </article>

              <article className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">ICF Competency Evaluation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Assess and track your coaching against all ICF core competencies.
                </p>
              </article>

              <article className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Development Library</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Access a curated library of coaching tools and frameworks.
                </p>
              </article>

              <article className="text-center">
                <div className="mb-4 flex justify-center">
                  <svg className="w-12 h-12 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
        <section className="py-24 px-6 bg-gray-50" aria-labelledby="why-choose-heading">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
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

                <ul className="space-y-6" role="list">
                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Maintain Professional Standards</h3>
                      <p className="text-sm text-gray-600">Stay ICF-compliant with tools that keep you aligned with industry best practices.</p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Improve Client Outcomes</h3>
                      <p className="text-sm text-gray-600">Structured exercises and real-time insights help you track and improve results.</p>
                    </div>
                  </li>

                  <li className="flex gap-3">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
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
        <section className="py-24 px-6 bg-white" aria-labelledby="testimonials-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 mb-4">
                Loved by Coaches Worldwide
              </h2>
              <p className="text-gray-600">
                Don't just take our word for it. Here's what certified professionals are saying about our platform.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
              <article className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="/images/testimonials/maria-s.webp" alt="Maria S." className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Maria S., PCC</div>
                    <div className="text-sm text-gray-600">Executive Coach</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  "This platform significantly improved how I manage my coaching practice. The ICF competency tools are outstanding."
                </p>
              </article>

              <article className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="/images/testimonials/david-l.webp" alt="David L." className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">David L., ACC</div>
                    <div className="text-sm text-gray-600">Career Coach</div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  "Finally, a coaching platform that gets it right. My clients love the structured exercises and I love the analytics."
                </p>
              </article>

              <article className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="/images/testimonials/chloe-r.webp" alt="Chloe R." className="w-full h-full object-cover" />
                  </div>
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
        <section className="py-24 px-6 bg-gradient-to-br from-purple-600 via-primary-600 to-primary-700" aria-labelledby="cta-heading">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 id="cta-heading" className="text-4xl font-bold mb-6">
              Ready to Transform Your Coaching Business?
            </h2>
            <p className="text-lg mb-8 text-white/90 leading-relaxed">
              Join hundreds of coaches using our AI-powered tools to deliver exceptional results and grow their practice.
            </p>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-2xl transition-all">
              Start Your 14-Day Free Trial
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-16 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-semibold text-white">AchievingCoach</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Professional coaching platform for certified coaches worldwide.
                </p>
              </div>
              
              <nav aria-label="Product links">
                <h3 className="font-semibold text-white mb-4 text-sm">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                </ul>
              </nav>

              <nav aria-label="Company links">
                <h3 className="font-semibold text-white mb-4 text-sm">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                  <li><Link href="/organizations" className="hover:text-white transition-colors">For Organizations</Link></li>
                </ul>
              </nav>

              <nav aria-label="Legal links">
                <h3 className="font-semibold text-white mb-4 text-sm">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </nav>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
              <p>© 2024 AchievingCoach. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
