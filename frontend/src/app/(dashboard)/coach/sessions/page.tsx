'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import {
  Calendar,
  Clock,
  User,
  Video,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  ExternalLink,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface Session {
  id: string;
  coacheeId: string;
  coacheeName: string;
  coacheeEmail: string;
  scheduledDate: Date;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  meetingLink?: string;
  notes?: string;
  preSessionNotes?: string;
  postSessionNotes?: string;
  programId?: string;
  programName?: string;
  startedAt?: Date;
}

interface Coachee {
  id: string;
  displayName: string;
  email: string;
}

export default function CoachSessionsPage() {
  const { user, userProfile } = useAuth();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [coachees, setCoachees] = useState<Coachee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [newSession, setNewSession] = useState({
    coacheeId: searchParams?.get('coacheeId') || '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    meetingLink: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [user, userProfile]);

  // Auto-open create modal when redirected from client profile
  useEffect(() => {
    if (searchParams?.get('newSession') === 'true' && !loading) {
      setShowCreateModal(true);
    }
  }, [searchParams, loading]);

  const loadData = async () => {
    if (!user || !userProfile) return;

    try {
      // Load coachees
      const coacheesQuery = query(
        collection(db, 'users'),
        where('role', '==', 'coachee'),
        where('coacheeInfo.coachId', '==', user.uid)
      );
      const coacheesSnapshot = await getDocs(coacheesQuery);
      const coacheesData = coacheesSnapshot.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName || doc.data().email?.split('@')[0] || 'Unknown',
        email: doc.data().email || ''
      }));
      setCoachees(coacheesData);

      // Load sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('coachId', '==', user.uid)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Handle Firestore Timestamp, string date, or fallback to current date
        let scheduledDate: Date;
        if (data.scheduledDate?.toDate) {
          scheduledDate = data.scheduledDate.toDate();
        } else if (data.scheduledDate) {
          scheduledDate = new Date(data.scheduledDate);
          // Check if date is valid
          if (isNaN(scheduledDate.getTime())) {
            scheduledDate = new Date();
          }
        } else {
          scheduledDate = new Date();
        }
        const coachee = coacheesData.find(c => c.id === data.coacheeId);

        return {
          id: doc.id,
          coacheeId: data.coacheeId,
          coacheeName: coachee?.displayName || data.coacheeName || 'Unknown',
          coacheeEmail: coachee?.email || data.coacheeEmail || '',
          scheduledDate,
          duration: data.duration || 60,
          status: data.status || 'scheduled',
          meetingLink: data.meetingLink || '',
          notes: data.notes || '',
          preSessionNotes: data.preSessionNotes || '',
          postSessionNotes: data.postSessionNotes || '',
          programId: data.programId,
          programName: data.programName
        } as Session;
      });

      // Sort by date (newest first for past, oldest first for upcoming)
      sessionsData.sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!user || !newSession.coacheeId || !newSession.scheduledDate || !newSession.scheduledTime) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const coachee = coachees.find(c => c.id === newSession.coacheeId);
      const scheduledDateTime = new Date(`${newSession.scheduledDate}T${newSession.scheduledTime}`);

      await addDoc(collection(db, 'sessions'), {
        coachId: user.uid,
        coacheeId: newSession.coacheeId,
        coacheeName: coachee?.displayName || '',
        coacheeEmail: coachee?.email || '',
        scheduledDate: Timestamp.fromDate(scheduledDateTime),
        duration: newSession.duration,
        status: 'scheduled',
        meetingLink: newSession.meetingLink,
        notes: newSession.notes,
        createdAt: serverTimestamp()
      });

      // Create notification for coachee
      await addDoc(collection(db, 'notifications'), {
        userId: newSession.coacheeId,
        type: 'session',
        title: 'Nueva Sesión Programada',
        message: `Tienes una sesión programada para ${scheduledDateTime.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
        read: false,
        createdAt: serverTimestamp(),
        actionUrl: '/sessions'
      });

      toast.success('Session created successfully');
      setShowCreateModal(false);
      setNewSession({
        coacheeId: '',
        scheduledDate: '',
        scheduledTime: '',
        duration: 60,
        meetingLink: '',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Error creating session');
    }
  };

  const handleUpdateSession = async () => {
    if (!selectedSession) return;

    try {
      await updateDoc(doc(db, 'sessions', selectedSession.id), {
        status: selectedSession.status,
        meetingLink: selectedSession.meetingLink,
        notes: selectedSession.notes,
        postSessionNotes: selectedSession.postSessionNotes,
        updatedAt: serverTimestamp()
      });

      toast.success('Session updated successfully');
      setShowEditModal(false);
      setSelectedSession(null);
      loadData();
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Error updating session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
      toast.success('Session deleted');
      loadData();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Error deleting session');
    }
  };

  const handleStatusChange = async (sessionId: string, newStatus: Session['status']) => {
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      toast.success('Status updated');
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error updating status');
    }
  };

  const handleStartSession = async (session: Session) => {
    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        status: 'in-progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Sesión iniciada');
      loadData();

      // Open meeting link if available
      if (session.meetingLink) {
        window.open(session.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Error al iniciar sesión');
    }
  };

  const filteredSessions = sessions.filter(session => {
    const now = new Date();
    const matchesSearch =
      session.coacheeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.coacheeEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (filter) {
      case 'upcoming':
        return session.scheduledDate > now && session.status === 'scheduled';
      case 'past':
        return session.scheduledDate < now || session.status === 'completed';
      case 'cancelled':
        return session.status === 'cancelled' || session.status === 'no-show';
      default:
        return true;
    }
  });

  const upcomingSessions = sessions.filter(s =>
    s.scheduledDate > new Date() && s.status === 'scheduled'
  ).slice(0, 5);

  const stats = {
    total: sessions.length,
    upcoming: sessions.filter(s => s.scheduledDate > new Date() && s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled' || s.status === 'no-show').length
  };

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Programada</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-[var(--accent-primary)] animate-pulse">En curso</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-violet-500/20 text-violet-400">Completada</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">Cancelada</span>;
      case 'no-show':
        return <span className="px-2 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">No asistió</span>;
      default:
        // For sessions without status, show as "Pendiente" (ready to start)
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">Pendiente</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--fg-muted)]">Cargando sesiones...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] p-8">
      <Toaster position="top-center" richColors />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Sesiones</h1>
          <p className="text-[var(--fg-muted)]">Administra y programa sesiones con tus coachees</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Sesión
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-[var(--fg-muted)]">Total Sesiones</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.upcoming}</p>
              <p className="text-sm text-[var(--fg-muted)]">Próximas</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-[var(--fg-muted)]">Completadas</p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
              <p className="text-sm text-[var(--fg-muted)]">Canceladas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'upcoming', 'past', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-[var(--fg-primary)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'upcoming' ? 'Próximas' : f === 'past' ? 'Pasadas' : 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-primary)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--fg-muted)] uppercase">Coachee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--fg-muted)] uppercase">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--fg-muted)] uppercase">Duración</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--fg-muted)] uppercase">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[var(--fg-muted)] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--fg-muted)]">
                    No hay sesiones que mostrar
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <span className="text-[var(--accent-primary)] font-medium">
                            {session.coacheeName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-[var(--fg-primary)]">{session.coacheeName}</p>
                          <p className="text-sm text-[var(--fg-muted)]">{session.coacheeEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[var(--fg-primary)]">
                        {session.scheduledDate.toLocaleDateString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-[var(--fg-muted)]">
                        {session.scheduledDate.toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-[var(--fg-muted)]">
                      {session.duration} min
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(session.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Start Session Button - show for any session that can be started */}
                        {(!session.status || session.status === 'scheduled') && (
                          <button
                            onClick={() => handleStartSession(session)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                            title="Iniciar sesión"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Iniciar
                          </button>
                        )}
                        {/* Continue Session Button - for in-progress sessions */}
                        {session.status === 'in-progress' && (
                          <Link
                            href={`/coach/sessions/${session.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Continuar
                          </Link>
                        )}
                        {/* View Session Detail */}
                        <Link
                          href={`/coach/sessions/${session.id}`}
                          className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {session.meetingLink && (
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--accent-primary)] hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Unirse a la reunión"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setShowEditModal(true);
                          }}
                          className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-2 text-[var(--fg-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold">Nueva Sesión</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Coachee *</label>
                <select
                  value={newSession.coacheeId}
                  onChange={(e) => setNewSession({ ...newSession, coacheeId: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Seleccionar coachee</option>
                  {coachees.map((coachee) => (
                    <option key={coachee.id} value={coachee.id}>
                      {coachee.displayName} ({coachee.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Fecha *</label>
                  <input
                    type="date"
                    value={newSession.scheduledDate}
                    onChange={(e) => setNewSession({ ...newSession, scheduledDate: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Hora *</label>
                  <input
                    type="time"
                    value={newSession.scheduledTime}
                    onChange={(e) => setNewSession({ ...newSession, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Duración (minutos)</label>
                <select
                  value={newSession.duration}
                  onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:border-emerald-500"
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                  <option value={120}>120 minutos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Link de reunión</label>
                <input
                  type="url"
                  value={newSession.meetingLink}
                  onChange={(e) => setNewSession({ ...newSession, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Notas</label>
                <textarea
                  value={newSession.notes}
                  onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                  placeholder="Notas o agenda para la sesión..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSession}
                className="px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Crear Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold">Editar Sesión</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSession(null);
                }}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                <p className="text-sm text-[var(--fg-muted)] mb-1">Coachee</p>
                <p className="font-medium">{selectedSession.coacheeName}</p>
                <p className="text-sm text-[var(--fg-muted)]">{selectedSession.coacheeEmail}</p>
              </div>
              <div className="bg-[var(--bg-primary)] rounded-lg p-4">
                <p className="text-sm text-[var(--fg-muted)] mb-1">Fecha y Hora</p>
                <p className="font-medium">
                  {selectedSession.scheduledDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Estado</label>
                <select
                  value={selectedSession.status}
                  onChange={(e) => setSelectedSession({ ...selectedSession, status: e.target.value as Session['status'] })}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] focus:outline-none focus:border-emerald-500"
                >
                  <option value="scheduled">Programada</option>
                  <option value="in-progress">En curso</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="no-show">No asistió</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Link de reunión</label>
                <input
                  type="url"
                  value={selectedSession.meetingLink || ''}
                  onChange={(e) => setSelectedSession({ ...selectedSession, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">Notas de sesión</label>
                <textarea
                  value={selectedSession.postSessionNotes || ''}
                  onChange={(e) => setSelectedSession({ ...selectedSession, postSessionNotes: e.target.value })}
                  placeholder="Notas después de la sesión..."
                  rows={4}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)]">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedSession(null);
                }}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
