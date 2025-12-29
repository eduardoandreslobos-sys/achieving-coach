'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight, Linkedin, Twitter, Youtube, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Interés en Demo',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate with backend/email service
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'Interés en Demo', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-semibold text-white">AchievingCoach</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/features" className="text-gray-400 hover:text-white text-sm transition-colors">Características</Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Precios</Link>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">Acerca de</Link>
              <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-gray-400 hover:text-white text-sm transition-colors">Iniciar Sesión</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Empezar Prueba Gratuita
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start py-12">
            {/* Left Side - Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                SISTEMA OPERATIVO
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Hablemos de<br />tu<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">evolución.</span>
              </h1>

              <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
                Estamos aquí para ayudarte a desbloquear el siguiente nivel de liderazgo ejecutivo con inteligencia artificial.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4 p-4 bg-[#111111] border border-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Correo Electrónico</p>
                    <p className="text-white font-medium">info@achievingcoach.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#111111] border border-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Sede Central</p>
                    <p className="text-white font-medium">Santiago, Chile. LATAM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Síguenos</p>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Twitter className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Youtube className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Envíanos un mensaje</h2>
              <p className="text-gray-400 text-sm mb-8">Nuestro equipo te responderá en menos de 24 horas hábiles.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-400">Te contactaremos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Email Profesional</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Asunto</label>
                    <div className="relative">
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors cursor-pointer"
                      >
                        <option value="Interés en Demo">Interés en Demo</option>
                        <option value="Consulta General">Consulta General</option>
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Facturación">Facturación</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Mensaje</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos sobre tus objetivos y cómo podemos ayudarte..."
                      rows={5}
                      required
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    ) : (
                      <>
                        Enviar Mensaje
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 AchievingCoach. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Términos de Servicio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
