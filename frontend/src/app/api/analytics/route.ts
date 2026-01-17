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
      countriesResponse,
      devicesResponse,
      channelsResponse,
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
          { name: 'newUsers' },
          { name: 'engagedSessions' },
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
          { name: 'bounceRate' },
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

      // Geographic data (GEO)
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
      }),

      // Device breakdown
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'bounceRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),

      // Traffic channels (organic, paid, direct, etc.)
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
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
      newUsers: parseInt(trafficRow?.metricValues?.[5]?.value || '0'),
      engagedSessions: parseInt(trafficRow?.metricValues?.[6]?.value || '0'),
    };

    // Parse top pages
    const topPages = pagesResponse[0]?.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse traffic sources
    const sources = sourcesResponse[0]?.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'direct',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || [];

    // Parse countries (GEO data)
    const countries = countriesResponse[0]?.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse devices
    const devices = devicesResponse[0]?.rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || 'unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse channels (organic, direct, paid, etc.)
    const channels = channelsResponse[0]?.rows?.map(row => ({
      channel: row.dimensionValues?.[0]?.value || 'Other',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Calculate organic traffic percentage
    const totalSessions = channels.reduce((sum, c) => sum + c.sessions, 0);
    const organicSessions = channels.find(c => c.channel.toLowerCase().includes('organic'))?.sessions || 0;
    const organicPercentage = totalSessions > 0 ? ((organicSessions / totalSessions) * 100).toFixed(1) : '0';

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          ...metrics,
          organicPercentage: parseFloat(organicPercentage),
        },
        topPages,
        sources,
        countries,
        devices,
        channels,
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
