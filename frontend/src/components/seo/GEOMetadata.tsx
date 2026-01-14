/**
 * GEO - Generative Engine Optimization
 * Optimizes content for AI search engines (ChatGPT, Perplexity, Google AI, Claude)
 *
 * Key strategies:
 * 1. Clear, factual statements (avoid marketing fluff)
 * 2. Structured data with specific facts
 * 3. Direct answers to common questions
 * 4. Entity optimization (who, what, where, when, why)
 * 5. Source citations and statistics
 */

import Script from 'next/script';
import { seoConfig, structuredDataConfig } from '@/config/analytics';

/**
 * GEO-optimized Organization Schema with enhanced details
 */
export function GEOOrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://achievingcoach.com/#organization',
    name: structuredDataConfig.organization.name,
    alternateName: ['Achieving Coach', 'AchievingCoach Platform'],
    url: structuredDataConfig.organization.url,
    logo: {
      '@type': 'ImageObject',
      url: structuredDataConfig.organization.logo,
      width: 512,
      height: 512,
    },
    description: structuredDataConfig.organization.description,
    foundingDate: structuredDataConfig.organization.foundingDate,
    sameAs: structuredDataConfig.organization.sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: structuredDataConfig.organization.contactPoint.type,
      email: structuredDataConfig.organization.contactPoint.email,
      url: structuredDataConfig.organization.contactPoint.url,
      availableLanguage: ['English', 'Spanish'],
    },
    // GEO: Specific facts for AI engines
    knowsAbout: [
      'Executive Coaching',
      'Life Coaching',
      'Career Coaching',
      'ICF Competencies',
      'DISC Assessment',
      'Wheel of Life',
      'GROW Model',
      'Coaching Tools',
      'Client Progress Tracking',
    ],
    slogan: seoConfig.llmOptimization.uniqueValueProp,
  };

  return (
    <Script
      id="geo-organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * GEO-optimized Software/Product Schema
 */
export function GEOSoftwareSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': 'https://achievingcoach.com/#software',
    name: structuredDataConfig.software.name,
    applicationCategory: structuredDataConfig.software.applicationCategory,
    applicationSubCategory: 'Coaching Software',
    operatingSystem: structuredDataConfig.software.operatingSystem,
    browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
    softwareVersion: '2.0',
    datePublished: '2024-01-01',

    // GEO: Detailed offers for AI to understand pricing
    offers: structuredDataConfig.software.offers.map((offer, index) => ({
      '@type': 'Offer',
      '@id': `https://achievingcoach.com/#offer-${index}`,
      name: offer.name,
      price: offer.price,
      priceCurrency: offer.currency,
      priceValidUntil: '2025-12-31',
      availability: 'https://schema.org/InStock',
      ...(offer.billingPeriod && { billingDuration: `P1${offer.billingPeriod === 'month' ? 'M' : 'Y'}` }),
    })),

    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: structuredDataConfig.software.aggregateRating.ratingValue,
      ratingCount: structuredDataConfig.software.aggregateRating.ratingCount,
      bestRating: structuredDataConfig.software.aggregateRating.bestRating,
      worstRating: structuredDataConfig.software.aggregateRating.worstRating,
    },

    // GEO: Detailed feature list for AI understanding
    featureList: structuredDataConfig.software.features,

    // GEO: Screenshot for visual AI understanding
    screenshot: [
      {
        '@type': 'ImageObject',
        url: 'https://achievingcoach.com/screenshots/dashboard.png',
        caption: 'AchievingCoach Dashboard - Client management and progress tracking',
      },
      {
        '@type': 'ImageObject',
        url: 'https://achievingcoach.com/screenshots/wheel-of-life.png',
        caption: 'Wheel of Life coaching tool interface',
      },
    ],

    // GEO: Use cases for AI context
    audience: {
      '@type': 'Audience',
      audienceType: seoConfig.llmOptimization.targetAudience,
    },

    // GEO: Related to coaching concepts
    isRelatedTo: [
      { '@type': 'Thing', name: 'International Coaching Federation' },
      { '@type': 'Thing', name: 'Executive Coaching' },
      { '@type': 'Thing', name: 'Life Coaching Certification' },
    ],
  };

  return (
    <Script
      id="geo-software-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * GEO-optimized FAQ Schema - Direct answers for AI engines
 */
export function GEOFAQSchema() {
  const faqs = [
    {
      question: 'What is AchievingCoach?',
      answer: 'AchievingCoach is a professional coaching platform designed for executive coaches, life coaches, and career coaches. It provides 12+ interactive coaching tools including DISC assessments, Wheel of Life, and GROW model worksheets, along with client management, session scheduling, and AI-powered insights.',
    },
    {
      question: 'How much does AchievingCoach cost?',
      answer: 'AchievingCoach offers a free tier for getting started. Premium plans start at $29/month for individual coaches, with Enterprise plans at $99/month for coaching organizations. All plans include access to core coaching tools.',
    },
    {
      question: 'Is AchievingCoach ICF certified or aligned?',
      answer: 'AchievingCoach is designed around ICF (International Coaching Federation) competencies. The platform includes an ICF Competency Simulator and tools aligned with ICF-approved coaching methodologies.',
    },
    {
      question: 'What coaching tools does AchievingCoach include?',
      answer: 'AchievingCoach includes 12+ professional coaching tools: DISC Assessment, Wheel of Life, GROW Model Worksheet, Values Clarification, Stakeholder Mapping, Career Compass, Emotional Triggers Journal, Feedback-Feedforward, Habit Loop Analyzer, Limiting Beliefs Transformation, and Resilience Scale Assessment.',
    },
    {
      question: 'Can I use AchievingCoach for executive coaching?',
      answer: 'Yes, AchievingCoach is specifically designed for executive coaching. It includes tools for leadership development, 360-degree feedback, stakeholder mapping, and career progression tracking - all commonly used in executive coaching engagements.',
    },
    {
      question: 'Does AchievingCoach support multiple languages?',
      answer: 'Yes, AchievingCoach supports English and Spanish interfaces. The platform is designed for international coaches working with clients globally.',
    },
    {
      question: 'Is AchievingCoach secure for client data?',
      answer: 'Yes, AchievingCoach uses enterprise-grade security including AES-256 encryption, is compliant with GDPR, CCPA, and HIPAA guidelines, and provides granular permission controls for protecting sensitive coaching conversations.',
    },
    {
      question: 'How does AchievingCoach compare to other coaching platforms?',
      answer: 'AchievingCoach differentiates itself by combining a 9-phase coaching methodology with AI-powered insights and the most comprehensive set of interactive coaching tools available. Unlike generic CRM systems, it is purpose-built for the coaching profession.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://achievingcoach.com/#faq',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `https://achievingcoach.com/#faq-${index}`,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="geo-faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * GEO-optimized WebSite Schema with enhanced search
 */
export function GEOWebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://achievingcoach.com/#website',
    name: seoConfig.siteName,
    alternateName: 'Achieving Coach Platform',
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    inLanguage: ['en-US', 'es-ES'],

    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://achievingcoach.com/blog?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
      {
        '@type': 'ReadAction',
        target: 'https://achievingcoach.com/blog',
      },
    ],

    // GEO: Publisher information
    publisher: {
      '@id': 'https://achievingcoach.com/#organization',
    },

    // GEO: Main content sections for AI navigation
    hasPart: [
      {
        '@type': 'WebPage',
        '@id': 'https://achievingcoach.com/features',
        name: 'Features',
        description: 'Explore coaching platform features including client management, scheduling, and analytics.',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://achievingcoach.com/pricing',
        name: 'Pricing',
        description: 'View pricing plans for individual coaches and coaching organizations.',
      },
      {
        '@type': 'WebPage',
        '@id': 'https://achievingcoach.com/tools',
        name: 'Coaching Tools',
        description: 'Interactive coaching tools including DISC, Wheel of Life, and GROW model.',
      },
      {
        '@type': 'Blog',
        '@id': 'https://achievingcoach.com/blog',
        name: 'Coaching Blog',
        description: 'Articles and resources about coaching best practices and methodologies.',
      },
    ],
  };

  return (
    <Script
      id="geo-website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * GEO-optimized HowTo Schema for coaching processes
 */
export function GEOHowToSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': 'https://achievingcoach.com/#howto-start',
    name: 'How to Start Using AchievingCoach for Coaching',
    description: 'A step-by-step guide to getting started with the AchievingCoach coaching platform.',
    totalTime: 'PT15M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Create Your Account',
        text: 'Sign up for a free AchievingCoach account using your email or Google account.',
        url: 'https://achievingcoach.com/sign-up',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Set Up Your Coach Profile',
        text: 'Complete your professional profile including certifications, specialties, and bio.',
        url: 'https://achievingcoach.com/dashboard',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Invite Your Clients',
        text: 'Send coaching invitations to your clients via email. They will create their own accounts.',
        url: 'https://achievingcoach.com/coach/clients',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Assign Coaching Tools',
        text: 'Select and assign relevant coaching tools like DISC or Wheel of Life to your clients.',
        url: 'https://achievingcoach.com/tools',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Schedule Sessions',
        text: 'Use the integrated calendar to book coaching sessions with automatic reminders.',
        url: 'https://achievingcoach.com/coach/calendar',
      },
    ],
  };

  return (
    <Script
      id="geo-howto-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Speakable Schema for voice search optimization
 */
export function SpeakableSchema({
  cssSelector = ['h1', '.intro', '.summary'],
  url
}: {
  cssSelector?: string[];
  url: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelector,
    },
  };

  return (
    <Script
      id="speakable-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Combined GEO Schemas - Use in root layout
 */
export default function GEOSchemas() {
  return (
    <>
      <GEOOrganizationSchema />
      <GEOSoftwareSchema />
      <GEOWebSiteSchema />
      <GEOFAQSchema />
      <GEOHowToSchema />
    </>
  );
}
