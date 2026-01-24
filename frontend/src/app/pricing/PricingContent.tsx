'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, ArrowRight, HelpCircle, Zap, Users, Calendar, BarChart3, Target, MessageSquare, Shield } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plans = [
  {
    name: 'Core',
    priceMonthly: 25,
    priceYearly: 19,
    description: 'Herramientas esenciales para coaches independientes',
    features: [
      'Hasta 15 clientes activos',
      'Agendamiento de sesiones',
      'Sincronización con Google Calendar',
      '10 herramientas de coaching',
      'Dashboard de analytics básico',
      'Mensajería con clientes',
      'Notas de sesión',
      'Soporte por email',
    ],
    cta: 'Comenzar Prueba',
    href: '/sign-up?plan=core',
    popular: false,
  },
  {
    name: 'Pro',
    priceMonthly: 40,
    priceYearly: 30,
    description: 'Para prácticas en crecimiento',
    features: [
      'Clientes ilimitados',
      'Todas las funciones Core',
      '12+ herramientas (biblioteca completa)',
      'Simulador ICF con feedback de IA',
      'CRM completo (leads y pipeline)',
      'Perfil en directorio público',
      'Analytics avanzados con IA',
      'Reportes automatizados',
      'Portal del cliente',
      'Firmas digitales',
      'Branding personalizado',
      'Soporte prioritario',
    ],
    cta: 'Comenzar Prueba',
    href: '/sign-up?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: null,
    priceYearly: null,
    description: 'Para organizaciones y equipos de coaches',
    features: [
      'Todo en Pro',
      'Multi-coach / Multi-tenant',
      'SSO y controles de seguridad',
      'Perfil destacado en directorio',
      'Métricas de ROI',
      'White label (sin marca)',
      'Integraciones personalizadas',
      'Acceso API',
      'Onboarding dedicado',
      'SLA garantizado',
      'Account manager asignado',
    ],
    cta: 'Contactar Ventas',
    href: '/contact?subject=enterprise',
    popular: false,
  },
];

