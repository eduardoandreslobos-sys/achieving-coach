'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Sparkles, Camera, Info, Copy, Users, Target, Flag, Settings2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface ValueProposition {
  coachingType: string;
  targetAudience: string;
  desiredOutcome: string;
  problemSolved: string;
}

export default function CoachProfilePage() {
  const { userProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  const [valueProps, setValueProps] = useState<ValueProposition>({
    coachingType: '',
    targetAudience: '',
    desiredOutcome: '',
    problemSolved: '',
  });

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhotoURL(userProfile.photoURL || '');
      if (userProfile.valueProposition) {
        setValueProps(userProfile.valueProposition);
      }
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile?.uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        displayName,
        valueProposition: valueProps,
      });
      await refreshProfile();
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <Toaster position="top-right" theme="dark" />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Perfil del Coach</h1>
            <p className="text-[var(--fg-muted)]">Gestiona la información de tu perfil público y define tu propuesta de valor.</p>
          </div>
          <button className="px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
            Perfil Público Activo
          </button>
        </div>

        {/* Profile Information Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-[var(--fg-primary)] font-semibold">Información del Perfil</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="w-32 h-32 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center overflow-hidden">
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[var(--fg-primary)] text-4xl font-medium">{displayName?.charAt(0) || 'C'}</span>
                  )}
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <button className="text-emerald-400 text-sm hover:text-emerald-300">Eliminar foto</button>
            </div>

            {/* Form */}
            <div className="flex-1 space-y-6">
              {/* Photo Requirements */}
              <div className="flex items-start gap-3 p-4 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg">
                <Info className="w-5 h-5 text-[var(--fg-muted)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[var(--fg-muted)] text-sm font-medium mb-1">Requisitos de la foto</p>
                  <p className="text-[var(--fg-muted)] text-sm">
                    Sube una foto profesional en formato JPG, PNG o WebP. Tamaño máximo de 2MB. Se recomienda una dimensión de 400×400 píxeles.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label className="block text-[var(--fg-muted)] text-sm mb-2">Nombre Visible</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 pr-10"
                    />
                    <Copy className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[var(--fg-muted)] text-sm mb-2">Correo Electrónico</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={userProfile?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-muted)] cursor-not-allowed pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]">🔒</div>
                  </div>
                  <p className="text-[var(--fg-muted)] text-xs mt-1">El correo electrónico no se puede cambiar.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-[var(--fg-primary)] font-semibold">Propuesta de Valor</h2>
            </div>
            <span className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--fg-muted)] text-xs rounded-full uppercase tracking-wider">
              Esencial
            </span>
          </div>

          {/* Impact Formula */}
          <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-700/30 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Tu Fórmula de Impacto</span>
            </div>
            <p className="text-[var(--fg-primary)]">
              "Yo asumo que mi{' '}
              <span className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--fg-secondary)]">
                {valueProps.coachingType || 'tipo de coaching'}
              </span>
              {' '}ayudará a{' '}
              <span className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--fg-secondary)]">
                {valueProps.targetAudience || 'público objetivo'}
              </span>
              {' '}quienes desean{' '}
              <span className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--fg-secondary)]">
                {valueProps.desiredOutcome || 'resultado deseado'}
              </span>
              {' '}resolviendo{' '}
              <span className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--fg-secondary)]">
                {valueProps.problemSolved || 'problema específico'}
              </span>
              ."
            </p>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--fg-muted)] text-sm mb-2">
                Tipo de Coaching <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={valueProps.coachingType}
                  onChange={(e) => setValueProps({ ...valueProps, coachingType: e.target.value })}
                  placeholder="Ej: Coaching de Liderazgo"
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 pr-10"
                />
                <Settings2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
              </div>
            </div>

            <div>
              <label className="block text-[var(--fg-muted)] text-sm mb-2">
                Público Objetivo <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={valueProps.targetAudience}
                  onChange={(e) => setValueProps({ ...valueProps, targetAudience: e.target.value })}
                  placeholder="Ej: Gerentes Primerizos"
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 pr-10"
                />
                <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--fg-muted)] text-sm mb-2">
                Resultado Deseado <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={valueProps.desiredOutcome}
                  onChange={(e) => setValueProps({ ...valueProps, desiredOutcome: e.target.value })}
                  placeholder="Ej: Mejorar su comunicación efectiva y delegar con confianza"
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 pr-10"
                />
                <Flag className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[var(--fg-muted)] text-sm mb-2">
                Problema Resuelto <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={valueProps.problemSolved}
                  onChange={(e) => setValueProps({ ...valueProps, problemSolved: e.target.value })}
                  placeholder="Ej: Se sienten abrumados por la microgestión y temen perder talento en sus equipos..."
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 pr-10"
                />
                <Target className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
