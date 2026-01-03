'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, FileText, Zap, Calendar, ArrowUpRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalCoaches: number;
  totalCoachees: number;
  totalUsers: number;
  newUsersThisWeek: number;
  totalToolResults: number;
  totalSessions: number;
  totalBlogPosts: number;
}

interface RecentUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: Date;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalCoaches: 0,
    totalCoachees: 0,
    totalUsers: 0,
    newUsersThisWeek: 0,
    totalToolResults: 0,
    totalSessions: 0,
    totalBlogPosts: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email || '',
        displayName: doc.data().displayName || doc.data().firstName || doc.data().email?.split('@')[0] || '',
        role: doc.data().role || 'coachee',
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const coaches = users.filter(u => u.role === 'coach').length;
      const coachees = users.filter(u => u.role === 'coachee').length;

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newUsersThisWeek = users.filter(u => u.createdAt >= oneWeekAgo).length;

      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));

      let blogCount = 0;
      try {
        const blogSnapshot = await getDocs(collection(db, 'blog_posts'));
        blogCount = blogSnapshot.size;
      } catch (e) {}

      setStats({
        totalCoaches: coaches,
        totalCoachees: coachees,
        totalUsers: users.length,
        newUsersThisWeek,
        totalToolResults: toolResultsSnapshot.size,
        totalSessions: sessionsSnapshot.size,
        totalBlogPosts: blogCount,
      });

      const sortedUsers = users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);
      setRecentUsers(sortedUsers);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'coach': return 'bg-blue-500/20 text-blue-400';
      case 'coachee': return 'bg-emerald-500/20 text-emerald-400';
      case 'admin': return 'bg-violet-500/20 text-violet-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">¡Bienvenido de nuevo!</h1>
          <p className="text-gray-400 mt-1">Aquí tienes un resumen de la actividad de la plataforma.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Coaches Activos */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Coaches Activos Totales</p>
            <p className="text-4xl font-bold text-white mb-2">{stats.totalCoaches}</p>
            <div className="flex items-center text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>+0% vs semana pasada</span>
            </div>
          </div>

          {/* Coachees Activos */}
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Coachees Activos Totales</p>
            <p className="text-4xl font-bold text-white mb-2">{stats.totalCoachees}</p>
            <p className="text-gray-500 text-sm">{stats.totalUsers} usuarios totales</p>
          </div>

          {/* Nuevos Registros */}
          <div className="bg-gradient-to-br from-violet-600/20 to-violet-900/20 border border-violet-500/30 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Nuevos Registros</p>
            <p className="text-4xl font-bold text-white mb-2">+{stats.newUsersThisWeek}</p>
            <div className="flex items-center text-emerald-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>en últimos 7 días</span>
            </div>
          </div>

          {/* Herramientas Completadas */}
          <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/20 border border-amber-500/30 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-1">Herramientas Completadas</p>
            <p className="text-4xl font-bold text-white mb-2">{stats.totalToolResults}</p>
            <p className="text-gray-500 text-sm">{stats.totalSessions} sesiones</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Nuevos Registros Recientes */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Nuevos Registros Recientes</h2>
              <Link href="/admin/users" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                Gestionar Usuarios <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(user.displayName)}`}>
                      {getInitials(user.displayName)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.displayName}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <p className="text-gray-500 text-xs mt-1">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-gray-500 text-center py-4">No hay registros recientes</p>
              )}
            </div>
          </div>

          {/* Resumen de Contenido */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Resumen de Contenido</h2>
              <Link href="/admin/blog" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                Gestionar Contenido <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1b23] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Entradas Blog</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalBlogPosts}</p>
              </div>
              <div className="bg-[#1a1b23] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-400 text-sm">Sesiones</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
              </div>
              <div className="bg-[#1a1b23] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="text-gray-400 text-sm">Herramientas</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalToolResults}</p>
              </div>
              <div className="bg-[#1a1b23] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  <span className="text-gray-400 text-sm">Usuarios Totales</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
