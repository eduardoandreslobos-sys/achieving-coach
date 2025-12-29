import { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, HelpCircle, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Precios – Planes para Coaches, Equipos y Empresas',
  description: 'Compara los planes de AchievingCoach. Prueba gratuita de 14 días. Core $29/mes, Pro $59/mes, planes Enterprise personalizados.',
};

const plans = [
  {
    name: 'Core',
    price: '$29',
    period: '/mes',
    description: 'Herramientas esenciales para coaches independientes',
    features: [
      'Hasta 15 clientes activos',
      'Agendamiento de sesiones',
      '10 herramientas de coaching',
      'Dashboard de analytics básico',
      'Soporte por email',
    ],
    cta: 'Comenzar Prueba',
    href: '/sign-up?plan=core',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$59',
    period: '/mes',
    description: 'Para prácticas en crecimiento',
    features: [
      'Clientes ilimitados',
      'Todas las funciones Core',
      '12+ herramientas (biblioteca completa)',
      'Simulador ICF incluido',
      'Analytics avanzados con IA',
      'Soporte prioritario',
      'Branding personalizado',
    ],
    cta: 'Comenzar Prueba',
    href: '/sign-up?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Personalizado',
    period: '',
    description: 'Para organizaciones y equipos de coaches',
    features: [
      'Todo en Pro',
      'Multi-coach / Multi-tenant',
      'SSO y controles de seguridad',
      'Integraciones personalizadas',
      'Onboarding dedicado',
      'SLA garantizado',
      'Account manager asignado',
    ],
    cta: 'Contactar Ventas',
    href: '/contact?subject=enterprise',
    popular: false,
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
    answer: 'Sí, ofrecemos 2 meses gratis cuando pagas anualmente (equivalente a 17% de descuento).',
  },
  {
    question: '¿Qué pasa con mis datos si cancelo?',
    answer: 'Tienes 30 días para exportar tus datos después de cancelar. Después de ese período, los datos se eliminan de forma segura.',
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-white">AchievingCoach</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-400 hover:text-white text-sm transition-colors">Características</Link>
              <Link href="/pricing" className="text-white text-sm font-medium">Precios</Link>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">Nosotros</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-gray-400 hover:text-white text-sm transition-colors">Iniciar Sesión</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades. Sin contratos a largo plazo. Sin sorpresas.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-[#111111] border rounded-2xl p-8 ${
                  plan.popular 
                    ? 'border-blue-500 ring-1 ring-blue-500' 
                    : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
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
                  href={plan.href}
                  className={`block w-full py-3 rounded-lg font-medium text-center transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-[#1a1a1a] border border-gray-700 text-white hover:bg-[#222]'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Todos los Planes Incluyen</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-blue-400" />
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
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Comenzar Prueba Gratuita
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 AchievingCoach Inc. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacidad</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">Términos</Link>
            <Link href="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
