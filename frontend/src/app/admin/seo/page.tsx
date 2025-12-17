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
  BarChart3,
  XCircle,
  Info,
  FileSearch,
  Clock
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

interface AuditIssue {
  type: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  page?: string;
  details?: string;
}

interface PageAudit {
  url: string;
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  h1Count: number;
  h1Text: string[];
  imagesWithoutAlt: number;
  totalImages: number;
  internalLinks: number;
  externalLinks: number;
  hasCanonical: boolean;
  hasOpenGraph: boolean;
  loadTime: number;
}

interface AuditData {
  scannedAt: string;
  totalPages: number;
  totalIssues: number;
  score: number;
  issues: AuditIssue[];
  pages: PageAudit[];
}

export default function SEOAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [searchData, setSearchData] = useState<SearchConsoleData | null>(null);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('28');
  const [activeTab, setActiveTab] = useState<'overview' | 'audit'>('overview');

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
      setError('Failed to load some data');
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await fetch('/api/seo-audit');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAuditData(data.data);
        }
      }
    } catch (err) {
      console.error('Audit error:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading SEO data from Google APIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Analytics</h1>
          <p className="text-gray-600">Real-time data from Google Analytics & Search Console</p>
        </div>
        <button
          onClick={loadAllData}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'audit'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Technical Audit
        </button>
      </div>

      {/* Time Range Selector (only for overview) */}
      {activeTab === 'overview' && (
        <div className="flex gap-2 mb-6">
          {[
            { value: '7', label: 'Last 7 Days' },
            { value: '28', label: 'Last 28 Days' },
            { value: '90', label: 'Last 90 Days' },
          ].map(range => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">{error}</span>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {/* Search Console Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MousePointer className="w-4 h-4" />
                <span className="text-sm">Total Clicks</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {searchData?.metrics?.totalClicks || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">From Google Search</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Impressions</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {searchData?.metrics?.totalImpressions || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Times shown in search</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">Average CTR</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {searchData?.metrics?.averageCtr || '0%'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Click-through rate</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm">Avg. Position</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {searchData?.metrics?.averagePosition || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">In search results</p>
            </div>
          </div>

          {/* Analytics Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-3xl font-bold mt-1">
                {analyticsData?.metrics?.activeUsers || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <p className="text-sm opacity-90">Sessions</p>
              <p className="text-3xl font-bold mt-1">
                {analyticsData?.metrics?.sessions || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <p className="text-sm opacity-90">Page Views</p>
              <p className="text-3xl font-bold mt-1">
                {analyticsData?.metrics?.pageViews || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <p className="text-sm opacity-90">Avg. Session</p>
              <p className="text-3xl font-bold mt-1">
                {formatDuration(analyticsData?.metrics?.avgSessionDuration || 0)}
              </p>
            </div>
          </div>

          {/* Keywords Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keyword Performance</h2>
            <p className="text-sm text-gray-500 mb-4">Real keywords from Google Search Console</p>
            
            {searchData?.keywords && searchData.keywords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3 font-medium">KEYWORD</th>
                      <th className="pb-3 font-medium">CLICKS</th>
                      <th className="pb-3 font-medium">IMPRESSIONS</th>
                      <th className="pb-3 font-medium">CTR</th>
                      <th className="pb-3 font-medium">POSITION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchData.keywords.map((kw, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900">"{kw.keyword}"</td>
                        <td className="py-3 text-gray-700">{kw.clicks}</td>
                        <td className="py-3 text-gray-700">{kw.impressions}</td>
                        <td className="py-3 text-gray-700">{kw.ctr}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            parseFloat(kw.position) <= 10 ? 'bg-green-100 text-green-700' :
                            parseFloat(kw.position) <= 20 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {kw.position}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No keyword data yet. Data typically appears 48-72 hours after site verification.</p>
              </div>
            )}
          </div>

          {/* Top Pages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Search Pages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Top Pages (Search)</h3>
              <p className="text-sm text-gray-500 mb-4">Best performing pages in Google Search</p>
              
              {searchData?.pages && searchData.pages.length > 0 ? (
                <div className="space-y-3">
                  {searchData.pages.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{page.page}</p>
                        <p className="text-xs text-gray-500">{page.clicks} clicks · {page.impressions} impressions</p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(page.position) <= 10 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        #{Math.round(parseFloat(page.position))}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Globe className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No page data available yet</p>
                </div>
              )}
            </div>

            {/* Analytics Pages */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Top Pages (Analytics)</h3>
              <p className="text-sm text-gray-500 mb-4">Most visited pages on your site</p>
              
              {analyticsData?.topPages && analyticsData.topPages.length > 0 ? (
                <div className="space-y-3">
                  {analyticsData.topPages.slice(0, 5).map((page, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{page.path}</p>
                        <p className="text-xs text-gray-500">Avg. {formatDuration(page.avgDuration)} on page</p>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{page.views} views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <BarChart3 className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No analytics data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-1">Traffic Sources</h3>
            <p className="text-sm text-gray-500 mb-4">Where your visitors come from</p>
            
            {analyticsData?.sources && analyticsData.sources.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {analyticsData.sources.map((source, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{source.sessions}</p>
                    <p className="text-sm text-gray-600 capitalize">{source.source}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No traffic data available</p>
            )}
          </div>
        </>
      )}

      {/* AUDIT TAB */}
      {activeTab === 'audit' && (
        <div>
          {/* Run Audit Button */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Technical SEO Audit</h2>
                <p className="text-sm text-gray-500">Scan your site for SEO issues and get recommendations</p>
              </div>
              <button
                onClick={runAudit}
                disabled={auditLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {auditLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <FileSearch className="w-5 h-5" />
                    Run Audit
                  </>
                )}
              </button>
            </div>
            
            {auditData && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last scan: {new Date(auditData.scannedAt).toLocaleString()}
                </span>
                <span>{auditData.totalPages} pages scanned</span>
              </div>
            )}
          </div>

          {auditData && (
            <>
              {/* Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:col-span-1">
                  <p className="text-sm text-gray-600 mb-2">Overall Score</p>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-3xl font-bold ${getScoreColor(auditData.score)}`}>
                    {auditData.score}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-gray-600">Errors</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">
                    {auditData.issues.filter(i => i.type === 'error').length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">Warnings</span>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">
                    {auditData.issues.filter(i => i.type === 'warning').length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Passed</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    {auditData.totalPages * 8 - auditData.issues.length}
                  </p>
                </div>
              </div>

              {/* Issues List */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Issues Found</h3>
                
                {auditData.issues.length > 0 ? (
                  <div className="space-y-3">
                    {auditData.issues.map((issue, index) => (
                      <div key={index} className={`p-4 rounded-lg border ${
                        issue.type === 'error' ? 'bg-red-50 border-red-200' :
                        issue.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start gap-3">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{issue.message}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                                {issue.category}
                              </span>
                            </div>
                            {issue.page && (
                              <p className="text-sm text-gray-600 mt-1">Page: {issue.page}</p>
                            )}
                            {issue.details && (
                              <p className="text-sm text-gray-500 mt-1">{issue.details}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-lg font-medium text-gray-900">No issues found!</p>
                    <p className="text-gray-500">Your site passes all SEO checks</p>
                  </div>
                )}
              </div>

              {/* Pages Detail */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pages Scanned</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-medium">PAGE</th>
                        <th className="pb-3 font-medium">TITLE</th>
                        <th className="pb-3 font-medium">H1</th>
                        <th className="pb-3 font-medium">IMAGES</th>
                        <th className="pb-3 font-medium">LOAD TIME</th>
                        <th className="pb-3 font-medium">OG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditData.pages.map((page, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-900">{page.url}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              page.titleLength >= 50 && page.titleLength <= 60 
                                ? 'bg-green-100 text-green-700' 
                                : page.title 
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {page.titleLength} chars
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              page.h1Count === 1 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {page.h1Count}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              page.imagesWithoutAlt === 0 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {page.imagesWithoutAlt}/{page.totalImages} missing alt
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              page.loadTime < 1500 
                                ? 'bg-green-100 text-green-700' 
                                : page.loadTime < 3000
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                            }`}>
                              {(page.loadTime / 1000).toFixed(2)}s
                            </span>
                          </td>
                          <td className="py-3">
                            {page.hasOpenGraph ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!auditData && !auditLoading && (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <FileSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit data yet</h3>
              <p className="text-gray-500 mb-4">Click "Run Audit" to scan your site for SEO issues</p>
            </div>
          )}
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
