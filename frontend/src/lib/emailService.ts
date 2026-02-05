const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

interface EmailAttachment {
  name: string;
  content: string; // base64 encoded content
}

interface EmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  replyTo?: { email: string; name?: string };
  attachment?: EmailAttachment[];
}

export async function sendEmail(params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    console.error('BREVO_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'AchievingCoach', email: 'noreply@achievingcoach.com' },
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent,
        replyTo: params.replyTo,
        ...(params.attachment && { attachment: params.attachment }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// ============ EMAIL TEMPLATES ============

export function getStakeholderInvitationEmail(data: {
  stakeholderName: string;
  stakeholderRole: string;
  coacheeName: string;
  coachName: string;
  programTitle: string;
  portalUrl: string;
  expiresAt: string;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `Invitación: Proceso de Coaching de ${data.coacheeName}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">AchievingCoach</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Portal de Stakeholder</p>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #111; margin-top: 0;">Hola ${data.stakeholderName},</h2>
    
    <p>Has sido invitado/a a participar como <strong>${data.stakeholderRole}</strong> en el proceso de coaching ejecutivo de <strong>${data.coacheeName}</strong>.</p>
    
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>Programa:</strong> ${data.programTitle}</p>
      <p style="margin: 0;"><strong>Coach:</strong> ${data.coachName}</p>
    </div>
    
    <p>Desde tu portal podrás:</p>
    <ul style="color: #555;">
      <li>Ver el progreso general del proceso</li>
      <li>Completar evaluaciones 360°</li>
      <li>Enviar feedback y observaciones</li>
      <li>Participar en reuniones tripartitas</li>
    </ul>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.portalUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Acceder al Portal
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666;">
      Este enlace es personal y expira el <strong>${data.expiresAt}</strong>.<br>
      No compartas este enlace con otras personas.
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>© 2025 AchievingCoach. Todos los derechos reservados.</p>
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
Hola ${data.stakeholderName},

Has sido invitado/a a participar como ${data.stakeholderRole} en el proceso de coaching ejecutivo de ${data.coacheeName}.

Programa: ${data.programTitle}
Coach: ${data.coachName}

Accede a tu portal desde aquí:
${data.portalUrl}

Este enlace es personal y expira el ${data.expiresAt}.

© 2025 AchievingCoach
  `.trim();

  return { subject, htmlContent, textContent };
}

export function getStakeholderReminderEmail(data: {
  stakeholderName: string;
  coacheeName: string;
  portalUrl: string;
  pendingAction: string;
}): { subject: string; htmlContent: string; textContent: string } {
  const subject = `Recordatorio: ${data.pendingAction} - Coaching de ${data.coacheeName}`;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Recordatorio</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #111; margin-top: 0;">Hola ${data.stakeholderName},</h2>
    
    <p>Tienes una acción pendiente en el proceso de coaching de <strong>${data.coacheeName}</strong>:</p>
    
    <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 18px; font-weight: 600; color: #92400e;">${data.pendingAction}</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.portalUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Ir al Portal
      </a>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>© 2025 AchievingCoach</p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
Hola ${data.stakeholderName},

Tienes una acción pendiente en el proceso de coaching de ${data.coacheeName}:

${data.pendingAction}

Accede a tu portal: ${data.portalUrl}

© 2025 AchievingCoach
  `.trim();

  return { subject, htmlContent, textContent };
}

// ============ PDF REPORT EMAIL ============

export function getPdfReportEmail(data: {
  recipientName: string;
  coacheeName: string;
  coachName: string;
  reportType: 'process' | 'final' | 'agreement' | 'progress';
  programTitle: string;
}): { subject: string; htmlContent: string; textContent: string } {
  const reportTypeNames: Record<typeof data.reportType, string> = {
    process: 'Reporte de Proceso',
    final: 'Informe Final',
    agreement: 'Acuerdo de Coaching',
    progress: 'Reporte de Progreso',
  };

  const reportName = reportTypeNames[data.reportType];
  const subject = `${reportName} - ${data.programTitle}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📄 ${reportName}</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AchievingCoach</p>
  </div>

  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <h2 style="color: #111; margin-top: 0;">Hola ${data.recipientName},</h2>

    <p>Adjunto encontrarás el <strong>${reportName}</strong> del proceso de coaching.</p>

    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0 0 10px 0;"><strong>Programa:</strong> ${data.programTitle}</p>
      <p style="margin: 0 0 10px 0;"><strong>Coachee:</strong> ${data.coacheeName}</p>
      <p style="margin: 0;"><strong>Coach:</strong> ${data.coachName}</p>
    </div>

    <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; color: #059669;">
        <strong>📎 Archivo adjunto:</strong> ${reportName.toLowerCase().replace(/ /g, '-')}.pdf
      </p>
    </div>

    <p style="font-size: 14px; color: #666;">
      Este documento es confidencial y está destinado únicamente para el destinatario indicado.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>© 2025 AchievingCoach. Todos los derechos reservados.</p>
    <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
  </div>
</body>
</html>
  `.trim();

  const textContent = `
Hola ${data.recipientName},

Adjunto encontrarás el ${reportName} del proceso de coaching.

Programa: ${data.programTitle}
Coachee: ${data.coacheeName}
Coach: ${data.coachName}

Este documento es confidencial y está destinado únicamente para el destinatario indicado.

© 2025 AchievingCoach
  `.trim();

  return { subject, htmlContent, textContent };
}

export async function sendPdfReport(data: {
  recipientEmail: string;
  recipientName: string;
  coacheeName: string;
  coachName: string;
  reportType: 'process' | 'final' | 'agreement' | 'progress';
  programTitle: string;
  pdfBase64: string;
  fileName: string;
}): Promise<{ success: boolean; error?: string }> {
  const emailContent = getPdfReportEmail({
    recipientName: data.recipientName,
    coacheeName: data.coacheeName,
    coachName: data.coachName,
    reportType: data.reportType,
    programTitle: data.programTitle,
  });

  return sendEmail({
    to: [{ email: data.recipientEmail, name: data.recipientName }],
    subject: emailContent.subject,
    htmlContent: emailContent.htmlContent,
    textContent: emailContent.textContent,
    attachment: [
      {
        name: data.fileName,
        content: data.pdfBase64,
      },
    ],
  });
}
