import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AchievingCoach - Professional Coaching Platform",
  description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
  keywords: ["coaching platform", "professional coaching", "ICF coaching", "client progress tracking", "coaching software"],
  authors: [{ name: "AchievingCoach" }],
  openGraph: {
    title: "AchievingCoach - Professional Coaching Platform",
    description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
    url: "https://achievingcoach.com",
    siteName: "AchievingCoach",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AchievingCoach - Professional Coaching Platform",
    description: "End-to-end platform for professional coaches to manage practices, track client progress, and deliver exceptional results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
