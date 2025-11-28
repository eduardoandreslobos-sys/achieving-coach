import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users, TrendingUp, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: 'AchievingCoach - Professional Coaching Platform for Organizations',
  description: 'Transform your coaching practice with AchievingCoach. Professional tools including GROW Model, DISC Assessment, Wheel of Life, and more. Trusted by coaches and organizations worldwide. Start your 14-day free trial.',
  keywords: [
    'coaching platform',
    'professional coaching software',
    'coaching tools',
    'GROW model',
    'DISC assessment',
    'wheel of life',
    'corporate coaching',
    'coaching management',
    'ICF coaching tools',
    'coaching SaaS'
  ],
  openGraph: {
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Professional coaching tools and client management for coaches and organizations. GROW, DISC, Wheel of Life, and 10+ tools included.',
    url: 'https://achievingcoach.com',
    siteName: 'AchievingCoach',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'AchievingCoach - Professional Coaching Platform Dashboard',
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Transform your coaching practice with professional tools and client management.',
    images: ['/twitter-home.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header/Nav */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                href="/sign-in" 
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-medium"
              >
                Start Free Trial
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Coaching Platform for{' '}
            <span className="text-primary-600">Modern Organizations</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Transform your coaching practice with powerful tools, client management, 
            and proven frameworks. Trusted by coaches and organizations worldwide.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/sign-up" 
              className="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 font-semibold text-lg flex items-center gap-2"
            >
              Start 14-Day Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/sign-in" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 font-semibold text-lg"
            >
              Sign In
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Full access during trial
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Scale Your Coaching Practice
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Professional Tools</h4>
              <p className="text-gray-600 mb-4">
                GROW Model, DISC Assessment, Wheel of Life, Stakeholder Map, 
                and 10+ proven coaching frameworks.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">ICF-aligned methodologies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Interactive exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Progress tracking</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Client Management</h4>
              <p className="text-gray-600 mb-4">
                Manage unlimited clients, track progress, schedule sessions, 
                and maintain detailed coaching records.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Unlimited coachees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Session scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Notes & reflections</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Growth Insights</h4>
              <p className="text-gray-600 mb-4">
                Track progress, measure impact, and demonstrate ROI with 
                comprehensive analytics and reporting.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Progress dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Goal tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600">Impact reports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Transform Your Coaching Practice?
          </h3>
          <p className="text-xl mb-8 text-primary-100">
            Join hundreds of coaches and organizations using AchievingCoach
          </p>
          <Link 
            href="/sign-up" 
            className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-semibold text-lg inline-flex items-center gap-2"
          >
            Start Your 14-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-primary-100 mt-4">
            No credit card required • Full access • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              © 2024 AchievingCoach. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <Link href="/privacy" className="text-sm hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-sm hover:text-white">Terms of Service</Link>
              <Link href="/contact" className="text-sm hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
