'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Target, ArrowRight, BarChart3, Users, Award, FileText, Zap, Shield, CheckCircle, Calendar, MessageSquare, Download } from 'lucide-react';
import { LANDING_IMAGES } from '@/data/landing-images';

export default function FeaturesPage() {
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
              <Link href="/features" className="text-gray-900 font-semibold">Features</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About</Link>
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Log In</Link>
              <Link href="/sign-up" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            The Operating System for Professional Coaching
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Streamline your practice, track client progress, and elevate your impact with an end-to-end platform designed for professional coaches.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-xl transition-all text-lg font-semibold">
            Start Your 14-Day Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Workspaces Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-20">
            {/* Coach Workspace */}
            <WorkspaceCard
              badge="Coach Workspace"
              title="Your Command Center"
              description="Manage your entire coaching practice from a single, intuitive dashboard. Track client journeys, schedule sessions, and access your resource library with ease."
              image={LANDING_IMAGES.analytics.src}
              imageAlt={LANDING_IMAGES.analytics.alt}
            />

            {/* Coachee Workspace */}
            <WorkspaceCard
              badge="Coachee Workspace"
              title="A Focused Space for Growth"
              description="Empower clients with a dedicated portal to track goals, complete exercises, and communicate securely, fostering accountability and engagement."
              image={LANDING_IMAGES.sessionManagement.src}
              imageAlt={LANDING_IMAGES.sessionManagement.alt}
              reverse
            />

            {/* Supervisor Workspace */}
            <WorkspaceCard
              badge="Supervisor Workspace"
              title="Elevate Your Coaching Team"
              description="Oversee coach development with ICF competency evaluations, performance analytics, and streamlined feedback workflows to ensure quality and consistency."
              image={LANDING_IMAGES.icfEvaluation.src}
              imageAlt={LANDING_IMAGES.icfEvaluation.alt}
            />

            {/* Admin Workspace */}
            <WorkspaceCard
              badge="Admin Workspace"
              title="Platform-Wide Oversight"
              description="Manage your entire organization, from user roles and billing to branding and security settings, ensuring your platform runs smoothly."
              image={LANDING_IMAGES.stakeholderMap.src}
              imageAlt={LANDING_IMAGES.stakeholderMap.alt}
              reverse
            />
          </div>
        </div>
      </section>

      {/* Powerful Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features, Seamlessly Integrated</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a professional coaching business, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Client Progress Tracking"
              description="Visualize client journeys from start to finish. Monitor goal completion and track milestones."
              iconColor="bg-blue-500"
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="ICF Evaluation System"
              description="Use Anthropic's powerful AI frameworks to assess coaching against ICF core competencies."
              iconColor="bg-purple-500"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6" />}
              title="Accountability Tracking"
              description="Help clients stay on track with task lists, deadlines, and automated reminders."
              iconColor="bg-pink-500"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Analytics Dashboards"
              description="Visualize key metrics and client progress with custom dashboards and charts."
              iconColor="bg-indigo-500"
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Engagement Workflow"
              description="Assign tools, worksheets, and resources to clients directly from your library."
              iconColor="bg-green-500"
            />
            <FeatureCard
              icon={<Download className="w-6 h-6" />}
              title="Supervision Workflows"
              description="Streamline coach supervision with structured feedback, evaluations, and reports."
              iconColor="bg-orange-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Get up and running in minutes. Transform your coaching practice in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create"
              description="Set up your profile, create client profiles, and build your resource library."
            />
            <StepCard
              number="2"
              title="Coach"
              description="Engage with clients, deliver exercises, and track real-time progress toward their goals."
            />
            <StepCard
              number="3"
              title="Measure"
              description="Analyze engagement, evaluate competencies, and demonstrate your impact."
            />
          </div>
        </div>
      </section>

      {/* Works With Your Favorite Tools */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Works With Your Favorite Tools</h2>
          <p className="text-xl text-gray-600 mb-12">
            Connect AchievingCoach to the tools you already use to create a seamless workflow.
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-50">
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Zoom</span>
            </div>
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Calendar</span>
            </div>
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Slack</span>
            </div>
            <div className="w-32 h-16 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-600 font-semibold">Google</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-secondary-600 to-primary-600">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Elevate Your Coaching?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of coaches using our AI-powered tools to delivering exceptional results. Start your free trial—no credit card required.
          </p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-lg hover:shadow-2xl transition-all text-lg font-semibold">
            Start Your 14-Day Free Trial
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
function WorkspaceCard({ badge, title, description, image, imageAlt, reverse }: any) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
      {reverse ? (
        <>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100 aspect-video">
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              {badge}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              {badge}
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
            <p className="text-lg text-gray-600">{description}</p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100 aspect-video">
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </div>
        </>
      )}
    </div>
  );
}

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

function StepCard({ number, title, description }: any) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
