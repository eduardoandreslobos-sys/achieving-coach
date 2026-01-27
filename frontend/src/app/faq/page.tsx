import { Metadata } from 'next';
import FAQPageClient from './FAQPageClient';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes | AchievingCoach',
  description: 'Encuentra respuestas a las preguntas más comunes sobre AchievingCoach: precios, funcionalidades, herramientas de coaching, certificaciones ICF y más.',
  keywords: [
    'preguntas frecuentes coaching',
    'FAQ AchievingCoach',
    'plataforma coaching precios',
    'herramientas coaching ICF',
    'DISC assessment precio',
    'software coaching ejecutivo',
  ],
  alternates: {
    canonical: 'https://achievingcoach.com/faq',
  },
  openGraph: {
    title: 'Preguntas Frecuentes | AchievingCoach',
    description: 'Respuestas a todas tus preguntas sobre la plataforma de coaching más completa.',
    url: 'https://achievingcoach.com/faq',
    type: 'website',
  },
};

export default function FAQPage() {
  return <FAQPageClient />;
}
