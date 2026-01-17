'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, ArrowRight, Linkedin, Twitter, Youtube, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Interés en Demo',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate fields
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        throw new Error('Todos los campos son requeridos');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor ingresa un email válido');
      }

      if (formData.message.length < 10) {
        throw new Error('El mensaje debe tener al menos 10 caracteres');
      }

      // Save to Firestore
      await addDoc(collection(db, 'contact_messages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
        read: false,
        createdAt: serverTimestamp(),
      });

      // Create notification for admin
      await addDoc(collection(db, 'notifications'), {
        userId: 'admin',
        type: 'contact',
        title: 'Nuevo mensaje de contacto',
        message: `${formData.name} (${formData.email}) - ${formData.subject}`,
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: '/admin/messages',
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Interés en Demo', message: '' });

      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start py-12">
            {/* Left Side - Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs mb-8">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                CONTACTO
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
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Correo Electrónico</p>
                    <p className="text-white font-medium">info@achievingcoach.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[#111111] border border-gray-800 rounded-xl">
                  <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-violet-400" />
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
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <Twitter className="w-4 h-4 text-gray-400" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-[#111111] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 transition-colors">
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
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-gray-400">Te contactaremos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Email Profesional</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Asunto</label>
                    <div className="relative">
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
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
                      className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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

      <Footer />
    </div>
  );
}
