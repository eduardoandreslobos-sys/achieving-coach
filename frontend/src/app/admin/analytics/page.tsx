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
  TrendingDown,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Target,
  Zap,
  MapPin,
  Languages,
  AlertCircle,
  Award,
  FileText,
  ChevronRight,
  Clock,
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
    returningUsers: number;
    returningPercentage: number;
    sessionsPerUser: number;
  };
  prevMetrics: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
  };
  changes: {
    users: string;
    sessions: string;
    pageViews: string;
    bounceRate: string;
  };
  topPages: { path: string; views: number; avgDuration: number; bounceRate: number; users: number }[];
  landingPages: { page: string; sessions: number; bounceRate: number; avgDuration: number }[];
  sources: { source: string; medium: string; sessions: number; users: number; bounceRate: number }[];
  countries: { country: string; users: number; sessions: number; engagementRate: number; avgDuration: number; pageViews: number }[];
  cities: { city: string; country: string; users: number; sessions: number; engagementRate: number }[];
  citiesByCountry: Record<string, { city: string; country: string; users: number; sessions: number; engagementRate: number }[]>;
  devices: { device: string; users: number; sessions: number; bounceRate: number; avgDuration: number }[];
  browsers: { browser: string; users: number; sessions: number }[];
  channels: { channel: string; sessions: number; users: number; engagementRate: number; conversions: number }[];
  languages: { code: string; language: string; users: number; sessions: number; engagementRate: number }[];
  dailyTrends: { date: string; users: number; sessions: number; pageViews: number }[];
}

interface Keyword {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
  intent: string;
  opportunityScore: number;
  isOpportunity: boolean;
}

interface SearchConsolePage {
  page: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
  keywordCount: number;
  topKeywords: string[];
}

interface SearchConsoleData {
  totals: {
    clicks: number;
    impressions: number;
    avgCtr: string;
    avgPosition: string;
  };
  prevTotals: {
    clicks: number;
    impressions: number;
    avgCtr: string;
    avgPosition: string;
  };
  changes: {
    clicks: string;
    impressions: string;
    ctr: string;
    position: string;
  };
  keywords: Keyword[];
  keywordsByIntent: {
    branded: Keyword[];
    commercial: Keyword[];
    informational: Keyword[];
    comparison: Keyword[];
  };
  opportunityKeywords: Keyword[];
  quickWins: Keyword[];
  topPerformers: Keyword[];
  pages: SearchConsolePage[];
  zeroClickPages: SearchConsolePage[];
  devices: { device: string; clicks: number; impressions: number; ctr: string }[];
  countries: { country: string; clicks: number; impressions: number; ctr: string; position: string }[];
  dailyTrends: { date: string; clicks: number; impressions: number; ctr: string; position: string }[];
}

type TabType = 'overview' | 'traffic' | 'seo' | 'geo' | 'platform';

