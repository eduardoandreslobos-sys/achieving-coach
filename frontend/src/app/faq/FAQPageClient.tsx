'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { ChevronDown, Search, HelpCircle, CreditCard, Shield, Wrench, Users, Zap } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // General
  {
    category: 'General',
    question: '¿Qué es AchievingCoach?',
    answer: 'AchievingCoach es una plataforma profesional de coaching diseñada para coaches ejecutivos, de vida y de carrera. Proporciona más de 12 herramientas interactivas de coaching incluyendo evaluaciones DISC, Rueda de la Vida y hojas de trabajo del modelo GROW, junto con gestión de clientes, programación de sesiones e insights impulsados por IA.',
  },
  {
    category: 'General',
    question: '¿Para quién está diseñado AchievingCoach?',
    answer: 'AchievingCoach está diseñado para coaches profesionales certificados, coaches ejecutivos, coaches de vida, coaches de carrera, mentores organizacionales y empresas de coaching. También es ideal para departamentos de RRHH que gestionan programas de coaching interno.',
  },
  {
    category: 'General',
    question: '¿AchievingCoach está alineado con las competencias ICF?',
    answer: 'Sí, AchievingCoach está diseñado en torno a las competencias de la International Coaching Federation (ICF). La plataforma incluye un Simulador de Competencias ICF y herramientas alineadas con metodologías de coaching aprobadas por ICF.',
  },
  {
    category: 'General',
    question: '¿En qué idiomas está disponible AchievingCoach?',
    answer: 'AchievingCoach soporta interfaces en inglés y español. La plataforma está diseñada para coaches internacionales que trabajan con clientes a nivel global.',
  },
  // Precios
  {
    category: 'Precios',
    question: '¿Cuánto cuesta AchievingCoach?',
    answer: 'AchievingCoach ofrece una prueba gratuita de 14 días. Los planes comienzan en $25/mes (Core) para coaches individuales, $40/mes (Pro) con funciones avanzadas como CRM y Simulador ICF, y planes Enterprise personalizados para organizaciones de coaching. Todos los planes incluyen acceso a las herramientas principales de coaching.',
  },
  {
    category: 'Precios',
    question: '¿Hay un plan gratuito disponible?',
    answer: 'Sí, ofrecemos una prueba gratuita de 14 días con acceso completo a todas las funcionalidades. No se requiere tarjeta de crédito para comenzar. Después del período de prueba, puedes elegir el plan que mejor se adapte a tus necesidades.',
  },
  {
    category: 'Precios',
    question: '¿Puedo cancelar mi suscripción en cualquier momento?',
    answer: 'Sí, puedes cancelar tu suscripción en cualquier momento desde tu panel de control. No hay contratos a largo plazo ni penalizaciones por cancelación. Tu acceso continuará hasta el final del período de facturación actual.',
  },
  // Herramientas
  {
    category: 'Herramientas',
    question: '¿Qué herramientas de coaching incluye AchievingCoach?',
    answer: 'AchievingCoach incluye más de 12 herramientas profesionales de coaching: Evaluación DISC, Rueda de la Vida, Hoja de Trabajo GROW, Clarificación de Valores, Mapeo de Stakeholders, Brújula de Carrera, Diario de Disparadores Emocionales, Feedback-Feedforward, Analizador de Bucle de Hábitos, Transformación de Creencias Limitantes y Evaluación de Escala de Resiliencia.',
  },
  {
    category: 'Herramientas',
    question: '¿Puedo personalizar las herramientas de coaching?',
    answer: 'Sí, muchas herramientas permiten personalización para adaptarse a tu metodología de coaching específica. Puedes ajustar preguntas, agregar secciones personalizadas y crear plantillas reutilizables para tus procesos de coaching.',
  },
  {
    category: 'Herramientas',
    question: '¿Qué es el Simulador de Competencias ICF?',
    answer: 'El Simulador de Competencias ICF es una herramienta exclusiva que te permite practicar y evaluar tu dominio de las 8 competencias centrales de ICF. Incluye escenarios de práctica, autoevaluaciones y retroalimentación para mejorar tus habilidades de coaching.',
  },
  // Funcionalidades
  {
    category: 'Funcionalidades',
    question: '¿Puedo usar AchievingCoach para coaching ejecutivo?',
    answer: 'Sí, AchievingCoach está específicamente diseñado para coaching ejecutivo. Incluye herramientas para desarrollo de liderazgo, feedback 360 grados, mapeo de stakeholders y seguimiento de progresión de carrera, todas comúnmente usadas en compromisos de coaching ejecutivo.',
  },
  {
    category: 'Funcionalidades',
    question: '¿Cómo funciona la gestión de clientes?',
    answer: 'AchievingCoach ofrece un sistema completo de gestión de clientes que incluye perfiles detallados, historial de sesiones, notas de coaching, documentos compartidos, seguimiento de objetivos y métricas de progreso. Todo centralizado en un dashboard intuitivo.',
  },
  {
    category: 'Funcionalidades',
    question: '¿Qué tipo de insights proporciona la IA?',
    answer: 'Nuestra IA analiza patrones en las sesiones de coaching, identifica temas recurrentes, sugiere áreas de enfoque, genera resúmenes automáticos de sesiones y proporciona recomendaciones basadas en el progreso del cliente. Todo diseñado para potenciar tu práctica, no reemplazarla.',
  },
  {
    category: 'Funcionalidades',
    question: '¿Puedo programar sesiones y enviar recordatorios?',
    answer: 'Sí, AchievingCoach incluye un sistema de calendario integrado para programar sesiones de coaching. Envía recordatorios automáticos por email a ti y a tus clientes, permite reprogramaciones fáciles y se sincroniza con Google Calendar y Outlook.',
  },
  // Seguridad
  {
    category: 'Seguridad',
    question: '¿Es seguro AchievingCoach para los datos de mis clientes?',
    answer: 'Sí, AchievingCoach utiliza seguridad de nivel empresarial incluyendo encriptación AES-256, cumple con las directrices de GDPR, CCPA y HIPAA, y proporciona controles de permisos granulares para proteger conversaciones de coaching sensibles.',
  },
  {
    category: 'Seguridad',
    question: '¿Dónde se almacenan los datos?',
    answer: 'Los datos se almacenan en servidores seguros con certificación SOC 2 Type II. Utilizamos infraestructura de Google Cloud Platform con centros de datos en múltiples regiones para garantizar disponibilidad y redundancia.',
  },
  {
    category: 'Seguridad',
    question: '¿Puedo exportar mis datos?',
    answer: 'Sí, puedes exportar todos tus datos en cualquier momento en formatos estándar (CSV, PDF). Esto incluye perfiles de clientes, notas de sesiones, resultados de evaluaciones y reportes. Tus datos siempre te pertenecen.',
  },
  // Comparación
  {
    category: 'Comparación',
    question: '¿Cómo se compara AchievingCoach con otras plataformas?',
    answer: 'AchievingCoach se diferencia por combinar una metodología de coaching de 9 fases con insights impulsados por IA y el conjunto más completo de herramientas interactivas de coaching disponibles. A diferencia de sistemas CRM genéricos, está construido específicamente para la profesión del coaching.',
  },
  {
    category: 'Comparación',
    question: '¿Por qué elegir AchievingCoach sobre un CRM general?',
    answer: 'Los CRM generales no entienden el coaching. AchievingCoach ofrece herramientas específicas de coaching (DISC, Rueda de la Vida, GROW), seguimiento de competencias ICF, flujos de trabajo diseñados para sesiones de coaching, y reportes que hablan el lenguaje del coaching profesional.',
  },
];

