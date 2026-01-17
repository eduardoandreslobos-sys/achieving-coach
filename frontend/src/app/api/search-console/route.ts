import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SITE_URL = 'https://achievingcoach.com';

// Initialize the Search Console client with same credentials as GA4
const getSearchConsoleClient = () => {
  const credentials = JSON.parse(process.env.GA4_CREDENTIALS || '{}');
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return google.searchconsole({ version: 'v1', auth });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '28');

  try {
    const searchConsole = getSearchConsoleClient();

    // Calculate date range
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 2); // Search Console has 2-day delay
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days);

    // Previous period for comparison
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevEndDate.getDate() - days);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fetch comprehensive data in parallel
    const [
      keywordsResponse,
      pagesResponse,
      devicesResponse,
      countriesResponse,
      queryPageResponse,
      dateResponse,
      prevPeriodResponse,
    ] = await Promise.all([
      // Top keywords/queries (extended to 50)
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query'],
          rowLimit: 50,
          dataState: 'final',
        },
      }),

      // Top pages (extended to 30)
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 30,
          dataState: 'final',
        },
      }),

      // Device breakdown
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['device'],
          dataState: 'final',
        },
      }),

      // Country breakdown (extended to 20)
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['country'],
          rowLimit: 20,
          dataState: 'final',
        },
      }),

      // Query + Page combinations (for keyword mapping)
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query', 'page'],
          rowLimit: 100,
          dataState: 'final',
        },
      }),

      // Daily data for trends
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['date'],
          dataState: 'final',
        },
      }),

      // Previous period totals for comparison
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(prevStartDate),
          endDate: formatDate(prevEndDate),
          dimensions: [],
          dataState: 'final',
        },
      }),
    ]);

    // Parse keywords with enhanced analysis
    const keywords = keywordsResponse.data.rows?.map(row => {
      const query = row.keys?.[0] || '';
      const clicks = row.clicks || 0;
      const impressions = row.impressions || 0;
      const ctr = row.ctr || 0;
      const position = row.position || 0;

      // Categorize query intent
      const queryLower = query.toLowerCase();
      let intent = 'informational';
      if (queryLower.includes('precio') || queryLower.includes('comprar') || queryLower.includes('costo') || queryLower.includes('plan')) {
        intent = 'commercial';
      } else if (queryLower.includes('cómo') || queryLower.includes('qué es') || queryLower.includes('como') || queryLower.includes('guía')) {
        intent = 'informational';
      } else if (queryLower.includes('achievingcoach') || queryLower.includes('achieving coach')) {
        intent = 'branded';
      } else if (queryLower.includes('mejor') || queryLower.includes('vs') || queryLower.includes('comparar')) {
        intent = 'comparison';
      }

      // Calculate opportunity score (high impressions + low CTR = opportunity)
      const expectedCtr = position <= 1 ? 0.30 : position <= 3 ? 0.15 : position <= 10 ? 0.05 : 0.01;
      const opportunityScore = impressions > 50 && ctr < expectedCtr ? Math.round((impressions * (expectedCtr - ctr)) * 100) : 0;

      return {
        query,
        clicks,
        impressions,
        ctr: (ctr * 100).toFixed(2),
        position: position.toFixed(1),
        intent,
        opportunityScore,
        isOpportunity: opportunityScore > 10,
      };
    }) || [];

    // Parse pages with keyword counts
    const pageKeywordMap = new Map<string, string[]>();
    queryPageResponse.data.rows?.forEach(row => {
      const query = row.keys?.[0] || '';
      const page = row.keys?.[1]?.replace(SITE_URL, '') || '/';
      if (!pageKeywordMap.has(page)) {
        pageKeywordMap.set(page, []);
      }
      pageKeywordMap.get(page)?.push(query);
    });

    const pages = pagesResponse.data.rows?.map(row => {
      const page = row.keys?.[0]?.replace(SITE_URL, '') || '/';
      const keywords = pageKeywordMap.get(page) || [];
      return {
        page,
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
        position: row.position?.toFixed(1) || '0',
        keywordCount: keywords.length,
        topKeywords: keywords.slice(0, 5),
      };
    }) || [];

    // Parse devices
    const devices = devicesResponse.data.rows?.map(row => ({
      device: row.keys?.[0] || 'unknown',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
    })) || [];

    // Parse countries with more details
    const countries = countriesResponse.data.rows?.map(row => ({
      country: row.keys?.[0] || 'unknown',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
      position: row.position?.toFixed(1) || '0',
    })) || [];

    // Parse daily trends
    const dailyTrends = dateResponse.data.rows?.map(row => ({
      date: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
      position: row.position?.toFixed(1) || '0',
    })).sort((a, b) => a.date.localeCompare(b.date)) || [];

    // Calculate totals
    const totals = {
      clicks: keywords.reduce((sum, k) => sum + k.clicks, 0),
      impressions: keywords.reduce((sum, k) => sum + k.impressions, 0),
      avgCtr: keywords.length > 0
        ? (keywords.reduce((sum, k) => sum + parseFloat(k.ctr), 0) / keywords.length).toFixed(2)
        : '0',
      avgPosition: keywords.length > 0
        ? (keywords.reduce((sum, k) => sum + parseFloat(k.position), 0) / keywords.length).toFixed(1)
        : '0',
    };

    // Previous period totals for comparison
    const prevRow = prevPeriodResponse.data.rows?.[0];
    const prevTotals = {
      clicks: prevRow?.clicks || 0,
      impressions: prevRow?.impressions || 0,
      avgCtr: prevRow?.ctr ? (prevRow.ctr * 100).toFixed(2) : '0',
      avgPosition: prevRow?.position?.toFixed(1) || '0',
    };

    // Calculate changes
    const changes = {
      clicks: prevTotals.clicks > 0 ? ((totals.clicks - prevTotals.clicks) / prevTotals.clicks * 100).toFixed(1) : '0',
      impressions: prevTotals.impressions > 0 ? ((totals.impressions - prevTotals.impressions) / prevTotals.impressions * 100).toFixed(1) : '0',
      ctr: (parseFloat(totals.avgCtr) - parseFloat(prevTotals.avgCtr)).toFixed(2),
      position: (parseFloat(prevTotals.avgPosition) - parseFloat(totals.avgPosition)).toFixed(1), // Lower is better
    };

    // Categorize keywords by intent
    const keywordsByIntent = {
      branded: keywords.filter(k => k.intent === 'branded'),
      commercial: keywords.filter(k => k.intent === 'commercial'),
      informational: keywords.filter(k => k.intent === 'informational'),
      comparison: keywords.filter(k => k.intent === 'comparison'),
    };

    // Find opportunity keywords
    const opportunityKeywords = keywords
      .filter(k => k.isOpportunity)
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 20);

    // Find quick wins (position 4-20, good impressions)
    const quickWins = keywords
      .filter(k => {
        const pos = parseFloat(k.position);
        return pos >= 4 && pos <= 20 && k.impressions >= 20;
      })
      .sort((a, b) => {
        const posA = parseFloat(a.position);
        const posB = parseFloat(b.position);
        return posA - posB;
      })
      .slice(0, 15);

    // Top 10 keywords (already have clicks)
    const topPerformers = keywords
      .filter(k => k.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Pages with zero clicks but impressions (content opportunities)
    const zeroClickPages = pages
      .filter(p => p.clicks === 0 && p.impressions > 50)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      data: {
        totals,
        prevTotals,
        changes,
        keywords,
        keywordsByIntent,
        opportunityKeywords,
        quickWins,
        topPerformers,
        pages,
        zeroClickPages,
        devices,
        countries,
        dailyTrends,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate),
        },
      },
    });

  } catch (error: any) {
    console.error('Search Console API Error:', error);

    // Return structured empty data for development/when API is not configured
    if (error.code === 403 || error.message?.includes('permission') || !process.env.GA4_CREDENTIALS) {
      return NextResponse.json({
        success: true,
        data: {
          totals: { clicks: 0, impressions: 0, avgCtr: '0', avgPosition: '0' },
          prevTotals: { clicks: 0, impressions: 0, avgCtr: '0', avgPosition: '0' },
          changes: { clicks: '0', impressions: '0', ctr: '0', position: '0' },
          keywords: [],
          keywordsByIntent: { branded: [], commercial: [], informational: [], comparison: [] },
          opportunityKeywords: [],
          quickWins: [],
          topPerformers: [],
          pages: [],
          zeroClickPages: [],
          devices: [],
          countries: [],
          dailyTrends: [],
          dateRange: {
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
          },
          notice: 'Search Console not configured. Add the service account to your Search Console property.',
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch Search Console data',
      },
      { status: 500 }
    );
  }
}
