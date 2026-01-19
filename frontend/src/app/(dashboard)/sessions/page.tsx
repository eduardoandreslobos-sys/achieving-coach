'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, Play, CheckCircle, XCircle, Plus, Video } from 'lucide-react';
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
  coachId: string;
  confirmed: boolean;
  meetingUrl?: string;
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
      const q = query(
        collection(db, 'sessions'), 
        where('coacheeId', '==', user.uid), 
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title || 'Sesión de Coaching',
        date: doc.data().date?.toDate() || new Date(),
        duration: doc.data().duration || 60,
        status: doc.data().status || 'scheduled',
        coachName: doc.data().coachName || 'Tu Coach',
        coachId: doc.data().coachId || '',
        confirmed: doc.data().confirmed || false,
        meetingUrl: doc.data().meetingUrl,
      })) as Session[];
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' && new Date(s.date) >= now);
  const pastSessions = sessions.filter(s => s.status !== 'scheduled' || new Date(s.date) < now);

  const formatDate = (date: Date) => date.toLocaleDateString('es-CL', { 
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' 
  });
  
  const formatTime = (date: Date) => date.toLocaleTimeString('es-CL', { 
    hour: '2-digit', minute: '2-digit' 
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <span className="px-2 py-1 bg-emerald-500/20 text-[var(--accent-primary)] text-xs rounded-full">Programada</span>;
      case 'completed': return <span className="px-2 py-1 bg-emerald-500/20 text-[var(--accent-primary)] text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Completada</span>;
      case 'cancelled': return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" />Cancelada</span>;
      default: return null;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Mis Sesiones</h1>
            <p className="text-[var(--fg-muted)]">Visualiza y gestiona tus sesiones de coaching</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            Reservar Nueva Sesión
          </button>
        </div>

        {/* Próximas Sesiones */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-4">Próximas Sesiones</h2>
          
          {upcomingSessions.length === 0 ? (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-[var(--fg-muted)] mx-auto mb-4" />
              <p className="text-[var(--fg-muted)] mb-2">No tienes sesiones programadas</p>
              <p className="text-[var(--fg-muted)] text-sm">Tu coach te agendará próximas sesiones</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[var(--accent-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-[var(--fg-primary)] font-medium">{session.title}</h3>
                        <div className="flex items-center gap-3 text-[var(--fg-muted)] text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(session.date)} ({session.duration} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <User className="w-4 h-4 text-[var(--fg-muted)]" />
                          <span className="text-[var(--fg-muted)] text-sm">{session.coachName}</span>
                          {session.confirmed && (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-[var(--accent-primary)] text-xs rounded-full">Confirmada</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.meetingUrl && (
                        <a 
                          href={session.meetingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                          <Video className="w-4 h-4" />
                          Unirse
                        </a>
                      )}
                      <Link
                        href={'/sessions/' + session.id}
                        className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--fg-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sesiones Pasadas */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-4">Sesiones Pasadas</h2>
          
          {pastSessions.length === 0 ? (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-8 text-center">
              <p className="text-[var(--fg-muted)]">No hay sesiones pasadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pastSessions.map((session) => (
                <div key={session.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + 
                        (session.status === 'completed' ? 'bg-emerald-600/20' : 'bg-red-600/20')
                      }>
                        {session.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-[var(--accent-primary)]" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-[var(--fg-primary)] font-medium">{session.title}</h3>
                          {getStatusBadge(session.status)}
                        </div>
                        <div className="flex items-center gap-3 text-[var(--fg-muted)] text-sm mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {session.coachName}
                          </span>
                        </div>
                      </div>
                    </div>
                    {session.status === 'completed' && (
                      <Link
                        href={'/sessions/' + session.id}
                        className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--fg-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        Ver Notas
                      </Link>
                    )}
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
