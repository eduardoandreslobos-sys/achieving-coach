import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, sessionReports, tripartiteResponses, coacheeName, programTitle } = body;

    if (!type || !sessionReports || !coacheeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt = '';
    
    if (type === 'process') {
      prompt = `Eres un experto en coaching ejecutivo. Analiza los siguientes datos de un proceso de coaching y genera un reporte de seguimiento estructurado.

DATOS DEL PROCESO:
- Coachee: ${coacheeName}
- Programa: ${programTitle || 'Coaching Ejecutivo'}

REPORTES DE SESIONES:
${sessionReports.map((s: any) => `
Sesión ${s.sessionNumber}:
- Tema: ${s.topic || 'No especificado'}
- Prácticas trabajadas: ${s.practices || 'No especificado'}
- Descubrimientos: ${s.discoveries || 'No especificado'}
- Tareas: ${s.tasks || 'No especificado'}
`).join('\n')}

${tripartiteResponses ? `
RESPUESTAS DE REUNIÓN TRIPARTITA:
${tripartiteResponses.map((r: any) => `
Pregunta: ${r.question}
- Coachee: ${r.coacheeResponse || 'No respondió'}
${r.sponsorResponse ? `- Sponsor: ${r.sponsorResponse}` : ''}
${r.hrResponse ? `- HR: ${r.hrResponse}` : ''}
`).join('\n')}
` : ''}

INSTRUCCIONES:
Genera un análisis profesional en formato JSON con exactamente estos campos (en español, redacción profesional):
{
  "centralThemes": "Síntesis de los temas centrales trabajados en 2-3 párrafos coherentes",
  "conservativeForces": "Fuerzas que mantienen al coachee en su situación actual, patrones que resisten el cambio",
  "transformativeForces": "Fuerzas y motivaciones que impulsan el cambio positivo en el coachee",
  "keyPractices": "Principales prácticas y competencias desarrolladas durante las sesiones",
  "relevantDiscoveries": "Descubrimientos y aprendizajes más significativos del coachee",
  "recommendations": "Recomendaciones concretas para las siguientes sesiones"
}

Responde SOLO con el JSON válido, sin texto adicional, sin markdown, sin backticks.`;
    } else if (type === 'final') {
      prompt = `Eres un experto en coaching ejecutivo. Analiza los siguientes datos de un proceso de coaching COMPLETO y genera el informe final profesional.

DATOS DEL PROCESO:
- Coachee: ${coacheeName}
- Programa: ${programTitle || 'Coaching Ejecutivo'}

REPORTES DE TODAS LAS SESIONES:
${sessionReports.map((s: any) => `
Sesión ${s.sessionNumber}:
- Tema: ${s.topic || 'No especificado'}
- Prácticas trabajadas: ${s.practices || 'No especificado'}
- Descubrimientos: ${s.discoveries || 'No especificado'}
- Tareas: ${s.tasks || 'No especificado'}
`).join('\n')}

${tripartiteResponses ? `
CONTEXTO INICIAL (REUNIÓN TRIPARTITA):
${tripartiteResponses.map((r: any) => `
Pregunta: ${r.question}
- Coachee: ${r.coacheeResponse || 'No respondió'}
${r.sponsorResponse ? `- Sponsor: ${r.sponsorResponse}` : ''}
`).join('\n')}
` : ''}

INSTRUCCIONES:
Genera el informe final profesional en formato JSON con exactamente estos campos (en español, redacción ejecutiva):
{
  "startingPointSummary": "Resumen detallado del punto de partida del coachee al inicio del proceso (2-3 párrafos)",
  "progressAchieved": "Progreso y logros alcanzados durante todo el proceso de coaching",
  "incorporatedPractices": "Prácticas y competencias que el coachee ha incorporado exitosamente a su desempeño",
  "areasToReinforce": "Áreas y brechas que aún requieren refuerzo o desarrollo continuo",
  "sustainabilityRecommendations": "Recomendaciones específicas para mantener y profundizar los cambios logrados a largo plazo"
}

Responde SOLO con el JSON válido, sin texto adicional, sin markdown, sin backticks.`;
    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json({ success: true, data: parsed });
    }
    
    return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 });
    
  } catch (error: any) {
    console.error('AI Report generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: 500 }
    );
  }
}
