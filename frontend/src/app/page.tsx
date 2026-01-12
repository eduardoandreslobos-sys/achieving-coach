import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: 'AchievingCoach - Plataforma Profesional de Coaching Ejecutivo',
  description: 'Transforma tu práctica de coaching con AchievingCoach. Herramientas profesionales incluyendo Modelo GROW, Evaluación DISC, Rueda de la Vida y más. Confianza de coaches y organizaciones en todo el mundo. Inicia tu prueba gratuita de 14 días.',
  keywords: [
    'plataforma de coaching',
    'software de coaching profesional',
    'herramientas de coaching',
    'modelo GROW',
    'evaluación DISC',
    'rueda de la vida',
    'coaching corporativo',
    'gestión de coaching',
    'herramientas ICF',
    'coaching SaaS',
    'coaching ejecutivo',
    'coaching empresarial'
  ],
  openGraph: {
    title: 'AchievingCoach - Plataforma Profesional de Coaching Ejecutivo',
    description: 'Herramientas profesionales de coaching y gestión de clientes para coaches y organizaciones. GROW, DISC, Rueda de la Vida y más de 10 herramientas incluidas.',
    url: 'https://achievingcoach.com',
    siteName: 'AchievingCoach',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'AchievingCoach - Dashboard de Plataforma Profesional de Coaching',
      }
    ],
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AchievingCoach - Plataforma Profesional de Coaching Ejecutivo',
    description: 'Transforma tu práctica de coaching con herramientas profesionales y gestión de clientes.',
    images: ['/twitter-home.png'],
  },
  alternates: {
    canonical: 'https://achievingcoach.com',
  },
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
};

export default function HomePage() {
  return <HomePageClient />;
}
