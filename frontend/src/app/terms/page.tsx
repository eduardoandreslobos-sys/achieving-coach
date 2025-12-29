import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle, AlertTriangle, CreditCard, Scale, Clock, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Servicio – AchievingCoach',
  description: 'Términos y condiciones de uso de la plataforma AchievingCoach.',
};

export default function TermsPage() {
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
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-gray-400 hover:text-white text-sm transition-colors">Iniciar Sesión</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Términos de Servicio</h1>
              <p className="text-gray-500 text-sm">Última actualización: Diciembre 2024</p>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 mb-8">
            <p className="text-gray-400 leading-relaxed">
              Bienvenido a AchievingCoach. Al acceder o usar nuestra plataforma, aceptas estos términos de servicio. Por favor, léelos cuidadosamente antes de utilizar nuestros servicios.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">1. Aceptación de Términos</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>Al crear una cuenta o utilizar AchievingCoach, confirmas que:</p>
                <ul className="space-y-2">
                  <li>• Tienes al menos 18 años de edad</li>
                  <li>• Tienes capacidad legal para celebrar contratos</li>
                  <li>• Aceptas cumplir con estos términos y nuestra política de privacidad</li>
                  <li>• La información que proporcionas es veraz y actualizada</li>
                </ul>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold">2. Descripción del Servicio</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>AchievingCoach proporciona una plataforma de software para coaches profesionales que incluye:</p>
                <ul className="space-y-2">
                  <li>• Gestión de clientes y sesiones de coaching</li>
                  <li>• Herramientas de evaluación y seguimiento</li>
                  <li>• Simulador de competencias ICF</li>
                  <li>• Analytics y reportes con inteligencia artificial</li>
                  <li>• Almacenamiento seguro de documentos</li>
                </ul>
                <p className="mt-4">Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio con previo aviso.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold">3. Planes y Pagos</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p><strong className="text-white">Prueba gratuita:</strong> 14 días sin compromiso. No se requiere tarjeta de crédito.</p>
                <p><strong className="text-white">Suscripciones:</strong> Facturación mensual o anual. Los precios pueden cambiar con 30 días de aviso.</p>
                <p><strong className="text-white">Cancelación:</strong> Puedes cancelar en cualquier momento. El acceso continúa hasta el fin del período pagado.</p>
                <p><strong className="text-white">Reembolsos:</strong> Ofrecemos reembolso completo dentro de los primeros 14 días de suscripción paga.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold">4. Uso Aceptable</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>Te comprometes a NO usar la plataforma para:</p>
                <ul className="space-y-2">
                  <li>• Actividades ilegales o fraudulentas</li>
                  <li>• Violar derechos de propiedad intelectual</li>
                  <li>• Transmitir malware o código malicioso</li>
                  <li>• Acosar, difamar o discriminar a otros usuarios</li>
                  <li>• Intentar acceder a cuentas de otros usuarios</li>
                  <li>• Revender o sublicenciar el servicio sin autorización</li>
                </ul>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold">5. Propiedad Intelectual</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p><strong className="text-white">Nuestra propiedad:</strong> La plataforma, su código, diseño, logos y contenido son propiedad de AchievingCoach Inc.</p>
                <p><strong className="text-white">Tu contenido:</strong> Mantienes la propiedad de todo el contenido que subes. Nos otorgas licencia para almacenarlo y mostrarlo según sea necesario para el servicio.</p>
                <p><strong className="text-white">Feedback:</strong> Cualquier sugerencia o mejora que nos envíes puede ser utilizada sin compensación.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold">6. Limitación de Responsabilidad</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p>AchievingCoach se proporciona "tal cual". No garantizamos:</p>
                <ul className="space-y-2">
                  <li>• Que el servicio sea ininterrumpido o libre de errores</li>
                  <li>• Resultados específicos del uso de la plataforma</li>
                  <li>• La precisión de los análisis generados por IA</li>
                </ul>
                <p className="mt-4">Nuestra responsabilidad máxima se limita al monto pagado por el servicio en los últimos 12 meses.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-pink-400" />
                </div>
                <h2 className="text-xl font-semibold">7. Terminación</h2>
              </div>
              <div className="text-gray-400 space-y-4">
                <p><strong className="text-white">Por ti:</strong> Puedes cerrar tu cuenta en cualquier momento desde la configuración.</p>
                <p><strong className="text-white">Por nosotros:</strong> Podemos suspender o terminar tu cuenta si violas estos términos, con o sin previo aviso.</p>
                <p><strong className="text-white">Efectos:</strong> Al terminar, tienes 30 días para exportar tus datos. Después, serán eliminados permanentemente.</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">8. Contacto</h2>
              </div>
              <div className="text-gray-400">
                <p className="mb-4">Para preguntas sobre estos términos:</p>
                <p><strong className="text-white">Email:</strong> legal@achievingcoach.com</p>
                <p><strong className="text-white">Dirección:</strong> Santiago, Chile</p>
              </div>
            </section>

            <section className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold">9. Ley Aplicable</h2>
              </div>
              <div className="text-gray-400">
                <p>Estos términos se rigen por las leyes de la República de Chile. Cualquier disputa será resuelta en los tribunales de Santiago, Chile.</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2026 AchievingCoach Inc. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacidad</Link>
            <Link href="/terms" className="text-white text-sm">Términos</Link>
            <Link href="/contact" className="text-gray-500 hover:text-white text-sm transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
