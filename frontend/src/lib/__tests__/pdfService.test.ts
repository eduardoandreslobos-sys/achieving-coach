import jsPDF from 'jspdf';
import {
  generateProcessReportPDF,
  generateFinalReportPDF,
  generateAgreementPDF,
  downloadPDF,
  getPDFBase64,
  sendPDFByEmail,
} from '../pdfService';

// Mock fetch for sendPDFByEmail
global.fetch = jest.fn();

// Mock jsPDF
jest.mock('jspdf', () => {
  const mockJsPDF = jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    setFillColor: jest.fn(),
    setTextColor: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    rect: jest.fn(),
    roundedRect: jest.fn(),
    text: jest.fn(),
    splitTextToSize: jest.fn((text) => [text]),
    addPage: jest.fn(),
    setPage: jest.fn(),
    getNumberOfPages: jest.fn(() => 1),
    save: jest.fn(),
    output: jest.fn((type) => {
      if (type === 'datauristring') {
        return 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoK';
      }
      return '';
    }),
  }));
  return mockJsPDF;
});

describe('PDF Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateProcessReportPDF', () => {
    it('should generate a process report PDF', () => {
      const program = {
        title: 'Coaching Ejecutivo 2026',
        coacheeName: 'Juan Pérez',
        coachName: 'María Coach',
        organizationName: 'Empresa ABC',
      };

      const report = {
        centralThemes: 'Liderazgo y comunicación',
        coacheeAspects: {
          conservativeForces: 'Resistencia al cambio',
          transformativeForces: 'Motivación al crecimiento',
        },
        relevantDiscoveries: 'Nuevas fortalezas identificadas',
        aiGenerated: true,
      };

      const doc = generateProcessReportPDF(program, report);

      expect(doc).toBeDefined();
      expect(doc.text).toHaveBeenCalled();
      expect(doc.setFillColor).toHaveBeenCalled();
    });

    it('should handle empty report data', () => {
      const program = {
        title: 'Test Program',
        coacheeName: '',
        coachName: '',
      };

      const report = {};

      const doc = generateProcessReportPDF(program, report);

      expect(doc).toBeDefined();
    });
  });

  describe('generateFinalReportPDF', () => {
    it('should generate a final report PDF', () => {
      const program = {
        title: 'Programa Final',
        coacheeName: 'Ana García',
        coachName: 'Pedro Coach',
        organizationName: 'Empresa XYZ',
      };

      const report = {
        startingPointData: 'Situación inicial',
        closingAspects: 'Aspectos de cierre',
        incorporatedPractices: 'Nuevas prácticas',
        gapsToReinforce: 'Brechas identificadas',
        sustainabilityRecommendations: 'Recomendaciones',
        finalObservations: 'Observaciones finales',
        aiGenerated: false,
      };

      const doc = generateFinalReportPDF(program, report);

      expect(doc).toBeDefined();
      expect(doc.text).toHaveBeenCalled();
    });
  });

  describe('generateAgreementPDF', () => {
    it('should generate an agreement PDF', () => {
      const program = {
        title: 'Acuerdo de Coaching',
        coacheeName: 'Carlos López',
        coachName: 'Laura Coach',
        organizationName: 'Corp Inc',
      };

      const agreement = {
        generalObjective: 'Desarrollar habilidades de liderazgo',
        workDomains: 'Comunicación, Gestión de equipos',
        expectedResults: 'Mejora en indicadores de liderazgo',
        competencies: 'Escucha activa, Feedback efectivo',
        progressIndicators: 'Evaluaciones 360',
      };

      const doc = generateAgreementPDF(program, agreement);

      expect(doc).toBeDefined();
      expect(doc.text).toHaveBeenCalled();
    });
  });

  describe('downloadPDF', () => {
    it('should call save on the PDF document', () => {
      const mockDoc = new jsPDF();
      downloadPDF(mockDoc, 'test-document.pdf');

      expect(mockDoc.save).toHaveBeenCalledWith('test-document.pdf');
    });
  });

  describe('getPDFBase64', () => {
    it('should return base64 encoded PDF without data URI prefix', () => {
      const mockDoc = new jsPDF();
      const base64 = getPDFBase64(mockDoc);

      expect(mockDoc.output).toHaveBeenCalledWith('datauristring');
      // Should return only the base64 part, without the "data:application/pdf;base64," prefix
      expect(base64).toBe('JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoK');
      expect(base64).not.toContain('data:application/pdf');
    });
  });

  describe('sendPDFByEmail', () => {
    it('should send PDF by email successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const mockDoc = new jsPDF();
      const result = await sendPDFByEmail({
        doc: mockDoc,
        fileName: 'reporte-proceso.pdf',
        recipientEmail: 'test@example.com',
        recipientName: 'Test User',
        coacheeName: 'Juan Coachee',
        coachName: 'María Coach',
        programTitle: 'Mi Programa',
        reportType: 'process',
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/send-pdf-report',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const callBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.recipientEmail).toBe('test@example.com');
      expect(callBody.fileName).toBe('reporte-proceso.pdf');
      expect(callBody.reportType).toBe('process');
      expect(callBody.pdfBase64).toBeDefined();

      expect(result.success).toBe(true);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Server error' }),
      });

      const mockDoc = new jsPDF();
      const result = await sendPDFByEmail({
        doc: mockDoc,
        fileName: 'test.pdf',
        recipientEmail: 'test@example.com',
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        programTitle: 'Test',
        reportType: 'final',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Server error');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      const mockDoc = new jsPDF();
      const result = await sendPDFByEmail({
        doc: mockDoc,
        fileName: 'test.pdf',
        recipientEmail: 'test@example.com',
        recipientName: 'Test',
        coacheeName: 'Test',
        coachName: 'Coach',
        programTitle: 'Test',
        reportType: 'agreement',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al enviar el email');
    });

    it('should pass correct report type in request', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      const mockDoc = new jsPDF();

      // Test each report type
      const reportTypes: Array<'process' | 'final' | 'agreement' | 'progress'> = [
        'process',
        'final',
        'agreement',
        'progress',
      ];

      for (const reportType of reportTypes) {
        await sendPDFByEmail({
          doc: mockDoc,
          fileName: 'test.pdf',
          recipientEmail: 'test@example.com',
          recipientName: 'Test',
          coacheeName: 'Test',
          coachName: 'Coach',
          programTitle: 'Test',
          reportType,
        });
      }

      expect(fetch).toHaveBeenCalledTimes(4);
    });
  });
});
