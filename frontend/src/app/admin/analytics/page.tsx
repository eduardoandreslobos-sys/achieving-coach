'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, CheckCircle, Calendar, BarChart3, MoreHorizontal } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  totalTools: number;
  sessionsThisMonth: number;
  toolsPerUser: number;
  usersByWeek: { week: string; count: number }[];
  roleDistribution: { role: string; count: number; percentage: number }[];
  topTools: { name: string; completions: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const formatToolName = (toolId: string) => {
    const names: Record<string, string> = {
      'wheel-of-life': 'Wheel Of Life',
      'grow-model': 'Grow Worksheet',
      'disc': 'DISC Assessment',
      'values-clarification': 'Values Clarification',
      'limiting-beliefs': 'Limiting Beliefs',
      'resilience-scale': 'Resilience Scale',
    };
    return names[toolId] || toolId;
  };

  const loadAnalytics = async () => {
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        role: doc.data().role || 'coachee',
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const totalUsers = users.length;
      const coaches = users.filter(u => u.role === 'coach').length;
      const coachees = users.filter(u => u.role === 'coachee').length;
      const admins = users.filter(u => u.role === 'admin').length;

      // Users by week (last 8 weeks)
      const usersByWeek: { week: string; count: number }[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const count = users.filter(u => 
          u.createdAt >= weekStart && u.createdAt < weekEnd
        ).length;
        
        const weekLabel = weekStart.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }).toUpperCase();
        usersByWeek.push({ week: weekLabel, count });
      }

      // Role distribution
      const roleDistribution = [
        { role: 'Coaches', count: coaches, percentage: Math.round((coaches / totalUsers) * 100) || 0 },
        { role: 'Coachees', count: coachees, percentage: Math.round((coachees / totalUsers) * 100) || 0 },
        { role: 'Administradores', count: admins, percentage: Math.round((admins / totalUsers) * 100) || 0 },
      ];

      // Load tool results
      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));
      const toolResults = toolResultsSnapshot.docs.map(doc => doc.data());
      const totalTools = toolResults.length;

      // Tool counts
      const toolCounts: Record<string, number> = {};
      toolResults.forEach(result => {
        const toolId = result.toolId || 'unknown';
        toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
      });

      const topTools = Object.entries(toolCounts)
        .map(([name, completions]) => ({ name: formatToolName(name), completions }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);

      // Sessions this month
      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const sessionsThisMonth = sessionsSnapshot.docs.filter(doc => {
        const date = doc.data().createdAt?.toDate();
        return date && date >= monthStart;
      }).length;

      setData({
        totalUsers,
        totalTools,
        sessionsThisMonth,
        toolsPerUser: totalUsers > 0 ? Math.round((totalTools / totalUsers) * 10) / 10 : 0,
        usersByWeek,
        roleDistribution,
        topTools,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxWeekCount = Math.max(...(data?.usersByWeek.map(w => w.count) || [1]), 1);
  const maxToolCount = Math.max(...(data?.topTools.map(t => t.completions) || [1]), 1);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Analíticas</h1>
          <p className="text-gray-400 mt-1">Rendimiento detallado y perspectivas clave de la plataforma</p>
        </div>
        <div className="flex items-center gap-2 bg-[#12131a] border border-gray-800 rounded-xl px-4 py-2">
          <span className="text-white text-sm">Últimos {timeRange} días</span>
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Usuarios Totales */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-emerald-400 text-sm font-medium">+12% ↑</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Usuarios Totales</p>
          <p className="text-3xl font-bold text-white">
            {data?.totalUsers || 0}
            <span className="text-base font-normal text-gray-500 ml-2">activos</span>
          </p>
        </div>

        {/* Herramientas Completadas */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Herramientas Completadas</p>
          <p className="text-3xl font-bold text-white">{data?.totalTools || 0}</p>
        </div>

        {/* Sesiones Este Mes */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Sesiones Este Mes</p>
          <p className="text-3xl font-bold text-white">
            {data?.sessionsThisMonth || 0}
            <span className="text-base font-normal text-gray-500 ml-2">programadas</span>
          </p>
        </div>

        {/* Prom. Herramientas/Usuario */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
          <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Prom. Herramientas/Usuario</p>
          <p className="text-3xl font-bold text-white">{data?.toolsPerUser || 0}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Registros de Usuarios */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Registros de Usuarios</h2>
            <span className="text-sm text-gray-500 bg-gray-800 px-3 py-1 rounded-lg">Últimas 8 Semanas</span>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end justify-between gap-3 h-48">
            {data?.usersByWeek.map((week, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400"
                  style={{ height: `${(week.count / maxWeekCount) * 100}%`, minHeight: week.count > 0 ? '8px' : '4px' }}
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{week.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribución de Usuarios */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Distribución de Usuarios</h2>
            <button className="p-1 hover:bg-gray-800 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-5">
            {data?.roleDistribution.map((role, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      role.role === 'Coaches' ? 'bg-blue-500' :
                      role.role === 'Coachees' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`} />
                    <span className="text-white">{role.role}</span>
                  </div>
                  <span className="text-gray-400">
                    {role.count} <span className="text-gray-500">({role.percentage}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      role.role === 'Coaches' ? 'bg-blue-500' :
                      role.role === 'Coachees' ? 'bg-emerald-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${role.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Herramientas Más Usadas */}
      <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Herramientas Más Usadas</h2>
          <button className="text-blue-400 text-sm hover:text-blue-300">VER TODO</button>
        </div>
        
        <div className="space-y-4">
          {data?.topTools.map((tool, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-gray-500 text-sm w-6">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white">{tool.name}</span>
                  <span className="text-sm text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                    {tool.completions} completadas
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(tool.completions / maxToolCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(!data?.topTools || data.topTools.length === 0) && (
            <p className="text-gray-500 text-center py-8">No hay datos de herramientas aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
