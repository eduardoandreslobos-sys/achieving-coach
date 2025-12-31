'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, Video, MapPin, Plus, Filter,
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  AlertCircle, FileText, User, MoreVertical
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Session {
  id: string;
  date: Date;
  duration: number;
  type: 'video' | 'presencial' | 'telefono';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  coachId: string;
  coachName: string;
  notes?: string;
  objectives?: string[];
}

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    loadSessions();
  }, [user]);

  const loadSessions = async () => {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, 'sessions'),
        where('coacheeId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Session[];
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Mock data for demo
      setSessions([
        {
          id: '1',
          date: new Date(Date.now() + 86400000 * 2),
          duration: 60,
          type: 'video',
          status: 'scheduled',
          coachId: 'coach1',
          coachName: 'María García',
          objectives: ['Revisar progreso de metas', 'Definir próximos pasos'],
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000 * 5),
          duration: 60,
          type: 'video',
          status: 'completed',
          coachId: 'coach1',
          coachName: 'María García',
          notes: 'Excelente sesión. Se definieron 3 metas principales.',
        },
        {
          id: '3',
          date: new Date(Date.now() - 86400000 * 12),
          duration: 45,
          type: 'presencial',
          status: 'completed',
          coachId: 'coach1',
          coachName: 'María García',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const now = new Date();
    if (filter === 'upcoming') return session.date > now && session.status === 'scheduled';
    if (filter === 'past') return session.date < now || session.status !== 'scheduled';
    return true;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Session['status']) => {
    const styles = {
      scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
      'no-show': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    };
    const labels = {
      scheduled: 'Programada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      'no-show': 'No asistió',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeIcon = (type: Session['type']) => {
    if (type === 'video') return <Video className="w-4 h-4" />;
    if (type === 'presencial') return <MapPin className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const stats = {
    upcoming: sessions.filter(s => s.date > new Date() && s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    total: sessions.length,
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getSessionsForDay = (date: Date) => {
    return sessions.filter(s => 
      s.date.toDateString() === date.toDateString()
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mis Sesiones</h1>
            <p className="text-gray-400">Gestiona tus sesiones de coaching.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-[#111111] border border-gray-800 rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  view === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Calendario
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Próximas</p>
            <p className="text-2xl font-bold text-blue-400">{stats.upcoming}</p>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Completadas</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
        </div>

        {view === 'list' ? (
          <>
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {(['upcoming', 'past', 'all'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {f === 'upcoming' ? 'Próximas' : f === 'past' ? 'Pasadas' : 'Todas'}
                </button>
              ))}
            </div>

            {/* Sessions List */}
            {filteredSessions.length > 0 ? (
              <div className="space-y-4">
                {filteredSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-[#111111] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex flex-col items-center justify-center">
                          <span className="text-blue-400 text-xs font-medium">
                            {session.date.toLocaleDateString('es-CL', { weekday: 'short' })}
                          </span>
                          <span className="text-white text-lg font-bold">
                            {session.date.getDate()}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-semibold">Sesión con {session.coachName}</h3>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatTime(session.date)} - {session.duration} min
                            </span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(session.type)}
                              {session.type === 'video' ? 'Videollamada' : session.type === 'presencial' ? 'Presencial' : 'Teléfono'}
                            </span>
                          </div>
                          {session.objectives && session.objectives.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {session.objectives.map((obj, i) => (
                                <span key={i} className="px-2 py-1 bg-[#1a1a1a] text-gray-400 text-xs rounded">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {session.status === 'scheduled' && session.date > new Date() && (
                          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Unirse
                          </button>
                        )}
                        {session.status === 'completed' && (
                          <Link
                            href={`/sessions/${session.id}`}
                            className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg hover:bg-[#222] transition-colors"
                          >
                            Ver Notas
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">No hay sesiones</h3>
                <p className="text-gray-500">
                  {filter === 'upcoming' 
                    ? 'No tienes sesiones próximas programadas.' 
                    : 'No se encontraron sesiones.'}
                </p>
              </div>
            )}
          </>
        ) : (
          /* Calendar View */
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-white">
                {currentMonth.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div key={day} className="text-center text-gray-500 text-sm py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, i) => {
                if (!date) {
                  return <div key={`empty-${i}`} className="h-24 bg-[#0a0a0a] rounded-lg" />;
                }
                const daySessions = getSessionsForDay(date);
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={date.toISOString()}
                    className={`h-24 p-2 rounded-lg ${
                      isToday ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-[#1a1a1a]'
                    }`}
                  >
                    <span className={`text-sm ${isToday ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}>
                      {date.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {daySessions.slice(0, 2).map((s) => (
                        <div
                          key={s.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            s.status === 'scheduled'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {formatTime(s.date)}
                        </div>
                      ))}
                      {daySessions.length > 2 && (
                        <span className="text-xs text-gray-500">+{daySessions.length - 2} más</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
