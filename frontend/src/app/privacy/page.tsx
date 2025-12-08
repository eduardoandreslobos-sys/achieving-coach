import type { Metadata } from "next";
import Link from "next/link";
import { Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | AchievingCoach",
  description: "Learn how AchievingCoach collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  keywords: ["privacy policy", "data protection", "coaching platform privacy", "GDPR", "data security"],
  authors: [{ name: "AchievingCoach" }],
  openGraph: {
    title: "Privacy Policy | AchievingCoach",
    description: "Learn how AchievingCoach collects, uses, and protects your personal information.",
    url: "https://achievingcoach.com/privacy",
    siteName: "AchievingCoach",
    images: [{ url: "https://achievingcoach.com/images/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | AchievingCoach",
    description: "Learn how AchievingCoach collects, uses, and protects your personal information.",
    images: ["https://achievingcoach.com/images/og-image.png"],
  },
  alternates: { canonical: "https://achievingcoach.com/privacy" },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  description: "Learn how AchievingCoach collects, uses, and protects your personal information.",
  url: "https://achievingcoach.com/privacy",
  publisher: { "@type": "Organization", name: "AchievingCoach", url: "https://achievingcoach.com" },
};

export default function PrivacyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-white">
        {/* Nav */}
        <Navbar />

        <main role="main">
          <section className="bg-gradient-to-br from-blue-50 to-white py-16" aria-labelledby="privacy-heading">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 id="privacy-heading" className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
              <p className="mt-4 text-lg text-gray-600">Last updated: December 6, 2025</p>
            </div>
          </section>

          <section className="py-16" aria-label="Privacy policy content">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <article className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
                <p className="text-gray-600 mb-6">Welcome to AchievingCoach. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our coaching platform.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
                <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (professional credentials, biography)</li>
                  <li>Coaching session data and notes</li>
                  <li>Assessment results and progress tracking data</li>
                  <li>Communications between coaches and coachees</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Provide, maintain, and improve our coaching platform</li>
                  <li>Process transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-6">We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit and at rest, regular security assessments, and strict access controls.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Sharing</h2>
                <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your data with:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Your assigned coach or coachees (based on your role and relationships)</li>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal authorities when required by law</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2" role="list">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data in a portable format</li>
                  <li>Withdraw consent at any time</li>
                </ul>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Cookies</h2>
                <p className="text-gray-600 mb-6">We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
                <p className="text-gray-600 mb-6">Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
                <p className="text-gray-600 mb-6">We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.</p>

                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
                <p className="text-gray-600 mb-6">If you have any questions about this privacy policy or our data practices, please contact us at:</p>
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <p className="text-gray-700 font-medium">AchievingCoach</p>
                  <p className="text-gray-600">Email: privacy@achievingcoach.com</p>
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
