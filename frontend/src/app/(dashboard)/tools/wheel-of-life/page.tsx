'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Target, TrendingUp, Briefcase, DollarSign, Heart, Users, Smile, Home, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

const lifeAreas = [
  { id: 'career', name: 'Carrera', icon: Briefcase, color: 'text-emerald-600' },
  { id: 'finance', name: 'Finanzas', icon: DollarSign, color: 'text-green-600' },
  { id: 'health', name: 'Salud', icon: Heart, color: 'text-red-600' },
  { id: 'relationships', name: 'Relaciones', icon: Users, color: 'text-purple-600' },
  { id: 'personal-growth', name: 'Crecimiento Personal', icon: Sprout, color: 'text-emerald-600' },
  { id: 'fun', name: 'Diversión y Recreación', icon: Smile, color: 'text-orange-600' },
  { id: 'environment', name: 'Entorno Físico', icon: Home, color: 'text-indigo-600' },
  { id: 'spirituality', name: 'Espiritualidad', icon: Sparkles, color: 'text-yellow-600' },
];

export default function WheelOfLifePage() {
  const { user, userProfile } = useAuth();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      // Coaches cannot complete tools - they can only assign them to coachees
      if (userProfile.role === 'coach') {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      if (userProfile.role === 'coachee') {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life')
        );
        
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignment = assignmentSnapshot.docs[0].data();
          setHasAccess(true);
          setIsCompleted(assignment.completed || false);
        }
      }
      
      setLoading(false);
    };

    checkAccess();
  }, [user, userProfile]);

  const handleSave = async () => {
    if (!user || !userProfile) return;

    const allScored = lifeAreas.every(area => scores[area.id] !== undefined);
    
    if (!allScored) {
      toast.error('Por favor califica todas las áreas antes de guardar');
      return;
    }

    setSaving(true);

    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      // Guardar resultados
      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'wheel-of-life',
        toolName: 'Wheel of Life',
        coachId: coachId,
        results: {
          scores,
          averageScore: Object.values(scores).reduce((a, b) => a + b, 0) / lifeAreas.length,
        },
        completedAt: serverTimestamp(),
      });

      // Si es coachee, actualizar assignment y notificar al coach
      if (userProfile.role === 'coachee' && coachId) {
        // Buscar el assignment
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life'),
          where('completed', '==', false)
        );
        
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignmentDoc = assignmentSnapshot.docs[0];
          
          // Actualizar a completado
          await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
            completed: true,
            completedAt: serverTimestamp(),
          });

          // Notificar al coach
          await addDoc(collection(db, 'notifications'), {
            userId: coachId,
            type: 'program',
            title: 'Tool Completed',
            message: `${userProfile.displayName || userProfile.email} completed Wheel of Life`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('Rueda de la Vida completada exitosamente', {
        description: 'Tu coach ha sido notificado.',
        duration: 4000,
      });
      
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Error al guardar resultados. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Si es coach, permitir previsualizar en modo lectura
  const isCoach = userProfile?.role === 'coach';
  const isPreviewMode = isCoach && !hasAccess;

  if (!hasAccess && !isCoach) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">
              Acceso Requerido
            </h2>
            <p className="text-[var(--fg-muted)] mb-6">
              Esta herramienta debe ser asignada por tu coach antes de que puedas acceder.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">¡Herramienta Completada!</h2>
            <p className="text-[var(--fg-muted)] mb-6">
              Has completado exitosamente la evaluación Rueda de la Vida. Tu coach ha sido notificado y puede revisar tus resultados.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-color)] text-[var(--fg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Ver Otras Herramientas
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const averageScore = Object.keys(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl mx-auto">
        {/* Preview Mode Banner for Coaches */}
        {isPreviewMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-amber-400 font-medium">Modo Vista Previa</p>
                <p className="text-amber-400/70 text-sm">Estás previsualizando esta herramienta. Asígnala a un coachee para que la complete.</p>
              </div>
            </div>
            <Link
              href="/coach/tools"
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm font-medium"
            >
              Volver a Herramientas
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <Link
            href={isPreviewMode ? "/coach/tools" : "/tools"}
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium mb-4"
          >
            ← Volver a Herramientas
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--fg-primary)]">Rueda de la Vida</h1>
              <p className="text-[var(--fg-muted)]">Evalúa tu equilibrio de vida en áreas clave</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-[var(--accent-primary)] mb-2">Cómo usar esta herramienta</h2>
          <p className="text-emerald-300">
            Califica cada área de tu vida en una escala del 0 al 10, donde 0 es completamente insatisfecho y 10 es completamente satisfecho.
            Sé honesto contigo mismo - esta evaluación trata de entender dónde estás ahora, no dónde crees que deberías estar.
          </p>
        </div>

        {/* Life Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lifeAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.id} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${area.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--fg-primary)]">{area.name}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[var(--fg-muted)]">
                    <span>Insatisfecho</span>
                    <span>Satisfecho</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[area.id] || 0}
                    onChange={(e) => setScores({ ...scores, [area.id]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-[var(--accent-primary)]">
                      {scores[area.id] !== undefined ? scores[area.id] : '-'}
                    </span>
                    <span className="text-[var(--fg-muted)]">/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Average Score */}
        {Object.keys(scores).length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-1">Puntaje Promedio</h3>
                <p className="text-[var(--fg-muted)]">Satisfacción general de vida</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-[var(--accent-primary)]">{averageScore.toFixed(1)}</div>
                <div className="text-sm text-[var(--fg-muted)]">de 10</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        {!isPreviewMode && (
          <button
            onClick={handleSave}
            disabled={saving || Object.keys(scores).length !== lifeAreas.length}
            className="w-full bg-emerald-600 text-[var(--fg-primary)] py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--fg-muted)] disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar Resultados'}
          </button>
        )}
        {isPreviewMode && (
          <div className="text-center py-4 text-[var(--fg-muted)]">
            <p>Esta es una vista previa. Los coaches no pueden completar herramientas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
