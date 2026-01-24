import { Metadata } from 'next';
import PricingContent from './PricingContent';

export const metadata: Metadata = {
  title: 'Precios – Planes para Coaches, Equipos y Empresas',
  description: 'Compara los planes de AchievingCoach. Prueba gratuita de 14 días. Core $25/mes, Pro $40/mes, planes Enterprise personalizados.',
};

export default function PricingPage() {
  return <PricingContent />;
}
