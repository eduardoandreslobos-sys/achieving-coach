import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ReportSummaryInput {
  sessionReports: {
    sessionNumber: number;
    topic: string;
    practices: string;
    discoveries: string;
    tasks: string;
  }[];
  tripartiteResponses?: {
    question: string;
    coacheeResponse: string;
    sponsorResponse?: string;
    hrResponse?: string;
  }[];
  coacheeName: string;
  programTitle: string;
}

export interface ProcessReportSummary {
  centralThemes: string;
  conservativeForces: string;
  transformativeForces: string;
  keyPractices: string;
  relevantDiscoveries: string;
  recommendations: string;
}

export interface FinalReportSummary {
  startingPointSummary: string;
  progressAchieved: string;
  incorporatedPractices: string;
  areasToReinforce: string;
  sustainabilityRecommendations: string;
}

export async function generateProcessReportSummary(
  input: ReportSummaryInput
): Promise<ProcessReportSummary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Eres un experto en coaching ejecutivo. Analiza los siguientes datos de un proceso de coaching y genera un reporte de seguimiento estructurado.

DATOS DEL PROCESO:
- Coachee: ${input.coacheeName}
- Programa: ${input.programTitle}

REPORTES DE SESIONES:
${input.sessionReports.map(s => `
Sesión ${s.sessionNumber}:
- Tema: ${s.topic}
- Prácticas trabajadas: ${s.practices}
- Descubrimientos: ${s.discoveries}
- Tareas: ${s.tasks}
`).join('\n')}

${input.tripartiteResponses ? `
RESPUESTAS DE REUNIÓN TRIPARTITA:
${input.tripartiteResponses.map(r => `
Pregunta: ${r.question}
- Coachee: ${r.coacheeResponse}
${r.sponsorResponse ? `- Sponsor: ${r.sponsorResponse}` : ''}
${r.hrResponse ? `- HR: ${r.hrResponse}` : ''}
`).join('\n')}
` : ''}

INSTRUCCIONES:
Genera un análisis en formato JSON con exactamente estos campos (en español):
{
  "centralThemes": "Síntesis de los temas centrales trabajados en 2-3 párrafos",
  "conservativeForces": "Fuerzas que mantienen al coachee en su situación actual, patrones que resisten el cambio",
  "transformativeForces": "Fuerzas y motivaciones que impulsan el cambio positivo",
  "keyPractices": "Principales prácticas y competencias desarrolladas",
  "relevantDiscoveries": "Descubrimientos y aprendizajes más significativos",
  "recommendations": "Recomendaciones para las siguientes sesiones"
}

Responde SOLO con el JSON, sin texto adicional ni markdown.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ProcessReportSummary;
    }
    
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.error('Error generating process report summary:', error);
    // Return fallback
    return {
      centralThemes: input.sessionReports.map(s => s.topic).join('\n\n'),
      conservativeForces: 'Pendiente de análisis',
      transformativeForces: 'Pendiente de análisis',
      keyPractices: input.sessionReports.map(s => s.practices).join('\n'),
      relevantDiscoveries: input.sessionReports.map(s => s.discoveries).join('\n\n'),
      recommendations: 'Continuar con el proceso según lo planificado',
    };
  }
}

export async function generateFinalReportSummary(
  input: ReportSummaryInput
): Promise<FinalReportSummary> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Eres un experto en coaching ejecutivo. Analiza los siguientes datos de un proceso de coaching COMPLETO y genera el informe final.

DATOS DEL PROCESO:
- Coachee: ${input.coacheeName}
- Programa: ${input.programTitle}

REPORTES DE TODAS LAS SESIONES:
${input.sessionReports.map(s => `
Sesión ${s.sessionNumber}:
- Tema: ${s.topic}
- Prácticas trabajadas: ${s.practices}
- Descubrimientos: ${s.discoveries}
- Tareas: ${s.tasks}
`).join('\n')}

${input.tripartiteResponses ? `
CONTEXTO INICIAL (REUNIÓN TRIPARTITA):
${input.tripartiteResponses.map(r => `
Pregunta: ${r.question}
- Coachee: ${r.coacheeResponse}
${r.sponsorResponse ? `- Sponsor: ${r.sponsorResponse}` : ''}
`).join('\n')}
` : ''}

INSTRUCCIONES:
Genera el informe final en formato JSON con exactamente estos campos (en español):
{
  "startingPointSummary": "Resumen del punto de partida del coachee al inicio del proceso",
  "progressAchieved": "Progreso y logros alcanzados durante el proceso",
  "incorporatedPractices": "Prácticas y competencias que el coachee ha incorporado exitosamente",
  "areasToReinforce": "Áreas y brechas que aún requieren refuerzo o desarrollo",
  "sustainabilityRecommendations": "Recomendaciones para mantener y profundizar los cambios logrados"
}

Responde SOLO con el JSON, sin texto adicional ni markdown.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as FinalReportSummary;
    }
    
    throw new Error('No valid JSON in response');
  } catch (error) {
    console.error('Error generating final report summary:', error);
    // Return fallback
    return {
      startingPointSummary: 'Pendiente de análisis',
      progressAchieved: input.sessionReports.map(s => s.discoveries).join('\n'),
      incorporatedPractices: input.sessionReports.map(s => s.practices).join('\n'),
      areasToReinforce: 'Pendiente de análisis',
      sustainabilityRecommendations: 'Continuar aplicando las prácticas aprendidas',
    };
  }
}
