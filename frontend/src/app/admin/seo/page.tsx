'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Globe, 
  Link2, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Download,
  ChevronRight,
  Eye,
  MousePointer,
  Target,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

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

export default function SEOAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [searchData, setSearchData] = useState<SearchConsoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('28');

  useEffect(() => {
    loadAllData();
  }, [timeRange]);

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [analyticsRes, searchRes] = await Promise.all([
        fetch(`/api/analytics?days=${timeRange}`),
        fetch(`/api/search-console?days=${timeRange}`),
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
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading SEO data from Google APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time data from Google Analytics & Search Console</p>
        </div>
        <button
          onClick={loadAllData}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 mb-6">
        {[
          { value: '7', label: 'Last 7 Days' },
          { value: '28', label: 'Last 28 Days' },
          { value: '90', label: 'Last 90 Days' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">Some data may be unavailable: {error}</p>
        </div>
      )}

      {/* Search Console Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Total Clicks</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {searchData?.metrics.totalClicks.toLocaleString() || '0'}
          </div>
          <p className="text-xs text-gray-500 mt-1">From Google Search</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Impressions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {searchData?.metrics.totalImpressions.toLocaleString() || '0'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Times shown in search</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Average CTR</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {searchData?.metrics.averageCtr || '0'}%
          </div>
          <p className="text-xs text-gray-500 mt-1">Click-through rate</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Avg. Position</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {searchData?.metrics.averagePosition || '0'}
          </div>
          <p className="text-xs text-gray-500 mt-1">In search results</p>
        </div>
      </div>

      {/* Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
          <span className="text-sm text-blue-700">Active Users</span>
          <div className="text-3xl font-bold text-blue-900 mt-1">
            {analyticsData?.metrics.activeUsers.toLocaleString() || '0'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <span className="text-sm text-green-700">Sessions</span>
          <div className="text-3xl font-bold text-green-900 mt-1">
            {analyticsData?.metrics.sessions.toLocaleString() || '0'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6">
          <span className="text-sm text-purple-700">Page Views</span>
          <div className="text-3xl font-bold text-purple-900 mt-1">
            {analyticsData?.metrics.pageViews.toLocaleString() || '0'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-6">
          <span className="text-sm text-orange-700">Avg. Session</span>
          <div className="text-3xl font-bold text-orange-900 mt-1">
            {formatDuration(analyticsData?.metrics.avgSessionDuration || 0)}
          </div>
        </div>
      </div>

      {/* Keyword Performance - Real Data */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Keyword Performance</h2>
          <p className="text-sm text-gray-500">Real keywords from Google Search Console</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Keyword</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Impressions</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">CTR</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {searchData?.keywords && searchData.keywords.length > 0 ? (
                searchData.keywords.map((kw, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">"{kw.keyword}"</td>
                    <td className="px-6 py-4 text-center text-gray-600">{kw.clicks}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{kw.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{kw.ctr}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(kw.position) <= 10 ? 'bg-green-100 text-green-700' :
                        parseFloat(kw.position) <= 20 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {kw.position}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No keyword data yet. Data typically appears 48-72 hours after site verification.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Pages from Search */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Pages (Search)</h2>
            <p className="text-sm text-gray-500">Best performing pages in Google Search</p>
          </div>
          <div className="p-6 space-y-4">
            {searchData?.pages && searchData.pages.length > 0 ? (
              searchData.pages.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate text-sm">{page.page || '/'}</p>
                    <p className="text-xs text-gray-500">{page.clicks} clicks · {page.impressions} impressions</p>
                  </div>
                  <span className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                    parseFloat(page.position) <= 10 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    Pos {page.position}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Globe className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No page data available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Pages from Analytics */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Pages (Analytics)</h2>
            <p className="text-sm text-gray-500">Most visited pages on your site</p>
          </div>
          <div className="p-6 space-y-4">
            {analyticsData?.topPages && analyticsData.topPages.length > 0 ? (
              analyticsData.topPages.slice(0, 5).map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate text-sm">{page.path}</p>
                    <p className="text-xs text-gray-500">Avg. {formatDuration(page.avgDuration)} on page</p>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-700">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No analytics data available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      {analyticsData?.sources && analyticsData.sources.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Traffic Sources</h2>
            <p className="text-sm text-gray-500">Where your visitors come from</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {analyticsData.sources.map((source, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{source.sessions}</p>
                  <p className="text-sm text-gray-600 capitalize">{source.source || 'direct'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <a 
          href="https://search.google.com/search-console?resource_id=sc-domain:achievingcoach.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Google Search Console</span>
          </div>
          <ExternalLink className="w-5 h-5 text-gray-400" />
        </a>

        <a 
          href="https://analytics.google.com/analytics/web/#/p514516891"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <span className="font-medium text-gray-900">Google Analytics</span>
          </div>
          <ExternalLink className="w-5 h-5 text-gray-400" />
        </a>

        <Link 
          href="/admin/blog"
          className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Link2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Manage Content</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>
      </div>
    </div>
  );
}
