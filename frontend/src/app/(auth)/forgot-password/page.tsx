'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, Lock, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email.');
      } else {
        setError('Error al enviar el email. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">AchievingCoach AI</span>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Revisa tu correo</h2>
            <p className="text-gray-400 mb-8">Hemos enviado un enlace de recuperación a tu dirección de correo electrónico.</p>

            <div className="border-t border-gray-800 pt-6">
              <Link href="/sign-in" className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              ¿No recibiste el correo?{' '}
              <button onClick={() => setSent(false)} className="text-white hover:text-emerald-400 transition-colors font-medium">Reenviar instrucciones</button>
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-8 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secured by AchievingCoach AI
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">AchievingCoach AI</span>
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl text-left">
          <h2 className="text-2xl font-semibold text-white mb-2">Restablecer Contraseña</h2>
          <p className="text-emerald-400 text-sm mb-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            Recupera el acceso a tu cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Correo Profesional</label>
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@empresa.com" required
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : <>Enviar enlace de recuperación <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <Link href="/sign-in" className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm mt-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>

        <p className="text-center text-gray-600 text-xs mt-8 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          Secured by AchievingCoach AI
        </p>
      </div>
    </div>
  );
}
