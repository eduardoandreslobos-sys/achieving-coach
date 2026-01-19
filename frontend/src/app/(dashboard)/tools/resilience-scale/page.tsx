'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import ResilienceQuestionnaire from '@/components/tools/ResilienceQuestionnaire';
import ResilienceResults from '@/components/tools/ResilienceResults';
import { ResilienceQuestion, ResilienceAnswers } from '@/types/resilience';

const RESILIENCE_QUESTIONS: ResilienceQuestion[] = [
  { id: 'emo1', category: 'Emotional', text: 'I am able to adapt when changes occur in my life.' },
  { id: 'emo2', category: 'Emotional', text: 'I can deal with whatever comes my way.' },
  { id: 'emo3', category: 'Emotional', text: 'I tend to bounce back after illness, injury, or other hardships.' },
  { id: 'emo4', category: 'Emotional', text: 'I believe I can achieve my goals even when there are obstacles.' },
  { id: 'emo5', category: 'Emotional', text: 'Even when things look hopeless, I don\'t give up.' },
  { id: 'emo6', category: 'Emotional', text: 'Under pressure, I stay focused and think clearly.' },
  { id: 'emo7', category: 'Emotional', text: 'I am not easily discouraged by failure.' },
  { id: 'phy1', category: 'Physical', text: 'I maintain a regular exercise routine.' },
  { id: 'phy2', category: 'Physical', text: 'I get enough sleep to feel rested and energized.' },
  { id: 'phy3', category: 'Physical', text: 'I eat a balanced and nutritious diet.' },
  { id: 'phy4', category: 'Physical', text: 'I take time to relax and recharge my body.' },
  { id: 'phy5', category: 'Physical', text: 'I manage stress through physical activities or practices.' },
  { id: 'phy6', category: 'Physical', text: 'I listen to my body and address health concerns promptly.' },
  { id: 'men1', category: 'Mental', text: 'I can control my thoughts when feeling anxious or stressed.' },
  { id: 'men2', category: 'Mental', text: 'I practice mindfulness or meditation regularly.' },
  { id: 'men3', category: 'Mental', text: 'I maintain a positive outlook even in difficult situations.' },
  { id: 'men4', category: 'Mental', text: 'I learn from my mistakes and move forward.' },
  { id: 'men5', category: 'Mental', text: 'I can find meaning and purpose in challenging experiences.' },
  { id: 'men6', category: 'Mental', text: 'I engage in activities that stimulate my mind and creativity.' },
  { id: 'soc1', category: 'Social', text: 'I have close relationships that provide support.' },
  { id: 'soc2', category: 'Social', text: 'I feel comfortable asking others for help when needed.' },
  { id: 'soc3', category: 'Social', text: 'I maintain connections with family and friends.' },
  { id: 'soc4', category: 'Social', text: 'I participate in community or group activities.' },
  { id: 'soc5', category: 'Social', text: 'I feel a sense of belonging in my social circles.' },
  { id: 'soc6', category: 'Social', text: 'I contribute to the wellbeing of others in my life.' },
];

export default function ResilienceScalePage() {
  const { user, userProfile } = useAuth();
  const [answers, setAnswers] = useState<ResilienceAnswers | null>(null);
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
          where('toolId', '==', 'resilience-scale')
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

  const handleComplete = async (completedAnswers: ResilienceAnswers) => {
    setAnswers(completedAnswers);
    setShowResults(true);

    if (user && userProfile) {
      try {
        const coachId = userProfile.role === 'coachee' 
          ? userProfile.coacheeInfo?.coachId 
          : user.uid;

        await addDoc(collection(db, 'tool_results'), {
          userId: user.uid,
          toolId: 'resilience-scale',
          toolName: 'Resilience Assessment Scale',
          coachId: coachId,
          results: completedAnswers,
          completedAt: serverTimestamp(),
        });

        if (userProfile.role === 'coachee' && coachId) {
          const assignmentQuery = query(
            collection(db, 'tool_assignments'),
            where('coacheeId', '==', user.uid),
            where('toolId', '==', 'resilience-scale'),
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
              message: `${userProfile.displayName || userProfile.email} completed Resilience Assessment`,
              read: false,
              createdAt: serverTimestamp(),
              actionUrl: `/coach/clients/${user.uid}`,
            });
          }
        }

        toast.success('Evaluacion de Resiliencia guardada exitosamente', {
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
    setAnswers(null);
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
              <Shield className="w-8 h-8 text-yellow-400" />
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
              Has completado exitosamente la Evaluacion de Resiliencia. Tu coach ha sido notificado.
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

  if (showResults && answers) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-5xl mx-auto mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium"
          >
            <ArrowLeft size={20} />
            Volver a Herramientas
          </Link>
        </div>
        <ResilienceResults
          answers={answers}
          questions={RESILIENCE_QUESTIONS}
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
              <Shield className="w-5 h-5 text-amber-400" />
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
            <div className="bg-emerald-500/20 p-4 rounded-xl">
              <Shield className="w-10 h-10 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--fg-primary)]">
                Resilience Assessment Scale
              </h1>
              <p className="text-[var(--fg-muted)] mt-1">
                Evaluate your resilience across emotional, physical, mental, and social dimensions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-emerald-300 mb-3">
            Cómo usar esta herramienta
          </h2>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-[var(--accent-primary)]">•</span>
              <span>This assessment contains 25 questions across 4 categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-[var(--accent-primary)]">•</span>
              <span>Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-[var(--accent-primary)]">•</span>
              <span>Answer honestly based on how you typically feel and behave</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-[var(--accent-primary)]">•</span>
              <span>There are no right or wrong answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-[var(--accent-primary)]">•</span>
              <span>The assessment takes approximately 5-7 minutes to complete</span>
            </li>
          </ul>
        </div>

        {!isPreviewMode && (
          <ResilienceQuestionnaire
            questions={RESILIENCE_QUESTIONS}
            onComplete={handleComplete}
          />
        )}
        {isPreviewMode && (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <p className="text-[var(--fg-muted)]">Esta es una vista previa. Los coaches no pueden completar herramientas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
