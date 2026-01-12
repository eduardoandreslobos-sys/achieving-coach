import type { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contacto - AchievingCoach',
  description: 'Contacta con el equipo de AchievingCoach. Estamos aquí para ayudarte con demos, consultas, soporte técnico y partnerships. Respuesta en menos de 24 horas.',
  keywords: [
    'contacto coaching',
    'demo coaching platform',
    'soporte AchievingCoach',
    'consulta coaching ejecutivo',
    'partnership coaching',
  ],
  openGraph: {
    title: 'Contacto - AchievingCoach',
    description: 'Contacta con el equipo de AchievingCoach. Estamos aquí para ayudarte con demos, consultas y soporte.',
    url: 'https://achievingcoach.com/contact',
    siteName: 'AchievingCoach',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary',
    title: 'Contacto - AchievingCoach',
    description: 'Contacta con el equipo de AchievingCoach. Respuesta en menos de 24 horas.',
  },
  alternates: {
    canonical: 'https://achievingcoach.com/contact',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
