'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseAvailable } from '@/lib/firebase';
import {
  Users,
  CheckCircle,
  Calendar,
  BarChart3,
  Globe,
  Search,
  TrendingUp,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

// Types
interface PlatformData {
  totalUsers: number;
  totalTools: number;
  sessionsThisMonth: number;
  toolsPerUser: number;
  usersByWeek: { week: string; count: number }[];
  roleDistribution: { role: string; count: number; percentage: number }[];
  topTools: { name: string; completions: number }[];
}

interface GA4Data {
  metrics: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
    newUsers: number;
    engagedSessions: number;
    organicPercentage: number;
  };
  topPages: { path: string; views: number; avgDuration: number; bounceRate: number }[];
  sources: { source: string; sessions: number }[];
  countries: { country: string; users: number; sessions: number; engagementRate: number }[];
  devices: { device: string; users: number; sessions: number; bounceRate: number }[];
  channels: { channel: string; sessions: number; users: number; engagementRate: number }[];
}

interface SearchConsoleData {
  totals: {
    clicks: number;
    impressions: number;
    avgCtr: string;
    avgPosition: string;
  };
  keywords: { query: string; clicks: number; impressions: number; ctr: string; position: string }[];
  pages: { page: string; clicks: number; impressions: number; ctr: string; position: string }[];
  devices: { device: string; clicks: number; impressions: number; ctr: string }[];
  countries: { country: string; clicks: number; impressions: number; ctr: string; position: string }[];
}

