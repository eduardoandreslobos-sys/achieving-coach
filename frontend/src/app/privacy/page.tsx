import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, UserCheck, Globe, Mail, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Política de Privacidad – AchievingCoach',
  description: 'Conoce cómo AchievingCoach protege tu información personal y la de tus clientes.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Política de Privacidad</h1>
              <p className="text-gray-500 text-sm">Última actualización: Diciembre 2024</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 mb-8">
            <p className="text-gray-400 leading-relaxed">
              En AchievingCoach, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal y la de tus clientes.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold">1. Información que Recopilamos</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p><strong className="text-white">Información de cuenta:</strong> Nombre, correo electrónico, contraseña encriptada, foto de perfil opcional.</p>
                <p><strong className="text-white">Información de coaching:</strong> Notas de sesión, objetivos de clientes, evaluaciones y documentos que subas a la plataforma.</p>
                <p><strong className="text-white">Datos de uso:</strong> Cómo interactúas con la plataforma, funciones que utilizas, y métricas de rendimiento.</p>
                <p><strong className="text-white">Información de pago:</strong> Procesada de forma segura por Stripe. No almacenamos números de tarjeta completos.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold">2. Cómo Usamos tu Información</h2>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>• Proporcionar y mejorar nuestros servicios de coaching</li>
                <li>• Personalizar tu experiencia en la plataforma</li>
                <li>• Procesar pagos y gestionar tu suscripción</li>
                <li>• Enviarte actualizaciones importantes sobre el servicio</li>
                <li>• Generar analytics y reportes para tu práctica</li>
                <li>• Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold">3. Seguridad de Datos</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>Implementamos medidas de seguridad de nivel enterprise:</p>
                <ul className="space-y-2">
                  <li>• <strong className="text-white">Encriptación AES-256</strong> para datos en reposo</li>
                  <li>• <strong className="text-white">TLS 1.3</strong> para datos en tránsito</li>
                  <li>• <strong className="text-white">Autenticación de dos factores</strong> disponible</li>
                  <li>• <strong className="text-white">Backups automáticos</strong> con retención de 30 días</li>
                  <li>• <strong className="text-white">Auditorías de seguridad</strong> regulares</li>
                </ul>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold">4. Tus Derechos</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>Tienes derecho a:</p>
                <ul className="space-y-2">
                  <li>• <strong className="text-white">Acceder</strong> a tus datos personales</li>
                  <li>• <strong className="text-white">Corregir</strong> información inexacta</li>
                  <li>• <strong className="text-white">Eliminar</strong> tu cuenta y datos asociados</li>
                  <li>• <strong className="text-white">Exportar</strong> tus datos en formato estándar</li>
                  <li>• <strong className="text-white">Oponerte</strong> al procesamiento de tus datos</li>
                </ul>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-xl font-semibold">5. Cumplimiento Internacional</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>AchievingCoach cumple con las siguientes regulaciones:</p>
                <ul className="space-y-2">
                  <li>• <strong className="text-white">GDPR</strong> - Reglamento General de Protección de Datos (UE)</li>
                  <li>• <strong className="text-white">CCPA</strong> - Ley de Privacidad del Consumidor de California</li>
                  <li>• <strong className="text-white">Ley 19.628</strong> - Protección de datos personales (Chile)</li>
                </ul>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">6. Contacto</h2>
              </div>
              <div className="text-gray-400">
                <p className="mb-4">Para preguntas sobre privacidad o ejercer tus derechos, contáctanos:</p>
                <p><strong className="text-white">Email:</strong> privacy@achievingcoach.com</p>
                <p><strong className="text-white">Dirección:</strong> Santiago, Chile</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
