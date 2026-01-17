import { NextRequest, NextResponse } from 'next/server';

const CLARITY_API_URL = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';
const CLARITY_TOKEN = process.env.CLARITY_API_TOKEN;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = searchParams.get('days') || '3'; // 1, 2, or 3 days

  if (!CLARITY_TOKEN) {
    return NextResponse.json({
      success: true,
      data: {
        notice: 'Clarity API not configured. Add CLARITY_API_TOKEN to environment variables.',
        metrics: null,
        byDevice: [],
        byBrowser: [],
        byCountry: [],
        byOS: [],
        byPage: [],
      },
    });
  }

  try {
    // Fetch multiple dimensions in parallel
    const [
      overviewResponse,
      deviceResponse,
      browserResponse,
      countryResponse,
      osResponse,
      pageResponse,
    ] = await Promise.all([
      // Overview metrics (no dimension)
      fetch(`${CLARITY_API_URL}?numOfDays=${days}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
      // By Device
      fetch(`${CLARITY_API_URL}?numOfDays=${days}&dimension1=Device`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
      // By Browser
      fetch(`${CLARITY_API_URL}?numOfDays=${days}&dimension1=Browser`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
      // By Country
      fetch(`${CLARITY_API_URL}?numOfDays=${days}&dimension1=Country`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
      // By OS
      fetch(`${CLARITY_API_URL}?numOfDays=${days}&dimension1=OS`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
      // By Page/URL
      fetch(`${CLARITY_API_URL}?numOfDays=${days}&dimension1=URL`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLARITY_TOKEN}`,
        },
      }),
    ]);

    // Parse responses
    const [overview, byDevice, byBrowser, byCountry, byOS, byPage] = await Promise.all([
      overviewResponse.ok ? overviewResponse.json() : null,
      deviceResponse.ok ? deviceResponse.json() : [],
      browserResponse.ok ? browserResponse.json() : [],
      countryResponse.ok ? countryResponse.json() : [],
      osResponse.ok ? osResponse.json() : [],
      pageResponse.ok ? pageResponse.json() : [],
    ]);

    // Extract key metrics from overview
    const metrics = overview ? {
      totalSessions: overview.totalSessionCount || 0,
      totalPageViews: overview.totalPageviewCount || 0,
      totalUsers: overview.distinctUserCount || 0,
      avgScrollDepth: overview.scrollDepth?.avg || 0,
      avgEngagementTime: overview.engagementTime?.avg || 0,
      // UX Metrics
      deadClickCount: overview.deadClickCount || 0,
      rageClickCount: overview.rageClickCount || 0,
      quickbackCount: overview.quickbackCount || 0,
      excessiveScrollCount: overview.excessiveScrollCount || 0,
      // Rates
      deadClickRate: overview.deadClickRate || 0,
      rageClickRate: overview.rageClickRate || 0,
      quickbackRate: overview.quickbackRate || 0,
      botTraffic: overview.botTraffic || 0,
    } : null;

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        byDevice: Array.isArray(byDevice) ? byDevice : byDevice?.data || [],
        byBrowser: Array.isArray(byBrowser) ? byBrowser : byBrowser?.data || [],
        byCountry: Array.isArray(byCountry) ? byCountry : byCountry?.data || [],
        byOS: Array.isArray(byOS) ? byOS : byOS?.data || [],
        byPage: Array.isArray(byPage) ? byPage : byPage?.data || [],
        period: `Last ${days} day${days === '1' ? '' : 's'}`,
      },
    });

  } catch (error: any) {
    console.error('Clarity API Error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch Clarity data',
      data: {
        metrics: null,
        byDevice: [],
        byBrowser: [],
        byCountry: [],
        byOS: [],
        byPage: [],
      },
    }, { status: 500 });
  }
}
