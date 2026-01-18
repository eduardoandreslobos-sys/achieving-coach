'use client';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-[#0a0a0a]" role="contentinfo">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="AchievingCoach - Inicio">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-white">AchievingCoach</span>
            </Link>
            <p className="text-gray-500 text-sm mb-4">
              La plataforma de IA que empodera a la próxima generación de coaches ejecutivos de clase mundial.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/achievingcoach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Síguenos en Twitter"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/achievingcoach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Síguenos en LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href="https://instagram.com/achievingcoach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
                aria-label="Síguenos en Instagram"
              >
                Instagram
              </a>
            </div>
          </div>

          {/* Producto Column */}
          <nav aria-label="Enlaces de producto">
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/features" className="hover:text-white transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Recursos Column */}
          <nav aria-label="Enlaces de recursos">
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  Agendar Demo
                </Link>
              </li>
            </ul>
          </nav>

          {/* Legal Column */}
          <nav aria-label="Enlaces legales">
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5">
          <p className="text-gray-600 text-sm">
            © {currentYear} AchievingCoach Inc. Todos los derechos reservados.
          </p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">
            <time dateTime={currentDate}>
              Última actualización: {currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}
            </time>
          </p>
        </div>
      </div>
    </footer>
  );
}
