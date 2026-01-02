'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Play, CheckCircle, XCircle, Plus, ArrowRight } from 'lucide-react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Session {
  id: string;
  title: string;
  date: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  coachName: string;
  confirmed: boolean;
}

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user?.uid) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'sessions'), where('coacheeId', '==', user.uid), orderBy('date', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Sesión de Coaching',
        date: doc.data().date?.toDate() || new Date(),
        duration: doc.data().duration || 60,
        status: doc.data().status || 'scheduled',
        coachName: doc.data().coachName || 'Tu Coach',
        confirmed: doc.data().confirmed || false,
      })) as Session[];
      setSessions(data);
    } catch (error) {
      console.error('Error:', error);
      // Mock data for demo
      setSessions([
        { id: '1', title: 'Check-In', date: new Date('2025-12-28'), duration: 60, status: 'scheduled', coachName: 'John Doe', confirmed: true },
        { id: '2', title: 'Revisar objetivos del plan', date: new Date('2025-12-24'), duration: 60, status: 'completed', coachName: 'John Doe', confirmed: true },
        { id: '3', title: 'Sesión de Exploración', date: new Date('2025-12-21'), duration: 60, status: 'scheduled', coachName: 'John Doe', confirmed: false },
        { id: '4', title: 'First meeting', date: new Date('2025-12-19'), duration: 60, status: 'cancelled', coachName: 'John Doe', confirmed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' && new Date(s.date) >= new Date());
  const pastSessions = sessions.filter(s => s.status !== 'scheduled' || new Date(s.date) < new Date());

  const formatDate = (date: Date) => date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">Programada</span>;
      case 'completed': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Completada</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Cancelada</span>;
      default: return null;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mis Sesiones</h1>
            <p className="text-gray-400">Visualiza y gestiona tus sesiones de coaching</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Reservar Nueva Sesión
          </button>
        </div>

        {/* Próximas Sesiones */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Próximas Sesiones</h2>
          
          {upcomingSessions.length === 0 ? (
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-8 text-center">
              <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-gray-500" />
              </div>
              <h3 className="text-white font-semibold mb-2">No hay sesiones próximas</h3>
              <p className="text-gray-400 text-sm mb-4">Empieza tu viaje de transformación hoy mismo.</p>
              <Link href="#" className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1">
                Programa tu primera sesión <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-white font-semibold">{session.title}</h3>
                      <div className="flex items-center gap-4 text-gray-400 text-sm mt-1">
                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> {session.coachName}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(session.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {session.duration} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.confirmed && <span className="text-emerald-400 text-sm flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Confirmada</span>}
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Play className="w-4 h-4" /> Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sesiones Pasadas */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Sesiones Pasadas</h2>
          
          {pastSessions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay sesiones pasadas</p>
          ) : (
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div key={session.id} className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-semibold">{session.title}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="flex items-center gap-1"><User className="w-4 h-4" /> {session.coachName}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(session.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {session.duration} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
