'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, Calendar, MessageSquare, TrendingUp, Clock, 
  CheckCircle, ArrowRight, Bell, BookOpen, Star,
  ChevronRight, Flame, Award
} from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

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
  const [stats, setStats] = useState({
    completedGoals: 0,
    totalSessions: 0,
    streak: 7,
    toolsCompleted: 0,
  });

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            {getGreeting()}, {userProfile?.displayName?.split(' ')[0] || 'Coachee'}
          </h1>
          <p className="text-gray-400">Tu progreso de coaching de un vistazo.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.completedGoals}</p>
            <p className="text-gray-500 text-sm">Metas Completadas</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
            <p className="text-gray-500 text-sm">Sesiones Completadas</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.streak} días</p>
            <p className="text-gray-500 text-sm">Racha Activa</p>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stats.toolsCompleted}</p>
            <p className="text-gray-500 text-sm">Herramientas Usadas</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Próximas Sesiones
              </h2>
              <Link href="/sessions" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-blue-400 text-xs font-medium">
                          {session.date.toLocaleDateString('es-CL', { weekday: 'short' })}
                        </span>
                        <span className="text-white font-bold">
                          {session.date.getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">Sesión con {session.coachName}</p>
                        <p className="text-gray-500 text-sm">{formatTime(session.date)}</p>
                      </div>
                    </div>
                    <Link
                      href={`/sessions/${session.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Unirse
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No tienes sesiones programadas</p>
                <Link href="/sessions" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
                  Solicitar sesión
                </Link>
              </div>
            )}
          </div>

          {/* Assigned Tools */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Herramientas
              </h2>
              <Link href="/tools" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
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
                    className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{tool.toolName}</p>
                      <p className="text-gray-500 text-xs">Pendiente</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-500" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Sin herramientas asignadas</p>
              </div>
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-6 bg-[#111111] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              Mis Metas
            </h2>
            <Link href="/goals" className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {goals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-[#1a1a1a] rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3 line-clamp-2">{goal.title}</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progreso</span>
                      <span className="text-white">{goal.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Vence: {formatDate(goal.dueDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No tienes metas activas</p>
              <Link href="/goals" className="text-blue-400 text-sm mt-2 inline-block hover:text-blue-300">
                Crear una meta
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
