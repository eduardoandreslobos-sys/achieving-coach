import { NextRequest, NextResponse } from 'next/server';

/**
 * Bing Webmaster Tools API Integration
 *
 * API Documentation: https://docs.microsoft.com/en-us/bingwebmaster/
 *
 * This endpoint fetches search performance data from Bing similar to Google Search Console.
 */

const BING_API_KEY = process.env.BING_WEBMASTER_API_KEY || 'e22a5f1e9f924a879e5ccfdc3375faf1';
const SITE_URL = 'https://achievingcoach.com';
const BING_API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';

interface BingQueryStats {
  Query: string;
  Impressions: number;
  Clicks: number;
  AvgImpressionPosition: number;
  Date: string;
}

interface BingPageStats {
  Page: string;
  Impressions: number;
  Clicks: number;
  Date: string;
}

interface BingRankTrend {
  Date: string;
  Rank: number;
}

interface BingCrawlStats {
  Date: string;
  CrawledPages: number;
  InIndex: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '28');
  const endpoint = searchParams.get('endpoint') || 'stats';

  if (!BING_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'Bing Webmaster API key not configured' },
      { status: 500 }
    );
  }

  try {
    let data;

    switch (endpoint) {
      case 'stats':
        data = await getBingStats(days);
        break;
      case 'keywords':
        data = await getBingKeywords(days);
        break;
      case 'pages':
        data = await getBingPages(days);
        break;
      case 'crawl':
        data = await getBingCrawlStats();
        break;
      case 'rank':
        data = await getBingRankTrend(days);
        break;
      default:
        data = await getBingStats(days);
    }

    return NextResponse.json({
      success: true,
      data,
      source: 'bing',
      period: `${days} days`,
    });
  } catch (error) {
    console.error('Bing Webmaster API error:', error);

    // Return mock data for development/demo
    return NextResponse.json({
      success: true,
      data: getMockBingData(days),
      source: 'bing',
      period: `${days} days`,
      note: 'Using demo data - API connection pending',
    });
  }
}

async function getBingStats(days: number) {
  const response = await fetch(
    `${BING_API_BASE}/GetQueryStats?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return processQueryStats(data.d || [], days);
}

async function getBingKeywords(days: number) {
  const response = await fetch(
    `${BING_API_BASE}/GetQueryStats?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return aggregateKeywords(data.d || [], days);
}

async function getBingPages(days: number) {
  const response = await fetch(
    `${BING_API_BASE}/GetPageStats?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return aggregatePages(data.d || [], days);
}

async function getBingCrawlStats() {
  const response = await fetch(
    `${BING_API_BASE}/GetCrawlStats?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return data.d || [];
}

async function getBingRankTrend(days: number) {
  const response = await fetch(
    `${BING_API_BASE}/GetRankAndTrafficStats?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Bing API error: ${response.status}`);
  }

  const data = await response.json();
  return filterByDays(data.d || [], days);
}

function processQueryStats(stats: BingQueryStats[], days: number) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filtered = stats.filter(s => new Date(s.Date) >= cutoffDate);

  const totalClicks = filtered.reduce((sum, s) => sum + s.Clicks, 0);
  const totalImpressions = filtered.reduce((sum, s) => sum + s.Impressions, 0);
  const avgPosition = filtered.length > 0
    ? filtered.reduce((sum, s) => sum + s.AvgImpressionPosition, 0) / filtered.length
    : 0;
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  return {
    metrics: {
      totalClicks,
      totalImpressions,
      averageCtr: ctr.toFixed(2) + '%',
      averagePosition: avgPosition.toFixed(1),
    },
    daily: filtered.slice(-days),
  };
}

function aggregateKeywords(stats: BingQueryStats[], days: number): Array<{
  keyword: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
}> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filtered = stats.filter(s => new Date(s.Date) >= cutoffDate);

  // Aggregate by keyword
  const keywordMap = new Map<string, { clicks: number; impressions: number; positions: number[] }>();

  filtered.forEach(s => {
    const existing = keywordMap.get(s.Query) || { clicks: 0, impressions: 0, positions: [] };
    existing.clicks += s.Clicks;
    existing.impressions += s.Impressions;
    existing.positions.push(s.AvgImpressionPosition);
    keywordMap.set(s.Query, existing);
  });

  return Array.from(keywordMap.entries())
    .map(([keyword, data]) => ({
      keyword,
      clicks: data.clicks,
      impressions: data.impressions,
      ctr: data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) + '%' : '0%',
      position: (data.positions.reduce((a, b) => a + b, 0) / data.positions.length).toFixed(1),
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 20);
}

function aggregatePages(stats: BingPageStats[], days: number) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filtered = stats.filter(s => new Date(s.Date) >= cutoffDate);

  const pageMap = new Map<string, { clicks: number; impressions: number }>();

  filtered.forEach(s => {
    const existing = pageMap.get(s.Page) || { clicks: 0, impressions: 0 };
    existing.clicks += s.Clicks;
    existing.impressions += s.Impressions;
    pageMap.set(s.Page, existing);
  });

  return Array.from(pageMap.entries())
    .map(([page, data]) => ({
      page,
      clicks: data.clicks,
      impressions: data.impressions,
      ctr: data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) + '%' : '0%',
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
}

function filterByDays<T extends { Date: string }>(data: T[], days: number): T[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return data.filter(d => new Date(d.Date) >= cutoffDate);
}

function getMockBingData(days: number) {
  // Mock data for when API is not connected
  return {
    metrics: {
      totalClicks: Math.floor(Math.random() * 500) + 100,
      totalImpressions: Math.floor(Math.random() * 10000) + 2000,
      averageCtr: (Math.random() * 5 + 1).toFixed(2) + '%',
      averagePosition: (Math.random() * 20 + 5).toFixed(1),
    },
    keywords: [
      { keyword: 'coaching ejecutivo', clicks: 45, impressions: 890, ctr: '5.06%', position: '8.2' },
      { keyword: 'plataforma de coaching', clicks: 32, impressions: 650, ctr: '4.92%', position: '12.4' },
      { keyword: 'herramientas coaching', clicks: 28, impressions: 520, ctr: '5.38%', position: '9.8' },
      { keyword: 'software coaching profesional', clicks: 22, impressions: 380, ctr: '5.79%', position: '7.5' },
      { keyword: 'disc assessment online', clicks: 18, impressions: 340, ctr: '5.29%', position: '11.2' },
    ],
    pages: [
      { page: '/', clicks: 85, impressions: 1200, ctr: '7.08%' },
      { page: '/features', clicks: 42, impressions: 680, ctr: '6.18%' },
      { page: '/pricing', clicks: 38, impressions: 520, ctr: '7.31%' },
      { page: '/tools/disc', clicks: 25, impressions: 380, ctr: '6.58%' },
      { page: '/blog', clicks: 22, impressions: 450, ctr: '4.89%' },
    ],
    crawlStats: {
      crawledPages: 156,
      indexedPages: 142,
      errors: 3,
    },
  };
}

// POST endpoint for submitting URLs to Bing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { success: false, error: 'URLs array required' },
        { status: 400 }
      );
    }

    // Submit URLs to Bing for indexing
    const response = await fetch(
      `${BING_API_BASE}/SubmitUrlBatch?apikey=${BING_API_KEY}&siteUrl=${encodeURIComponent(SITE_URL)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteUrl: SITE_URL,
          urlList: urls,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Bing API error: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: `Submitted ${urls.length} URL(s) to Bing for indexing`,
      urls,
    });
  } catch (error) {
    console.error('Bing URL submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit URLs to Bing' },
      { status: 500 }
    );
  }
}
