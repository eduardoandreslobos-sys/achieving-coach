import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const GA4_PROPERTY_ID = '514516891';

// Initialize the client with credentials
const getAnalyticsClient = () => {
  const credentials = JSON.parse(process.env.GA4_CREDENTIALS || '{}');
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get('days') || '30');
  
  try {
    const analyticsDataClient = getAnalyticsClient();
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fetch multiple metrics in parallel
    const [
      trafficResponse,
      pagesResponse,
      sourcesResponse,
    ] = await Promise.all([
      // Overall traffic metrics
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
      }),
      
      // Top pages
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      
      // Traffic sources
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'sessionSource' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 5,
      }),
    ]);

    // Parse traffic metrics
    const trafficRow = trafficResponse[0]?.rows?.[0];
    const metrics = {
      activeUsers: parseInt(trafficRow?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(trafficRow?.metricValues?.[1]?.value || '0'),
      pageViews: parseInt(trafficRow?.metricValues?.[2]?.value || '0'),
      avgSessionDuration: parseFloat(trafficRow?.metricValues?.[3]?.value || '0'),
      bounceRate: parseFloat(trafficRow?.metricValues?.[4]?.value || '0'),
    };

    // Parse top pages
    const topPages = pagesResponse[0]?.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || '0'),
    })) || [];

    // Parse traffic sources
    const sources = sourcesResponse[0]?.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'direct',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        topPages,
        sources,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate),
        },
      },
    });

  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch analytics data',
        details: error.details || null,
      },
      { status: 500 }
    );
  }
}
