'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  TrendingUp, Users, Target, Calendar, Activity, BarChart3, 
  Globe, Clock, MousePointer, ExternalLink, Eye, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';

interface FirebaseData {
  usersByWeek: { week: string; count: number }[];
  toolUsage: { tool: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  sessionStats: { total: number; thisMonth: number; lastMonth: number };
  topTools: { name: string; completions: number }[];
}

interface GA4Data {
  metrics: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  topPages: { path: string; views: number; avgDuration: number }[];
  sources: { source: string; sessions: number }[];
}

export default function AdminAnalyticsPage() {
  const [firebaseData, setFirebaseData] = useState<FirebaseData | null>(null);
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [ga4Loading, setGa4Loading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadFirebaseAnalytics();
    loadGA4Analytics();
  }, [timeRange]);

  const loadFirebaseAnalytics = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        ...(doc.data() as { role?: string }),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const usersByWeek: { week: string; count: number }[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        const count = users.filter(u => u.createdAt >= weekStart && u.createdAt < weekEnd).length;
        usersByWeek.push({
          week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count
        });
      }

      const roleDistribution = [
        { role: 'Coaches', count: users.filter(u => u.role === 'coach').length },
        { role: 'Coachees', count: users.filter(u => u.role === 'coachee').length },
        { role: 'Admins', count: users.filter(u => u.role === 'admin').length },
      ];

      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));
      const toolResults = toolResultsSnapshot.docs.map(doc => doc.data());
      const toolCounts: Record<string, number> = {};
      toolResults.forEach(result => {
        const toolId = result.toolId || 'unknown';
        toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
      });

      const topTools = Object.entries(toolCounts)
        .map(([name, completions]) => ({ name: formatToolName(name), completions }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);

      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const sessions = sessionsSnapshot.docs.map(doc => ({
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      setFirebaseData({
        usersByWeek,
        toolUsage: topTools.map(t => ({ tool: t.name, count: t.completions })),
        roleDistribution,
        sessionStats: {
          total: sessions.length,
          thisMonth: sessions.filter(s => s.createdAt >= thisMonthStart).length,
          lastMonth: sessions.filter(s => s.createdAt >= lastMonthStart && s.createdAt <= lastMonthEnd).length,
        },
        topTools,
      });
    } catch (error) {
      console.error('Error loading Firebase analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGA4Analytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange}`);
      const result = await response.json();
      if (result.success) {
        setGa4Data(result.data);
      }
    } catch (error) {
      console.error('Error loading GA4 analytics:', error);
    } finally {
      setGa4Loading(false);
    }
  };

  const formatToolName = (toolId: string) => {
    return toolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0a0a0f]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  const maxUserCount = Math.max(...(firebaseData?.usersByWeek.map(w => w.count) || [1]), 1);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-gray-400 mt-1">Métricas de plataforma y tráfico web</p>
          </div>
          <div className="flex items-center gap-4">
            
              href="https://app.contentsquare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#12131a] border border-blue-900/30 text-white rounded-lg hover:bg-[#1a1b23] transition-colors"
            >
              <MousePointer className="w-4 h-4" />
              Contentsquare
              <ExternalLink className="w-4 h-4" />
            </a>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-[#12131a] border border-blue-900/30 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
            </select>
          </div>
        </div>

        {/* GA4 Traffic Metrics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" />
            Tráfico Web (Google Analytics)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Usuarios Activos</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ga4Loading ? '...' : ga4Data?.metrics.activeUsers.toLocaleString() || '0'}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Sesiones</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ga4Loading ? '...' : ga4Data?.metrics.sessions.toLocaleString() || '0'}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-gray-400">Páginas Vistas</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ga4Loading ? '...' : ga4Data?.metrics.pageViews.toLocaleString() || '0'}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-400">Duración Promedio</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ga4Loading ? '...' : formatDuration(ga4Data?.metrics.avgSessionDuration || 0)}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-400">Tasa de Rebote</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {ga4Loading ? '...' : `${((ga4Data?.metrics.bounceRate || 0) * 100).toFixed(1)}%`}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Metrics (Firebase) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Métricas de Plataforma (Firebase)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Total Usuarios</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {firebaseData?.roleDistribution.reduce((sum, r) => sum + r.count, 0) || 0}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-gray-400">Herramientas Completadas</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {firebaseData?.toolUsage.reduce((sum, t) => sum + t.count, 0) || 0}
              </div>
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-gray-400">Sesiones Este Mes</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {firebaseData?.sessionStats.thisMonth || 0}
              </div>
              {firebaseData && firebaseData.sessionStats.lastMonth > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {firebaseData.sessionStats.thisMonth >= firebaseData.sessionStats.lastMonth ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-xs text-gray-500">vs {firebaseData.sessionStats.lastMonth} mes anterior</span>
                </div>
              )}
            </div>
            <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-gray-400">Herramientas/Usuario</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {firebaseData && firebaseData.roleDistribution.reduce((sum, r) => sum + r.count, 0) > 0
                  ? (firebaseData.toolUsage.reduce((sum, t) => sum + t.count, 0) / firebaseData.roleDistribution.reduce((sum, r) => sum + r.count, 0)).toFixed(1)
                  : '0'}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Páginas Más Visitadas</h3>
            {ga4Loading ? (
              <div className="text-gray-500 text-center py-8">Cargando...</div>
            ) : ga4Data?.topPages && ga4Data.topPages.length > 0 ? (
              <div className="space-y-3">
                {ga4Data.topPages.slice(0, 6).map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500 text-sm w-5">#{idx + 1}</span>
                      <span className="text-gray-300 text-sm truncate max-w-[200px]">{page.path}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium">{page.views.toLocaleString()}</span>
                      <span className="text-gray-500 text-xs">{formatDuration(page.avgDuration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">Sin datos</div>
            )}
          </div>

          {/* Traffic Sources */}
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Fuentes de Tráfico</h3>
            {ga4Loading ? (
              <div className="text-gray-500 text-center py-8">Cargando...</div>
            ) : ga4Data?.sources && ga4Data.sources.length > 0 ? (
              <div className="space-y-3">
                {ga4Data.sources.map((source, idx) => {
                  const total = ga4Data.sources.reduce((sum, s) => sum + s.sessions, 0);
                  const percentage = total > 0 ? (source.sessions / total) * 100 : 0;
                  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-red-500'];
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{source.source || '(direct)'}</span>
                        <span className="text-gray-500">{source.sessions} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div className={`h-2 rounded-full ${colors[idx % colors.length]}`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">Sin datos</div>
            )}
          </div>
        </div>

        {/* User Growth & Distribution */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* User Signups Chart */}
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Registros por Semana</h3>
            <div className="flex items-end gap-2 h-40">
              {firebaseData?.usersByWeek.map((week, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-400"
                    style={{ height: `${(week.count / maxUserCount) * 100}%`, minHeight: week.count > 0 ? '8px' : '2px' }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">{week.week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Role Distribution */}
          <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Distribución de Usuarios</h3>
            <div className="space-y-4">
              {firebaseData?.roleDistribution.map((role, index) => {
                const total = firebaseData.roleDistribution.reduce((sum, r) => sum + r.count, 0);
                const percentage = total > 0 ? (role.count / total) * 100 : 0;
                const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500'];
                return (
                  <div key={role.role}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{role.role}</span>
                      <span className="text-gray-500">{role.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className={`h-3 rounded-full ${colors[index]}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Tools */}
        <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4">Herramientas Más Usadas</h3>
          {firebaseData?.topTools && firebaseData.topTools.length > 0 ? (
            <div className="grid md:grid-cols-5 gap-4">
              {firebaseData.topTools.map((tool, index) => (
                <div key={tool.name} className="bg-[#1a1b23] rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{tool.completions}</div>
                  <div className="text-sm text-gray-400 truncate">{tool.name}</div>
                  <div className="text-xs text-gray-600 mt-1">#{index + 1}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin completaciones aún</p>
          )}
        </div>
      </div>
    </div>
  );
}
