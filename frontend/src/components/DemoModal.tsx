'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Users, Brain, Calendar, Target, BarChart3, Shield, Sparkles, FileSignature } from 'lucide-react';
import Link from 'next/link';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slides = [
  {
    id: 1,
    title: 'Dashboard Inteligente',
    description: 'Visualiza el progreso de tus clientes con métricas en tiempo real, próximas sesiones y herramientas asignadas en un solo lugar.',
    icon: BarChart3,
    color: 'emerald',
    features: ['Métricas de progreso', 'Sesiones programadas', 'Objetivos activos', 'Vista personalizada por rol'],
  },
  {
    id: 2,
    title: 'Gestión de Clientes',
    description: 'Centraliza perfiles, historial de sesiones, notas privadas y el journey completo de cada coachee.',
    icon: Users,
    color: 'violet',
    features: ['Perfiles detallados', 'Historial de sesiones', 'Notas y observaciones', 'Seguimiento de evolución'],
  },
  {
    id: 3,
    title: '12+ Herramientas de Coaching',
    description: 'Accede a evaluaciones interactivas como DISC, Rueda de la Vida, GROW, Clarificación de Valores y más.',
    icon: Target,
    color: 'amber',
    features: ['DISC Assessment', 'Wheel of Life', 'GROW Model', 'Stakeholder Map', 'Career Compass'],
  },
  {
    id: 4,
    title: 'Simulador ICF',
    description: 'Practica y mejora tus competencias de coaching con escenarios basados en las 8 competencias de la ICF.',
    icon: Brain,
    color: 'pink',
    features: ['Escenarios realistas', 'Feedback inmediato', 'Alineado con ICF', 'Mejora continua'],
  },
  {
    id: 5,
    title: 'Insights con IA',
    description: 'Obtén análisis automáticos de sesiones, sugerencias de técnicas y reportes de progreso generados por inteligencia artificial.',
    icon: Sparkles,
    color: 'cyan',
    features: ['Análisis de patrones', 'Sugerencias de técnicas', 'Reportes automáticos', 'KPIs personalizados'],
  },
  {
    id: 6,
    title: 'Agendamiento Inteligente',
    description: 'Sincroniza con Google Calendar, envía recordatorios automáticos y gestiona reprogramaciones sin fricción.',
    icon: Calendar,
    color: 'emerald',
    features: ['Sync con Google Calendar', 'Recordatorios automáticos', 'Booking público', 'Gestión de disponibilidad'],
  },
  {
    id: 7,
    title: 'Seguridad Enterprise',
    description: 'Tus datos y los de tus clientes protegidos con encriptación AES-256, cumplimiento GDPR, CCPA y directrices HIPAA.',
    icon: Shield,
    color: 'violet',
    features: ['Encriptación AES-256', 'Cumplimiento GDPR', 'Audit logs', 'Permisos granulares'],
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 300);
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const colors = colorClasses[slide.color];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#0f0f0f] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-gray-500 text-sm">Tour de AchievingCoach</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300`}>
              <Icon className={`w-10 h-10 ${colors.text}`} />
            </div>

            {/* Slide indicator */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-medium ${colors.text}`}>
                {currentSlide + 1} / {slides.length}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 transition-all duration-300">
              {slide.title}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-lg mb-8 max-w-xl transition-all duration-300">
              {slide.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {slide.features.map((feature, i) => (
                <span
                  key={i}
                  className={`px-3 py-1.5 ${colors.bg} border ${colors.border} rounded-full text-sm ${colors.text}`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <button
            onClick={prevSlide}
            disabled={isAnimating}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => !isAnimating && setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? `w-6 ${colors.bg.replace('/20', '')}`
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {currentSlide === slides.length - 1 ? (
            <Link
              href="/sign-up"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              onClick={onClose}
            >
              Comenzar Gratis
            </Link>
          ) : (
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
