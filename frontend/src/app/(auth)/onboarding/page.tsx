'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'coach' | 'coachee'>('coachee');
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialties: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: formData.name,
        role,
        ...(role === 'coach' && {
          coachProfile: {
            bio: formData.bio,
            specialties: formData.specialties.split(',').map(s => s.trim()),
          },
        }),
        onboardingCompleted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      router.push(role === 'coach' ? '/coach' : '/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error guardando el perfil. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-white text-xl">AchievingCoach</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Bienvenido a AchievingCoach</h1>
          <p className="text-gray-400 mb-8">Configuremos tu perfil para comenzar</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Soy un...
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('coachee')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    role === 'coachee'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    role === 'coachee' ? 'bg-emerald-500/20' : 'bg-gray-700'
                  }`}>
                    <User className={`w-5 h-5 ${role === 'coachee' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  </div>
                  <div className={`font-semibold mb-1 ${role === 'coachee' ? 'text-white' : 'text-gray-300'}`}>
                    Coachee
                  </div>
                  <div className="text-xs text-gray-500">Busco coaching</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coach')}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    role === 'coach'
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    role === 'coach' ? 'bg-emerald-500/20' : 'bg-gray-700'
                  }`}>
                    <Briefcase className={`w-5 h-5 ${role === 'coach' ? 'text-emerald-400' : 'text-gray-400'}`} />
                  </div>
                  <div className={`font-semibold mb-1 ${role === 'coach' ? 'text-white' : 'text-gray-300'}`}>
                    Coach
                  </div>
                  <div className="text-xs text-gray-500">Coach profesional</div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            {/* Coach-specific fields */}
            {role === 'coach' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Biografía
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                    placeholder="Cuéntanos sobre tu experiencia en coaching..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Especialidades
                  </label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Liderazgo, Carrera, Vida (separado por comas)"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || !formData.name}
              className="w-full px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Configurando...
                </>
              ) : (
                <>
                  Completar Configuración
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          © 2026 AchievingCoach. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
