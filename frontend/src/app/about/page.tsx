import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Heart, Users, Zap, Shield, Lightbulb, Award } from 'lucide-react';
import { generateMetadata as genMeta } from '@/lib/metadata';

export const metadata: Metadata = genMeta({
  title: 'About Us - Professional Coaching Platform',
  description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools, our journey since 2021, and our commitment to ICF standards.',
  keywords: [
    'about achievingcoach',
    'coaching platform company',
    'professional coaching software',
    'ICF compliant platform',
    'coaching technology',
  ],
  path: '/about',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About AchievingCoach',
  description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools.',
  url: 'https://achievingcoach.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'AchievingCoach',
    url: 'https://achievingcoach.com',
    foundingDate: '2021',
  },
};

const founders = [
  { name: 'James Mitchell', role: 'Co-Founder & CEO', bio: 'ICF Master Certified Coach with 15+ years helping leaders unlock their potential.', gradient: 'from-primary-400 to-primary-600' },
  { name: 'Sarah Chen', role: 'Co-Founder & CTO', bio: 'Former tech lead passionate about building tools that empower coaches worldwide.', gradient: 'from-purple-400 to-purple-600' },
  { name: 'Michael Torres', role: 'Co-Founder & CPO', bio: 'Executive coach and product designer focused on creating intuitive experiences.', gradient: 'from-blue-400 to-blue-600' },
];

const timeline = [
  { year: '2021', title: 'Foundation & Research', description: 'Started with extensive research, interviewing 100+ ICF-certified coaches to define core challenges.' },
  { year: '2022', title: 'Product Launch', description: 'Launched initial platform with core features for session management and client communication.' },
  { year: '2023', title: 'First Organizations', description: 'Platform proven for scale as we welcomed our first corporate coaching teams.' },
  { year: '2024', title: 'Platform Evolution', description: 'Introduced ICF competency tools, structured exercises library, and deeper integrations.' },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="border-b border-gray-100" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" aria-label="AchievingCoach Home">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-sm text-gray-900 font-semibold" aria-current="page">About</Link>
              <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log In</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700">Start Free Trial</Link>
            </div>
          </div>
        </nav>

        <main role="main">
          {/* Hero */}
          <section className="relative py-24 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900" aria-labelledby="hero-heading">
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                The Future of Professional Coaching
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Empowering coaches and their clients through a unified platform designed for growth, clarity, and success.
              </p>
            </div>
          </section>

          {/* Why We Built */}
          <section className="py-20 px-6 bg-white" aria-labelledby="why-heading">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 id="why-heading" className="text-3xl font-bold text-gray-900 mb-6">Why We Built AchievingCoach</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    AchievingCoach was born from a simple observation: the world&apos;s best coaches were overwhelmed by inefficient tools—juggling spreadsheets, managing appointments, and compiling notes—instead of focusing on what they do best: transforming lives.
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    We envisioned a single, elegant platform that would not only streamline the business of coaching but elevate the practice itself. A system designed to foster deeper client connections, provide clear visibility into progress, and align every engagement with ICF standards.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We built AchievingCoach to give coaches back their time and amplify their impact.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                      <div className="text-sm text-gray-600">Active Coaches</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary-600 mb-2">30+</div>
                      <div className="text-sm text-gray-600">Countries</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
                      <div className="text-sm text-gray-600">Sessions Tracked</div>
                    </div>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
                      <div className="text-sm text-gray-600">Satisfaction Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Journey Timeline */}
          <section className="py-20 px-6 bg-gray-50" aria-labelledby="journey-heading">
            <div className="max-w-4xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="journey-heading" className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
                <p className="text-gray-600">From a simple idea to a comprehensive platform.</p>
              </header>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" aria-hidden="true"></div>
                <div className="space-y-12">
                  {timeline.map((item, index) => (
                    <article key={index} className="relative pl-20">
                      <div className="absolute left-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {item.year.slice(-2)}
                      </div>
                      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <span className="text-primary-600 font-semibold text-sm">{item.year}</span>
                        <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Trust */}
          <section className="py-20 px-6 bg-white" aria-labelledby="trust-heading">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="trust-heading" className="text-3xl font-bold text-gray-900 mb-4">Built on a Foundation of Trust</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">The coach-client relationship is sacred. We honor it with unwavering commitment to security, ethics, and privacy.</p>
              </header>
              <div className="grid md:grid-cols-3 gap-8">
                <article className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-7 h-7 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Robust Data Security</h3>
                  <p className="text-gray-600 text-sm">Bank-level encryption and industry-best security practices protect your data.</p>
                </article>
                <article className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-7 h-7 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Ethical by Design</h3>
                  <p className="text-gray-600 text-sm">Built to support ICF ethical guidelines with transparency and integrity.</p>
                </article>
                <article className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-7 h-7 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy-First Approach</h3>
                  <p className="text-gray-600 text-sm">We never sell your data. You have full control over your information.</p>
                </article>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="py-20 px-6 bg-gray-50" aria-labelledby="values-heading">
            <div className="max-w-6xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="values-heading" className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
              </header>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <article className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Coach-First</h3>
                  <p className="text-gray-600 text-sm">Every decision starts with: How does this serve coaches?</p>
                </article>
                <article className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-purple-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
                  <p className="text-gray-600 text-sm">Committed to the highest standards, aligned with ICF.</p>
                </article>
                <article className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-green-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 text-sm">Learning from coaches around the world.</p>
                </article>
                <article className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600 text-sm">Embracing new tech while respecting coaching principles.</p>
                </article>
              </div>
            </div>
          </section>

          {/* Founders */}
          <section className="py-20 px-6 bg-white" aria-labelledby="team-heading">
            <div className="max-w-5xl mx-auto">
              <header className="text-center mb-16">
                <h2 id="team-heading" className="text-3xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
                <p className="text-gray-600">Combining decades of expertise in professional coaching and software engineering.</p>
              </header>
              <div className="grid md:grid-cols-3 gap-8">
                {founders.map((founder, index) => (
                  <article key={index} className="text-center">
                    <div className={`w-32 h-32 bg-gradient-to-br ${founder.gradient} rounded-full mx-auto mb-6 shadow-lg`}></div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                    <p className="text-primary-600 text-sm font-medium mb-3">{founder.role}</p>
                    <p className="text-gray-600 text-sm">{founder.bio}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900" aria-labelledby="cta-heading">
            <div className="max-w-3xl mx-auto text-center">
              <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6">Join Our Mission</h2>
              <p className="text-lg text-gray-300 mb-8">Ready to streamline your coaching practice and deliver exceptional results?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all">Get Started for Free</Link>
                <Link href="/contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">Talk to Sales</Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm">© 2024 AchievingCoach. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
