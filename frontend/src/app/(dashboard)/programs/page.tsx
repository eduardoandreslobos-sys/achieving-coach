'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCoacheePrograms } from '@/lib/coachingService';
import { CoachingProgram } from '@/types/coaching';
import { FileSignature, Clock, Check, AlertCircle, ChevronRight } from 'lucide-react';

export default function MyProgramsPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [programs, setPrograms] = useState<CoachingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.uid) {
      loadPrograms();
    }
  }, [userProfile]);

  const loadPrograms = async () => {
    if (!userProfile?.uid) return;
    
    try {
      const data = await getCoacheePrograms(userProfile.uid);
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pendingPrograms = programs.filter(p => p.status === 'pending_acceptance');
  const activePrograms = programs.filter(p => p.status === 'active');
  const completedPrograms = programs.filter(p => p.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Programas de Coaching</h1>
        <p className="text-gray-600 mb-8">Gestiona tus programas de coaching ejecutivo</p>

        {/* Pending Acceptance */}
        {pendingPrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="text-yellow-600" size={24} />
              Pendientes de Aceptación
            </h2>
            <div className="space-y-4">
              {pendingPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 cursor-pointer hover:border-yellow-400 transition-colors"
                  onClick={() => router.push(`/programs/${program.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">
                        Coach ha enviado el acuerdo de coaching para tu revisión y firma
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-700">
                      <FileSignature size={20} />
                      <span className="font-medium">Requiere firma</span>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Programs */}
        {activePrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="text-primary-600" size={24} />
              Programas Activos
            </h2>
            <div className="space-y-4">
              {activePrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary-300 transition-colors"
                  onClick={() => router.push(`/programs/${program.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">
                        Fase {program.currentPhase || 1} • {program.sessionsPlanned} sesiones planificadas
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-primary-600">
                      <span className="font-medium">Ver programa</span>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Programs */}
        {completedPrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Check className="text-green-600" size={24} />
              Programas Completados
            </h2>
            <div className="space-y-4">
              {completedPrograms.map((program) => (
                <div
                  key={program.id}
                  className="bg-green-50 border-2 border-green-200 rounded-xl p-6 cursor-pointer hover:border-green-300 transition-colors"
                  onClick={() => router.push(`/programs/${program.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{program.title}</h3>
                      <p className="text-sm text-gray-600">
                        Completado • {program.sessionsPlanned} sesiones
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <Check size={20} />
                      <span className="font-medium">Completado</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {programs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-gray-200">
            <FileSignature className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No tienes programas asignados</h3>
            <p className="text-gray-600">
              Cuando tu coach cree un programa de coaching, aparecerá aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
