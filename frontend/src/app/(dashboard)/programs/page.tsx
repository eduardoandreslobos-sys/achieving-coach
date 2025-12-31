'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Calendar, Clock, CheckCircle, 
  ChevronRight, Users, Target, Award, Lock
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  totalSessions: number;
  completedSessions: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: Date;
  endDate: Date;
  coachName: string;
  modules: {
    name: string;
    completed: boolean;
  }[];
}

export default function ProgramsPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, [user]);

  const loadPrograms = async () => {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, 'program_enrollments'),
        where('coacheeId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDate: doc.data().startDate?.toDate() || new Date(),
        endDate: doc.data().endDate?.toDate() || new Date(),
      })) as Program[];
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading programs:', error);
      // Mock data
      setPrograms([
        {
          id: '1',
          name: 'Programa de Liderazgo Ejecutivo',
          description: 'Desarrolla las competencias esenciales para liderar equipos de alto rendimiento.',
          duration: '3 meses',
          totalSessions: 12,
          completedSessions: 5,
          status: 'active',
          startDate: new Date(Date.now() - 30 * 86400000),
          endDate: new Date(Date.now() + 60 * 86400000),
          coachName: 'María García',
          modules: [
            { name: 'Autoconocimiento', completed: true },
            { name: 'Comunicación Efectiva', completed: true },
            { name: 'Gestión de Equipos', completed: false },
            { name: 'Toma de Decisiones', completed: false },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: Program['status']) => {
    const styles = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    };
    const labels = {
      active: 'En Progreso',
      completed: 'Completado',
      upcoming: 'Próximamente',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Mis Programas</h1>
          <p className="text-gray-400">Programas de coaching en los que estás inscrito.</p>
        </div>

        {programs.length > 0 ? (
          <div className="space-y-6">
            {programs.map((program) => {
              const progress = Math.round((program.completedSessions / program.totalSessions) * 100);
              return (
                <div
                  key={program.id}
                  className="bg-[#111111] border border-gray-800 rounded-xl overflow-hidden"
                >
                  {/* Program Header */}
                  <div className="p-6 border-b border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-violet-500/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-7 h-7 text-violet-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold text-white">{program.name}</h2>
                            {getStatusBadge(program.status)}
                          </div>
                          <p className="text-gray-400 text-sm">{program.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progreso del programa</span>
                        <span className="text-white font-medium">{progress}%</span>
                      </div>
                      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{program.completedSessions}/{program.totalSessions} sesiones</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{program.coachName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{formatDate(program.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="p-6">
                    <h3 className="text-white font-medium mb-4">Módulos del Programa</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {program.modules.map((module, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-4 rounded-lg ${
                            module.completed 
                              ? 'bg-emerald-500/10 border border-emerald-500/20' 
                              : 'bg-[#1a1a1a] border border-gray-700'
                          }`}
                        >
                          {module.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                          )}
                          <span className={module.completed ? 'text-white' : 'text-gray-400'}>
                            {module.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-[#0a0a0a] border-t border-gray-800">
                    <Link
                      href={`/programs/${program.id}`}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ver Programa Completo
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No estás inscrito en ningún programa</h3>
            <p className="text-gray-500 mb-4">Tu coach te inscribirá en programas según tu plan de desarrollo.</p>
          </div>
        )}

        {/* Available Programs Preview */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-4">Programas Disponibles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Inteligencia Emocional', sessions: 8, icon: '🧠' },
              { name: 'Comunicación Asertiva', sessions: 6, icon: '💬' },
              { name: 'Gestión del Tiempo', sessions: 4, icon: '⏰' },
            ].map((prog, index) => (
              <div
                key={index}
                className="bg-[#111111] border border-gray-800 rounded-xl p-5 opacity-60"
              >
                <div className="text-3xl mb-3">{prog.icon}</div>
                <h3 className="text-white font-medium mb-1">{prog.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{prog.sessions} sesiones</p>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Lock className="w-3 h-3" />
                  Solicita a tu coach
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
