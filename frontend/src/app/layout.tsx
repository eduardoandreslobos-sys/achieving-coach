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
    default: "AchievingCoach - Professional Coaching Platform",
    template: "%s | AchievingCoach",
  },
  description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
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
    title: "AchievingCoach - Professional Coaching Platform",
    description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
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
    title: "AchievingCoach - Professional Coaching Platform",
    description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
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
