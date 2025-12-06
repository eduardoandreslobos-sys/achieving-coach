import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Target, Heart, Users, Zap } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';
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

export default function AboutPage() {
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
              <Link href="/about" className="text-sm text-gray-900 font-semibold" aria-current="page">About</Link>
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
            Building the Future of Professional Coaching
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're on a mission to empower coaches worldwide with technology that amplifies their impact and simplifies their practice.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="mission-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <article className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To provide professional coaches with intuitive, powerful tools that help them deliver exceptional results while maintaining the highest standards of coaching excellence. We believe technology should enhance, not replace, the human connection at the heart of coaching.
              </p>
            </article>

            <article className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A world where every professional coach has access to world-class tools that enable them to focus on what matters most: transforming lives. We envision a coaching ecosystem powered by technology that respects the profession's integrity and amplifies coaches' impact.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="py-20 px-6 bg-white" aria-labelledby="journey-heading">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="journey-heading" className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600">From idea to impact</p>
          </header>

          <div className="space-y-12">
            <article className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2021
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">The Beginning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Founded by professional coaches who experienced firsthand the challenges of managing a coaching practice with disconnected tools. We knew there had to be a better way.
                </p>
              </div>
            </article>

            <article className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2022
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Building & Testing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Worked closely with 50+ professional coaches to design and refine our platform. Every feature was tested in real coaching scenarios to ensure it truly served the profession.
                </p>
              </div>
            </article>

            <article className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2023
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Official Launch</h3>
                <p className="text-gray-600 leading-relaxed">
                  Launched AchievingCoach to the public. Within months, hundreds of coaches from 30+ countries were using the platform to transform their practices and their clients' lives.
                </p>
              </div>
            </article>

            <article className="flex gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2024
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Growth & Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Expanded our tool library, launched the ICF Simulator, and introduced advanced analytics. Our community has grown to thousands of coaches delivering exceptional results worldwide.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gray-50" aria-labelledby="values-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="values-heading" className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600">The principles that guide everything we do</p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Coach-First</h3>
              <p className="text-gray-600 text-sm">
                Every decision we make starts with the question: How does this serve coaches and their clients?
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                We're committed to the highest standards of quality, aligning with ICF competencies and best practices.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">
                We believe in the power of community and continuously learn from coaches around the world.
              </p>
            </article>

            <article className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-orange-600" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                We embrace new technologies while respecting the timeless principles of professional coaching.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white" aria-labelledby="team-heading">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16">
            <h2 id="team-heading" className="text-3xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
            <p className="text-gray-600">Professional coaches turned tech entrepreneurs</p>
          </header>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <article className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-purple-400 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eduardo Lobos</h3>
              <p className="text-primary-600 text-sm font-medium mb-3">Co-Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                ICF-certified coach with 10+ years helping leaders unlock their potential.
              </p>
            </article>

            <article className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
              <p className="text-primary-600 text-sm font-medium mb-3">Co-Founder & CTO</p>
              <p className="text-gray-600 text-sm">
                Former tech lead at Google, passionate about building tools that empower people.
              </p>
            </article>

            <article className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-primary-400 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Michael Rodriguez</h3>
              <p className="text-primary-600 text-sm font-medium mb-3">Co-Founder & CPO</p>
              <p className="text-gray-600 text-sm">
                Executive coach and product designer focused on creating intuitive experiences.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 via-primary-600 to-primary-700" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 id="cta-heading" className="text-4xl font-bold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8 text-white/90">
            Become part of a global community of coaches transforming lives
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