type TabType = 'overview' | 'traffic' | 'seo' | 'geo' | 'platform';

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [platformData, setPlatformData] = useState<PlatformData | null>(null);
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [searchConsoleData, setSearchConsoleData] = useState<SearchConsoleData | null>(null);

  const tabs = [
    { id: 'overview' as TabType, label: 'Resumen', icon: BarChart3 },
    { id: 'traffic' as TabType, label: 'Tráfico', icon: TrendingUp },
    { id: 'seo' as TabType, label: 'SEO', icon: Search },
    { id: 'geo' as TabType, label: 'GEO', icon: Globe },
    { id: 'platform' as TabType, label: 'Plataforma', icon: Users },
  ];

  useEffect(() => {
    loadAllData();
  }, [timeRange]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadPlatformData(),
      loadGA4Data(),
      loadSearchConsoleData(),
    ]);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const loadPlatformData = async () => {
    if (!isFirebaseAvailable || !db) {
      setPlatformData(null);
      return;
    }

    try {
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

      const roleDistribution = [
        { role: 'Coaches', count: coaches, percentage: Math.round((coaches / totalUsers) * 100) || 0 },
        { role: 'Coachees', count: coachees, percentage: Math.round((coachees / totalUsers) * 100) || 0 },
        { role: 'Admins', count: admins, percentage: Math.round((admins / totalUsers) * 100) || 0 },
      ];

      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));
      const toolResults = toolResultsSnapshot.docs.map(doc => doc.data());
      const totalTools = toolResults.length;

      const toolCounts: Record<string, number> = {};
      toolResults.forEach(result => {
        const toolId = result.toolId || 'unknown';
        toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
      });

      const formatToolName = (id: string) => {
        const names: Record<string, string> = {
          'wheel-of-life': 'Wheel of Life',
          'grow-model': 'GROW',
          'disc': 'DISC',
          'values-clarification': 'Valores',
          'limiting-beliefs': 'Creencias',
          'resilience-scale': 'Resiliencia',
        };
        return names[id] || id;
      };

      const topTools = Object.entries(toolCounts)
        .map(([name, completions]) => ({ name: formatToolName(name), completions }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);

      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const sessionsThisMonth = sessionsSnapshot.docs.filter(doc => {
        const date = doc.data().createdAt?.toDate();
        return date && date >= monthStart;
      }).length;

      setPlatformData({
        totalUsers,
        totalTools,
        sessionsThisMonth,
        toolsPerUser: totalUsers > 0 ? Math.round((totalTools / totalUsers) * 10) / 10 : 0,
        usersByWeek,
        roleDistribution,
        topTools,
      });
    } catch (error) {
      console.error('Error loading platform data:', error);
      setPlatformData(null);
    }
  };

  const loadGA4Data = async () => {
    try {
      const res = await fetch(`/api/analytics?days=${timeRange}`);
      const json = await res.json();
      if (json.success) {
        setGa4Data(json.data);
      }
    } catch (error) {
      console.error('Error loading GA4 data:', error);
    }
  };

  const loadSearchConsoleData = async () => {
    try {
      const res = await fetch(`/api/search-console?days=${timeRange}`);
      const json = await res.json();
      if (json.success) {
        setSearchConsoleData(json.data);
      }
    } catch (error) {
      console.error('Error loading Search Console data:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return Smartphone;
      case 'desktop': return Monitor;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: Record<string, string> = {
      'CL': '🇨🇱', 'MX': '🇲🇽', 'AR': '🇦🇷', 'CO': '🇨🇴', 'ES': '🇪🇸',
      'US': '🇺🇸', 'PE': '🇵🇪', 'BR': '🇧🇷', 'EC': '🇪🇨', 'VE': '🇻🇪',
      'Chile': '🇨🇱', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'Colombia': '🇨🇴', 'Spain': '🇪🇸',
      'United States': '🇺🇸', 'Peru': '🇵🇪', 'Brazil': '🇧🇷', 'Ecuador': '🇪🇨', 'Venezuela': '🇻🇪',
    };
    return flags[countryCode] || '🌍';
  };

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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analíticas Completas</h1>
          <p className="text-gray-400 mt-1">GA4 + Search Console + Datos de plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="bg-[#12131a] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#12131a] text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Visitas (GA4)</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.pageViews || 0)}</p>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Clicks Orgánicos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.clicks || 0)}</p>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-violet-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Impresiones</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.impressions || 0)}</p>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-1">Posición Promedio</p>
              <p className="text-3xl font-bold text-white">{searchConsoleData?.totals.avgPosition || '—'}</p>
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Usuarios Activos</p>
              <p className="text-xl font-bold text-white">{formatNumber(ga4Data?.metrics.activeUsers || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Sesiones</p>
              <p className="text-xl font-bold text-white">{formatNumber(ga4Data?.metrics.sessions || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">CTR Orgánico</p>
              <p className="text-xl font-bold text-white">{searchConsoleData?.totals.avgCtr || '0'}%</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">% Tráfico Orgánico</p>
              <p className="text-xl font-bold text-emerald-400">{ga4Data?.metrics.organicPercentage || 0}%</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Usuarios Plataforma</p>
              <p className="text-xl font-bold text-white">{platformData?.totalUsers || 0}</p>
            </div>
          </div>

          {/* Quick Views */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Keywords */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Keywords (Search Console)</h3>
              <div className="space-y-3">
                {searchConsoleData?.keywords.slice(0, 5).map((kw, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate flex-1">{kw.query}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{kw.clicks} clicks</span>
                      <span className="text-emerald-400">#{kw.position}</span>
                    </div>
                  </div>
                ))}
                {(!searchConsoleData?.keywords || searchConsoleData.keywords.length === 0) && (
                  <p className="text-gray-500 text-sm">Sin datos de Search Console</p>
                )}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Países (GA4)</h3>
              <div className="space-y-3">
                {ga4Data?.countries.slice(0, 5).map((country, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm flex items-center gap-2">
                      <span>{getCountryFlag(country.country)}</span>
                      {country.country}
                    </span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{country.users} users</span>
                      <span className="text-blue-400">{country.sessions} sessions</span>
                    </div>
                  </div>
                ))}
                {(!ga4Data?.countries || ga4Data.countries.length === 0) && (
                  <p className="text-gray-500 text-sm">Sin datos geográficos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Traffic Tab */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          {/* Traffic KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.activeUsers || 0)}</p>
              <p className="text-emerald-400 text-sm mt-1">+{ga4Data?.metrics.newUsers || 0} nuevos</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Sesiones</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.sessions || 0)}</p>
              <p className="text-blue-400 text-sm mt-1">{ga4Data?.metrics.engagedSessions || 0} comprometidas</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Duración Promedio</p>
              <p className="text-3xl font-bold text-white">{formatDuration(ga4Data?.metrics.avgSessionDuration || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Tasa de Rebote</p>
              <p className="text-3xl font-bold text-white">{(ga4Data?.metrics.bounceRate || 0).toFixed(1)}%</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Páginas Más Visitadas</h3>
              <div className="space-y-3">
                {ga4Data?.topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate flex-1">{page.path || '/'}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white font-medium">{formatNumber(page.views)}</span>
                      <span className="text-gray-500">{formatDuration(page.avgDuration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Canales de Tráfico</h3>
              <div className="space-y-3">
                {ga4Data?.channels.map((channel, i) => {
                  const total = ga4Data.channels.reduce((s, c) => s + c.sessions, 0);
                  const percentage = total > 0 ? ((channel.sessions / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm">{channel.channel}</span>
                        <span className="text-gray-400 text-sm">{percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            channel.channel.toLowerCase().includes('organic') ? 'bg-emerald-500' :
                            channel.channel.toLowerCase().includes('direct') ? 'bg-blue-500' :
                            channel.channel.toLowerCase().includes('social') ? 'bg-pink-500' :
                            channel.channel.toLowerCase().includes('referral') ? 'bg-violet-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Devices */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Dispositivos</h3>
            <div className="grid grid-cols-3 gap-4">
              {ga4Data?.devices.map((device, i) => {
                const Icon = getDeviceIcon(device.device);
                const total = ga4Data.devices.reduce((s, d) => s + d.sessions, 0);
                const percentage = total > 0 ? ((device.sessions / total) * 100).toFixed(1) : '0';
                return (
                  <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                    <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium capitalize">{device.device}</p>
                    <p className="text-2xl font-bold text-white mt-1">{percentage}%</p>
                    <p className="text-gray-500 text-sm">{formatNumber(device.sessions)} sesiones</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Clicks Totales</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.clicks || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Impresiones</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.impressions || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">CTR Promedio</p>
              <p className="text-3xl font-bold text-emerald-400">{searchConsoleData?.totals.avgCtr || '0'}%</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Posición Promedio</p>
              <p className="text-3xl font-bold text-amber-400">{searchConsoleData?.totals.avgPosition || '—'}</p>
            </div>
          </div>

          {/* Keywords Table */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Keywords que Rankean</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium">Keyword</th>
                    <th className="pb-3 font-medium text-right">Clicks</th>
                    <th className="pb-3 font-medium text-right">Impresiones</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {searchConsoleData?.keywords.map((kw, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-3 text-gray-300">{kw.query}</td>
                      <td className="py-3 text-white text-right font-medium">{kw.clicks}</td>
                      <td className="py-3 text-gray-400 text-right">{formatNumber(kw.impressions)}</td>
                      <td className="py-3 text-emerald-400 text-right">{kw.ctr}%</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded text-sm ${
                          parseFloat(kw.position) <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                          parseFloat(kw.position) <= 10 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          #{kw.position}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!searchConsoleData?.keywords || searchConsoleData.keywords.length === 0) && (
                <p className="text-gray-500 text-center py-8">
                  Sin datos de Search Console. Asegúrate de agregar el Service Account a tu propiedad.
                </p>
              )}
            </div>
          </div>

          {/* Pages Performance */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Rendimiento por Página</h3>
            <div className="space-y-3">
              {searchConsoleData?.pages.slice(0, 10).map((page, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50">
                  <span className="text-gray-300 text-sm truncate flex-1">{page.page || '/'}</span>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-white">{page.clicks} clicks</span>
                    <span className="text-gray-500">{formatNumber(page.impressions)} imp</span>
                    <span className="text-emerald-400">{page.ctr}% CTR</span>
                    <span className="text-amber-400">#{page.position}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GEO Tab */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          {/* Countries from GA4 */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tráfico por País (GA4)</h3>
            <div className="space-y-4">
              {ga4Data?.countries.map((country, i) => {
                const maxSessions = Math.max(...(ga4Data.countries.map(c => c.sessions) || [1]));
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white flex items-center gap-2">
                        <span className="text-xl">{getCountryFlag(country.country)}</span>
                        {country.country}
                      </span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">{country.users} usuarios</span>
                        <span className="text-blue-400">{country.sessions} sesiones</span>
                        <span className="text-emerald-400">{(country.engagementRate * 100).toFixed(1)}% eng</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(country.sessions / maxSessions) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {(!ga4Data?.countries || ga4Data.countries.length === 0) && (
                <p className="text-gray-500 text-center py-4">Sin datos geográficos</p>
              )}
            </div>
          </div>

          {/* Countries from Search Console */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Búsquedas por País (Search Console)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium">País</th>
                    <th className="pb-3 font-medium text-right">Clicks</th>
                    <th className="pb-3 font-medium text-right">Impresiones</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Posición Prom.</th>
                  </tr>
                </thead>
                <tbody>
                  {searchConsoleData?.countries.map((country, i) => (
                    <tr key={i} className="border-b border-gray-800/50">
                      <td className="py-3 text-white flex items-center gap-2">
                        <span>{getCountryFlag(country.country)}</span>
                        {country.country}
                      </td>
                      <td className="py-3 text-white text-right font-medium">{country.clicks}</td>
                      <td className="py-3 text-gray-400 text-right">{formatNumber(country.impressions)}</td>
                      <td className="py-3 text-emerald-400 text-right">{country.ctr}%</td>
                      <td className="py-3 text-amber-400 text-right">#{country.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!searchConsoleData?.countries || searchConsoleData.countries.length === 0) && (
                <p className="text-gray-500 text-center py-8">Sin datos de Search Console</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Platform Tab */}
      {activeTab === 'platform' && (
        <div className="space-y-6">
          {/* Platform KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Usuarios Totales</p>
              <p className="text-3xl font-bold text-white">{platformData?.totalUsers || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Herramientas Completadas</p>
              <p className="text-3xl font-bold text-white">{platformData?.totalTools || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Sesiones Este Mes</p>
              <p className="text-3xl font-bold text-white">{platformData?.sessionsThisMonth || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Herramientas/Usuario</p>
              <p className="text-3xl font-bold text-white">{platformData?.toolsPerUser || 0}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* User Registrations */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Registros de Usuarios</h3>
              <div className="flex items-end justify-between gap-3 h-48">
                {platformData?.usersByWeek.map((week, i) => {
                  const maxCount = Math.max(...(platformData.usersByWeek.map(w => w.count) || [1]), 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-400"
                        style={{ height: `${(week.count / maxCount) * 100}%`, minHeight: week.count > 0 ? '8px' : '4px' }}
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{week.week}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Role Distribution */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Distribución por Rol</h3>
              <div className="space-y-4">
                {platformData?.roleDistribution.map((role, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white">{role.role}</span>
                      <span className="text-gray-400">{role.count} ({role.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
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

          {/* Top Tools */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Herramientas Más Usadas</h3>
            <div className="space-y-4">
              {platformData?.topTools.map((tool, i) => {
                const maxCount = Math.max(...(platformData.topTools.map(t => t.completions) || [1]), 1);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm w-6">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white">{tool.name}</span>
                        <span className="text-sm text-gray-500">{tool.completions} completadas</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(tool.completions / maxCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!platformData?.topTools || platformData.topTools.length === 0) && (
                <p className="text-gray-500 text-center py-4">Sin datos de herramientas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
