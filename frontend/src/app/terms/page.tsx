import type { Metadata } from "next";
import Link from "next/link";
import { Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | AchievingCoach",
  description: "Read the terms and conditions for using AchievingCoach coaching platform. Understand your rights and responsibilities as a user.",
  keywords: ["terms of service", "user agreement", "coaching platform terms", "conditions of use"],
  authors: [{ name: "AchievingCoach" }],
  openGraph: {
    title: "Terms of Service | AchievingCoach",
    description: "Read the terms and conditions for using AchievingCoach coaching platform.",
    url: "https://achievingcoach.com/terms",
    siteName: "AchievingCoach",
    images: [{ url: "https://achievingcoach.com/images/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | AchievingCoach",
    description: "Read the terms and conditions for using AchievingCoach coaching platform.",
    images: ["https://achievingcoach.com/images/og-image.png"],
  },
  alternates: { canonical: "https://achievingcoach.com/terms" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service",
  description: "Read the terms and conditions for using AchievingCoach coaching platform.",
  url: "https://achievingcoach.com/terms",
  publisher: { "@type": "Organization", name: "AchievingCoach", url: "https://achievingcoach.com" },
};

export default function TermsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <Navbar />

        <main role="main">
          <section className="bg-gradient-to-br from-blue-50 to-white py-16" aria-labelledby="terms-heading">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="terms-heading" className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Terms of Service</h1>
              <p className="mt-4 text-lg text-gray-600">Last updated: December 6, 2025</p>
            </div>
          </section>

          <section className="py-16" aria-label="Terms of service content">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-6">By accessing or using AchievingCoach, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                <p className="text-gray-600 mb-6">AchievingCoach is a professional coaching platform that provides tools for coaches to manage their practice, track client progress, conduct assessments, and deliver structured coaching exercises. The platform serves both coaches and their clients (coachees).</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts</h2>
                <p className="text-gray-600 mb-4">When creating an account, you agree to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. User Roles and Responsibilities</h2>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">For Coaches:</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2" role="list">
                  <li>You are responsible for maintaining appropriate professional credentials</li>
                  <li>You agree to adhere to ICF ethical standards or equivalent professional guidelines</li>
                  <li>You are solely responsible for your coaching relationships and outcomes</li>
                  <li>You agree to maintain client confidentiality as appropriate</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">For Coachees:</h3>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>You understand that coaching is not therapy or medical treatment</li>
                  <li>You are responsible for your own decisions and actions</li>
                  <li>You agree to engage honestly and constructively in the coaching process</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Subscription and Payments</h2>
                <p className="text-gray-600 mb-4">Our subscription plans include:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li><strong>Core Plan:</strong> $29/month (up to 15 clients)</li>
                  <li><strong>Pro Plan:</strong> $59/month (unlimited clients)</li>
                  <li><strong>Organization Plan:</strong> Custom pricing for enterprises</li>
                </ul>
                <p className="text-gray-600 mb-6">Subscriptions are billed monthly or annually. You may cancel at any time, and your subscription will remain active until the end of your current billing period.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-600 mb-6">The platform, including its original content, features, and functionality, is owned by AchievingCoach and is protected by international copyright, trademark, and other intellectual property laws. Your coaching content and client data remain your property.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Prohibited Uses</h2>
                <p className="text-gray-600 mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Use the platform for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to any part of the platform</li>
                  <li>Interfere with or disrupt the platform or servers</li>
                  <li>Upload viruses or malicious code</li>
                  <li>Collect or harvest user information without consent</li>
                  <li>Impersonate another person or entity</li>
                  <li>Use the platform to provide therapy or medical advice</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Disclaimer of Warranties</h2>
                <p className="text-gray-600 mb-6">The platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-600 mb-6">AchievingCoach shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the platform. Our total liability shall not exceed the amount you paid for the service in the past twelve months.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
                <p className="text-gray-600 mb-6">We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the platform will cease immediately. You may export your data before termination.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-600 mb-6">We reserve the right to modify these terms at any time. We will provide notice of significant changes by posting an announcement on the platform or sending you an email. Your continued use of the platform after changes constitutes acceptance of the new terms.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
                <p className="text-gray-600 mb-6">These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which AchievingCoach operates, without regard to conflict of law provisions.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contact Information</h2>
                <p className="text-gray-600 mb-6">For any questions about these Terms of Service, please contact us at:</p>
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <p className="text-gray-700 font-medium">AchievingCoach</p>
                  <p className="text-gray-600">Email: legal@achievingcoach.com</p>
                </div>
              </article>

              <div className="mt-12 text-center">
                <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors" aria-label="Return to homepage">← Back to Home</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-900 text-gray-400 py-12 px-6" role="contentinfo">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm">© 2024 AchievingCoach. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
