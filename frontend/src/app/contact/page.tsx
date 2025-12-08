'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/layout';
import { Target, Mail, Clock, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const faqs = [
    {
      question: 'How quickly will I receive a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please mention it in your message.',
    },
    {
      question: 'Can I schedule a demo?',
      answer: 'Yes! Mention in your message that you\'d like a demo, and we\'ll send you a calendar link to book a time that works for you.',
    },
    {
      question: 'Do you offer implementation support?',
      answer: 'Absolutely. We provide onboarding assistance for all new customers and dedicated support for Organization plan customers.',
    },
    {
      question: 'What if I have a technical issue?',
      answer: 'For technical support, please include as much detail as possible about the issue. Screenshots are helpful. Our support team will prioritize your request.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-6 bg-white" aria-labelledby="hero-heading">
        <div className="max-w-4xl mx-auto text-center">
          <h1 id="hero-heading" className="text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form & Sidebar */}
      <section className="py-12 px-6 bg-gray-50" aria-labelledby="contact-form-heading">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 id="contact-form-heading" className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                
                {submitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium">Message sent successfully! We'll get back to you soon.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-900 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-900 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                      aria-required="true"
                    >
                      <option>General Inquiry</option>
                      <option>Sales Question</option>
                      <option>Technical Support</option>
                      <option>Partnership Opportunity</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                      aria-required="true"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                    aria-label="Send message"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Contact information">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Support</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm mb-1">Email</div>
                      <a href="mailto:support@achievingcoach.com" className="text-primary-600 text-sm hover:underline">
                        support@achievingcoach.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm mb-1">Response Time</div>
                      <p className="text-gray-600 text-sm">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl border border-primary-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Need immediate help?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Check out our documentation and video tutorials for quick answers.
                </p>
                <Link href="/blog" className="text-primary-600 font-medium text-sm hover:underline">
                  Visit Help Center →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </header>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <article key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-600 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === index && (
                  <div id={`faq-answer-${index}`} className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
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
