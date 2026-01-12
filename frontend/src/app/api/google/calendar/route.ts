import { NextRequest, NextResponse } from 'next/server';
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getBusyTimes,
  refreshAccessToken,
} from '@/lib/google-calendar';

/**
 * POST /api/google/calendar
 * Create a calendar event for a booking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accessToken,
      refreshToken,
      summary,
      description,
      startTime,
      endTime,
      attendeeEmail,
      attendeeName,
      meetingLink,
      timezone,
    } = body;

    if (!accessToken || !summary || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to create the event
    let event;
    try {
      event = await createCalendarEvent(accessToken, refreshToken, {
        summary,
        description: description || '',
        startTime,
        endTime,
        attendeeEmail,
        attendeeName,
        meetingLink,
        timezone,
      });
    } catch (error: any) {
      // If token expired, try to refresh and retry
      if (error.code === 401 && refreshToken) {
        const newCredentials = await refreshAccessToken(refreshToken);
        event = await createCalendarEvent(
          newCredentials.access_token!,
          refreshToken,
          {
            summary,
            description: description || '',
            startTime,
            endTime,
            attendeeEmail,
            attendeeName,
            meetingLink,
            timezone,
          }
        );

        // Return new tokens along with the event
        return NextResponse.json({
          success: true,
          event,
          newTokens: {
            access_token: newCredentials.access_token,
            expiry_date: newCredentials.expiry_date,
          },
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/google/calendar
 * Update or cancel a calendar event
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accessToken,
      refreshToken,
      eventId,
      summary,
      description,
      startTime,
      endTime,
      status,
      timezone,
    } = body;

    if (!accessToken || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await updateCalendarEvent(accessToken, refreshToken, eventId, {
      summary,
      description,
      startTime,
      endTime,
      status,
      timezone,
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to update calendar event' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/google/calendar
 * Delete a calendar event
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const eventId = searchParams.get('eventId');

    if (!accessToken || !eventId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await deleteCalendarEvent(accessToken, refreshToken || undefined, eventId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return NextResponse.json(
      { error: 'Failed to delete calendar event' },
      { status: 500 }
    );
  }
}
