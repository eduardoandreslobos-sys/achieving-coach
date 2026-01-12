import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-calendar';

/**
 * GET /api/google/callback
 * Handles OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle errors from Google
    if (error) {
      console.error('Google OAuth error:', error);
      return NextResponse.redirect(
        new URL('/coach/booking?error=oauth_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/coach/booking?error=missing_params', request.url)
      );
    }

    // Decode state to get user ID
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/coach/booking?error=invalid_state', request.url)
      );
    }

    const { userId, timestamp } = stateData;

    // Check if state is not too old (30 minutes max)
    if (Date.now() - timestamp > 30 * 60 * 1000) {
      return NextResponse.redirect(
        new URL('/coach/booking?error=expired', request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    // Encode tokens for client-side storage
    // In production, you should store these securely server-side
    const tokenData = Buffer.from(JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    })).toString('base64');

    // Redirect back to booking settings with tokens
    return NextResponse.redirect(
      new URL(`/coach/booking?calendar_connected=true&tokens=${tokenData}&userId=${userId}`, request.url)
    );
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(
      new URL('/coach/booking?error=callback_failed', request.url)
    );
  }
}
