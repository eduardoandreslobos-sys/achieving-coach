import { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Users, Calendar, Zap, Shield, BookOpen, Award, FileSignature, Sparkles, Target, Brain, Lock, Eye, Layers, Workflow, CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Características – Herramientas de Coaching, Analytics e IA',
  description: 'Explora las características de AchievingCoach: dashboards de clientes, simulador ICF, 12+ herramientas, analytics en tiempo real, reportes con IA.',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-6">
            <Sparkles className="w-3 h-3" />
            PLATAFORMA COMPLETA
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Todo lo que Necesitas para<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Coaching de Alto Impacto</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Herramientas profesionales, analytics avanzados e inteligencia artificial diseñados específicamente para coaches ejecutivos y organizacionales.
          </p>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Gestión Integral de Coaching</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Una plataforma unificada para administrar cada aspecto de tu práctica de coaching.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Gestión de Clientes</h3>
              <p className="text-gray-500 text-sm">Perfiles completos, historial de sesiones, progreso de objetivos y documentación centralizada para cada coachee.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Agendamiento Inteligente</h3>
              <p className="text-gray-500 text-sm">Calendario integrado con recordatorios automáticos, gestión de reprogramaciones y sincronización con Google Calendar.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Portal del Cliente</h3>
              <p className="text-gray-500 text-sm">Espacio dedicado donde tus coachees acceden a ejercicios, revisan su progreso y preparan sus sesiones.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                <FileSignature className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Contratos y Firmas</h3>
              <p className="text-gray-500 text-sm">Acuerdos de coaching con firma digital integrada para un onboarding profesional y sin fricción.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Dashboards por Rol</h3>
              <p className="text-gray-500 text-sm">Vistas personalizadas para coaches, coachees, supervisores y administradores organizacionales.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Seguimiento de Metas</h3>
              <p className="text-gray-500 text-sm">Sistema SMART integrado para definir, monitorear y celebrar el logro de objetivos de coaching.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-400 text-xs uppercase tracking-wider mb-4">BIBLIOTECA DE HERRAMIENTAS</p>
              <h2 className="text-3xl font-bold mb-4">12+ Herramientas de Coaching Profesional</h2>
              <p className="text-gray-400 mb-8">
                Accede a versiones digitales e interactivas de las herramientas más efectivas de la industria, todas integradas en tu flujo de trabajo.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Rueda de la Vida con visualización dinámica</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Evaluación DISC con reportes detallados</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Framework GROW para sesiones estructuradas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Clarificación de Valores y Creencias Limitantes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">Escala de Resiliencia y Mapa de Stakeholders</span>
                </div>
              </div>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {['Wheel of Life', 'DISC', 'GROW Model', 'Values', 'Beliefs', 'Resilience', 'Stakeholders', 'Habits'].map((tool, i) => (
                  <div key={i} className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 text-center">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-sm text-gray-300">{tool}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ICF Simulator */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 text-sm font-medium">SIMULADOR ICF</span>
              </div>
              <div className="h-48 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">87%</div>
                  <p className="text-gray-500 text-sm">Puntuación Global</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-emerald-400 text-xs mb-1">Fundamentos</p>
                  <p className="text-white font-semibold">94%</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-orange-400 text-xs mb-1">Co-Creación</p>
                  <p className="text-white font-semibold">89%</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-violet-400 text-xs uppercase tracking-wider mb-4">EXCLUSIVO</p>
              <h2 className="text-3xl font-bold mb-4">Simulador de Competencias ICF</h2>
              <p className="text-gray-400 mb-6">
                Practica y evalúa tus habilidades de coaching con nuestro simulador basado en las 8 competencias centrales de la ICF, actualizado al modelo 2024.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Evaluación de los 4 dominios ICF
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Feedback detallado por competencia
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Análisis de IA con recomendaciones
                </li>
              </ul>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Probar Simulador
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-xs uppercase tracking-wider mb-4">INTELIGENCIA ARTIFICIAL</p>
            <h2 className="text-3xl font-bold mb-4">Analytics y Reportes Potenciados por IA</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Convierte datos de conversaciones en insights accionables. Demuestra el ROI del coaching con reportes automáticos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Analytics en Tiempo Real</h3>
              <p className="text-gray-500 text-sm">Visualiza el progreso de tus clientes con métricas dinámicas y KPIs personalizados.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Insights de IA</h3>
              <p className="text-gray-500 text-sm">Sugerencias automáticas sobre técnicas de preguntas y patrones de comunicación efectivos.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <FileSignature className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Reportes Automáticos</h3>
              <p className="text-gray-500 text-sm">Genera informes profesionales para RRHH, sponsors y reflexión del cliente con un clic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRM Section */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-400 text-xs uppercase tracking-wider mb-4">CRM DE VENTAS</p>
              <h2 className="text-3xl font-bold mb-4">Gestiona tus Oportunidades de Negocio</h2>
              <p className="text-gray-400 mb-6">
                Convierte prospectos en clientes con un CRM diseñado específicamente para coaches. Pipeline visual, calificación BANT y seguimiento de actividades.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  Pipeline visual estilo Kanban
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  Calificación BANT de prospectos
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  Lead scoring automático
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-blue-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-400" />
                  </div>
                  Registro de actividades y tareas
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs">
                Disponible en Plan Pro
              </div>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Workflow className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">PIPELINE DE VENTAS</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['Prospección', 'Calificación', 'Propuesta', 'Negociación'].map((stage, i) => (
                  <div key={i} className="bg-[#1a1a1a] rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-400 truncate">{stage}</p>
                    <p className="text-white font-semibold text-sm">{[3, 5, 2, 1][i]}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 text-sm">Pipeline Total</span>
                  <span className="text-emerald-400 font-semibold">$45,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Valor Ponderado</span>
                  <span className="text-blue-400 font-semibold">$22,500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 order-2 lg:order-1">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-violet-400" />
                <span className="text-violet-400 text-sm font-medium">DIRECTORIO DE COACHES</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'María González', specialty: 'Coaching Ejecutivo', rating: 4.9 },
                  { name: 'Carlos Mendez', specialty: 'Liderazgo', rating: 4.8 },
                  { name: 'Ana López', specialty: 'Carrera', rating: 4.7 },
                ].map((coach, i) => (
                  <div key={i} className="bg-[#1a1a1a] rounded-lg p-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {coach.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{coach.name}</p>
                      <p className="text-gray-500 text-xs">{coach.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-gray-300 text-sm">{coach.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-violet-400 text-xs uppercase tracking-wider mb-4">COMUNIDAD</p>
              <h2 className="text-3xl font-bold mb-4">Directorio Público de Coaches</h2>
              <p className="text-gray-400 mb-6">
                Aumenta tu visibilidad y atrae nuevos clientes. Crea tu perfil profesional en nuestro directorio público y recibe consultas de potenciales coachees.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Perfil profesional personalizable
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Muestra tus especialidades y certificaciones
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Recibe consultas de potenciales clientes
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-violet-500/10 rounded flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-violet-400" />
                  </div>
                  Convierte consultas en leads del CRM
                </li>
              </ul>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs">
                Disponible en Plan Pro
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Seguridad de Nivel Enterprise</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Protegemos la confidencialidad de tus sesiones y datos de clientes con los más altos estándares.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <Shield className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Encriptación AES-256</h3>
              <p className="text-gray-500 text-sm">Todos los datos en reposo y en tránsito están protegidos con encriptación de nivel bancario.</p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <Lock className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Cumplimiento GDPR</h3>
              <p className="text-gray-500 text-sm">Infraestructura compatible con GDPR, CCPA y preparada para requerimientos HIPAA.</p>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <Eye className="w-10 h-10 text-violet-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Control de Acceso</h3>
              <p className="text-gray-500 text-sm">Permisos granulares para asegurar que solo personal autorizado accede a información sensible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Empieza a Transformar tu Práctica Hoy</h2>
          <p className="text-gray-400 mb-8">14 días de prueba gratuita. Sin tarjeta de crédito. Cancela cuando quieras.</p>
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
