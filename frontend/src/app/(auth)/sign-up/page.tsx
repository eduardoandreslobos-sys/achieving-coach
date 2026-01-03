'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { trackSignUp } from '@/lib/analytics';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ArrowLeft, Lightbulb, TrendingUp, Check } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!hasMinLength || !hasNumber) {
      setError('La contraseña debe tener al menos 8 caracteres y un número');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'coachee',
        createdAt: serverTimestamp(),
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        emailVerified: false,
      });

      setShowVerification(true);
      trackSignUp('email', 'coachee');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con este email');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al crear la cuenta. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showVerification) {
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
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-4">Revisa tu correo</h2>
            <p className="text-gray-400 mb-8">Hemos enviado un enlace de confirmación a tu dirección de correo electrónico.</p>

            <div className="border-t border-gray-800 pt-6">
              <Link href="/sign-in" className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-6">
              ¿No recibiste el correo?{' '}
              <button className="text-white hover:text-emerald-400 transition-colors font-medium">Reenviar instrucciones</button>
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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">AchievingCoach AI</span>
          </div>

          <h1 className="text-5xl xl:text-6xl font-light text-white mb-2 leading-tight">El futuro del</h1>
          <h1 className="text-5xl xl:text-6xl font-light text-emerald-400 mb-8 leading-tight">liderazgo ejecutivo.</h1>

          <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
            Desbloquea insights profundos sobre tu gestión y eleva tu carrera con nuestra inteligencia artificial de clase mundial.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                <Lightbulb className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Neuro-Insights</h3>
              <p className="text-gray-500 text-sm">Análisis de patrones de comportamiento en tiempo real.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Predictibilidad</h3>
              <p className="text-gray-500 text-sm">Proyecciones de carrera basadas en big data.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Bienvenido</h2>
            <p className="text-emerald-400 text-sm mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Únete a la élite ejecutiva hoy mismo.
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

              <div>
                <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Contraseña</label>
                <div className="relative">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crear contraseña segura" required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Confirmación</label>
                <div className="relative">
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetir contraseña" required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" />
                  {passwordsMatch && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : <>Registrarse <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-gray-500 text-xs mt-6">
              Al continuar, inicias tu <span className="text-white font-medium">prueba gratuita de 14 días</span><br />Sin cargos ocultos. Cancela cuando quieras.
            </p>

            <p className="text-center text-gray-400 text-sm mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link href="/sign-in" className="text-white hover:text-emerald-400 transition-colors font-medium">Iniciar sesión</Link>
            </p>
          </div>

          <p className="text-center text-gray-600 text-xs mt-8 flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            Secured by AchievingCoach AI
          </p>
        </div>
      </div>
    </div>
  );
}
