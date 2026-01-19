'use client';

import { useState, useEffect } from 'react';
import { Flag, RefreshCw } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Program {
  id: string;
  name: string;
  description: string;
  progress: number;
  totalSessions: number;
  completedSessions: number;
}

export default function ProgramsPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, [user]);

  const loadPrograms = async () => {
    if (!user?.uid) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'programEnrollments'), where('coacheeId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Program[];
      setPrograms(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Mis Programas de Coaching</h1>
          <p className="text-[var(--fg-muted)]">Gestiona tus programas de coaching ejecutivo.</p>
        </div>

        {programs.length === 0 ? (
          /* Empty State */
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-16">
            <div className="flex flex-col items-center text-center">
              {/* Icon with gradient background */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600/30 to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <Flag className="w-10 h-10 text-[var(--accent-primary)]" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-3">No tienes programas asignados</h2>
              <p className="text-[var(--fg-muted)] mb-8 max-w-md">
                Actualmente no estás inscrito en ningún programa de coaching activo. Los programas asignados por tu coach aparecerán aquí.
              </p>

              <button
                onClick={() => loadPrograms()}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--fg-primary)] rounded-xl font-medium hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Actualizar
              </button>
            </div>
          </div>
        ) : (
          /* Programs List */
          <div className="space-y-4">
            {programs.map((program) => (
              <div key={program.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[var(--fg-primary)] font-semibold text-lg">{program.name}</h3>
                  <span className="text-[var(--accent-primary)] text-sm">{program.progress}% completado</span>
                </div>
                <p className="text-[var(--fg-muted)] text-sm mb-4">{program.description}</p>
                <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: program.progress + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-[var(--fg-muted)] text-xs uppercase tracking-wider">
            © ACHIEVINGCOACH SYSTEMS 2026
          </p>
        </div>
      </div>
    </div>
  );
}