const categories = [
  { name: 'Todos', icon: HelpCircle, slug: 'all' },
  { name: 'General', icon: Users, slug: 'General' },
  { name: 'Precios', icon: CreditCard, slug: 'Precios' },
  { name: 'Herramientas', icon: Wrench, slug: 'Herramientas' },
  { name: 'Funcionalidades', icon: Zap, slug: 'Funcionalidades' },
  { name: 'Seguridad', icon: Shield, slug: 'Seguridad' },
];

export default function FAQPageClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // FAQ Schema for SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://achievingcoach.com/faq#faqpage',
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `https://achievingcoach.com/faq#faq-${index}`,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <Script
        id="faq-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs
            items={[{ name: 'FAQ', url: 'https://achievingcoach.com/faq' }]}
            className="mb-8"
          />

          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Encuentra respuestas rápidas a las preguntas más comunes sobre AchievingCoach.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar en las preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#111111] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = cat.slug === 'all'
                ? faqs.length
                : faqs.filter(f => f.category === cat.slug).length;

              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat.slug
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                  <span className="text-xs opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron preguntas que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => {
                const globalIndex = faqs.indexOf(faq);
                const isOpen = openItems.has(globalIndex);

                return (
                  <div
                    key={globalIndex}
                    className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleItem(globalIndex)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                        <h2 className="text-white font-medium pr-4">{faq.question}</h2>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-0">
                        <div className="pl-[72px] text-gray-400 leading-relaxed faq-answer">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">¿No encontraste lo que buscabas?</h2>
            <p className="text-gray-400 mb-6">
              Nuestro equipo está listo para ayudarte con cualquier pregunta adicional.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/contact"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Contactar Soporte
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Probar Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
