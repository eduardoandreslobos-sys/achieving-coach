'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, ArrowRight, Heart, Users, Lightbulb, TrendingUp } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function AboutPage() {
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
              <Link href="/about" className="text-gray-900 font-semibold">About</Link>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Log In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            The Future of Professional Coaching
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering coaches and their clients through a unified platform designed for growth, accountability, and success.
          </p>
        </div>
      </section>

      {/* Why We Built AchievingCoach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why We Built AchievingCoach</h2>
              <p className="text-lg text-gray-600 mb-4">
                AchievingCoach was born from a simple observation: the world's best coaches lack the infrastructure they need to operate efficiently. We built what we wished existed.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Working in close partnership with ICF-certified coaches and consulting firms, we identified the biggest pain points. From managing client relationships, provide easy-to-deploy programs, and make every engagement with the highest professional standards, AchievingCoach simplifies the complexities of modern coaching.
              </p>
              <p className="text-lg text-gray-600">
                Today, AchievingCoach is trusted by thousands of coaches worldwide. We're on a mission to elevate coaching standards and make transformational coaching accessible to more people than ever before.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-primary-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600 text-sm">To democratize access to professional coaching through technology.</p>
              </div>
              <div className="bg-secondary-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-secondary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600 text-sm">A world where every professional has access to transformational coaching.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">From a simple idea to a comprehensive platform, our journey has been driven by a passion for empowering coaches and their clients.</p>
          </div>

          <div className="space-y-12">
            <TimelineItem
              year="2021"
              title="Foundation & Research"
              description="The concept was born. We conducted extensive research with coaching professionals and built our initial prototypes to validate the market need and gather feedback from certified coaches."
            />
            <TimelineItem
              year="2022"
              title="Product Launch"
              description="After months of development and refinement, we officially launched AchievingCoach. Our first features included client management and basic progress tracking."
            />
            <TimelineItem
              year="2023"
              title="First Organizations Onboarded"
              description="We began partnering with coaching firms and HR departments, expanding our platform to serve organizational coaching programs at scale."
            />
            <TimelineItem
              year="2024"
              title="Platform at Scale"
              description="Today, we support thousands of coaches across 50+ countries, with advanced analytics, ICF evaluation tools, and an extensive coaching framework library."
            />
          </div>
        </div>
      </section>

      {/* Built on a Foundation of Trust */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built on a Foundation of Trust</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The coach-client relationship is sacred. We built our platform on transparency, security, and professional excellence so you can coach with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Target className="w-6 h-6" />}
              title="Robust Data Security"
              description="Your coaching data is encrypted at rest and in transit with bank-level security. We're SOC 2 compliant and take data privacy seriously."
              iconColor="bg-blue-500"
            />
            <ValueCard
              icon={<Heart className="w-6 h-6" />}
              title="Integrity by Design"
              description="Built in close partnership with certified ICF coaches, every feature is designed to uphold the highest professional standards."
              iconColor="bg-purple-500"
            />
            <ValueCard
              icon={<Users className="w-6 h-6" />}
              title="Privacy-First Approach"
              description="Client data belongs to coaches and clients—not to us. We're transparent about how information flows within our platform and only collect what's essential."
              iconColor="bg-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CoreValueCard
              icon={<Heart className="w-6 h-6 text-red-600" />}
              title="Empowerment"
              description="We exist to help you and your clients achieve their best. Every decision we make is guided by this mission."
            />
            <CoreValueCard
              icon={<Target className="w-6 h-6 text-blue-600" />}
              title="Integrity"
              description="We're honest and transparent in all we do. Our platform is built on ethical practices and professional standards."
            />
            <CoreValueCard
              icon={<Lightbulb className="w-6 h-6 text-yellow-600" />}
              title="Innovation"
              description="We constantly evolve to meet the changing needs of modern coaching through technology and best practices."
            />
            <CoreValueCard
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              title="Client Success"
              description="We measure success by your success. Your growth and your clients' outcomes are our top priorities."
            />
          </div>
        </div>
      </section>

      {/* Meet the Founders */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
            <p className="text-xl text-gray-600">
              The minds behind AchievingCoach, combining decades of expertise in professional coaching and software development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FounderCard
              name="Jane Doe"
              role="Co-Founder & CEO"
              bio="A former PCC coach with 15+ years of experience helping executives reach their full potential."
            />
            <FounderCard
              name="John Smith"
              role="Co-Founder & CTO"
              bio="A seasoned technologist who's passionate about using technology to amplify human potential."
            />
            <FounderCard
              name="Emily Wilson"
              role="Chief Product Officer"
              bio="Expert at designing intuitive digital experiences with a background in coaching and UX design."
            />
          </div>
        </div>
      </section>

      {/* Our Strategic Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Strategic Partners</h2>
          <p className="text-xl text-gray-600 mb-12">
            We're proud to collaborate with top-tier leaders for best-in-class standards of coaching.
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
            <div className="w-32 h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8 text-white/90">
            Ready to streamline your coaching practice and deliver exceptional results? Take a community of forward-thinking professionals dedicated to the craft of professional coaching today.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-2xl transition-all text-lg font-semibold">
            Get Started for Free
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
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
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
function TimelineItem({ year, title, description }: any) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
          {year.slice(2)}
        </div>
        <div className="w-0.5 h-full bg-primary-200 mt-2"></div>
      </div>
      <div className="pb-12">
        <div className="text-sm text-primary-600 font-semibold mb-1">{year}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon, title, description, iconColor }: any) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CoreValueCard({ icon, title, description }: any) {
  return (
    <div className="bg-white rounded-xl p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function FounderCard({ name, role, bio }: any) {
  return (
    <div className="text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-4"></div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-primary-600 font-medium mb-3">{role}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
    </div>
  );
}