export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

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
      'Guatemala': '🇬🇹', 'Panama': '🇵🇦', 'Uruguay': '🇺🇾', 'Bolivia': '🇧🇴', 'Paraguay': '🇵🇾',
      'Costa Rica': '🇨🇷', 'Honduras': '🇭🇳', 'El Salvador': '🇸🇻', 'Nicaragua': '🇳🇮',
      'Dominican Republic': '🇩🇴', 'Puerto Rico': '🇵🇷', 'Cuba': '🇨🇺',
    };
    return flags[countryCode] || '🌍';
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'branded': return 'bg-violet-500/20 text-violet-400';
      case 'commercial': return 'bg-amber-500/20 text-amber-400';
      case 'comparison': return 'bg-cyan-500/20 text-cyan-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getIntentLabel = (intent: string) => {
    switch (intent) {
      case 'branded': return 'Marca';
      case 'commercial': return 'Comercial';
      case 'comparison': return 'Comparación';
      default: return 'Info';
    }
  };

  const ChangeIndicator = ({ value, inverse = false }: { value: string; inverse?: boolean }) => {
    const num = parseFloat(value);
    const isPositive = inverse ? num < 0 : num > 0;
    const isNegative = inverse ? num > 0 : num < 0;

    if (num === 0) return null;

    return (
      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-gray-400'}`}>
        {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(num).toFixed(1)}%
      </span>
    );
  };

  // Mini sparkline chart component
  const Sparkline = ({ data, color = 'blue' }: { data: number[]; color?: string }) => {
    if (!data.length) return null;
    const max = Math.max(...data, 1);
    const width = 100;
    const height = 30;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color === 'emerald' ? '#10b981' : color === 'violet' ? '#8b5cf6' : '#3b82f6'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
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
          <p className="text-gray-400 mt-1">GA4 + Search Console + Plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="bg-[#12131a] border border-gray-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={7}>7 días</option>
            <option value={14}>14 días</option>
            <option value={28}>28 días</option>
            <option value={30}>30 días</option>
            <option value={90}>90 días</option>
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
      <div className="flex gap-2 mb-6 border-b border-gray-800 pb-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
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
          {/* Main KPIs with trends */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <ChangeIndicator value={ga4Data?.changes.users || '0'} />
              </div>
              <p className="text-gray-400 text-sm mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.activeUsers || 0)}</p>
              <div className="mt-3">
                <Sparkline data={ga4Data?.dailyTrends.map(d => d.users) || []} color="blue" />
              </div>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-emerald-400" />
                </div>
                <ChangeIndicator value={searchConsoleData?.changes.clicks || '0'} />
              </div>
              <p className="text-gray-400 text-sm mb-1">Clicks Orgánicos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.clicks || 0)}</p>
              <div className="mt-3">
                <Sparkline data={searchConsoleData?.dailyTrends.map(d => d.clicks) || []} color="emerald" />
              </div>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-violet-400" />
                </div>
                <ChangeIndicator value={searchConsoleData?.changes.impressions || '0'} />
              </div>
              <p className="text-gray-400 text-sm mb-1">Impresiones</p>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.impressions || 0)}</p>
              <div className="mt-3">
                <Sparkline data={searchConsoleData?.dailyTrends.map(d => d.impressions) || []} color="violet" />
              </div>
            </div>

            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-400" />
                </div>
                <ChangeIndicator value={searchConsoleData?.changes.position || '0'} />
              </div>
              <p className="text-gray-400 text-sm mb-1">Posición Promedio</p>
              <p className="text-3xl font-bold text-white">{searchConsoleData?.totals.avgPosition || '—'}</p>
              <p className="text-xs text-gray-500 mt-2">CTR: {searchConsoleData?.totals.avgCtr || '0'}%</p>
            </div>
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Sesiones</p>
              <p className="text-xl font-bold text-white">{formatNumber(ga4Data?.metrics.sessions || 0)}</p>
              <ChangeIndicator value={ga4Data?.changes.sessions || '0'} />
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Page Views</p>
              <p className="text-xl font-bold text-white">{formatNumber(ga4Data?.metrics.pageViews || 0)}</p>
              <ChangeIndicator value={ga4Data?.changes.pageViews || '0'} />
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">% Orgánico</p>
              <p className="text-xl font-bold text-emerald-400">{ga4Data?.metrics.organicPercentage || 0}%</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Nuevos</p>
              <p className="text-xl font-bold text-white">{formatNumber(ga4Data?.metrics.newUsers || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Bounce Rate</p>
              <p className="text-xl font-bold text-white">{(ga4Data?.metrics.bounceRate || 0).toFixed(1)}%</p>
              <ChangeIndicator value={ga4Data?.changes.bounceRate || '0'} inverse />
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">Duración Prom.</p>
              <p className="text-xl font-bold text-white">{formatDuration(ga4Data?.metrics.avgSessionDuration || 0)}</p>
            </div>
          </div>

          {/* Quick insights */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Performers */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">Top Keywords</h3>
              </div>
              <div className="space-y-3">
                {searchConsoleData?.topPerformers.slice(0, 5).map((kw, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate flex-1 pr-2">{kw.query}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-white font-medium">{kw.clicks}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        parseFloat(kw.position) <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                        parseFloat(kw.position) <= 10 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>#{kw.position}</span>
                    </div>
                  </div>
                ))}
                {(!searchConsoleData?.topPerformers?.length) && (
                  <p className="text-gray-500 text-sm">Sin datos</p>
                )}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Quick Wins</h3>
              </div>
              <p className="text-gray-500 text-xs mb-3">Keywords en posición 4-20 con potencial</p>
              <div className="space-y-3">
                {searchConsoleData?.quickWins.slice(0, 5).map((kw, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm truncate flex-1 pr-2">{kw.query}</span>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{kw.impressions} imp</span>
                      <span className="text-amber-400">#{kw.position}</span>
                    </div>
                  </div>
                ))}
                {(!searchConsoleData?.quickWins?.length) && (
                  <p className="text-gray-500 text-sm">Sin datos</p>
                )}
              </div>
            </div>

            {/* Top Countries */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Top Mercados</h3>
              </div>
              <div className="space-y-3">
                {ga4Data?.countries.slice(0, 5).map((country, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm flex items-center gap-2">
                      <span>{getCountryFlag(country.country)}</span>
                      {country.country}
                    </span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-white">{country.users}</span>
                      <span className="text-emerald-400">{(country.engagementRate * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
                {(!ga4Data?.countries?.length) && (
                  <p className="text-gray-500 text-sm">Sin datos</p>
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Usuarios Activos</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.activeUsers || 0)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-emerald-400 text-sm">+{ga4Data?.metrics.newUsers || 0} nuevos</span>
                <ChangeIndicator value={ga4Data?.changes.users || '0'} />
              </div>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Sesiones</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.sessions || 0)}</p>
              <p className="text-blue-400 text-sm mt-2">{ga4Data?.metrics.sessionsPerUser?.toFixed(1) || 0} por usuario</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Page Views</p>
              <p className="text-3xl font-bold text-white">{formatNumber(ga4Data?.metrics.pageViews || 0)}</p>
              <ChangeIndicator value={ga4Data?.changes.pageViews || '0'} />
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Duración Promedio</p>
              <p className="text-3xl font-bold text-white">{formatDuration(ga4Data?.metrics.avgSessionDuration || 0)}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Tasa de Rebote</p>
              <p className="text-3xl font-bold text-white">{(ga4Data?.metrics.bounceRate || 0).toFixed(1)}%</p>
              <ChangeIndicator value={ga4Data?.changes.bounceRate || '0'} inverse />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Páginas Más Visitadas</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {ga4Data?.topPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50">
                    <span className="text-gray-300 text-sm truncate flex-1 pr-4">{page.path || '/'}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white font-medium">{formatNumber(page.views)}</span>
                      <span className="text-gray-500 w-12 text-right">{formatDuration(page.avgDuration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Canales de Tráfico</h3>
              <div className="space-y-4">
                {ga4Data?.channels.map((channel, i) => {
                  const total = ga4Data.channels.reduce((s, c) => s + c.sessions, 0);
                  const percentage = total > 0 ? ((channel.sessions / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-sm">{channel.channel}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">{formatNumber(channel.sessions)}</span>
                          <span className="text-white font-medium w-12 text-right">{percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            channel.channel.toLowerCase().includes('organic') ? 'bg-emerald-500' :
                            channel.channel.toLowerCase().includes('direct') ? 'bg-blue-500' :
                            channel.channel.toLowerCase().includes('social') ? 'bg-pink-500' :
                            channel.channel.toLowerCase().includes('referral') ? 'bg-violet-500' :
                            channel.channel.toLowerCase().includes('paid') ? 'bg-amber-500' :
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

          {/* Devices & Landing Pages */}
          <div className="grid lg:grid-cols-2 gap-6">
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
                      <p className="text-gray-500 text-xs">{formatNumber(device.sessions)} sesiones</p>
                      <p className="text-gray-500 text-xs">{formatDuration(device.avgDuration)} prom</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Landing Pages */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Páginas de Entrada</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {ga4Data?.landingPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50">
                    <span className="text-gray-300 text-sm truncate flex-1 pr-4">{page.page || '/'}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white">{page.sessions}</span>
                      <span className={`${page.bounceRate > 70 ? 'text-red-400' : page.bounceRate > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {page.bounceRate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab - Completely redesigned */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO KPIs with comparison */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Clicks Totales</p>
                <ChangeIndicator value={searchConsoleData?.changes.clicks || '0'} />
              </div>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.clicks || 0)}</p>
              <p className="text-gray-500 text-xs mt-1">vs {formatNumber(searchConsoleData?.prevTotals.clicks || 0)} período anterior</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Impresiones</p>
                <ChangeIndicator value={searchConsoleData?.changes.impressions || '0'} />
              </div>
              <p className="text-3xl font-bold text-white">{formatNumber(searchConsoleData?.totals.impressions || 0)}</p>
              <p className="text-gray-500 text-xs mt-1">vs {formatNumber(searchConsoleData?.prevTotals.impressions || 0)} período anterior</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">CTR Promedio</p>
                <span className={`text-xs ${parseFloat(searchConsoleData?.changes.ctr || '0') >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {parseFloat(searchConsoleData?.changes.ctr || '0') >= 0 ? '+' : ''}{searchConsoleData?.changes.ctr || '0'}%
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">{searchConsoleData?.totals.avgCtr || '0'}%</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400 text-sm">Posición Promedio</p>
                <ChangeIndicator value={searchConsoleData?.changes.position || '0'} />
              </div>
              <p className="text-3xl font-bold text-amber-400">{searchConsoleData?.totals.avgPosition || '—'}</p>
            </div>
          </div>

          {/* Keyword Intent Distribution */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Distribución por Intención de Búsqueda</h3>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(searchConsoleData?.keywordsByIntent || {}).map(([intent, keywords]) => (
                <div key={intent} className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <span className={`inline-block px-2 py-1 rounded text-xs mb-2 ${getIntentColor(intent)}`}>
                    {getIntentLabel(intent)}
                  </span>
                  <p className="text-2xl font-bold text-white">{keywords.length}</p>
                  <p className="text-gray-500 text-xs">keywords</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {keywords.reduce((s, k) => s + k.clicks, 0)} clicks
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Opportunity Keywords */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Oportunidades SEO</h3>
              </div>
              <p className="text-gray-500 text-xs mb-4">Keywords con alto potencial de mejora de CTR</p>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {searchConsoleData?.opportunityKeywords.map((kw, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm truncate flex-1">{kw.query}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${getIntentColor(kw.intent)}`}>
                        {getIntentLabel(kw.intent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{formatNumber(kw.impressions)} imp</span>
                        <span className="text-gray-500">{kw.clicks} clicks</span>
                        <span className="text-red-400">{kw.ctr}% CTR</span>
                      </div>
                      <span className="text-amber-400">#{kw.position}</span>
                    </div>
                  </div>
                ))}
                {(!searchConsoleData?.opportunityKeywords?.length) && (
                  <p className="text-gray-500 text-sm text-center py-4">Sin oportunidades detectadas</p>
                )}
              </div>
            </div>

            {/* Quick Wins */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Quick Wins</h3>
              </div>
              <p className="text-gray-500 text-xs mb-4">Keywords en posición 4-20 - un pequeño push puede llevarlas al top 3</p>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {searchConsoleData?.quickWins.map((kw, i) => (
                  <div key={i} className="bg-[#0a0a0a] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm truncate flex-1">{kw.query}</span>
                      <span className="text-amber-400 font-medium">#{kw.position}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-500">{formatNumber(kw.impressions)} imp</span>
                      <span className="text-gray-500">{kw.clicks} clicks</span>
                      <span className="text-emerald-400">{kw.ctr}% CTR</span>
                    </div>
                  </div>
                ))}
                {(!searchConsoleData?.quickWins?.length) && (
                  <p className="text-gray-500 text-sm text-center py-4">Sin quick wins detectados</p>
                )}
              </div>
            </div>
          </div>

          {/* All Keywords Table */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Todas las Keywords ({searchConsoleData?.keywords.length || 0})</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm border-b border-gray-800">
                    <th className="pb-3 font-medium">Keyword</th>
                    <th className="pb-3 font-medium">Intent</th>
                    <th className="pb-3 font-medium text-right">Clicks</th>
                    <th className="pb-3 font-medium text-right">Impresiones</th>
                    <th className="pb-3 font-medium text-right">CTR</th>
                    <th className="pb-3 font-medium text-right">Posición</th>
                  </tr>
                </thead>
                <tbody>
                  {searchConsoleData?.keywords.slice(0, 25).map((kw, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                      <td className="py-3 text-gray-300">{kw.query}</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getIntentColor(kw.intent)}`}>
                          {getIntentLabel(kw.intent)}
                        </span>
                      </td>
                      <td className="py-3 text-white text-right font-medium">{kw.clicks}</td>
                      <td className="py-3 text-gray-400 text-right">{formatNumber(kw.impressions)}</td>
                      <td className="py-3 text-emerald-400 text-right">{kw.ctr}%</td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-1 rounded text-sm ${
                          parseFloat(kw.position) <= 3 ? 'bg-emerald-500/20 text-emerald-400' :
                          parseFloat(kw.position) <= 10 ? 'bg-blue-500/20 text-blue-400' :
                          parseFloat(kw.position) <= 20 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          #{kw.position}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!searchConsoleData?.keywords?.length) && (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500">Sin datos de Search Console</p>
                  <p className="text-gray-600 text-sm">Agrega el Service Account a tu propiedad de Search Console</p>
                </div>
              )}
            </div>
          </div>

          {/* Pages Performance */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Rendimiento por Página</h3>
            </div>
            <div className="space-y-4">
              {searchConsoleData?.pages.slice(0, 15).map((page, i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm truncate flex-1">{page.page || '/'}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white font-medium">{page.clicks} clicks</span>
                      <span className="text-gray-500">{formatNumber(page.impressions)} imp</span>
                      <span className="text-emerald-400">{page.ctr}%</span>
                      <span className="text-amber-400">#{page.position}</span>
                    </div>
                  </div>
                  {page.topKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {page.topKeywords.slice(0, 3).map((kw, j) => (
                        <span key={j} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                          {kw}
                        </span>
                      ))}
                      {page.keywordCount > 3 && (
                        <span className="text-xs text-gray-500">+{page.keywordCount - 3} más</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Zero Click Pages */}
          {searchConsoleData?.zeroClickPages && searchConsoleData.zeroClickPages.length > 0 && (
            <div className="bg-[#12131a] border border-red-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Páginas sin Clicks (con impresiones)</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4">Estas páginas tienen visibilidad pero no generan clicks - optimiza sus títulos y meta descripciones</p>
              <div className="space-y-3">
                {searchConsoleData.zeroClickPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800/50">
                    <span className="text-gray-300 text-sm truncate flex-1">{page.page}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{formatNumber(page.impressions)} impresiones</span>
                      <span className="text-red-400">0% CTR</span>
                      <span className="text-amber-400">#{page.position}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* GEO Tab - Completely redesigned */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          {/* GEO Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Países Activos</p>
              <p className="text-3xl font-bold text-white">{ga4Data?.countries.length || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Ciudades Activas</p>
              <p className="text-3xl font-bold text-white">{ga4Data?.cities.length || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Idiomas Detectados</p>
              <p className="text-3xl font-bold text-white">{ga4Data?.languages.length || 0}</p>
            </div>
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-400 text-sm mb-1">Top Mercado</p>
              <p className="text-3xl font-bold text-white flex items-center gap-2">
                <span>{getCountryFlag(ga4Data?.countries[0]?.country || '')}</span>
                <span className="text-lg">{ga4Data?.countries[0]?.country || '—'}</span>
              </p>
            </div>
          </div>

          {/* Countries with expandable cities */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Tráfico por País</h3>
            </div>
            <div className="space-y-4">
              {ga4Data?.countries.map((country, i) => {
                const maxSessions = Math.max(...(ga4Data.countries.map(c => c.sessions) || [1]));
                const isExpanded = expandedCountry === country.country;
                const countryCities = ga4Data.citiesByCountry[country.country] || [];

                return (
                  <div key={i} className="bg-[#0a0a0a] rounded-xl overflow-hidden">
                    <div
                      className={`p-4 cursor-pointer hover:bg-gray-800/30 transition-colors ${countryCities.length > 0 ? '' : 'cursor-default'}`}
                      onClick={() => countryCities.length > 0 && setExpandedCountry(isExpanded ? null : country.country)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {countryCities.length > 0 && (
                            <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          )}
                          <span className="text-xl">{getCountryFlag(country.country)}</span>
                          <span className="text-white font-medium">{country.country}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-right">
                            <span className="text-white font-medium">{country.users}</span>
                            <span className="text-gray-500 ml-1">users</span>
                          </div>
                          <div className="text-right">
                            <span className="text-blue-400">{country.sessions}</span>
                            <span className="text-gray-500 ml-1">sessions</span>
                          </div>
                          <div className="text-right">
                            <span className="text-emerald-400">{(country.engagementRate * 100).toFixed(0)}%</span>
                            <span className="text-gray-500 ml-1">eng</span>
                          </div>
                          <div className="text-right hidden lg:block">
                            <span className="text-gray-400">{formatDuration(country.avgDuration)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(country.sessions / maxSessions) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Expanded cities */}
                    {isExpanded && countryCities.length > 0 && (
                      <div className="border-t border-gray-800 p-4 bg-[#12131a]">
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-400">Ciudades en {country.country}</span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                          {countryCities.slice(0, 9).map((city, j) => (
                            <div key={j} className="bg-[#0a0a0a] rounded-lg p-3">
                              <p className="text-white text-sm font-medium">{city.city}</p>
                              <div className="flex items-center gap-3 mt-1 text-xs">
                                <span className="text-gray-500">{city.users} users</span>
                                <span className="text-blue-400">{city.sessions} sessions</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {(!ga4Data?.countries?.length) && (
                <p className="text-gray-500 text-center py-4">Sin datos geográficos</p>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Languages */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-violet-400" />
                <h3 className="text-lg font-semibold text-white">Idiomas</h3>
              </div>
              <div className="space-y-3">
                {ga4Data?.languages.slice(0, 10).map((lang, i) => {
                  const total = ga4Data.languages.reduce((s, l) => s + l.sessions, 0);
                  const percentage = total > 0 ? ((lang.sessions / total) * 100).toFixed(1) : '0';
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">{lang.language}</span>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{lang.users} users</span>
                        <span className="text-white font-medium w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search Console Countries */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Búsquedas por País</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs border-b border-gray-800">
                      <th className="pb-2 font-medium">País</th>
                      <th className="pb-2 font-medium text-right">Clicks</th>
                      <th className="pb-2 font-medium text-right">Imp.</th>
                      <th className="pb-2 font-medium text-right">CTR</th>
                      <th className="pb-2 font-medium text-right">Pos.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchConsoleData?.countries.slice(0, 10).map((country, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-2 text-white text-sm flex items-center gap-2">
                          <span>{getCountryFlag(country.country)}</span>
                          {country.country}
                        </td>
                        <td className="py-2 text-white text-right text-sm font-medium">{country.clicks}</td>
                        <td className="py-2 text-gray-400 text-right text-sm">{formatNumber(country.impressions)}</td>
                        <td className="py-2 text-emerald-400 text-right text-sm">{country.ctr}%</td>
                        <td className="py-2 text-amber-400 text-right text-sm">#{country.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!searchConsoleData?.countries?.length) && (
                  <p className="text-gray-500 text-center py-4 text-sm">Sin datos de Search Console</p>
                )}
              </div>
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-semibold text-white">Top 20 Ciudades</h3>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {ga4Data?.cities.slice(0, 20).map((city, i) => (
                <div key={i} className="bg-[#0a0a0a] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{getCountryFlag(city.country)}</span>
                    <span className="text-white text-sm font-medium truncate">{city.city}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">{city.users} users</span>
                    <span className="text-blue-400">{city.sessions} sessions</span>
                  </div>
                </div>
              ))}
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
                        style={{ height: `${Math.max((week.count / maxCount) * 100, 4)}%` }}
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
              {(!platformData?.topTools?.length) && (
                <p className="text-gray-500 text-center py-4">Sin datos de herramientas</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
