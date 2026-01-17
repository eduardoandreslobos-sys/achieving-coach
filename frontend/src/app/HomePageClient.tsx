'use client';

import Link from 'next/link';
import { BarChart3, Shield, Zap, Users, Sparkles, ArrowRight, Play, ChevronLeft, ChevronRight, Brain, Target, Calendar, FileSignature, Layers, Workflow, Cpu, Headphones, Lock, Eye, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';

export default function HomePageClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { quote: "La profundidad de la analítica no tiene comparación. Es como tener un supervisor en la sala conmigo, señalando matices que podría haber perdido.", name: "Sarah A.", role: "Master Certified Coach" },
    { quote: "AchievingCoach se sabe gestionar mi agenda, gestiona mi metodología. La actualización 2024 es asombrosamente rápida y hermosa.", name: "David Chen", role: "Consultor Ejecutivo" },
    { quote: "Una mezcla perfecta de tecnología y toque humano. Solo los informes automatizados me ahorran unas 10 horas a la semana.", name: "Elena R.", role: "Coach de Liderazgo" },
  ];

  const tools = [
    { name: 'Wheel of Life', icon: '◐' },
    { name: 'DISC Assessment', icon: '◑' },
    { name: 'SWOT Analysis', icon: '◒' },
    { name: 'GROW Framework', icon: '◓' },
    { name: 'SMART Goals', icon: '◔' },
    { name: 'Journaling Prompts', icon: '◕' },
  ];

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
              <Link href="/features" className="text-gray-400 hover:text-white text-sm transition-colors">Soluciones</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Precios</Link>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">Nosotros</Link>
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              NUEVA VERSIÓN 2026
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              El Sistema Operativo del<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Coaching Ejecutivo</span>
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Eleva tu práctica con insights impulsados por IA, gestión fluida y herramientas integrales diseñadas para el futuro del coaching de alto impacto.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link href="/sign-up" className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                Iniciar Prueba Gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <Play className="w-4 h-4" />
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gestión de Coaching Avanzada */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Cómo gestionar tu práctica de coaching de forma eficiente?</h2>
            <p className="text-gray-400 max-w-2xl">
              Optimiza tu flujo de trabajo con una plataforma unificada que maneja la complejidad con elegancia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Perfiles y Viajes del Cliente</h3>
              <p className="text-gray-500 text-sm">Centraliza y visualiza la evolución de cada cliente: objetivos, notas, planes de acción y progreso consolidados de forma intuitiva e interactiva.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Agendamiento Inteligente</h3>
              <p className="text-gray-500 text-sm">Organiza tus sesiones con el calendario inteligente: recordatorios automáticos, gestión de reprogramaciones y toma de notas en tiempo real.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Portal del Cliente</h3>
              <p className="text-gray-500 text-sm">Centraliza las interacciones del coachee: ejercicios interactivos, acceso rápido a sesiones y seguimiento de su evolución.</p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <FileSignature className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Firmas Digitales</h3>
              <p className="text-gray-500 text-sm">Firma legalmente documentos como acuerdos integrados para alinearte sin el flujo de onboarding.</p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-pink-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Dashboards por Rol</h3>
              <p className="text-gray-500 text-sm">Vistas prediseñadas para administradores, coaches y clientes.</p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Metodología de 9 Fases</h3>
              <p className="text-gray-500 text-sm">Sigue nuestro marco estructurado paso a paso del comportamiento en 9 pasos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas para el Éxito */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-blue-400 text-xs uppercase tracking-wider mb-2">RECURSOS DE ÉLITE</p>
              <h2 className="text-3xl lg:text-4xl font-bold">¿Qué herramientas necesita un coach profesional?</h2>
            </div>
            <Link href="/coach/tools" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
              Explorar Biblioteca
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-gray-400 mb-10 max-w-2xl">
            Potencia tus sesiones con evaluaciones estándar de la industria y ejercicios interactivos de vanguardia.
          </p>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Simulador ICF Card */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <p className="text-blue-400 text-xs uppercase tracking-wider mb-4">PREMIUM</p>
              <h3 className="text-2xl font-bold text-white mb-3">Simulador de Competencias ICF</h3>
              <p className="text-gray-400 text-sm mb-6">
                Practica y refina tu presencia como coach con nuestro simulador impulsado por IA, basado en las competencias centrales de la International Coaching Federation.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 rounded-full text-xs text-gray-400">Escucha Activa</span>
                <span className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 rounded-full text-xs text-gray-400">Preguntas Poderosas</span>
                <span className="px-3 py-1 bg-[#1a1a1a] border border-gray-700 rounded-full text-xs text-gray-400">Presencia</span>
              </div>
              <Link href="/coach/icf-simulator" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
                Probar Simulador
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Tools Grid */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Plantillas Listas</h3>
                  <p className="text-gray-500 text-sm">Más de 10 estructuras de sesión y recursos preconstruidos para maximizar tu tiempo.</p>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-4 mb-4">
                <h4 className="text-white font-semibold mb-1">12+ Herramientas</h4>
                <p className="text-gray-500 text-sm">Versiones digitales interactivas de los ejercicios clásicos de coaching.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-xs text-gray-300 flex items-center gap-1.5">
                    <span className="text-blue-400">{tool.icon}</span>
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights con IA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-400 text-xs uppercase tracking-wider mb-4">INTELLIGENCE LAYER</p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                ¿Cómo puede la IA mejorar tu coaching?<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Análisis Profundo con Inteligencia Artificial</span>
              </h2>
              <p className="text-gray-400 mb-8">
                Convierte los datos de conversación en estrategias de coaching accionables. Nuestra IA analiza patrones para ayudarte a demostrar el ROI a tus clientes.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Analítica de Progreso en Tiempo Real</h4>
                    <p className="text-gray-500 text-sm">Visualiza el crecimiento del cliente con gráficos dinámicos que capturan KPIs personalizados.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Insights Generados por IA</h4>
                    <p className="text-gray-500 text-sm">Sugerencias sobre técnicas de preguntas y patrones lingüísticos basados en análisis de transcripciones.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <FileSignature className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Reportes Finales y de Proceso</h4>
                    <p className="text-gray-500 text-sm">Genera informes de alto nivel automáticos entre sesiones para equipos de RRHH, corporativos o reflexión del cliente.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Preview Card */}
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-semibold">Velocidad de Crecimiento</h4>
                <span className="text-emerald-400 text-sm">+24% último trimestre</span>
              </div>
              <div className="h-40 bg-[#1a1a1a] rounded-lg mb-6 flex items-end p-4 gap-2">
                {[30, 45, 35, 60, 50, 70, 65, 80, 75, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-500/50 rounded-t" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs mb-2">
                  <Sparkles className="w-4 h-4" />
                  AI INSIGHT
                </div>
                <p className="text-gray-300 text-sm">
                  "El cliente ha mostrado mejora significativa en regulación de impulsos. La técnica del 'pause antes de responder' parece ser efectiva."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conectividad y Eficiencia */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Cómo integrar tus herramientas de coaching favoritas?</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Conecta tus herramientas favoritas y deja que nuestros flujos de trabajo manejen el trabajo pesado, sin fricción.
          </p>

          <div className="flex justify-center gap-8 mb-12">
            <div className="w-16 h-16 bg-[#111111] border border-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div className="w-16 h-16 bg-[#111111] border border-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="w-16 h-16 bg-[#111111] border border-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📹</span>
            </div>
            <div className="w-16 h-16 bg-[#111111] border border-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-gray-800 rounded-lg">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Open API</span>
              <span className="text-xs text-gray-500">v2.0 disponible</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-gray-800 rounded-lg">
              <Workflow className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-300">Workflows</span>
              <span className="text-xs text-gray-500">automatización nativa</span>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué AchievingCoach - SEO Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                La Plataforma Profesional de<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Coaching Ejecutivo</span>
              </h2>
              <div className="space-y-4 text-gray-400">
                <p>
                  AchievingCoach es el sistema operativo definitivo para coaches profesionales que buscan transformar su práctica de coaching ejecutivo. Nuestra plataforma profesional integra todas las herramientas que necesitas para gestionar clientes, sesiones y resultados en un solo lugar.
                </p>
                <p>
                  Como sistema operativo del coaching ejecutivo, automatizamos las tareas administrativas para que puedas enfocarte en lo que realmente importa: el desarrollo y crecimiento de tus clientes. Desde la primera sesión de descubrimiento hasta el cierre del proceso, nuestra plataforma profesional te acompaña en cada paso.
                </p>
                <p>
                  El coaching ejecutivo requiere herramientas a la altura del impacto que generas. Por eso diseñamos AchievingCoach como una plataforma profesional completa que incluye evaluaciones psicométricas, seguimiento de objetivos, análisis de progreso y comunicación integrada con tus clientes.
                </p>
              </div>
            </div>
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">¿Por qué elegir nuestra plataforma profesional?</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Sistema operativo completo</span>
                    <p className="text-gray-500 text-sm mt-1">Gestiona todo tu negocio de coaching ejecutivo desde una única plataforma profesional integrada.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Metodologías probadas</span>
                    <p className="text-gray-500 text-sm mt-1">Implementa GROW, DISC, Rueda de la Vida y más de 10 herramientas de coaching ejecutivo validadas.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Analítica avanzada</span>
                    <p className="text-gray-500 text-sm mt-1">Demuestra el ROI de tu coaching ejecutivo con reportes automáticos y métricas de impacto.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">Cumplimiento ICF</span>
                    <p className="text-gray-500 text-sm mt-1">Plataforma profesional alineada con las competencias de la International Coaching Federation.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios del Coaching Ejecutivo - SEO Content */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Transforma tu Práctica de Coaching Ejecutivo</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              El coaching ejecutivo es una de las profesiones de mayor impacto en el desarrollo organizacional. Con AchievingCoach, llevas tu práctica profesional al siguiente nivel con tecnología diseñada específicamente para coaches que trabajan con líderes y equipos de alto rendimiento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <Star className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Coaching Ejecutivo de Alto Impacto</h3>
              <p className="text-gray-500 text-sm">
                Nuestra plataforma profesional te permite estructurar procesos de coaching ejecutivo que generan resultados medibles. Desde la definición de objetivos hasta el seguimiento de KPIs, todo integrado en un sistema operativo intuitivo.
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <Users className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Gestión Profesional de Clientes</h3>
              <p className="text-gray-500 text-sm">
                El coaching ejecutivo requiere un manejo impecable de la relación con el cliente. Nuestra plataforma profesional centraliza perfiles, historial de sesiones, documentos y comunicación en un solo lugar.
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <Brain className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Inteligencia Artificial para Coaches</h3>
              <p className="text-gray-500 text-sm">
                El sistema operativo de AchievingCoach incluye IA que analiza sesiones y sugiere enfoques. Perfecto para coaches ejecutivos que quieren maximizar el impacto de cada conversación.
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <Target className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Seguimiento de Objetivos</h3>
              <p className="text-gray-500 text-sm">
                El coaching ejecutivo efectivo se mide por resultados. Nuestra plataforma profesional te permite definir, trackear y reportar el progreso hacia objetivos con precisión.
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <Calendar className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Agendamiento y Recordatorios</h3>
              <p className="text-gray-500 text-sm">
                Como sistema operativo completo, AchievingCoach maneja tu calendario, envía recordatorios automáticos y facilita la reprogramación. Menos administración, más coaching ejecutivo.
              </p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <BarChart3 className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Reportes para Stakeholders</h3>
              <p className="text-gray-500 text-sm">
                El coaching ejecutivo corporativo requiere comunicar resultados a RRHH y sponsors. Genera reportes profesionales automáticos que demuestran el valor de tu intervención.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seguridad */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">¿Es seguro almacenar datos de clientes en AchievingCoach?</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Protegemos tu práctica y la privacidad de tus clientes con los estándares más altos de la industria.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Seguridad Enterprise</h3>
              <p className="text-gray-500 text-sm">Encriptación de nivel bancario (AES-256) para recibir datos del cliente y notas de sesión, en reposo y en tránsito.</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Privacidad & Compliance</h3>
              <p className="text-gray-500 text-sm">Infraestructura totalmente compatible con GDPR, CCPA e HIPAA (disponible con complementos de coaching de salud y bienestar).</p>
            </div>

            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 text-left">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Confidencialidad por Diseño</h3>
              <p className="text-gray-500 text-sm">Controles de permisos granulares para asegurar que solo el personal autorizado tiene acceso a registros específicos de datos de clientes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios - Social Proof */}
      <section className="py-20 px-6 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-xs uppercase tracking-wider mb-4">TESTIMONIOS</p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Lo Que Dicen Nuestros Coaches</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Coaches profesionales de todo el mundo confían en AchievingCoach para transformar su práctica de coaching ejecutivo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Valoración promedio de <span className="text-amber-400 font-semibold">4.8/5</span> basada en más de 150 reseñas
            </p>
          </div>
        </div>
      </section>

      {/* FAQ - Preguntas Frecuentes */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs uppercase tracking-wider mb-4">PREGUNTAS FRECUENTES</p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Todo lo que Necesitas Saber</h2>
            <p className="text-gray-400">
              Respuestas a las preguntas más comunes sobre nuestra plataforma de coaching ejecutivo.
            </p>
          </div>

          <div className="space-y-4">
            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Qué es AchievingCoach?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                AchievingCoach es una plataforma profesional diseñada para coaches ejecutivos, coaches de vida y coaches de carrera. Proporciona más de 12 herramientas interactivas de coaching incluyendo evaluaciones DISC, Rueda de la Vida y hojas de trabajo del modelo GROW, junto con gestión de clientes, programación de sesiones e insights impulsados por IA.
              </div>
            </details>

            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Cuánto cuesta AchievingCoach?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                AchievingCoach ofrece un plan gratuito para comenzar. Los planes Premium comienzan en $29/mes para coaches individuales, con planes Enterprise a $99/mes para organizaciones de coaching. Todos los planes incluyen acceso a las herramientas principales de coaching.
              </div>
            </details>

            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Está alineado con las competencias ICF?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                Sí, AchievingCoach está diseñado alrededor de las competencias de la ICF (International Coaching Federation). La plataforma incluye un Simulador de Competencias ICF y herramientas alineadas con metodologías de coaching aprobadas por la ICF.
              </div>
            </details>

            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Qué herramientas de coaching incluye?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                AchievingCoach incluye más de 12 herramientas profesionales: Evaluación DISC, Rueda de la Vida, Hoja de Trabajo GROW, Clarificación de Valores, Mapeo de Stakeholders, Brújula de Carrera, Diario de Disparadores Emocionales, Feedback-Feedforward, Analizador de Bucles de Hábitos, Transformación de Creencias Limitantes y Evaluación de Escala de Resiliencia.
              </div>
            </details>

            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Es seguro para los datos de mis clientes?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                Sí, AchievingCoach utiliza seguridad de nivel empresarial incluyendo encriptación AES-256, cumple con GDPR, CCPA y directrices HIPAA, y proporciona controles de permisos granulares para proteger las conversaciones de coaching sensibles.
              </div>
            </details>

            <details className="bg-[#111111] border border-gray-800 rounded-xl group">
              <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                <h3 className="text-white font-semibold">¿Soporta múltiples idiomas?</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">
                Sí, AchievingCoach soporta interfaces en inglés y español. La plataforma está diseñada para coaches internacionales que trabajan con clientes globalmente.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#080808] to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Comienza a Transformar tu Práctica de Coaching Ejecutivo Hoy
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Únete a cientos de coaches profesionales que ya utilizan AchievingCoach como su sistema operativo de coaching. Prueba gratis, sin compromiso.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sign-up" className="px-8 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Crear Cuenta Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="px-8 py-3.5 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
              Contactar Ventas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-white">AchievingCoach</span>
              </Link>
              <p className="text-gray-500 text-sm mb-4">
                La plataforma de IA que empodera a la próxima generación de coaches ejecutivos de clase mundial.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/features" className="hover:text-white transition-colors">Características</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Precios</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integraciones</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Comunidad</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Academia</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Centro de Ayuda</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Términos</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Seguridad</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
            <p className="text-gray-600 text-sm">© 2026 AchievingCoach Inc. Todos los derechos reservados.</p>
            <p className="text-gray-600 text-sm mt-2 md:mt-0">
              <time dateTime="2026-01-16">Última actualización: Enero 2026</time>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
