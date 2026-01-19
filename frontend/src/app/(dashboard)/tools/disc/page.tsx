'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CircleDot, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'sonner';
import { DISCAssessment } from '@/components/DISCAssessment';

export default function DISCPage() {
  const { user, userProfile } = useAuth();
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
          where('toolId', '==', 'disc')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const isCoach = userProfile?.role === 'coach';
  const isPreviewMode = isCoach && !hasAccess;

  if (!hasAccess && !isCoach) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CircleDot className="w-8 h-8 text-yellow-400" />
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
              Has completado exitosamente la Evaluacion DISC. Tu coach ha sido notificado.
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

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        {/* Preview Mode Banner for Coaches */}
        {isPreviewMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CircleDot className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-amber-400 font-medium">Modo Vista Previa</p>
                <p className="text-amber-400/70 text-sm">Estas previsualizando esta herramienta. Asignala a un coachee para que la complete.</p>
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

        <div className="mb-8">
          <Link
            href={isPreviewMode ? "/coach/tools" : "/tools"}
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium mb-4"
          >
            ← Volver a Herramientas
          </Link>
          <h1 className="text-3xl font-bold text-[var(--fg-primary)]">DISC Assessment</h1>
          <p className="text-[var(--fg-muted)] mt-2">
            Discover your behavioral profile and communication style
          </p>
        </div>
        {!isPreviewMode && <DISCAssessment />}
        {isPreviewMode && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <p className="text-[var(--fg-muted)]">Esta es una vista previa. Los coaches no pueden completar herramientas.</p>
            <p className="text-[var(--fg-muted)] mt-2">La evaluacion DISC contiene preguntas interactivas que los coachees completaran.</p>
          </div>
        )}
      </div>
    </div>
  );
}
