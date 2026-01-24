import { Metadata } from 'next';
import Link from 'next/link';
import { Users, BarChart3, Shield, Palette, Settings, HeadphonesIcon, CheckCircle, Building2, Target, TrendingUp } from 'lucide-react';
import { Navbar, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Organizaciones – Plataforma Enterprise de Coaching',
  description: 'Plataforma de coaching empresarial para líderes de RRHH y L&D. Gestiona coaches a escala, mide el ROI, garantiza seguridad (SOC 2, GDPR, HIPAA).',
  keywords: ['plataforma coaching empresarial', 'software coaching corporativo', 'ROI coaching', 'plataforma desarrollo liderazgo'],
  openGraph: {
    title: 'AchievingCoach para Organizaciones – Plataforma Enterprise de Coaching',
    description: 'Plataforma de coaching empresarial para líderes de RRHH y L&D. Gestiona coaches a escala, mide el ROI, garantiza seguridad.',
    url: 'https://achievingcoach.com/organizations',
  },
};

const features = [
  {
    icon: Users,
    title: 'Gestión Multi-Coach',
    description: 'Administra múltiples coaches desde un único panel. Asigna clientes, monitorea actividad y asegura consistencia.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Analytics de ROI',
    description: 'Demuestra el valor del coaching con datos concretos. Mide engagement, logro de objetivos y mejoras de rendimiento.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Shield,
    title: 'Compliance y Seguridad',
    description: 'Integración SSO, controles de acceso por rol, logs de auditoría. Compatible con GDPR, preparado para HIPAA, certificado SOC 2 Type II.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Palette,
    title: 'Branding Personalizado',
    description: 'Aplica el logo, colores y terminología de tu empresa. Experiencia de marca consistente para tus colaboradores.',
    color: 'bg-violet-500/10 text-violet-400',
  },
  {
    icon: Settings,
    title: 'API e Integraciones',
    description: 'Conecta con tu HRIS, LMS o sistemas de gestión de talento. Automatiza flujos de datos con nuestra API completa.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: HeadphonesIcon,
    title: 'Soporte Dedicado',
    description: 'Customer Success Manager, capacitación personalizada y SLAs garantizados. Te acompañamos en cada paso.',
    color: 'bg-pink-500/10 text-pink-400',
  },
];

const useCases = [
  {
    title: 'Desarrollo de Liderazgo',
    description: 'Desarrolla la próxima generación de líderes con programas de coaching estructurados.',
    items: ['Identificación de alto potencial', 'Planificación de sucesión', 'Onboarding ejecutivo'],
    icon: Target,
    color: 'bg-emerald-600',
  },
  {
    title: 'Coaching de Desempeño',
    description: 'Mejora el rendimiento individual y de equipos con intervenciones de coaching focalizadas.',
    items: ['Logro de objetivos', 'Desarrollo de habilidades', 'Transiciones de carrera'],
    icon: TrendingUp,
    color: 'bg-blue-600',
  },
  {
    title: 'Transformación Cultural',
    description: 'Construye y sostén una cultura organizacional fuerte escalando el coaching ampliamente.',
    items: ['Gestión del cambio', 'Alineación de equipos', 'Embedding de valores'],
    icon: Building2,
    color: 'bg-violet-600',
  },
];

const stats = [
  { value: '87%', label: 'Aumento en engagement', note: 'reportado por organizaciones' },
  { value: '62%', label: 'Reducción en rotación de líderes', note: 'en promedio' },
  { value: '3.5×', label: 'Retorno de inversión', note: 'en el primer año' },
];

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-6">
            <Building2 className="w-3 h-3" />
            SOLUCIÓN ENTERPRISE
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Escala el Impacto del Coaching y<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Demuestra el ROI</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-8">
            AchievingCoach para Organizaciones es una plataforma de coaching empresarial diseñada para empresas que ejecutan programas de coaching a escala. Gestiona todos tus coaches y participantes en un solo sistema, monitorea el progreso organizacional y demuestra un ROI claro.
          </p>
          <Link
            href="/contact?type=enterprise"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Solicitar Demo
          </Link>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades Enterprise</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Todo lo que necesitas para ejecutar programas de coaching exitosos a escala.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color.split(' ')[0]}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Demuestra ROI Claro</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cuando inviertes en coaching a escala, el liderazgo espera resultados. AchievingCoach proporciona los analytics para medir el impacto en términos de negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-[#111111] border border-gray-800 rounded-xl p-8 text-center">
                <p className="text-4xl font-bold text-emerald-400 mb-2">Hasta {stat.value}</p>
                <p className="text-gray-300 mb-2">{stat.label}</p>
                <p className="text-sm text-gray-500">{stat.note}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-8">
            <h3 className="text-xl font-semibold mb-6 text-center">Lo Que Puedes Medir:</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Utilización del Programa</p>
                  <p className="text-gray-500 text-sm">Inscripción, participación y tasas de engagement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Progreso de Desarrollo</p>
                  <p className="text-gray-500 text-sm">Logro de objetivos y desarrollo de competencias</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-white">Impacto de Negocio</p>
                  <p className="text-gray-500 text-sm">Retención, desempeño, tasas de promoción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Seguridad y Compliance Enterprise</h2>
              <p className="text-gray-400 mb-6">
                Tomamos la seguridad y privacidad de datos seriamente. AchievingCoach está construido sobre una infraestructura cloud moderna y segura con múltiples capas de protección.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Encriptación 256-bit en tránsito y en reposo</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Certificado SOC 2 Type II</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Compatible con GDPR</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Preparado para HIPAA en industrias reguladas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Integración Single Sign-On (SSO)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Control de acceso por roles y logs de auditoría</span>
                </li>
              </ul>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-[#1a1a1a] rounded-xl">
                  <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">SOC 2</p>
                  <p className="text-sm text-gray-500">Type II Certified</p>
                </div>
                <div className="text-center p-4 bg-[#1a1a1a] rounded-xl">
                  <Shield className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">GDPR</p>
                  <p className="text-sm text-gray-500">Compliant</p>
                </div>
                <div className="text-center p-4 bg-[#1a1a1a] rounded-xl">
                  <Shield className="w-10 h-10 text-violet-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">HIPAA</p>
                  <p className="text-sm text-gray-500">Ready</p>
                </div>
                <div className="text-center p-4 bg-[#1a1a1a] rounded-xl">
                  <Shield className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">SSO</p>
                  <p className="text-sm text-gray-500">Supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Casos de Uso</h2>
            <p className="text-gray-400">
              Empresas líderes usan AchievingCoach para potenciar sus iniciativas de coaching.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((useCase, i) => (
              <div key={i} className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden">
                <div className={`${useCase.color} p-6 text-white`}>
                  <useCase.icon className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-400 mb-4">{useCase.description}</p>
                  <ul className="space-y-2">
                    {useCase.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para Transformar tu Programa de Coaching?
          </h2>
          <p className="text-gray-400 mb-8">
            Agenda una demo hoy para ver cómo AchievingCoach puede elevar las iniciativas de coaching de tu organización.
          </p>
          <Link
            href="/contact?type=enterprise"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Solicitar Demo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
