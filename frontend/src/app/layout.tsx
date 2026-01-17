import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AnalyticsProvider from "@/components/analytics";
import PreloadResources from "@/components/PreloadResources";
import GEOSchemas from "@/components/seo/GEOMetadata";
import { seoConfig, analyticsConfig } from "@/config/analytics";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Viewport configuration for mobile optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),

  // Basic Meta
  title: {
    default: seoConfig.defaultTitle,
    template: "%s | AchievingCoach",
  },
  description: seoConfig.defaultDescription,

  // Keywords (still useful for some search engines)
  keywords: [
    "coaching platform",
    "executive coaching software",
    "life coaching tools",
    "ICF coaching",
    "coaching management system",
    "DISC assessment tool",
    "wheel of life coaching",
    "GROW model worksheet",
    "client progress tracking",
    "coaching session management",
    "AI coaching insights",
    "professional coaching tools",
    "coach client portal",
    "coaching practice management",
    "career coaching platform",
  ],

  // Author info
  authors: [{ name: "AchievingCoach", url: seoConfig.siteUrl }],
  creator: "AchievingCoach",
  publisher: "AchievingCoach",

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Open Graph
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    locale: seoConfig.locale,
    alternateLocale: seoConfig.alternateLocales,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AchievingCoach - Professional Coaching Platform",
        type: "image/png",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    creator: seoConfig.twitterHandle,
    site: seoConfig.twitterHandle,
    images: ["/opengraph-image"],
  },

  // Verification codes
  verification: {
    google: analyticsConfig.googleSearchConsole.verificationCode || undefined,
    // Add other verifications as needed:
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
  },

  // Canonical
  alternates: {
    canonical: seoConfig.siteUrl,
    languages: {
      'en-US': seoConfig.siteUrl,
      'es-ES': `${seoConfig.siteUrl}/es`,
    },
  },

  // App info
  applicationName: seoConfig.siteName,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },

  // Manifest
  manifest: '/manifest.json',

  // Category
  category: 'Business Software',

  // Classification (for some search engines)
  classification: 'Coaching Platform, Business Software, Professional Tools',

  // Other meta
  other: {
    // GEO: Structured data hints for AI
    'ai:description': seoConfig.llmOptimization.brandStatement,
    'ai:features': seoConfig.llmOptimization.uniqueValueProp,
    'ai:audience': seoConfig.llmOptimization.targetAudience,
    'ai:pricing': seoConfig.llmOptimization.pricing,

    // Dublin Core metadata (helps some academic/professional indexers)
    'DC.title': seoConfig.defaultTitle,
    'DC.creator': 'AchievingCoach',
    'DC.subject': 'Coaching Platform, Executive Coaching, Professional Development',
    'DC.description': seoConfig.defaultDescription,
    'DC.publisher': 'AchievingCoach',
    'DC.type': 'Software',
    'DC.format': 'text/html',
    'DC.language': 'es',

    // Google specific
    'google': 'notranslate',
    'googlebot': 'index,follow',

    // Pinterest
    'pinterest': 'nopin',

    // Format detection
    'format-detection': 'telephone=no',

    // Freshness signals for Gemini AI
    'article:published_time': '2024-01-01T00:00:00Z',
    'article:modified_time': '2026-01-16T00:00:00Z',
    'last-modified': '2026-01-16',
    'revision-date': '2026-01-16',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <PreloadResources />

        {/* GEO-optimized Schema.org structured data */}
        <GEOSchemas />

        {/* Preconnect to analytics domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Preconnect to Hotjar if configured */}
        {analyticsConfig.hotjar.siteId && (
          <>
            <link rel="preconnect" href="https://static.hotjar.com" />
            <link rel="dns-prefetch" href="https://static.hotjar.com" />
          </>
        )}

        {/* Preconnect to Clarity if configured */}
        {analyticsConfig.clarity.projectId && (
          <>
            <link rel="preconnect" href="https://www.clarity.ms" />
            <link rel="dns-prefetch" href="https://www.clarity.ms" />
          </>
        )}
      </head>
      <body className={inter.className}>
        {/* Analytics - loads after interactive */}
        <AnalyticsProvider />

        {/* Auth context and app content */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
