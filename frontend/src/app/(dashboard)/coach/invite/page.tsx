'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Copy, Check, Link2, Sparkles, Share2, Mail, Rocket } from 'lucide-react';

export default function InviteCoacheesPage() {
  const { userProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && userProfile?.uid) {
      const baseUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://achievingcoach.com';
      setInviteLink(`${baseUrl}/join/${userProfile.uid}`);
    }
  }, [userProfile]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Invitar Coachees</h1>
          <p className="text-gray-400">Comparte tu enlace único para invitar clientes a tu práctica de coaching y gestiona su incorporación automáticamente.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Card - Invite Link */}
          <div className="lg:col-span-2 bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Tu Enlace de Invitación</h2>
                <p className="text-sm text-gray-500">Cualquiera con este enlace puede registrarse y se asignará automáticamente a tu cartera de clientes.</p>
              </div>
            </div>

            {/* Link Box */}
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between gap-4">
                <code className="flex-1 text-sm text-gray-300 break-all font-mono">
                  {inviteLink || 'Cargando...'}
                </code>
                <button
                  onClick={copyToClipboard}
                  disabled={!inviteLink}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex-shrink-0 disabled:opacity-50 font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiar
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Enlace activo y permanente
            </div>
          </div>

          {/* Steps Card */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Pasos de Invitación</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-white font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Copia tu enlace</p>
                  <p className="text-sm text-gray-500">Usa el botón "Copiar" para guardar el enlace en tu portapapeles.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-white font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Comparte con clientes</p>
                  <p className="text-sm text-gray-500">Envía el enlace por email, WhatsApp o inclúyelo en tu sitio web.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-white font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-white mb-1">Registro automático</p>
                  <p className="text-sm text-gray-500">El cliente crea su cuenta y aparece instantáneamente en tu dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Pro Tips */}
          <div className="lg:col-span-2 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-white">Consejos Pro para Mayor Conversión</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#0a0a0a]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <p className="font-medium text-white">Redes Sociales</p>
                </div>
                <p className="text-sm text-gray-400">Comparte tu enlace en la biografía de LinkedIn o Instagram para acceso fácil.</p>
              </div>
              
              <div className="bg-[#0a0a0a]/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <p className="font-medium text-white">Firma de Email</p>
                </div>
                <p className="text-sm text-gray-400">Agrega un botón "Reserva tu sesión" con este enlace en tu firma de correo.</p>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Rocket className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Estás listo para crecer</h3>
            <p className="text-sm text-gray-400 mb-4">Tu enlace está activo. Comienza a compartirlo hoy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
