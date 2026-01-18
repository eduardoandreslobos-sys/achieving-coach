import { Metadata } from 'next';
import Link from 'next/link';
import { Users, BarChart3, Shield, Palette, Settings, HeadphonesIcon, CheckCircle, Building2, Target, TrendingUp } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'For Organizations – Enterprise Coaching Platform',
  description: 'Enterprise coaching platform for HR and L&D leaders. Manage coaches at scale, track ROI, ensure security (SOC 2, GDPR, HIPAA).',
  keywords: ['enterprise coaching platform', 'corporate coaching software', 'coaching ROI', 'leadership development platform'],
  openGraph: {
    title: 'AchievingCoach for Organizations – Enterprise Coaching Platform',
    description: 'Enterprise coaching platform for HR and L&D leaders. Manage coaches at scale, track ROI, ensure security.',
    url: 'https://achievingcoach.com/organizations',
  },
};

const features = [
  {
    icon: Users,
    title: 'Multi-Coach Management',
    description: 'Centrally manage multiple coaches through a single admin dashboard. Assign clients, monitor activity, and ensure consistency.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: BarChart3,
    title: 'ROI Analytics',
    description: 'Prove the value of coaching with hard numbers. Track engagement rates, goal completion, and performance improvements.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Shield,
    title: 'Compliance & Security',
    description: 'SSO integration, role-based access controls, audit logs. GDPR compliant, HIPAA-ready, SOC 2 Type II certified.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Apply your company\'s logo, colors, and terminology. Seamless, branded experience for your employees.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Settings,
    title: 'API & Integrations',
    description: 'Connect to your HRIS, LMS, or talent management systems. Automate data flow with our comprehensive API.',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Customer Success Manager, personalized training, and SLA guarantees. We partner with you every step.',
    color: 'bg-red-100 text-red-600',
  },
];

const useCases = [
  {
    title: 'Leadership Development',
    description: 'Develop your next generation of leaders with structured coaching programs.',
    items: ['High-potential identification', 'Succession planning', 'Executive onboarding'],
    icon: Target,
    color: 'bg-primary-600',
  },
  {
    title: 'Performance Coaching',
    description: 'Improve individual and team performance with targeted coaching interventions.',
    items: ['Goal achievement', 'Skill development', 'Career transitions'],
    icon: TrendingUp,
    color: 'bg-green-600',
  },
  {
    title: 'Culture Transformation',
    description: 'Build and sustain a strong company culture by scaling coaching broadly.',
    items: ['Change management', 'Team alignment', 'Embedding cultural values'],
    icon: Building2,
    color: 'bg-purple-600',
  },
];

const stats = [
  { value: '87%', label: 'Increase in employee engagement', note: 'reported by organizations' },
  { value: '62%', label: 'Reduction in leadership turnover', note: 'on average' },
  { value: '3.5×', label: 'Return on coaching investment', note: 'in the first year' },
];

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            Enterprise Solution
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Scale Your Coaching Impact and Prove the ROI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AchievingCoach for Organizations is an enterprise coaching platform designed for companies running coaching programs at scale. Manage all your coaches and participants in one system, track organization-wide progress, and demonstrate clear ROI.
          </p>
          <Link
            href="/contact?type=enterprise"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg"
          >
            Request a Demo
          </Link>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run successful coaching programs at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-gray-50 p-6 rounded-xl">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Demonstrate Clear ROI</h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              When investing in coaching at scale, leadership expects results. AchievingCoach provides the analytics to measure impact in business terms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
                <p className="text-5xl font-bold mb-2">Up to {stat.value}</p>
                <p className="text-primary-100 mb-2">{stat.label}</p>
                <p className="text-sm text-primary-200">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6">What You Can Measure:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Program Utilization</p>
                  <p className="text-primary-200 text-sm">Enrollment, participation, and engagement rates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Development Progress</p>
                  <p className="text-primary-200 text-sm">Goal achievements and competency development</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Business Impact</p>
                  <p className="text-primary-200 text-sm">Retention, performance, promotion rates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Enterprise-Grade Security & Compliance</h2>
              <p className="text-lg text-gray-600 mb-6">
                We take data security and privacy seriously. AchievingCoach is built on a modern, secure cloud infrastructure with multiple layers of protection.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">256-bit encryption in transit and at rest</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">SOC 2 Type II certified</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">GDPR compliant</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">HIPAA-ready for regulated industries</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Single Sign-On (SSO) integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Role-based access controls & audit logs</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">SOC 2</p>
                  <p className="text-sm text-gray-500">Type II Certified</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">GDPR</p>
                  <p className="text-sm text-gray-500">Compliant</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">HIPAA</p>
                  <p className="text-sm text-gray-500">Ready</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Shield className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">SSO</p>
                  <p className="text-sm text-gray-500">Supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted for Every Use Case</h2>
            <p className="text-lg text-gray-600">
              Leading companies use AchievingCoach to power their coaching initiatives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <div key={i} className="bg-gray-50 rounded-xl overflow-hidden">
                <div className={`${useCase.color} p-6 text-white`}>
                  <useCase.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Coaching Program?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Schedule a demo today to see how AchievingCoach can elevate your organization's coaching initiatives.
          </p>
          <Link
            href="/contact?type=enterprise"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all"
          >
            Request a Demo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
