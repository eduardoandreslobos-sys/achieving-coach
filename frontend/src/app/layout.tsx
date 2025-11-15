import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AchievingCoach - Professional Coaching Platform',
  description: 'Elevate your coaching practice with our cloud-native platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
