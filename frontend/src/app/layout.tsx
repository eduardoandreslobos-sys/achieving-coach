import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "./_components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://achievingcoach.com'),
  
  title: {
    default: 'AchievingCoach - Professional Coaching Platform',
    template: '%s | AchievingCoach'
  },
  
  description: 'Transform your coaching practice with AchievingCoach. Professional coaching tools, client management, and AI-powered insights for coaches and organizations. GROW, DISC, Wheel of Life, and more.',
  
  keywords: [
    'coaching platform',
    'professional coaching software',
    'corporate coaching',
    'executive coaching tools',
    'coaching management system',
    'GROW model',
    'DISC assessment',
    'Wheel of Life',
    'coaching SaaS',
    'multi-tenant coaching',
    'ICF coaching tools',
    'employee coaching platform',
    'leadership development software',
    'coaching for organizations',
    'team coaching tools'
  ],
  
  authors: [{ name: 'AchievingCoach Team' }],
  creator: 'AchievingCoach',
  publisher: 'AchievingCoach',
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
  
  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://achievingcoach.com',
    siteName: 'AchievingCoach',
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Transform your coaching practice with professional tools, client management, and AI-powered insights. Trusted by coaches and organizations worldwide.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AchievingCoach - Professional Coaching Platform',
      }
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'AchievingCoach - Professional Coaching Platform',
    description: 'Transform your coaching practice with professional tools and AI-powered insights.',
    images: ['/twitter-image.png'],
    creator: '@achievingcoach',
  },
  
  // Verification
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Alternate languages (if you support multiple languages)
  // alternates: {
  //   canonical: 'https://achievingcoach.com',
  //   languages: {
  //     'es-ES': 'https://achievingcoach.com/es',
  //     'fr-FR': 'https://achievingcoach.com/fr',
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AchievingCoach',
              url: 'https://achievingcoach.com',
              logo: 'https://achievingcoach.com/logo.png',
              description: 'Professional coaching platform for organizations and individuals',
              foundingDate: '2025',
              founders: [
                {
                  '@type': 'Person',
                  name: 'AchievingCoach Team'
                }
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'info@achievingcoach.com',
                contactType: 'Customer Support'
              },
              sameAs: [
                'https://twitter.com/achievingcoach',
                'https://linkedin.com/company/achievingcoach'
              ]
            })
          }}
        />
        
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AchievingCoach',
              url: 'https://achievingcoach.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://achievingcoach.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            })
          }}
        />
        
        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AchievingCoach',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'AggregateOffer',
                lowPrice: '29',
                highPrice: '99',
                priceCurrency: 'USD',
                priceSpecification: [
                  {
                    '@type': 'UnitPriceSpecification',
                    price: '29',
                    priceCurrency: 'USD',
                    name: 'Starter Plan'
                  },
                  {
                    '@type': 'UnitPriceSpecification',
                    price: '99',
                    priceCurrency: 'USD',
                    name: 'Professional Plan'
                  }
                ]
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127'
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
