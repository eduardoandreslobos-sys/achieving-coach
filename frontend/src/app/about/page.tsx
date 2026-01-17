import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Shield, Award, Users, Heart, Rocket, Lightbulb, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nosotros – Nuestra Misión, Visión y Equipo',
  description: 'Conoce la misión de AchievingCoach: empoderar coaches en todo el mundo. Descubre nuestra historia, valores y el equipo detrás de la plataforma.',
};

const timeline = [
  {
    year: '2021',
    title: 'Investigación y Fundación',
    description: 'Entrevistamos a más de 100 coaches certificados ICF para entender sus desafíos y necesidades.',
  },
  {
    year: '2022',
    title: 'Lanzamiento del Producto',
    description: 'Entregamos las funciones principales: agendamiento, gestión de clientes y seguimiento de progreso.',
  },
  {
    year: '2023',
    title: 'Primeras Organizaciones',
    description: 'Agregamos soporte multi-coach y seguridad enterprise para necesidades organizacionales.',
  },
  {
    year: '2024',
    title: 'Evolución de la Plataforma',
    description: 'Introdujimos herramientas ICF, biblioteca expandida, reportes con IA y analytics avanzados.',
  },
  {
    year: '2025',
    title: 'Expansión Global',
    description: 'Alcanzamos coaches en 30+ países con soporte multiidioma y nuevas integraciones.',
  },
];

const values = [
  {
    icon: Heart,
    title: 'Coach-First',
    description: 'Cada decisión comienza preguntando: "¿Cómo servirá esto a coaches y coachees?"',
    color: 'bg-red-500/10 text-red-400',
  },
  {
    icon: Award,
    title: 'Excelencia',
    description: 'Comprometidos con la más alta calidad, alineados con estándares ICF.',
    color: 'bg-amber-500/10 text-amber-400',
  },
  {
    icon: Shield,
    title: 'Confianza',
    description: 'La confidencialidad y seguridad de datos es nuestra prioridad absoluta.',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    description: 'Continuamente mejorando con IA y tecnología de vanguardia.',
    color: 'bg-violet-500/10 text-violet-400',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description: 'Construyendo una red global de coaches que se apoyan mutuamente.',
    color: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    icon: Globe,
    title: 'Impacto',
    description: 'Midiendo nuestro éxito por las vidas transformadas a través del coaching.',
    color: 'bg-cyan-500/10 text-cyan-400',
  },
];

const team = [
  {
    name: 'Eduardo Lobos',
    role: 'Founder & CEO',
    bio: 'Ex-consultor de transformación digital con pasión por el desarrollo humano.',
  },
  {
    name: 'María González',
    role: 'Head of Product',
    bio: 'Coach PCC con 10+ años de experiencia en coaching ejecutivo.',
  },
  {
    name: 'Carlos Mendez',
    role: 'CTO',
    bio: 'Ingeniero de software con experiencia en startups de alto crecimiento.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Empoderando la Próxima<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Generación de Coaches</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nuestra misión es proporcionar a los coaches las herramientas que necesitan para crear impacto transformador en las vidas de sus clientes.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
              <p className="text-gray-400 leading-relaxed">
                Democratizar el acceso a herramientas de coaching de clase mundial, permitiendo que cada coach —independiente o parte de una organización— entregue resultados excepcionales y medibles a sus clientes.
              </p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
              <p className="text-gray-400 leading-relaxed">
                Ser la plataforma preferida de coaches ejecutivos en todo el mundo, reconocida por innovación, calidad y compromiso con el desarrollo humano. Queremos que cada sesión de coaching sea más efectiva gracias a nuestra tecnología.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Los principios que guían cada decisión que tomamos.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${value.color.split(' ')[0]}`}>
                    <Icon className={`w-6 h-6 ${value.color.split(' ')[1]}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
            <p className="text-gray-400">El camino que nos trajo hasta aquí.</p>
          </div>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-800 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                    <p className="text-blue-400 text-sm font-medium mb-1">{item.year}</p>
                    <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-gray-500 text-sm">Coaches Activos</p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">30+</p>
              <p className="text-gray-500 text-sm">Países</p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">10K+</p>
              <p className="text-gray-500 text-sm">Sesiones Facilitadas</p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-white mb-2">98%</p>
              <p className="text-gray-500 text-sm">Satisfacción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Nuestro Equipo</h2>
            <p className="text-gray-400">Las personas detrás de AchievingCoach.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para Unirte a Nosotros?</h2>
          <p className="text-gray-400 mb-8">Forma parte de la comunidad de coaches que están transformando vidas con AchievingCoach.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Comenzar Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg font-medium hover:bg-[#222] transition-colors">
              Contactar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
