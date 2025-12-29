'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, TrendingUp, Shield, Sun, Moon } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      redirectToDashboard(user.uid);
    }
  }, [user, authLoading]);

  const redirectToDashboard = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'admin') {
          router.push('/admin');
        } else if (userData.role === 'coach') {
          router.push('/coach');
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await redirectToDashboard(userCredential.user.uid);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este email.');
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.');
      }
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando...</p>
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

          <h1 className="text-5xl xl:text-6xl font-light text-white mb-2 leading-tight">Vuelve a tomar</h1>
          <h1 className="text-5xl xl:text-6xl font-light text-emerald-400 mb-8 leading-tight">el control.</h1>

          <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
            Continúa tu viaje hacia la excelencia ejecutiva. Accede a tu dashboard personalizado y retoma tus sesiones de coaching.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Evolución Continua</h3>
              <p className="text-gray-500 text-sm">Seguimiento detallado de tu progreso.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-1">Privacidad Total</h3>
              <p className="text-gray-500 text-sm">Tus datos seguros y encriptados.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">Iniciar Sesión</h2>
            <p className="text-emerald-400 text-sm mb-8 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Bienvenido de nuevo, líder.
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
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@empresa.com"
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-gray-400 text-xs tracking-wider uppercase">Contraseña</label>
                  <Link href="/forgot-password" className="text-gray-400 text-xs hover:text-emerald-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRememberDevice(!rememberDevice)}
                  className={`w-5 h-5 rounded border ${rememberDevice ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'} flex items-center justify-center transition-colors`}
                >
                  {rememberDevice && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="text-gray-400 text-sm">Recordar dispositivo</span>
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
                    Ingresar
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm mt-8">
              ¿Aún no eres miembro?{' '}
              <Link href="/sign-up" className="text-white hover:text-emerald-400 transition-colors font-medium">
                Solicitar acceso
              </Link>
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
