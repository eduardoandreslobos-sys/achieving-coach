import { NextRequest, NextResponse } from 'next/server';

/**
 * IndexNow API - Instant URL indexing for Bing, Yandex, Seznam, Naver
 *
 * This allows instant notification to search engines when content is created/updated.
 * Much faster than waiting for crawlers to discover changes.
 *
 * Usage:
 * POST /api/indexnow
 * Body: { urls: ["https://achievingcoach.com/blog/new-post"] }
 */

const INDEXNOW_KEY = process.env.INDEXNOW_API_KEY || '';
const SITE_URL = 'https://achievingcoach.com';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoints for different search engines
const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',      // Bing, Yandex
  'https://www.bing.com/indexnow',           // Bing direct
  'https://yandex.com/indexnow',             // Yandex direct
];

interface IndexNowRequest {
  urls: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!INDEXNOW_KEY) {
      return NextResponse.json(
        { error: 'IndexNow API key not configured' },
        { status: 500 }
      );
    }

    const body: IndexNowRequest = await request.json();
    const { urls } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
        { status: 400 }
      );
    }

    // Validate URLs belong to our domain
    const validUrls = urls.filter(url => url.startsWith(SITE_URL));
    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided. URLs must start with ' + SITE_URL },
        { status: 400 }
      );
    }

    // Prepare IndexNow payload
    const payload = {
      host: 'achievingcoach.com',
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: validUrls,
    };

    // Submit to all IndexNow endpoints
    const results = await Promise.allSettled(
      INDEXNOW_ENDPOINTS.map(async (endpoint) => {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        return {
          endpoint,
          status: response.status,
          ok: response.ok,
        };
      })
    );

    // Parse results
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.ok
    ).length;

    const failed = results.filter(
      (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok)
    ).length;

    return NextResponse.json({
      success: true,
      message: `Submitted ${validUrls.length} URL(s) to IndexNow`,
      results: {
        successful,
        failed,
        total: INDEXNOW_ENDPOINTS.length,
      },
      urls: validUrls,
    });
  } catch (error) {
    console.error('IndexNow error:', error);
    return NextResponse.json(
      { error: 'Failed to submit to IndexNow' },
      { status: 500 }
    );
  }
}

// GET endpoint to verify API is working
export async function GET() {
  return NextResponse.json({
    service: 'IndexNow API',
    configured: !!INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY ? KEY_LOCATION : null,
    endpoints: INDEXNOW_ENDPOINTS,
    usage: 'POST /api/indexnow with { urls: ["https://achievingcoach.com/..."] }',
  });
}
