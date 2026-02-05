import { sendEmail, getPdfReportEmail, sendPdfReport } from '../emailService';

// Mock fetch
global.fetch = jest.fn();

describe('Email Service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, BREVO_API_KEY: 'test-api-key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('sendEmail', () => {
    it('should return error when API key is not configured', async () => {
      process.env.BREVO_API_KEY = '';

      const result = await sendEmail({
        to: [{ email: 'test@example.com' }],
        subject: 'Test',
        htmlContent: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email service not configured');
    });

    it('should send email successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ messageId: 'msg-123' }),
      });

      const result = await sendEmail({
        to: [{ email: 'test@example.com', name: 'Test User' }],
        subject: 'Test Subject',
        htmlContent: '<p>Test HTML</p>',
        textContent: 'Test Text',
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'api-key': 'test-api-key',
          }),
        })
      );
      expect(result.success).toBe(true);
      expect(result.messageId).toBe('msg-123');
    });

    it('should send email with attachments', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ messageId: 'msg-456' }),
      });

      await sendEmail({
        to: [{ email: 'test@example.com' }],
        subject: 'Test with attachment',
        htmlContent: '<p>Test</p>',
        attachment: [
          { name: 'document.pdf', content: 'base64encodedcontent' },
        ],
      });

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.attachment).toEqual([
        { name: 'document.pdf', content: 'base64encodedcontent' },
      ]);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid API key' }),
      });

      const result = await sendEmail({
        to: [{ email: 'test@example.com' }],
        subject: 'Test',
        htmlContent: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await sendEmail({
        to: [{ email: 'test@example.com' }],
        subject: 'Test',
        htmlContent: '<p>Test</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send email');
    });
  });

  describe('getPdfReportEmail', () => {
    it('should generate process report email content', () => {
      const result = getPdfReportEmail({
        recipientName: 'Juan Pérez',
        coacheeName: 'Juan Pérez',
        coachName: 'María Coach',
        reportType: 'process',
        programTitle: 'Programa Ejecutivo 2026',
      });

      expect(result.subject).toBe('Reporte de Proceso - Programa Ejecutivo 2026');
      expect(result.htmlContent).toContain('Hola Juan Pérez');
      expect(result.htmlContent).toContain('Reporte de Proceso');
      expect(result.htmlContent).toContain('Programa Ejecutivo 2026');
      expect(result.htmlContent).toContain('María Coach');
      expect(result.textContent).toContain('Reporte de Proceso');
    });

    it('should generate final report email content', () => {
      const result = getPdfReportEmail({
        recipientName: 'Ana García',
        coacheeName: 'Ana García',
        coachName: 'Pedro Coach',
        reportType: 'final',
        programTitle: 'Coaching Individual',
      });

      expect(result.subject).toBe('Informe Final - Coaching Individual');
      expect(result.htmlContent).toContain('Informe Final');
    });

    it('should generate agreement email content', () => {
      const result = getPdfReportEmail({
        recipientName: 'Carlos López',
        coacheeName: 'Carlos López',
        coachName: 'Laura Coach',
        reportType: 'agreement',
        programTitle: 'Programa CE',
      });

      expect(result.subject).toBe('Acuerdo de Coaching - Programa CE');
      expect(result.htmlContent).toContain('Acuerdo de Coaching');
    });

    it('should generate progress report email content', () => {
      const result = getPdfReportEmail({
        recipientName: 'María Rodríguez',
        coacheeName: 'María Rodríguez',
        coachName: 'José Coach',
        reportType: 'progress',
        programTitle: 'Mi Programa',
      });

      expect(result.subject).toBe('Reporte de Progreso - Mi Programa');
      expect(result.htmlContent).toContain('Reporte de Progreso');
    });

    it('should include confidentiality notice', () => {
      const result = getPdfReportEmail({
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        reportType: 'process',
        programTitle: 'Test Program',
      });

      expect(result.htmlContent).toContain('confidencial');
      expect(result.textContent).toContain('confidencial');
    });
  });

  describe('sendPdfReport', () => {
    it('should send PDF report email successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ messageId: 'msg-789' }),
      });

      const result = await sendPdfReport({
        recipientEmail: 'coachee@example.com',
        recipientName: 'Juan Coachee',
        coacheeName: 'Juan Coachee',
        coachName: 'Coach María',
        reportType: 'process',
        programTitle: 'Programa Test',
        pdfBase64: 'JVBERi0xLjQK...', // Mock PDF content
        fileName: 'reporte-proceso.pdf',
      });

      expect(result.success).toBe(true);

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.to[0].email).toBe('coachee@example.com');
      expect(callBody.attachment[0].name).toBe('reporte-proceso.pdf');
      expect(callBody.attachment[0].content).toBe('JVBERi0xLjQK...');
    });

    it('should handle errors when sending PDF report', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Attachment too large' }),
      });

      const result = await sendPdfReport({
        recipientEmail: 'test@example.com',
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        reportType: 'final',
        programTitle: 'Test',
        pdfBase64: 'large-content...',
        fileName: 'test.pdf',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Attachment too large');
    });

    it('should include correct email subject for each report type', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ messageId: 'msg-xxx' }),
      });

      // Test process report
      await sendPdfReport({
        recipientEmail: 'test@example.com',
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        reportType: 'process',
        programTitle: 'My Program',
        pdfBase64: 'content',
        fileName: 'report.pdf',
      });

      let callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.subject).toBe('Reporte de Proceso - My Program');

      // Test final report
      await sendPdfReport({
        recipientEmail: 'test@example.com',
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        reportType: 'final',
        programTitle: 'My Program',
        pdfBase64: 'content',
        fileName: 'report.pdf',
      });

      callBody = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body);
      expect(callBody.subject).toBe('Informe Final - My Program');
    });
  });
});
