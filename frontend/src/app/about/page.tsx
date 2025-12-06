import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Heart, Users, Zap, Shield, Lightbulb, Award } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'About Us | AchievingCoach - Professional Coaching Platform',
  description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools, our journey since 2021, and our commitment to ICF standards.',
  keywords: [
    'about achievingcoach',
    'coaching platform company',
    'professional coaching software',
    'ICF compliant platform',
    'coaching technology',
    'coaching tools',
  ],
  authors: [{ name: 'AchievingCoach' }],
  openGraph: {
    title: 'About Us | AchievingCoach',
    description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools.',
    url: 'https://achievingcoach.com/about',
    siteName: 'AchievingCoach',
    images: [{ url: 'https://achievingcoach.com/images/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | AchievingCoach',
    description: 'Learn about AchievingCoach: our mission to empower professional coaches with world-class tools.',
    images: ['https://achievingcoach.com/images/og-image.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
    description: 'Professional coaching platform for certified coaches worldwide.',
    sameAs: [],
  },
};

const founders = [
  {
    name: 'James Mitchell',
    role: 'Co-Founder & CEO',
    bio: 'ICF Master Certified Coach with 15+ years helping leaders unlock their potential.',
    gradient: 'from-primary-400 to-primary-600',
  },
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & CTO',
    bio: 'Former tech lead passionate about building tools that empower coaches worldwide.',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Michael Torres',
    role: 'Co-Founder & CPO',
    bio: 'Executive coach and product designer focused on creating intuitive experiences.',
    gradient: 'from-blue-400 to-blue-600',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Coach-First',
    description: 'Every decision starts with: How does this serve coaches and their clients?',
    color: 'primary',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to the highest standards, aligned with ICF competencies.',
    color: 'purple',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in the power of learning from coaches around the world.',
    color: 'green',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Embracing new tech while respecting timeless coaching principles.',
    color: 'orange',
  },
];

const timeline = [
  { year: '2021', title: 'Foundation & Research', description: 'Started with extensive research, interviewing 100+ ICF-certified coaches to define core challenges and platform requirements.' },
  { year: '2022', title: 'Product Launch', description: 'Launched initial platform offering core features for session management, goal tracking, and client communication.' },
  { year: '2023', title: 'First Organizations Onboarded', description: 'Platform proven for scale as we welcomed our first corporate clients, providing coaching teams with tools for certification and performance.' },
  { year: '2024', title: 'Platform Evolution', description: 'Introduced advanced features including ICF competency evaluation tools, library of structured exercises, and deeper integrations.' },
];

const trustPillars = [
  {
    icon: Shield,
    title: 'Robust Data Security',
    description: 'We employ best-in-class encryption and industry-best security practices to ensure your data is always protected.',
  },
  {
    icon: Heart,
    title: 'Ethical by Design',
    description: 'Our platform supports the ethical guidelines of professional coaching bodies, built for transparency and integrity.',
  },
  {
    icon: Users,
    title: 'Privacy-First Approach',
    description: 'We believe in data privacy, never selling your data and providing you with full control over your information.',
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="min-h-screen bg-white" role="main">
        
        {/* Hero */}
        <section className="relative py-24 px-6 bg-gradient-to-br from-gray-900 via-primary-900 to-purple-900 overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10"></div>
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
                  AchievingCoach was born from a simple observation: the world&apos;s best coaches were overwhelmed by inefficient tools—juggling spreadsheets, managing appointments, and compiling notes—time on what they do best: transforming lives.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We envisioned a single, elegant platform that would not only streamline the business of coaching but elevate the practice itself. A system designed to foster deeper client connections, provide clear visibility into progress, and align every engagement with the highest professional standards, including those of the International Coaching Federation (ICF).
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
              <p className="text-gray-600">From a simple idea to a comprehensive platform, our journey has been driven by a passion for empowering coaches and their clients.</p>
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

        {/* Trust Foundation */}
        <section className="py-20 px-6 bg-white" aria-labelledby="trust-heading">
          <div className="max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="trust-heading" className="text-3xl font-bold text-gray-900 mb-4">Built on a Foundation of Trust</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The coach-client relationship is sacred. We built our platform to honor and protect that relationship with an unwavering commitment to security, ethics, and privacy.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-8">
              {trustPillars.map((pillar, index) => (
                <article key={index} className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100 hover:border-primary-200 transition-colors">
                  <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <pillar.icon className="w-7 h-7 text-primary-600" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{pillar.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{pillar.description}</p>
                </article>
              ))}
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
              {values.map((value, index) => (
                <article key={index} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 bg-${value.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className={`w-6 h-6 text-${value.color}-600`} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-20 px-6 bg-white" aria-labelledby="team-heading">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-16">
              <h2 id="team-heading" className="text-3xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
              <p className="text-gray-600">The minds behind the mission, combining decades of expertise in professional coaching and software engineering.</p>
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
            <p className="text-lg text-gray-300 mb-8">
              Ready to streamline your coaching practice and deliver exceptional results? Join a community of forward-thinking professionals dedicated to the art and science of coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/sign-up" 
                className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:shadow-xl transition-all"
                aria-label="Get started for free"
              >
                Get Started for Free
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
                aria-label="Talk to sales team"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
