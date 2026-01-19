'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface Belief {
  limiting: string;
  empowering: string;
  evidence: string;
}

export default function LimitingBeliefsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [beliefs, setBeliefs] = useState<Belief[]>([{ limiting: '', empowering: '', evidence: '' }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      // Coaches cannot complete tools - they can only assign them to coachees
      if (userProfile.role === 'coach') {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'limiting-beliefs')
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        // Guardar el ID del assignment para actualizarlo después
        setAssignmentId(snapshot.docs[0].id);
        setHasAccess(true);

        const resultsQuery = query(
          collection(db, 'tool_results'),
          where('userId', '==', user.uid),
          where('toolId', '==', 'limiting-beliefs'),
          orderBy('completedAt', 'desc'),
          limit(1)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const lastDoc = resultsSnapshot.docs[0];
          setLastResult(lastDoc.data());
          if (lastDoc.data().results.beliefs) {
            setBeliefs(lastDoc.data().results.beliefs);
          }
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, userProfile]);

  const updateBelief = (index: number, field: keyof Belief, value: string) => {
    const newBeliefs = [...beliefs];
    newBeliefs[index][field] = value;
    setBeliefs(newBeliefs);
  };

  const addBelief = () => {
    setBeliefs([...beliefs, { limiting: '', empowering: '', evidence: '' }]);
  };

  const removeBelief = (index: number) => {
    if (beliefs.length > 1) {
      setBeliefs(beliefs.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    const validBeliefs = beliefs.filter(b => b.limiting.trim() && b.empowering.trim());
    if (validBeliefs.length === 0) {
      setShowSuccess(false);
      // Mostrar error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-50 border-2 border-red-500 text-red-900 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
      errorToast.innerHTML = `
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">Please complete at least one belief transformation</span>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
      return;
    }

    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      // Guardar los resultados
      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'limiting-beliefs',
        toolName: 'Limiting Beliefs',
        coachId: coachId,
        results: {
          beliefs: validBeliefs,
          totalTransformed: validBeliefs.length,
        },
        completedAt: serverTimestamp(),
      });

      // Marcar el assignment como completado
      if (assignmentId) {
        const assignmentRef = doc(db, 'tool_assignments', assignmentId);
        await updateDoc(assignmentRef, {
          completed: true,
          completedAt: serverTimestamp()
        });
      }

      // Crear notificación para el coach
      if (coachId && userProfile.role === 'coachee') {
        await addDoc(collection(db, 'notifications'), {
          userId: coachId,
          type: 'tool_completed',
          title: 'Tool Completed',
          message: `${userProfile.name || user.email} has completed the Limiting Beliefs tool`,
          data: {
            coacheeId: user.uid,
            coacheeName: userProfile.name || user.email,
            toolId: 'limiting-beliefs',
            toolName: 'Limiting Beliefs',
            totalTransformed: validBeliefs.length
          },
          read: false,
          createdAt: serverTimestamp()
        });
      }

      // Mostrar toast de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error saving results:', error);
      // Mostrar error toast
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-50 border-2 border-red-500 text-red-900 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
      errorToast.innerHTML = `
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="font-medium">Error saving results. Please try again.</span>
      `;
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 3000);
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

  const isCoach = userProfile?.role === 'coach';
  const isPreviewMode = isCoach && !hasAccess;

  if (!hasAccess && !isCoach) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">
            Acceso Requerido
          </h2>
          <p className="text-[var(--fg-muted)] mb-6">
            Esta herramienta debe ser asignada por tu coach antes de que puedas acceder.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] p-8">
      {/* Toast de exito */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="text-[var(--accent-primary)]" size={24} />
          <div>
            <p className="font-bold text-emerald-300">Exito</p>
            <p className="text-sm text-emerald-200">Tus resultados han sido guardados y tu coach ha sido notificado.</p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Preview Mode Banner for Coaches */}
        {isPreviewMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-amber-400 font-medium">Modo Vista Previa</p>
                <p className="text-amber-400/70 text-sm">Estas previsualizando esta herramienta. Asignala a un coachee para que la complete.</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/coach/tools')}
              className="px-4 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm font-medium"
            >
              Volver a Herramientas
            </button>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={() => router.push(isPreviewMode ? '/coach/tools' : '/tools')}
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium mb-4"
          >
            ← Volver a Herramientas
          </button>
          <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Limiting Beliefs Transformation</h1>
          <p className="text-[var(--fg-muted)]">
            Identify limiting beliefs and transform them into empowering ones
          </p>
        </div>

        {lastResult && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-emerald-300">
              📊 Last completed: {lastResult.completedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              {' - '}Transformed {lastResult.results.totalTransformed} beliefs
            </p>
          </div>
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-yellow-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-300 mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-200">
                <li>Identify a limiting belief that's holding you back</li>
                <li>Reframe it into an empowering belief</li>
                <li>Find evidence that supports your new empowering belief</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {beliefs.map((belief, index) => (
            <div key={index} className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--fg-primary)]">Belief #{index + 1}</h3>
                {beliefs.length > 1 && (
                  <button
                    onClick={() => removeBelief(index)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-red-400" size={20} />
                    <label className="block text-sm font-medium text-[var(--fg-muted)]">
                      Limiting Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.limiting}
                    onChange={(e) => updateBelief(index, 'limiting', e.target.value)}
                    placeholder="e.g., I'm not good enough to succeed..."
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-[var(--accent-primary)]" size={20} />
                    <label className="block text-sm font-medium text-[var(--fg-muted)]">
                      Empowering Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.empowering}
                    onChange={(e) => updateBelief(index, 'empowering', e.target.value)}
                    placeholder="e.g., I have unique skills and experiences that make me capable..."
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-[var(--accent-primary)]" size={20} />
                    <label className="block text-sm font-medium text-[var(--fg-muted)]">
                      Evidence for Empowering Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.evidence}
                    onChange={(e) => updateBelief(index, 'evidence', e.target.value)}
                    placeholder="e.g., I successfully completed X project, my colleagues value my input..."
                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={addBelief}
            className="px-6 py-3 border border-emerald-500 text-[var(--accent-primary)] rounded-lg font-medium hover:bg-emerald-500/10 transition-colors"
          >
            + Agregar Otra Creencia
          </button>
          {!isPreviewMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-8 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg font-medium hover:bg-emerald-700 disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--fg-muted)] transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Resultados'}
            </button>
          )}
        </div>
        {isPreviewMode && (
          <div className="text-center py-4 text-[var(--fg-muted)]">
            <p>Esta es una vista previa. Los coaches no pueden completar herramientas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
