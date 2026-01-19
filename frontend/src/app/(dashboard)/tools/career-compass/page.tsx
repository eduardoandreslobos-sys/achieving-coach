'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Compass, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import CareerCompassForm from '@/components/tools/CareerCompassForm';
import CareerCompassResults from '@/components/tools/CareerCompassResults';
import { CareerCompass } from '@/types/career';

export default function CareerCompassPage() {
  const { user, userProfile } = useAuth();
  const [compass, setCompass] = useState<CareerCompass | null>(null);
  const [showResults, setShowResults] = useState(false);
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
          where('toolId', '==', 'career-compass')
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

  const handleComplete = async (completedCompass: CareerCompass) => {
    setCompass(completedCompass);
    setShowResults(true);

    // Guardar resultado
    if (user && userProfile) {
      try {
        const coachId = userProfile.role === 'coachee' 
          ? userProfile.coacheeInfo?.coachId 
          : user.uid;

        await addDoc(collection(db, 'tool_results'), {
          userId: user.uid,
          toolId: 'career-compass',
          toolName: 'Career Compass',
          coachId: coachId,
          results: completedCompass,
          completedAt: serverTimestamp(),
        });

        if (userProfile.role === 'coachee' && coachId) {
          const assignmentQuery = query(
            collection(db, 'tool_assignments'),
            where('coacheeId', '==', user.uid),
            where('toolId', '==', 'career-compass'),
            where('completed', '==', false)
          );
          
          const assignmentSnapshot = await getDocs(assignmentQuery);
          
          if (!assignmentSnapshot.empty) {
            const assignmentDoc = assignmentSnapshot.docs[0];
            
            await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
              completed: true,
              completedAt: serverTimestamp(),
            });

            await addDoc(collection(db, 'notifications'), {
              userId: coachId,
              type: 'tool_completed',
              title: 'Tool Completed',
              message: `${userProfile.displayName || userProfile.email} completed Career Compass`,
              read: false,
              createdAt: serverTimestamp(),
              actionUrl: `/coach/clients/${user.uid}`,
            });
          }
        }

        toast.success('Career Compass guardado exitosamente', {
          description: 'Tu coach ha sido notificado.',
          duration: 4000,
        });
        
        setIsCompleted(true);
      } catch (error) {
        console.error('Error saving:', error);
        toast.error('Error al guardar. Por favor intenta de nuevo.');
      }
    }
  };

  const handleReset = () => {
    setCompass(null);
    setShowResults(false);
  };

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
              <Compass className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">
              Acceso Requerido
            </h2>
            <p className="text-[var(--fg-muted)] mb-6">
              Esta herramienta debe ser asignada por tu coach antes de que puedas acceder.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && !showResults) {
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
              Has completado exitosamente Career Compass. Tu coach ha sido notificado.
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

  if (showResults && compass) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-6xl mx-auto mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium"
          >
            <ArrowLeft size={20} />
            Volver a Herramientas
          </Link>
        </div>
        <CareerCompassResults
          compass={compass}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        {/* Preview Mode Banner for Coaches */}
        {isPreviewMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-amber-400" />
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
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Volver a Herramientas
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-500/20 p-4 rounded-xl">
              <Compass className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--fg-primary)]">
                Career Compass Mapping
              </h1>
              <p className="text-[var(--fg-muted)] mt-1">
                Map your career journey and chart your path forward
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Cómo usar esta herramienta
          </h2>
          <div className="space-y-3 text-indigo-200">
            <p>
              The Career Compass helps you gain clarity on where you are, where you want to go,
              and how to get there. This comprehensive tool examines multiple dimensions of your career.
            </p>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 mt-4">
              <p className="font-medium mb-2 text-[var(--fg-primary)]">You'll explore:</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-[var(--fg-secondary)]">
                <div>• Your current career satisfaction</div>
                <div>• Your strengths and interests</div>
                <div>• Your core career values</div>
                <div>• Your ideal career direction</div>
                <div>• Barriers and support systems</div>
                <div>• Concrete next steps</div>
              </div>
            </div>
            <p className="text-sm mt-4">
              <strong className="text-[var(--fg-primary)]">Time commitment:</strong> 15-20 minutes
            </p>
          </div>
        </div>

        {!isPreviewMode && <CareerCompassForm onComplete={handleComplete} />}
        {isPreviewMode && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <p className="text-[var(--fg-muted)]">Esta es una vista previa. Los coaches no pueden completar herramientas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
