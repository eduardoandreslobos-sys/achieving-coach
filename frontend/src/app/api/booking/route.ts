import { NextRequest, NextResponse } from 'next/server';

// Note: This API provides server-side validation endpoints for bookings.
// The main booking operations use client-side Firebase for simplicity.
// These endpoints can be expanded with firebase-admin for enhanced security.

export async function GET(request: NextRequest) {
  // Public endpoint to check API health
  return NextResponse.json({
    status: 'ok',
    message: 'Booking API is running',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, clientName, clientEmail, date, time } = body;

    // Basic validation
    if (!coachId || !clientName || !clientEmail || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Expected YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { error: 'Invalid time format. Expected HH:MM' },
        { status: 400 }
      );
    }

    // Note: Actual booking creation happens client-side with Firebase
    // This endpoint provides validation and can be extended for webhooks, notifications, etc.
    return NextResponse.json({
      valid: true,
      message: 'Validation passed. Proceed with client-side booking.',
    });
  } catch (error) {
    console.error('Booking validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
