'use client';

import { useState, useEffect, Suspense } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Check, Circle } from 'lucide-react';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const hasMinLength = password.length >= 8;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const getStrengthLevel = () => {
    const checks = [hasMinLength, hasUpperAndLower, hasNumber, hasSpecial];
    const passed = checks.filter(Boolean).length;
    if (passed === 0) return { level: 0, text: 'Sin iniciar', color: 'bg-gray-600' };
    if (passed === 1) return { level: 1, text: 'Débil', color: 'bg-red-500' };
    if (passed === 2) return { level: 2, text: 'Regular', color: 'bg-yellow-500' };
    if (passed === 3) return { level: 3, text: 'Buena', color: 'bg-emerald-400' };
    return { level: 4, text: 'Fuerte', color: 'bg-emerald-500' };
  };

  const strength = getStrengthLevel();

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setError('Enlace de recuperación inválido.');
        setVerifying(false);
        return;
      }
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setValidCode(true);
      } catch (err) {
        setError('El enlace de recuperación ha expirado o es inválido.');
      } finally {
        setVerifying(false);
      }
    };
    verifyCode();
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); return; }
    if (!hasMinLength) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode!, password);
      router.push('/sign-in?reset=success');
    } catch (err: any) {
      setError('Error al actualizar la contraseña. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!validCode) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">A</span></div>
            <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">AchievingCoach AI</span>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-6"><Lock className="w-8 h-8 text-red-400" /></div>
            <h2 className="text-2xl font-semibold text-white mb-4">Enlace Inválido</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link href="/forgot-password" className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Solicitar nuevo enlace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">A</span></div>
          <span className="text-gray-400 text-sm tracking-[0.2em] uppercase">AchievingCoach AI</span>
        </div>

        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 shadow-2xl text-left">
          <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Lock className="w-6 h-6 text-gray-400" />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-2 text-center">Actualizar contraseña</h2>
          <p className="text-gray-400 text-sm mb-8 text-center">Tu nueva contraseña debe ser diferente a las utilizadas anteriormente.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"><p className="text-red-400 text-sm">{error}</p></div>}

            <div>
              <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Nueva Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs tracking-wider uppercase">Fortaleza</span>
                <span className="text-gray-400 text-xs">{strength.text}</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div key={level} className={`h-1 flex-1 rounded-full transition-colors ${level <= strength.level ? strength.color : 'bg-gray-700'}`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  {hasMinLength ? <Check className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-gray-600" />}
                  <span className={`text-xs ${hasMinLength ? 'text-emerald-400' : 'text-gray-500'}`}>8+ caracteres</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasUpperAndLower ? <Check className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-gray-600" />}
                  <span className={`text-xs ${hasUpperAndLower ? 'text-emerald-400' : 'text-gray-500'}`}>Mayús. y minús.</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-gray-600" />}
                  <span className={`text-xs ${hasNumber ? 'text-emerald-400' : 'text-gray-500'}`}>Un número</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSpecial ? <Check className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4 text-gray-600" />}
                  <span className={`text-xs ${hasSpecial ? 'text-emerald-400' : 'text-gray-500'}`}>Carácter especial</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-xs tracking-wider uppercase mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors" />
              </div>
            </div>

            <button type="submit" disabled={loading || !hasMinLength}
              className="w-full bg-white text-black font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : <>Actualizar contraseña <ArrowRight className="w-4 h-4" /></>}
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

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
