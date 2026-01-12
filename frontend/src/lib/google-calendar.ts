import { google } from 'googleapis';

// Google OAuth2 client configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`
  : 'http://localhost:3000/api/google/callback';

// Scopes needed for calendar access
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

/**
 * Create OAuth2 client
 */
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

/**
 * Generate authorization URL for OAuth flow
 */
export function getAuthUrl(state: string): string {
  const oauth2Client = createOAuth2Client();

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state,
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Create authenticated calendar client
 */
export function createCalendarClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

/**
 * Refresh access token if needed
 */
export async function refreshAccessToken(refreshToken: string) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

/**
 * Create a calendar event for a booking
 */
export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventDetails: {
    summary: string;
    description: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    attendeeEmail?: string;
    attendeeName?: string;
    meetingLink?: string;
    timezone?: string;
  }
) {
  const calendar = createCalendarClient(accessToken, refreshToken);

  const event: any = {
    summary: eventDetails.summary,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: eventDetails.timezone || 'America/Santiago',
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: eventDetails.timezone || 'America/Santiago',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 30 }, // 30 minutes before
      ],
    },
  };

  // Add attendee if provided
  if (eventDetails.attendeeEmail) {
    event.attendees = [
      {
        email: eventDetails.attendeeEmail,
        displayName: eventDetails.attendeeName,
      },
    ];
    event.sendUpdates = 'all'; // Send email invitations
  }

  // Add meeting link if provided
  if (eventDetails.meetingLink) {
    event.description = `${eventDetails.description}\n\nLink de Videollamada: ${eventDetails.meetingLink}`;

    // If it's a Google Meet link, we can attach it properly
    if (eventDetails.meetingLink.includes('meet.google.com')) {
      event.conferenceData = {
        entryPoints: [
          {
            entryPointType: 'video',
            uri: eventDetails.meetingLink,
          },
        ],
        conferenceSolution: {
          key: { type: 'hangoutsMeet' },
          name: 'Google Meet',
        },
      };
    }
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
    conferenceDataVersion: eventDetails.meetingLink?.includes('meet.google.com') ? 1 : 0,
    sendUpdates: eventDetails.attendeeEmail ? 'all' : 'none',
  });

  return response.data;
}

/**
 * Update a calendar event
 */
export async function updateCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    status?: 'confirmed' | 'cancelled';
    timezone?: string;
  }
) {
  const calendar = createCalendarClient(accessToken, refreshToken);

  const updateData: any = {};

  if (updates.summary) updateData.summary = updates.summary;
  if (updates.description) updateData.description = updates.description;
  if (updates.status === 'cancelled') updateData.status = 'cancelled';

  if (updates.startTime) {
    updateData.start = {
      dateTime: updates.startTime,
      timeZone: updates.timezone || 'America/Santiago',
    };
  }

  if (updates.endTime) {
    updateData.end = {
      dateTime: updates.endTime,
      timeZone: updates.timezone || 'America/Santiago',
    };
  }

  const response = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    requestBody: updateData,
  });

  return response.data;
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  eventId: string
) {
  const calendar = createCalendarClient(accessToken, refreshToken);

  await calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });
}

/**
 * Get busy times from calendar for availability checking
 */
export async function getBusyTimes(
  accessToken: string,
  refreshToken: string | undefined,
  timeMin: string, // ISO string
  timeMax: string, // ISO string
  timezone?: string
) {
  const calendar = createCalendarClient(accessToken, refreshToken);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: timezone || 'America/Santiago',
      items: [{ id: 'primary' }],
    },
  });

  return response.data.calendars?.primary?.busy || [];
}

/**
 * List upcoming events
 */
export async function listUpcomingEvents(
  accessToken: string,
  refreshToken: string | undefined,
  maxResults: number = 10
) {
  const calendar = createCalendarClient(accessToken, refreshToken);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}
