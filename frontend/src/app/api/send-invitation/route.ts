import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getStakeholderInvitationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      stakeholderName,
      stakeholderEmail,
      stakeholderRole,
      coacheeName,
      coachName,
      programTitle,
      portalUrl,
      expiresAt,
    } = body;

    // Validar campos requeridos
    if (!stakeholderEmail || !stakeholderName || !portalUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generar contenido del email
    const emailContent = getStakeholderInvitationEmail({
      stakeholderName,
      stakeholderRole: stakeholderRole || 'Participante',
      coacheeName: coacheeName || 'Coachee',
      coachName: coachName || 'Coach',
      programTitle: programTitle || 'Programa de Coaching',
      portalUrl,
      expiresAt: expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL'),
    });

    // Enviar email
    const result = await sendEmail({
      to: [{ email: stakeholderEmail, name: stakeholderName }],
      subject: emailContent.subject,
      htmlContent: emailContent.htmlContent,
      textContent: emailContent.textContent,
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
    console.error('Send invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
