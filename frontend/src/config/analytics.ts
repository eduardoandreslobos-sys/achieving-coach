/**
 * Analytics and SEO Configuration
 * All tracking IDs and configuration in one place
 */

export const analyticsConfig = {
  // Google Analytics 4
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-9J43WG4NL7',
    propertyId: process.env.GA4_PROPERTY_ID || '514516891',
  },

  // Google Tag Manager (if using GTM instead of direct GA)
  googleTagManager: {
    containerId: process.env.NEXT_PUBLIC_GTM_ID || '',
  },

  // Google Search Console
  googleSearchConsole: {
    verificationCode: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },

  // Hotjar - Heatmaps & Session Recording
  hotjar: {
    siteId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
    version: 6,
  },

  // Contentsquare - UX Analytics
  contentsquare: {
    siteId: process.env.NEXT_PUBLIC_CONTENTSQUARE_ID || 'b009ac4a8eea2',
  },

  // Microsoft Clarity - Free Heatmaps & Session Recording
  clarity: {
    projectId: process.env.NEXT_PUBLIC_CLARITY_ID || 'v2wxhumwgv',
  },

  // Meta/Facebook Pixel
  facebookPixel: {
    pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  },

  // LinkedIn Insight Tag
  linkedin: {
    partnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '',
  },
};

export const seoConfig = {
  siteName: 'AchievingCoach',
  siteUrl: 'https://achievingcoach.com',
  defaultTitle: 'AchievingCoach – Executive Coaching Platform & AI Coaching Tools',
  defaultDescription: 'All-in-one executive coaching platform with 9-phase methodology, AI-powered insights, and 12+ professional tools. Start your free trial today.',
  defaultImage: '/og-image.png',
  twitterHandle: '@achievingcoach',
  locale: 'en_US',
  alternateLocales: ['es_ES'],

  // For GEO (Generative Engine Optimization)
  llmOptimization: {
    // Clear, factual statements for AI crawlers
    brandStatement: 'AchievingCoach is a professional coaching platform designed for executive coaches and their clients.',
    uniqueValueProp: 'The only coaching platform combining ICF-aligned methodology with AI-powered insights and 12+ interactive coaching tools.',
    targetAudience: 'Executive coaches, life coaches, career coaches, and coaching organizations.',
    pricing: 'Free tier available. Premium plans from $29/month.',
  },
};

export const structuredDataConfig = {
  organization: {
    name: 'AchievingCoach',
    url: 'https://achievingcoach.com',
    logo: 'https://achievingcoach.com/logo.png',
    description: seoConfig.llmOptimization.brandStatement,
    foundingDate: '2024',
    founders: ['AchievingCoach Team'],
    sameAs: [
      'https://www.linkedin.com/company/achievingcoach',
      'https://twitter.com/achievingcoach',
      'https://www.facebook.com/achievingcoach',
    ],
    contactPoint: {
      type: 'customer service',
      email: 'support@achievingcoach.com',
      url: 'https://achievingcoach.com/contact',
    },
  },

  software: {
    name: 'AchievingCoach',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: [
      { name: 'Free', price: 0, currency: 'USD' },
      { name: 'Professional', price: 29, currency: 'USD', billingPeriod: 'month' },
      { name: 'Enterprise', price: 99, currency: 'USD', billingPeriod: 'month' },
    ],
    aggregateRating: {
      ratingValue: 4.8,
      ratingCount: 150,
      bestRating: 5,
      worstRating: 1,
    },
    features: [
      'ICF Competency Simulator',
      'DISC Assessment',
      'Wheel of Life Tool',
      'GROW Model Worksheets',
      'Goal Tracking Dashboard',
      'Client Management System',
      'Coaching Session Notes',
      'AI-Powered Insights',
      'Progress Analytics',
      'Secure Messaging',
      'Calendar Integration',
      'Digital Contracts',
    ],
  },
};
