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

    // Previous period for comparison
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevEndDate.getDate() - days);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fetch multiple metrics in parallel
    const [
      trafficResponse,
      pagesResponse,
      sourcesResponse,
      countriesResponse,
      citiesResponse,
      devicesResponse,
      channelsResponse,
      languagesResponse,
      dailyResponse,
      prevPeriodResponse,
      landingPagesResponse,
      browserResponse,
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
          { name: 'userEngagementDuration' },
          { name: 'sessionsPerUser' },
        ],
      }),

      // Top pages (extended to 20)
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
          { name: 'activeUsers' },
        ],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 20,
      }),

      // Traffic sources (extended)
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'bounceRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),

      // Geographic data - Countries
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
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),

      // Geographic data - Cities
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'city' }, { name: 'country' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 25,
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
          { name: 'averageSessionDuration' },
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
          { name: 'conversions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),

      // Languages
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'language' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'engagementRate' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),

      // Daily data for trends
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),

      // Previous period for comparison
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(prevStartDate), endDate: formatDate(prevEndDate) },
        ],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
        ],
      }),

      // Landing pages (entry points)
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'landingPage' }],
        metrics: [
          { name: 'sessions' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),

      // Browser breakdown
      analyticsDataClient.runReport({
        property: `properties/${GA4_PROPERTY_ID}`,
        dateRanges: [
          { startDate: formatDate(startDate), endDate: formatDate(endDate) },
        ],
        dimensions: [{ name: 'browser' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10,
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
      totalEngagementTime: parseFloat(trafficRow?.metricValues?.[7]?.value || '0'),
      sessionsPerUser: parseFloat(trafficRow?.metricValues?.[8]?.value || '0'),
    };

    // Parse previous period metrics
    const prevRow = prevPeriodResponse[0]?.rows?.[0];
    const prevMetrics = {
      activeUsers: parseInt(prevRow?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(prevRow?.metricValues?.[1]?.value || '0'),
      pageViews: parseInt(prevRow?.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(prevRow?.metricValues?.[3]?.value || '0'),
    };

    // Calculate changes
    const changes = {
      users: prevMetrics.activeUsers > 0
        ? ((metrics.activeUsers - prevMetrics.activeUsers) / prevMetrics.activeUsers * 100).toFixed(1)
        : '0',
      sessions: prevMetrics.sessions > 0
        ? ((metrics.sessions - prevMetrics.sessions) / prevMetrics.sessions * 100).toFixed(1)
        : '0',
      pageViews: prevMetrics.pageViews > 0
        ? ((metrics.pageViews - prevMetrics.pageViews) / prevMetrics.pageViews * 100).toFixed(1)
        : '0',
      bounceRate: (metrics.bounceRate - prevMetrics.bounceRate).toFixed(2),
    };

    // Parse top pages
    const topPages = pagesResponse[0]?.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
      users: parseInt(row.metricValues?.[3]?.value || '0'),
    })) || [];

    // Parse traffic sources
    const sources = sourcesResponse[0]?.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'direct',
      medium: row.dimensionValues?.[1]?.value || '(none)',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse countries
    const countries = countriesResponse[0]?.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[3]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[4]?.value || '0'),
    })) || [];

    // Parse cities
    const cities = citiesResponse[0]?.rows?.map(row => ({
      city: row.dimensionValues?.[0]?.value || 'Unknown',
      country: row.dimensionValues?.[1]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    })).filter(c => c.city !== '(not set)') || [];

    // Parse devices
    const devices = devicesResponse[0]?.rows?.map(row => ({
      device: row.dimensionValues?.[0]?.value || 'unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[3]?.value || '0'),
    })) || [];

    // Parse channels
    const channels = channelsResponse[0]?.rows?.map(row => ({
      channel: row.dimensionValues?.[0]?.value || 'Other',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
      conversions: parseInt(row.metricValues?.[3]?.value || '0'),
    })) || [];

    // Parse languages
    const languages = languagesResponse[0]?.rows?.map(row => {
      const langCode = row.dimensionValues?.[0]?.value || 'unknown';
      // Map common language codes to readable names
      const langNames: Record<string, string> = {
        'es': 'Español', 'es-es': 'Español (España)', 'es-419': 'Español (LATAM)',
        'es-mx': 'Español (México)', 'es-cl': 'Español (Chile)', 'es-ar': 'Español (Argentina)',
        'es-co': 'Español (Colombia)', 'es-pe': 'Español (Perú)',
        'en': 'English', 'en-us': 'English (US)', 'en-gb': 'English (UK)',
        'pt': 'Português', 'pt-br': 'Português (Brasil)',
        'fr': 'Français', 'de': 'Deutsch', 'it': 'Italiano',
      };
      return {
        code: langCode,
        language: langNames[langCode.toLowerCase()] || langCode,
        users: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        engagementRate: parseFloat(row.metricValues?.[2]?.value || '0'),
      };
    }) || [];

    // Parse daily trends
    const dailyTrends = dailyResponse[0]?.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse landing pages
    const landingPages = landingPagesResponse[0]?.rows?.map(row => ({
      page: row.dimensionValues?.[0]?.value || '/',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[1]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[2]?.value || '0'),
    })) || [];

    // Parse browsers
    const browsers = browserResponse[0]?.rows?.map(row => ({
      browser: row.dimensionValues?.[0]?.value || 'Unknown',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || [];

    // Calculate organic traffic percentage
    const totalSessions = channels.reduce((sum, c) => sum + c.sessions, 0);
    const organicSessions = channels.find(c => c.channel.toLowerCase().includes('organic'))?.sessions || 0;
    const organicPercentage = totalSessions > 0 ? ((organicSessions / totalSessions) * 100).toFixed(1) : '0';

    // Calculate returning vs new users
    const returningUsers = metrics.activeUsers - metrics.newUsers;
    const returningPercentage = metrics.activeUsers > 0
      ? ((returningUsers / metrics.activeUsers) * 100).toFixed(1)
      : '0';

    // Group cities by country for regional analysis
    const citiesByCountry: Record<string, typeof cities> = {};
    cities.forEach(city => {
      if (!citiesByCountry[city.country]) {
        citiesByCountry[city.country] = [];
      }
      citiesByCountry[city.country].push(city);
    });

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          ...metrics,
          organicPercentage: parseFloat(organicPercentage),
          returningUsers,
          returningPercentage: parseFloat(returningPercentage),
        },
        prevMetrics,
        changes,
        topPages,
        landingPages,
        sources,
        countries,
        cities,
        citiesByCountry,
        devices,
        browsers,
        channels,
        languages,
        dailyTrends,
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
