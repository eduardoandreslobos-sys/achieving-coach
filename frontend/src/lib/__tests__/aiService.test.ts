/**
 * AI Service Tests - Gemini Integration
 *
 * Tests AI report generation functionality with Google Gemini.
 * These tests verify the service behavior with mocked AI responses.
 */

// Create mock storage object that can be accessed from factory and tests
const mockStore = {
  generateContent: jest.fn(),
};

// Mock with factory function
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: (...args: unknown[]) => mockStore.generateContent(...args),
    })),
  })),
}));

import {
  generateProcessReportSummary,
  generateFinalReportSummary,
  ReportSummaryInput,
  ProcessReportSummary,
  FinalReportSummary,
} from '../aiService';

describe('AI Service - Gemini Integration', () => {
  const sampleInput: ReportSummaryInput = {
    coacheeName: 'Juan García',
    programTitle: 'Liderazgo Ejecutivo',
    sessionReports: [
      {
        sessionNumber: 1,
        topic: 'Definición de objetivos de liderazgo',
        practices: 'Escucha activa, feedback constructivo',
        discoveries: 'Identificó estilo de liderazgo dominante',
        tasks: 'Practicar escucha activa en 3 reuniones',
      },
      {
        sessionNumber: 2,
        topic: 'Gestión de conflictos',
        practices: 'Comunicación asertiva, empatía',
        discoveries: 'Tendencia a evitar confrontaciones',
        tasks: 'Abordar un conflicto pendiente esta semana',
      },
      {
        sessionNumber: 3,
        topic: 'Delegación efectiva',
        practices: 'Confianza en el equipo, seguimiento',
        discoveries: 'Micromanagement como barrera',
        tasks: 'Delegar 2 tareas importantes',
      },
    ],
    tripartiteResponses: [
      {
        question: '¿Cuáles son los objetivos principales del coaching?',
        coacheeResponse: 'Mejorar mi liderazgo y comunicación',
        sponsorResponse: 'Que desarrolle habilidades de gestión de equipos',
        hrResponse: 'Prepararlo para un rol de mayor responsabilidad',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.generateContent.mockReset();
  });

  describe('generateProcessReportSummary', () => {
    const validProcessResponse: ProcessReportSummary = {
      centralThemes: 'El coachee ha trabajado principalmente en desarrollar habilidades de liderazgo.',
      conservativeForces: 'Se identificó una tendencia al micromanagement.',
      transformativeForces: 'Fuerte motivación por mejorar.',
      keyPractices: 'Escucha activa, comunicación asertiva.',
      relevantDiscoveries: 'Reconocimiento del estilo de liderazgo dominante.',
      recommendations: 'Continuar trabajando en la delegación progresiva.',
    };

    it('should generate process report summary with valid input', async () => {
      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(validProcessResponse),
        },
      });

      const result = await generateProcessReportSummary(sampleInput);

      expect(result).toHaveProperty('centralThemes');
      expect(result).toHaveProperty('conservativeForces');
      expect(result).toHaveProperty('transformativeForces');
      expect(result).toHaveProperty('keyPractices');
      expect(result).toHaveProperty('relevantDiscoveries');
      expect(result).toHaveProperty('recommendations');
    });

    it('should return fallback when AI fails', async () => {
      mockStore.generateContent.mockRejectedValue(new Error('API Error'));

      const result = await generateProcessReportSummary(sampleInput);

      // Should return fallback values
      expect(result.conservativeForces).toBe('Pendiente de análisis');
      expect(result.recommendations).toContain('Continuar con el proceso');
    });

    it('should return fallback when response is not valid JSON', async () => {
      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => 'This is not valid JSON',
        },
      });

      const result = await generateProcessReportSummary(sampleInput);

      expect(result.conservativeForces).toBe('Pendiente de análisis');
    });

    it('should parse JSON embedded in text', async () => {
      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => `Here is the analysis: ${JSON.stringify(validProcessResponse)}`,
        },
      });

      const result = await generateProcessReportSummary(sampleInput);

      expect(result.centralThemes).toBe(validProcessResponse.centralThemes);
    });
  });

  describe('generateFinalReportSummary', () => {
    const validFinalResponse: FinalReportSummary = {
      startingPointSummary: 'Al inicio del proceso, Juan García se encontraba en una posición de liderazgo.',
      progressAchieved: 'Ha logrado implementar prácticas de delegación.',
      incorporatedPractices: 'Escucha activa en reuniones.',
      areasToReinforce: 'Continuar trabajando en la gestión de conflictos.',
      sustainabilityRecommendations: 'Establecer reuniones mensuales de seguimiento.',
    };

    it('should generate final report summary with valid input', async () => {
      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify(validFinalResponse),
        },
      });

      const result = await generateFinalReportSummary(sampleInput);

      expect(result).toHaveProperty('startingPointSummary');
      expect(result).toHaveProperty('progressAchieved');
      expect(result).toHaveProperty('incorporatedPractices');
      expect(result).toHaveProperty('areasToReinforce');
      expect(result).toHaveProperty('sustainabilityRecommendations');
    });

    it('should return fallback when AI fails', async () => {
      mockStore.generateContent.mockRejectedValue(new Error('Network Error'));

      const result = await generateFinalReportSummary(sampleInput);

      expect(result.startingPointSummary).toBe('Pendiente de análisis');
      expect(result.sustainabilityRecommendations).toContain('Continuar aplicando');
    });
  });

  describe('Input Handling', () => {
    it('should handle empty session reports', async () => {
      const emptyInput: ReportSummaryInput = {
        coacheeName: 'Test User',
        programTitle: 'Test Program',
        sessionReports: [],
      };

      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            centralThemes: 'No sessions',
            conservativeForces: 'N/A',
            transformativeForces: 'N/A',
            keyPractices: 'N/A',
            relevantDiscoveries: 'N/A',
            recommendations: 'Start sessions',
          }),
        },
      });

      const result = await generateProcessReportSummary(emptyInput);

      expect(result).toBeDefined();
      expect(mockStore.generateContent).toHaveBeenCalled();
    });

    it('should handle missing tripartite responses', async () => {
      const inputWithoutTripartite: ReportSummaryInput = {
        coacheeName: 'Test',
        programTitle: 'Test',
        sessionReports: sampleInput.sessionReports,
        tripartiteResponses: undefined,
      };

      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            centralThemes: 'Test',
            conservativeForces: 'Test',
            transformativeForces: 'Test',
            keyPractices: 'Test',
            relevantDiscoveries: 'Test',
            recommendations: 'Test',
          }),
        },
      });

      const result = await generateProcessReportSummary(inputWithoutTripartite);

      expect(result).toBeDefined();
    });

    it('should handle many sessions (12 sessions)', async () => {
      const manySessionsInput: ReportSummaryInput = {
        coacheeName: 'Test',
        programTitle: 'Test',
        sessionReports: Array.from({ length: 12 }, (_, i) => ({
          sessionNumber: i + 1,
          topic: `Topic ${i + 1}`,
          practices: `Practices ${i + 1}`,
          discoveries: `Discoveries ${i + 1}`,
          tasks: `Tasks ${i + 1}`,
        })),
      };

      mockStore.generateContent.mockResolvedValue({
        response: {
          text: () => JSON.stringify({
            centralThemes: 'Comprehensive analysis',
            conservativeForces: 'Multiple barriers identified',
            transformativeForces: 'Strong growth trajectory',
            keyPractices: 'Various practices developed',
            relevantDiscoveries: 'Many insights gained',
            recommendations: 'Continue the momentum',
          }),
        },
      });

      const result = await generateProcessReportSummary(manySessionsInput);

      expect(result).toBeDefined();
    });
  });
});
