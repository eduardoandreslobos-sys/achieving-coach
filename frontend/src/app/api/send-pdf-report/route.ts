import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getPdfReportEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      recipientEmail,
      recipientName,
      coacheeName,
      coachName,
      reportType,
      programTitle,
      pdfBase64,
      fileName,
    } = body;

    // Validate required fields
    if (!recipientEmail || !pdfBase64 || !fileName || !reportType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate email content
    const emailContent = getPdfReportEmail({
      recipientName: recipientName || 'Destinatario',
      coacheeName: coacheeName || 'Coachee',
      coachName: coachName || 'Coach',
      reportType,
      programTitle: programTitle || 'Programa de Coaching',
    });

    // Send email with PDF attachment
    const result = await sendEmail({
      to: [{ email: recipientEmail, name: recipientName }],
      subject: emailContent.subject,
      htmlContent: emailContent.htmlContent,
      textContent: emailContent.textContent,
      attachment: [
        {
          name: fileName,
          content: pdfBase64,
        },
      ],
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
    });

  } catch (error) {
    console.error('Send PDF report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
