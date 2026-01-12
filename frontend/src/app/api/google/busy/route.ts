import { NextRequest, NextResponse } from 'next/server';
import { getBusyTimes, refreshAccessToken } from '@/lib/google-calendar';

/**
 * GET /api/google/busy
 * Get busy times from Google Calendar for availability checking
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const timeMin = searchParams.get('timeMin');
    const timeMax = searchParams.get('timeMax');
    const timezone = searchParams.get('timezone');

    if (!accessToken || !timeMin || !timeMax) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let busyTimes;
    let newAccessToken = null;

    try {
      busyTimes = await getBusyTimes(
        accessToken,
        refreshToken || undefined,
        timeMin,
        timeMax,
        timezone || undefined
      );
    } catch (error: any) {
      // If token expired, try to refresh and retry
      if (error.code === 401 && refreshToken) {
        const newCredentials = await refreshAccessToken(refreshToken);
        newAccessToken = newCredentials.access_token;

        busyTimes = await getBusyTimes(
          newCredentials.access_token!,
          refreshToken,
          timeMin,
          timeMax,
          timezone || undefined
        );
      } else {
        throw error;
      }
    }

    return NextResponse.json({
      success: true,
      busyTimes,
      ...(newAccessToken && { newAccessToken }),
    });
  } catch (error) {
    console.error('Error getting busy times:', error);
    return NextResponse.json(
      { error: 'Failed to get busy times' },
      { status: 500 }
    );
  }
}
