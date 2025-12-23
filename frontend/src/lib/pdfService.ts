import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: { finalY: number };
  }
}

interface ProgramData {
  title: string;
  coacheeName: string;
  coachName: string;
  organizationName?: string;
}

interface ProcessReportData {
  centralThemes?: string;
  coacheeAspects?: {
    conservativeForces?: string;
    transformativeForces?: string;
  };
  organizationalContext?: {
    conservativeForces?: string;
    transformativeForces?: string;
  };
  newPractices?: { name: string; context: string }[];
  relevantDiscoveries?: string;
  observations?: string;
  aiGenerated?: boolean;
}

interface FinalReportData {
  startingPointData?: string;
  closingAspects?: string;
  incorporatedPractices?: string;
  gapsToReinforce?: string;
  sustainabilityRecommendations?: string;
  finalObservations?: string;
  aiGenerated?: boolean;
}

const PRIMARY_COLOR: [number, number, number] = [79, 70, 229];
const DARK_COLOR: [number, number, number] = [31, 41, 55];
const GRAY_COLOR: [number, number, number] = [107, 114, 128];
const LIGHT_BG: [number, number, number] = [249, 250, 251];

export function generateProcessReportPDF(
  program: ProgramData,
  report: ProcessReportData
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte de Proceso', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(program.title, pageWidth / 2, 35, { align: 'center' });

  y = 55;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F');
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Coachee:', 20, y + 10);
  doc.text('Coach:', 20, y + 20);
  doc.text('Organización:', pageWidth/2, y + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.text(program.coacheeName || '-', 50, y + 10);
  doc.text(program.coachName || '-', 50, y + 20);
  doc.text(program.organizationName || '-', pageWidth/2 + 40, y + 10);

  if (report.aiGenerated) {
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(8);
    doc.text('Generado con IA', pageWidth - 20, y + 28, { align: 'right' });
  }

  y += 40;

  const sections = [
    { title: 'Temas Centrales', content: report.centralThemes },
    { title: 'Fuerzas Conservadoras del Coachee', content: report.coacheeAspects?.conservativeForces },
    { title: 'Fuerzas Transformadoras del Coachee', content: report.coacheeAspects?.transformativeForces },
    { title: 'Fuerzas Conservadoras del Sistema', content: report.organizationalContext?.conservativeForces },
    { title: 'Fuerzas Transformadoras del Sistema', content: report.organizationalContext?.transformativeForces },
    { title: 'Descubrimientos Relevantes', content: report.relevantDiscoveries },
    { title: 'Observaciones', content: report.observations },
  ];

  sections.forEach(section => {
    if (!section.content) return;
    if (y > 250) { doc.addPage(); y = 20; }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 14, y);
    y += 6;

    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, pageWidth - 28);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 10;
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(8);
    doc.text(`AchievingCoach - Reporte de Proceso | Pagina ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  return doc;
}

export function generateFinalReportPDF(
  program: ProgramData,
  report: FinalReportData
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Informe Final', pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(14);
  doc.text('Programa de Coaching Ejecutivo', pageWidth / 2, 32, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(program.title, pageWidth / 2, 42, { align: 'center' });

  y = 60;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageWidth - 28, 30, 3, 3, 'F');
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Coachee:', 20, y + 10);
  doc.text('Coach:', 20, y + 20);
  doc.text('Organizacion:', pageWidth/2, y + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.text(program.coacheeName || '-', 50, y + 10);
  doc.text(program.coachName || '-', 50, y + 20);
  doc.text(program.organizationName || '-', pageWidth/2 + 40, y + 10);

  if (report.aiGenerated) {
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(8);
    doc.text('Generado con IA', pageWidth - 20, y + 28, { align: 'right' });
  }

  y += 40;

  const sections = [
    { title: 'Punto de Partida', content: report.startingPointData },
    { title: 'Aspectos del Cierre', content: report.closingAspects },
    { title: 'Practicas Incorporadas', content: report.incorporatedPractices },
    { title: 'Brechas a Reforzar', content: report.gapsToReinforce },
    { title: 'Recomendaciones de Sostenibilidad', content: report.sustainabilityRecommendations },
    { title: 'Observaciones Finales', content: report.finalObservations },
  ];

  sections.forEach(section => {
    if (!section.content) return;
    if (y > 250) { doc.addPage(); y = 20; }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 14, y);
    y += 6;

    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, pageWidth - 28);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 12;
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(8);
    doc.text(`AchievingCoach - Informe Final | Pagina ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  return doc;
}

export function generateAgreementPDF(
  program: ProgramData,
  agreement: {
    generalObjective?: string;
    workDomains?: string;
    expectedResults?: string;
    competencies?: string;
    progressIndicators?: string;
  }
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Acuerdo de Coaching', pageWidth / 2, 22, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(program.title, pageWidth / 2, 31, { align: 'center' });

  y = 50;

  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageWidth - 28, 25, 3, 3, 'F');
  
  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Coach: ${program.coachName || '-'}`, 20, y + 10);
  doc.text(`Coachee: ${program.coacheeName || '-'}`, 20, y + 20);
  doc.text(`Organizacion: ${program.organizationName || '-'}`, pageWidth / 2, y + 10);

  y += 35;

  const sections = [
    { title: 'Objetivo General', content: agreement.generalObjective },
    { title: 'Dominios de Trabajo', content: agreement.workDomains },
    { title: 'Resultados Esperados', content: agreement.expectedResults },
    { title: 'Competencias a Desarrollar', content: agreement.competencies },
    { title: 'Indicadores de Progreso', content: agreement.progressIndicators },
  ];

  sections.forEach(section => {
    if (!section.content) return;
    if (y > 260) { doc.addPage(); y = 20; }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 14, y);
    y += 6;

    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(section.content, pageWidth - 28);
    doc.text(lines, 14, y);
    y += lines.length * 5 + 10;
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(8);
    doc.text(`AchievingCoach - Acuerdo de Coaching | Pagina ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  return doc;
}

export function downloadPDF(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