// Feature comparison matrix
const featureCategories = [
  {
    name: 'Gestión de Clientes',
    icon: Users,
    features: [
      { name: 'Perfiles de clientes', core: true, pro: true, enterprise: true },
      { name: 'Límite de clientes', core: '15', pro: 'Ilimitados', enterprise: 'Ilimitados' },
      { name: 'Portal del cliente', core: false, pro: true, enterprise: true },
      { name: 'Firmas digitales', core: false, pro: true, enterprise: true },
    ],
  },
  {
    name: 'Sesiones',
    icon: Calendar,
    features: [
      { name: 'Agendamiento', core: true, pro: true, enterprise: true },
      { name: 'Google Calendar sync', core: true, pro: true, enterprise: true },
      { name: 'Recordatorios automáticos', core: true, pro: true, enterprise: true },
      { name: 'Notas de sesión', core: true, pro: true, enterprise: true },
    ],
  },
  {
    name: 'Herramientas de Coaching',
    icon: Target,
    features: [
      { name: 'Herramientas disponibles', core: '10', pro: '12+', enterprise: '12+' },
      { name: 'Rueda de la Vida', core: true, pro: true, enterprise: true },
      { name: 'Marco GROW', core: true, pro: true, enterprise: true },
      { name: 'Evaluación DISC', core: false, pro: true, enterprise: true },
      { name: 'Analizador de Hábitos', core: false, pro: true, enterprise: true },
      { name: 'Brújula de Carrera', core: false, pro: true, enterprise: true },
    ],
  },
  {
    name: 'Simulador ICF',
    icon: Sparkles,
    features: [
      { name: 'Práctica de competencias', core: false, pro: true, enterprise: true },
      { name: 'Feedback con IA', core: false, pro: true, enterprise: true },
    ],
  },
  {
    name: 'CRM y Ventas',
    icon: BarChart3,
    features: [
      { name: 'Gestión de leads', core: false, pro: true, enterprise: true },
      { name: 'Pipeline de ventas', core: false, pro: true, enterprise: true },
      { name: 'Calificación BANT', core: false, pro: true, enterprise: true },
      { name: 'Tracking de actividades', core: false, pro: true, enterprise: true },
    ],
  },
  {
    name: 'Directorio de Coaches',
    icon: Users,
    features: [
      { name: 'Perfil público', core: false, pro: true, enterprise: true },
      { name: 'Recibir consultas', core: false, pro: true, enterprise: true },
      { name: 'Perfil destacado', core: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    features: [
      { name: 'Dashboard básico', core: true, pro: true, enterprise: true },
      { name: 'Analytics avanzados', core: false, pro: true, enterprise: true },
      { name: 'Insights con IA', core: false, pro: true, enterprise: true },
      { name: 'Reportes automatizados', core: false, pro: true, enterprise: true },
      { name: 'Métricas de ROI', core: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Personalización',
    icon: Sparkles,
    features: [
      { name: 'Branding personalizado', core: false, pro: true, enterprise: true },
      { name: 'White label', core: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Enterprise',
    icon: Shield,
    features: [
      { name: 'Multi-coach', core: false, pro: false, enterprise: true },
      { name: 'SSO', core: false, pro: false, enterprise: true },
      { name: 'Acceso API', core: false, pro: false, enterprise: true },
      { name: 'Integraciones custom', core: false, pro: false, enterprise: true },
      { name: 'SLA garantizado', core: false, pro: false, enterprise: true },
    ],
  },
  {
    name: 'Soporte',
    icon: MessageSquare,
    features: [
      { name: 'Email', core: true, pro: true, enterprise: true },
      { name: 'Prioritario (24h)', core: false, pro: true, enterprise: true },
      { name: 'Account manager', core: false, pro: false, enterprise: true },
    ],
  },
];

const faqs = [
  {
    question: '¿Puedo cambiar de plan en cualquier momento?',
    answer: 'Sí, puedes actualizar o bajar tu plan en cualquier momento. Los cambios se aplican en tu próximo ciclo de facturación.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos todas las tarjetas de crédito principales, PayPal y transferencia bancaria para planes Enterprise.',
  },
  {
    question: '¿Hay descuento por pago anual?',
    answer: 'Sí, ofrecemos un 25% de descuento cuando pagas anualmente. Por ejemplo, Pro pasa de $40/mes a $30/mes facturado anualmente.',
  },
  {
    question: '¿Qué pasa con mis datos si cancelo?',
    answer: 'Tienes 30 días para exportar tus datos después de cancelar. Después de ese período, los datos se eliminan de forma segura.',
  },
  {
    question: '¿Qué es el Simulador ICF?',
    answer: 'Es una herramienta exclusiva que te permite practicar las 8 competencias core de ICF con escenarios realistas y recibir retroalimentación detallada generada por IA.',
  },
  {
    question: '¿Qué incluye el CRM?',
    answer: 'El CRM te permite gestionar leads y oportunidades de negocio con un pipeline visual estilo Kanban, calificación BANT, y seguimiento de actividades para cerrar más clientes.',
  },
];

export default function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-6">
            <Zap className="w-3 h-3" />
            14 DÍAS GRATIS
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Planes que Escalan<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">con tu Práctica</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Elige el plan que mejor se adapte a tus necesidades. Sin contratos a largo plazo. Sin sorpresas.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Mensual
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Anual
            </span>
            {isAnnual && (
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full">
                Ahorra 25%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#111111] border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-emerald-500 ring-1 ring-emerald-500'
                    : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {plan.priceMonthly !== null ? (
                    <>
                      <span className="text-4xl font-bold text-white">
                        ${isAnnual ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-gray-500">/mes</span>
                      {isAnnual && (
                        <p className="text-sm text-gray-500 mt-1">
                          Facturado anualmente (${plan.priceYearly! * 12}/año)
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-white">Personalizado</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`${plan.href}${isAnnual && plan.priceMonthly !== null ? '&billing=annual' : ''}`}
                  className={`block w-full py-3 rounded-lg font-medium text-center transition-colors ${
                    plan.popular
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-[#1a1a1a] border border-gray-700 text-white hover:bg-[#222]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Annual savings note */}
          <p className="text-center text-gray-400 text-sm mt-8">
            {isAnnual
              ? 'Precios con 25% de descuento por pago anual. Todos los precios en USD.'
              : 'Ahorra 25% con facturación anual. Todos los precios en USD.'
            }
          </p>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comparación Detallada</h2>
            <p className="text-gray-400">Todo lo que incluye cada plan</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">Funcionalidad</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Core</th>
                  <th className="text-center py-4 px-4 text-emerald-400 font-semibold">Pro</th>
                  <th className="text-center py-4 px-4 text-white font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category) => (
                  <>
                    <tr key={category.name} className="border-b border-gray-800/50">
                      <td colSpan={4} className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <category.icon className="w-5 h-5 text-emerald-400" />
                          <span className="text-white font-semibold">{category.name}</span>
                        </div>
                      </td>
                    </tr>
                    {category.features.map((feature) => (
                      <tr key={feature.name} className="border-b border-gray-800/30">
                        <td className="py-3 px-4 pl-11 text-gray-300 text-sm">{feature.name}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.core === 'boolean' ? (
                            feature.core ? (
                              <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{feature.core}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-emerald-400 text-sm font-medium">{feature.pro}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? (
                              <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-gray-300 text-sm">{feature.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* All Plans Include */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Todos los Planes Incluyen</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Actualizaciones Gratis</h3>
              <p className="text-gray-500 text-sm">Acceso a todas las nuevas funciones sin costo adicional.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Sin Contratos</h3>
              <p className="text-gray-500 text-sm">Cancela cuando quieras, sin penalidades.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Soporte Incluido</h3>
              <p className="text-gray-500 text-sm">Ayuda cuando la necesites, en todos los planes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Empezar?</h2>
          <p className="text-gray-400 mb-8">Únete a cientos de coaches que ya transforman sus prácticas con AchievingCoach.</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Comenzar Prueba Gratuita
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
