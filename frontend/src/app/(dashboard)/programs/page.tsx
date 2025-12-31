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
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Programas de Coaching</h1>
          <p className="text-gray-400">Gestiona tus programas de coaching ejecutivo.</p>
        </div>

        {programs.length === 0 ? (
          /* Empty State */
          <div className="bg-[#12131a] border border-blue-900/30 rounded-2xl p-16">
            <div className="flex flex-col items-center text-center">
              {/* Icon with gradient background */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600/30 to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <Flag className="w-10 h-10 text-blue-400" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-3">No tienes programas asignados</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Actualmente no estás inscrito en ningún programa de coaching activo. Los programas asignados por tu coach aparecerán aquí.
              </p>

              <button
                onClick={() => loadPrograms()}
                className="flex items-center gap-2 px-6 py-3 bg-[#1a1b23] border border-blue-900/30 text-white rounded-xl font-medium hover:bg-[#22232d] transition-colors"
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
              <div key={program.id} className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">{program.name}</h3>
                  <span className="text-blue-400 text-sm">{program.progress}% completado</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{program.description}</p>
                <div className="h-2 bg-[#1a1b23] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: program.progress + '%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-xs uppercase tracking-wider">
            © ACHIEVINGCOACH SYSTEMS 2026
          </p>
        </div>
      </div>
    </div>
  );
}
