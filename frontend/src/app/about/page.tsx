import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Shield, Award, Users, Lightbulb, Heart, Rocket, Calendar } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'About Us – Our Mission, Vision & Team | AchievingCoach',
  description: 'Learn about AchievingCoach\'s mission to empower coaches worldwide. Discover our story, values, and the team behind the platform.',
  keywords: ['about achievingcoach', 'coaching platform company', 'coaching software team'],
  openGraph: {
    title: 'About AchievingCoach – Our Mission, Vision & Team',
    description: 'Learn about AchievingCoach\'s mission to empower coaches worldwide. Discover our story, values, and the team behind the platform.',
    url: 'https://achievingcoach.com/about',
  },
};

const timeline = [
  {
    year: '2021',
    title: 'Foundation & Research',
    description: 'Interviewed 100+ ICF-certified coaches to understand challenges and needs.',
  },
  {
    year: '2022',
    title: 'Product Launch',
    description: 'Delivered core features for session scheduling, client management, and progress tracking.',
  },
  {
    year: '2023',
    title: 'First Organizations Onboard',
    description: 'Added multi-coach support and enhanced security for enterprise needs.',
  },
  {
    year: '2024',
    title: 'Platform Evolution',
    description: 'Introduced ICF competency tools, expanded coaching library, AI-powered reporting, and advanced analytics.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Coach-First',
    description: 'Every decision starts by asking, "How will this serve coaches and coachees?"',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to the highest quality, aligned with ICF standards.',
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We actively listen to feedback and foster knowledge-sharing among coaches worldwide.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace innovation – from AI-powered insights to new coaching methodologies.',
    color: 'bg-purple-100 text-purple-600',
  },
];

const founders = [
  {
    name: 'James Mitchell',
    role: 'Co-Founder & CEO',
    bio: 'ICF Master Certified Coach (MCC) with 15+ years of experience helping leaders unlock their potential.',
    initials: 'JM',
    color: 'bg-primary-600',
  },
  {
    name: 'Sarah Chen',
    role: 'Co-Founder & CTO',
    bio: 'Former senior tech lead who has built enterprise software products used by thousands.',
    initials: 'SC',
    color: 'bg-green-600',
  },
  {
    name: 'Michael Torres',
    role: 'Co-Founder & CPO',
    bio: 'Executive coach and product designer dedicated to creating intuitive user experiences.',
    initials: 'MT',
    color: 'bg-purple-600',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            The Future of Professional Coaching
          </h1>
          <p className="text-xl text-gray-600">
            Empowering coaches and their clients through a unified platform designed for growth, clarity, and success.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Built AchievingCoach</h2>
              <p className="text-lg text-gray-600 mb-6">
                AchievingCoach was born from a simple observation: even the world's best coaches were overwhelmed by inefficient tools and administrative burdens. Coaches were juggling spreadsheets, manual calendars, and disparate apps – spending hours on logistics instead of transforming lives.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We envisioned a single, elegant platform that would streamline the business of coaching and elevate the coaching process itself.
              </p>
              <div className="bg-primary-50 p-6 rounded-xl">
                <p className="text-primary-800 font-semibold text-lg">
                  "Our mission: Give coaches back their time and amplify their impact."
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-primary-600 mb-2">500+</p>
                <p className="text-gray-600">Active Coaches</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">30+</p>
                <p className="text-gray-600">Countries</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-purple-600 mb-2">10,000+</p>
                <p className="text-gray-600">Sessions Tracked</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-orange-600 mb-2">98%</p>
                <p className="text-gray-600">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              From a simple idea to a comprehensive platform.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 hidden md:block"></div>

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold z-10">
                    {item.year.slice(2)}
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-primary-600">{item.year}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built on a Foundation of Trust</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The coach–client relationship is sacred. We honor that by embedding security, ethics, and privacy into everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Robust Data Security</h3>
              <p className="text-gray-600">
                Bank-level encryption and regular security audits. Your data is safe with us.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ethical by Design</h3>
              <p className="text-gray-600">
                Built to support ICF ethical guidelines and uphold the highest standards of professional conduct.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy-First Approach</h3>
              <p className="text-gray-600">
                Your data is yours. We never sell your information. Full control to export or delete anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              Our values keep us grounded in our mission and guide how we build our product.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div key={i} className="bg-white p-6 rounded-xl">
                <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
            <p className="text-lg text-gray-600">
              Combining decades of expertise in professional coaching and software engineering.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, i) => (
              <div key={i} className="text-center">
                <div className={`w-24 h-24 ${founder.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl font-bold text-white">{founder.initials}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{founder.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{founder.role}</p>
                <p className="text-gray-600 text-sm">{founder.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ready to streamline your coaching practice and deliver exceptional results?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-400 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
