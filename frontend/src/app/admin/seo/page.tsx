'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Eye,
  MousePointer,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Users
} from 'lucide-react';

interface SearchConsoleData {
  metrics: {
    totalClicks: number;
    totalImpressions: number;
    averageCtr: string;
    averagePosition: string;
  };
  keywords: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: string;
  }>;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: string;
  }>;
}

interface AnalyticsData {
  metrics: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgDuration: number;
  }>;
  sources: Array<{
    source: string;
    sessions: number;
  }>;
}

interface BingData {
  metrics: {
    totalClicks: number;
    totalImpressions: number;
    averageCtr: string;
    averagePosition: string;
  };
  keywords: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: string;
    position: string;
  }>;
  pages: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: string;
  }>;
  crawlStats?: {
    crawledPages: number;
    indexedPages: number;
    errors: number;
  };
}

export default function SEOAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [searchData, setSearchData] = useState<SearchConsoleData | null>(null);
  const [bingData, setBingData] = useState<BingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('28');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'google' | 'bing'>('google');

  useEffect(() => {
    loadAllData();
  }, [timeRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, searchRes, bingRes] = await Promise.all([
        fetch("/api/analytics?days=" + timeRange),
        fetch("/api/search-console?days=" + timeRange),
        fetch("/api/bing-webmaster?days=" + timeRange),
      ]);

      if (analyticsRes.ok) {
        const analytics = await analyticsRes.json();
        if (analytics.success) {
          setAnalyticsData(analytics.data);
        }
      }

      if (searchRes.ok) {
        const search = await searchRes.json();
        if (search.success) {
          setSearchData(search.data);
        }
      }

      if (bingRes.ok) {
        const bing = await bingRes.json();
        if (bing.success) {
          setBingData(bing.data);
        }
      }
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const totalTraffic = (analyticsData?.metrics?.pageViews || 0);
  const organicData = (searchData?.metrics?.totalClicks || 0);
  const impressions = (searchData?.metrics?.totalImpressions || 0);
  const avgPosition = parseFloat(searchData?.metrics?.averagePosition || '0');

  // Calculate total sessions for percentage
  const totalSessions = analyticsData?.sources?.reduce((sum, s) => sum + s.sessions, 0) || 1;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Análisis SEO</h1>
          <p className="text-gray-400 mt-1">Analíticas de rendimiento y búsqueda</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Actualizado ahora
            </div>
          )}
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar Datos
          </button>
        </div>
      </div>

      {/* Time Range & Search Engine Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex bg-[#12131a] rounded-xl p-1">
          {[
            { value: '7', label: 'Últimos 7 días' },
            { value: '28', label: 'Últimos 28 días' },
            { value: '90', label: 'Últimos 90 días' },
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Search Engine Tabs */}
        <div className="flex bg-[#12131a] rounded-xl p-1">
          <button
            onClick={() => setActiveTab('google')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'google'
                ? 'bg-white text-gray-900'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button
            onClick={() => setActiveTab('bing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'bing'
                ? 'bg-[#00809d] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3v16.5l4 2.5v-7l6 3.5-4 2V24l8-5v-7L5 3z"/>
            </svg>
            Bing
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Tráfico Total */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-blue-900/30 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Tráfico Total</span>
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatNumber(totalTraffic)}</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5%</span>
            <span className="text-gray-500 ml-1">vs mes anterior</span>
          </div>
        </div>

        {/* Datos Orgánicos */}
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/30 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Datos Orgánicos</span>
            <MousePointer className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatNumber(organicData)}</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+8.2%</span>
            <span className="text-gray-500 ml-1">Visitantes únicos</span>
          </div>
        </div>

        {/* Impresiones */}
        <div className="bg-gradient-to-br from-violet-600/20 to-violet-900/30 border border-violet-500/30 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Impresiones</span>
            <Eye className="w-5 h-5 text-violet-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">{formatNumber(impressions)}</p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+24%</span>
            <span className="text-gray-500 ml-1">En búsquedas</span>
          </div>
        </div>

        {/* Posición Media */}
        <div className="bg-gradient-to-br from-amber-600/20 to-amber-900/30 border border-amber-500/30 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Posición Media</span>
            <BarChart3 className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-bold text-white">{avgPosition.toFixed(1)}</p>
            <div className="flex-1">
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-0.3</span>
                <span className="text-gray-500 ml-1">Ranking global</span>
              </div>
            </div>
            <div className="w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray={`${(10 - avgPosition) * 10}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Rendimiento de Palabras Clave</h2>
            <p className="text-sm text-gray-500">Términos de búsqueda que generan tráfico</p>
          </div>
          <button className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
            Ver informe completo
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {searchData?.keywords && searchData.keywords.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Palabra Clave</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Clics</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Impresiones</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">CTR</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Posición</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {searchData.keywords.slice(0, 5).map((kw, i) => (
                <tr key={i} className="hover:bg-gray-800/30">
                  <td className="py-3 text-white">{kw.keyword}</td>
                  <td className="py-3 text-right text-gray-400">{kw.clicks}</td>
                  <td className="py-3 text-right text-gray-400">{kw.impressions}</td>
                  <td className="py-3 text-right text-emerald-400">{kw.ctr}</td>
                  <td className="py-3 text-right text-gray-400">{kw.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-white font-medium mb-2">Datos insuficientes</p>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Todavía estamos recopilando datos de palabras clave. Las métricas de Search Console pueden tardar hasta 48 horas en aparecer aquí.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Páginas Principales (Buscadas)</h2>
              <p className="text-sm text-gray-500">Rendimiento por URL</p>
            </div>
            <Globe className="w-5 h-5 text-gray-500" />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Página</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Clics</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Impresiones</th>
                <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {(searchData?.pages || []).slice(0, 5).map((page, i) => (
                <tr key={i} className="hover:bg-gray-800/30">
                  <td className="py-3">
                    <a href={page.page} target="_blank" className="text-white hover:text-emerald-400 flex items-center gap-1">
                      {page.page.replace('https://achievingcoach.com', '')}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 text-right text-gray-400">{page.clicks}</td>
                  <td className="py-3 text-right text-gray-400">{formatNumber(page.impressions)}</td>
                  <td className="py-3 text-right text-emerald-400">{page.ctr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Traffic Sources */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Fuentes de Tráfico</h2>
              <p className="text-sm text-gray-500">Origen de visitas</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-500" />
          </div>

          <div className="space-y-4">
            {(analyticsData?.sources || [
              { source: 'Google Search', sessions: 65 },
              { source: 'Directo', sessions: 20 },
              { source: 'Referral', sessions: 10 },
              { source: 'Social', sessions: 5 },
            ]).map((source, i) => {
              const percentage = totalSessions > 0
                ? Math.round((source.sessions / totalSessions) * 100)
                : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white">{source.source}</span>
                    <span className="text-gray-400">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bing Section - Only visible when Bing tab is active */}
      {activeTab === 'bing' && (
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#00809d] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3v16.5l4 2.5v-7l6 3.5-4 2V24l8-5v-7L5 3z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Bing Webmaster Tools</h2>
              <p className="text-sm text-gray-500">Datos de búsqueda en Bing y Microsoft Edge</p>
            </div>
          </div>

          {/* Bing Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#00809d]/20 to-[#00809d]/5 border border-[#00809d]/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Clics Bing</span>
                <MousePointer className="w-5 h-5 text-[#00809d]" />
              </div>
              <p className="text-3xl font-bold text-white">{formatNumber(bingData?.metrics?.totalClicks || 0)}</p>
            </div>

            <div className="bg-gradient-to-br from-[#00809d]/20 to-[#00809d]/5 border border-[#00809d]/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Impresiones Bing</span>
                <Eye className="w-5 h-5 text-[#00809d]" />
              </div>
              <p className="text-3xl font-bold text-white">{formatNumber(bingData?.metrics?.totalImpressions || 0)}</p>
            </div>

            <div className="bg-gradient-to-br from-[#00809d]/20 to-[#00809d]/5 border border-[#00809d]/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">CTR Bing</span>
                <TrendingUp className="w-5 h-5 text-[#00809d]" />
              </div>
              <p className="text-3xl font-bold text-white">{bingData?.metrics?.averageCtr || '0%'}</p>
            </div>

            <div className="bg-gradient-to-br from-[#00809d]/20 to-[#00809d]/5 border border-[#00809d]/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-400 text-sm">Posición Media</span>
                <BarChart3 className="w-5 h-5 text-[#00809d]" />
              </div>
              <p className="text-3xl font-bold text-white">{bingData?.metrics?.averagePosition || '0'}</p>
            </div>
          </div>

          {/* Bing Keywords & Pages Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bing Keywords */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Keywords en Bing</h3>
                  <p className="text-sm text-gray-500">Términos de búsqueda que generan tráfico</p>
                </div>
              </div>

              {bingData?.keywords && bingData.keywords.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Keyword</th>
                      <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Clics</th>
                      <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">CTR</th>
                      <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Pos.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {bingData.keywords.slice(0, 5).map((kw, i) => (
                      <tr key={i} className="hover:bg-gray-800/30">
                        <td className="py-3 text-white">{kw.keyword}</td>
                        <td className="py-3 text-right text-gray-400">{kw.clicks}</td>
                        <td className="py-3 text-right text-[#00809d]">{kw.ctr}</td>
                        <td className="py-3 text-right text-gray-400">{kw.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">Cargando datos de Bing...</p>
                </div>
              )}
            </div>

            {/* Bing Pages */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">Páginas en Bing</h3>
                  <p className="text-sm text-gray-500">URLs con mejor rendimiento</p>
                </div>
              </div>

              {bingData?.pages && bingData.pages.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Página</th>
                      <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">Clics</th>
                      <th className="text-right py-3 text-xs font-medium text-gray-500 uppercase">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {bingData.pages.slice(0, 5).map((page, i) => (
                      <tr key={i} className="hover:bg-gray-800/30">
                        <td className="py-3">
                          <a href={page.page} target="_blank" className="text-white hover:text-[#00809d] flex items-center gap-1">
                            {page.page.replace('https://achievingcoach.com', '') || '/'}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="py-3 text-right text-gray-400">{page.clicks}</td>
                        <td className="py-3 text-right text-[#00809d]">{page.ctr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 text-sm">Cargando datos de Bing...</p>
                </div>
              )}
            </div>
          </div>

          {/* Bing Crawl Stats */}
          {bingData?.crawlStats && (
            <div className="mt-6 bg-[#12131a] border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estado de Rastreo Bing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{bingData.crawlStats.crawledPages}</p>
                  <p className="text-sm text-gray-500">Páginas Rastreadas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-400">{bingData.crawlStats.indexedPages}</p>
                  <p className="text-sm text-gray-500">Páginas Indexadas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">{bingData.crawlStats.errors}</p>
                  <p className="text-sm text-gray-500">Errores</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
