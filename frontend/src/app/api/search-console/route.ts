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

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Fetch data in parallel
    const [
      keywordsResponse,
      pagesResponse,
      devicesResponse,
      countriesResponse,
    ] = await Promise.all([
      // Top keywords/queries
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['query'],
          rowLimit: 20,
          dataState: 'final',
        },
      }),

      // Top pages
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['page'],
          rowLimit: 15,
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

      // Country breakdown (GEO data)
      searchConsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          dimensions: ['country'],
          rowLimit: 10,
          dataState: 'final',
        },
      }),
    ]);

    // Parse keywords
    const keywords = keywordsResponse.data.rows?.map(row => ({
      query: row.keys?.[0] || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
      position: row.position?.toFixed(1) || '0',
    })) || [];

    // Parse pages
    const pages = pagesResponse.data.rows?.map(row => ({
      page: row.keys?.[0]?.replace(SITE_URL, '') || '/',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
      position: row.position?.toFixed(1) || '0',
    })) || [];

    // Parse devices
    const devices = devicesResponse.data.rows?.map(row => ({
      device: row.keys?.[0] || 'unknown',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
    })) || [];

    // Parse countries (GEO)
    const countries = countriesResponse.data.rows?.map(row => ({
      country: row.keys?.[0] || 'unknown',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0',
      position: row.position?.toFixed(1) || '0',
    })) || [];

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

    return NextResponse.json({
      success: true,
      data: {
        totals,
        keywords,
        pages,
        devices,
        countries,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate),
        },
      },
    });

  } catch (error: any) {
    console.error('Search Console API Error:', error);

    // Return mock data for development/when API is not configured
    if (error.code === 403 || error.message?.includes('permission') || !process.env.GA4_CREDENTIALS) {
      return NextResponse.json({
        success: true,
        data: {
          totals: {
            clicks: 0,
            impressions: 0,
            avgCtr: '0',
            avgPosition: '0',
          },
          keywords: [],
          pages: [],
          devices: [],
          countries: [],
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
