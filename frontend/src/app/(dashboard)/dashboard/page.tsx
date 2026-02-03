'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target, Calendar, MessageSquare, TrendingUp, Clock,
  CheckCircle, ArrowRight, Bell, BookOpen, Star,
  ChevronRight, Flame, Award, Sparkles
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';

interface Goal {
  id: string;
  title: string;
  progress: number;
  dueDate: Date;
}

interface Session {
  id: string;
  date: Date;
  coachName: string;
  status: string;
}

interface ToolAssignment {
  id: string;
  toolId: string;
  toolName: string;
  status: string;
}

export default function CoacheeDashboard() {
  const { user, userProfile } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [assignedTools, setAssignedTools] = useState<ToolAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Hola');
  const [stats, setStats] = useState({
    completedGoals: 0,
    totalSessions: 0,
    streak: 7,
    toolsCompleted: 0,
  });

  // Set greeting on client only to avoid hydration mismatch
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.uid) return;

      try {
        // Load goals
        const goalsQuery = query(
          collection(db, 'goals'),
          where('coacheeId', '==', user.uid),
          where('status', '!=', 'completed'),
          limit(3)
        );
        const goalsSnapshot = await getDocs(goalsQuery);
        const goalsData = goalsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          progress: doc.data().progress || 0,
          dueDate: doc.data().dueDate?.toDate() || new Date(),
        }));
        setGoals(goalsData);

        // Load upcoming sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'scheduled'),
          orderBy('date', 'asc'),
          limit(3)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessionsData = sessionsSnapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.data().date?.toDate() || new Date(),
          coachName: doc.data().coachName || 'Tu Coach',
          status: doc.data().status,
        }));
        setUpcomingSessions(sessionsData);

        // Load assigned tools
        const toolsQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'assigned'),
          limit(3)
        );
        const toolsSnapshot = await getDocs(toolsQuery);
        const toolsData = toolsSnapshot.docs.map(doc => ({
          id: doc.id,
          toolId: doc.data().toolId,
          toolName: doc.data().toolName,
          status: doc.data().status,
        }));
        setAssignedTools(toolsData);

        // Calculate stats
        const completedGoalsQuery = query(
          collection(db, 'goals'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'completed')
        );
        const completedSnapshot = await getDocs(completedGoalsQuery);
        
        const allSessionsQuery = query(
          collection(db, 'sessions'),
          where('coacheeId', '==', user.uid),
          where('status', '==', 'completed')
        );
        const allSessionsSnapshot = await getDocs(allSessionsQuery);

        setStats({
          completedGoals: completedSnapshot.size,
          totalSessions: allSessionsSnapshot.size,
          streak: 7,
          toolsCompleted: 3,
        });

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  if (loading) {
    return (
      <div className="p-6 lg:p-8 bg-[var(--bg-primary)] min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Bento Grid Skeleton */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Row 1: 4 stat cards */}
            <SkeletonCard className="col-span-6 lg:col-span-3" />
            <SkeletonCard className="col-span-6 lg:col-span-3" />
            <SkeletonCard className="col-span-6 lg:col-span-3" />
            <SkeletonCard className="col-span-6 lg:col-span-3" />

            {/* Row 2: Sessions + Tools */}
            <div className="col-span-12 lg:col-span-8 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Skeleton className="h-5 w-40 mb-6" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Skeleton className="h-5 w-32 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-28 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Goals */}
            <div className="col-span-12 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <Skeleton className="h-5 w-32 mb-6" />
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                    <Skeleton className="h-5 w-full mb-4" />
                    <Skeleton className="h-2 w-full rounded-full mb-3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[var(--fg-primary)]">
              {greeting}, {userProfile?.displayName?.split(' ')[0] || 'Coachee'}
            </h1>
          </div>
          <p className="text-[var(--fg-muted)] ml-13">Tu progreso de coaching de un vistazo.</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">
          {/* Row 1: Stats Cards */}
          <div className="col-span-6 lg:col-span-3 bento-card p-5 group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--fg-muted)] text-sm">Metas Completadas</p>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--fg-primary)]">{stats.completedGoals}</p>
            <p className="text-xs text-emerald-400 mt-1">+2 este mes</p>
          </div>

          <div className="col-span-6 lg:col-span-3 bento-card p-5 group hover:border-emerald-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--fg-muted)] text-sm">Sesiones</p>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--fg-primary)]">{stats.totalSessions}</p>
            <p className="text-xs text-blue-400 mt-1">Completadas</p>
          </div>

          <div className="col-span-6 lg:col-span-3 bento-card p-5 group hover:border-orange-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--fg-muted)] text-sm">Racha Activa</p>
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--fg-primary)]">{stats.streak}</p>
            <p className="text-xs text-orange-400 mt-1">días consecutivos</p>
          </div>

          <div className="col-span-6 lg:col-span-3 bento-card p-5 group hover:border-violet-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[var(--fg-muted)] text-sm">Herramientas</p>
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Award className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--fg-primary)]">{stats.toolsCompleted}</p>
            <p className="text-xs text-violet-400 mt-1">Completadas</p>
          </div>

          {/* Row 2: Sessions (8 cols) + Tools (4 cols) */}
          <div className="col-span-12 lg:col-span-8 bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
                Próximas Sesiones
              </h2>
              <Link href="/sessions" className="text-[var(--accent-primary)] text-sm hover:text-emerald-300 flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-tertiary)]/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[var(--accent-primary)] text-xs font-medium uppercase">
                          {session.date.toLocaleDateString('es-CL', { weekday: 'short' })}
                        </span>
                        <span className="text-[var(--fg-primary)] text-lg font-bold">
                          {session.date.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-[var(--fg-primary)] font-medium">Sesión con {session.coachName}</p>
                        <p className="text-[var(--fg-muted)] text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(session.date)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/sessions/${session.id}`}
                      className="px-5 py-2.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Unirse
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-[var(--fg-muted)]" />
                </div>
                <p className="text-[var(--fg-primary)] font-medium mb-1">No tienes sesiones programadas</p>
                <p className="text-[var(--fg-muted)] text-sm mb-4">Coordina con tu coach para agendar tu próxima sesión</p>
                <Link href="/sessions" className="inline-flex items-center gap-2 text-[var(--accent-primary)] text-sm hover:text-emerald-300 font-medium">
                  Solicitar sesión
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Assigned Tools */}
          <div className="col-span-12 lg:col-span-4 bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-violet-400" />
                Herramientas
              </h2>
              <Link href="/tools" className="text-[var(--accent-primary)] text-sm hover:text-emerald-300 flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {assignedTools.length > 0 ? (
              <div className="space-y-3">
                {assignedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.toolId}`}
                    className="flex items-center gap-3 p-4 bg-[var(--bg-tertiary)] rounded-xl hover:bg-[var(--bg-tertiary)]/80 transition-all group"
                  >
                    <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[var(--fg-primary)] text-sm font-medium truncate">{tool.toolName}</p>
                      <p className="text-[var(--fg-muted)] text-xs">Pendiente de completar</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--fg-muted)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-[var(--fg-muted)]" />
                </div>
                <p className="text-[var(--fg-muted)] text-sm">Sin herramientas asignadas</p>
              </div>
            )}
          </div>

          {/* Row 3: Goals - Full width */}
          <div className="col-span-12 bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--fg-primary)] flex items-center gap-2">
                <Target className="w-5 h-5 text-[var(--accent-primary)]" />
                Mis Metas
              </h2>
              <Link href="/goals" className="text-[var(--accent-primary)] text-sm hover:text-emerald-300 flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {goals.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-[var(--bg-tertiary)] rounded-xl p-5 hover:bg-[var(--bg-tertiary)]/80 transition-all group">
                    <h3 className="text-[var(--fg-primary)] font-medium mb-4 line-clamp-2">{goal.title}</h3>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-[var(--fg-muted)]">Progreso</span>
                        <span className="text-[var(--fg-primary)] font-medium">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[var(--fg-muted)] text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Vence: {formatDate(goal.dueDate)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-[var(--fg-muted)]" />
                </div>
                <p className="text-[var(--fg-primary)] font-medium mb-1">No tienes metas activas</p>
                <p className="text-[var(--fg-muted)] text-sm mb-4">Trabaja con tu coach para definir tus objetivos</p>
                <Link href="/goals" className="inline-flex items-center gap-2 text-[var(--accent-primary)] text-sm hover:text-emerald-300 font-medium">
                  Crear una meta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
