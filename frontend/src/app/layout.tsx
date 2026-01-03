import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PreloadResources from "@/components/PreloadResources";
import { OrganizationSchema, WebSiteSchema, SoftwareApplicationSchema } from "@/components/SchemaOrg";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://achievingcoach.com'),
  title: {
    default: "AchievingCoach – Executive Coaching Platform & AI Coaching Tools",
    template: "%s | AchievingCoach",
  },
  description: "All-in-one executive coaching platform with 9-phase methodology, AI-powered insights, and 12+ professional tools. Start your free trial today.",
  keywords: ["coaching platform", "professional coaching", "ICF coaching", "client progress tracking", "coaching software", "coaching tools", "DISC assessment", "wheel of life"],
  authors: [{ name: "AchievingCoach" }],
  creator: "AchievingCoach",
  publisher: "AchievingCoach",
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
  openGraph: {
    title: "AchievingCoach – Executive Coaching Platform & AI Coaching Tools",
    description: "All-in-one executive coaching platform with 9-phase methodology, AI-powered insights, and 12+ professional tools. Start your free trial today.",
    url: "https://achievingcoach.com",
    siteName: "AchievingCoach",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AchievingCoach - Professional Coaching Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AchievingCoach – Executive Coaching Platform & AI Coaching Tools",
    description: "All-in-one executive coaching platform with 9-phase methodology, AI-powered insights, and 12+ professional tools. Start your free trial today.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://achievingcoach.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PreloadResources />
        <OrganizationSchema />
        <WebSiteSchema />
        <SoftwareApplicationSchema />
        {/* Contentsquare Analytics */}
        <script src="https://t.contentsquare.net/uxa/b009ac4a8eea2.js" async />
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
