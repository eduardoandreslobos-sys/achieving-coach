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

// ============ COACHEE PROGRESS REPORT PDF ============

interface CoacheeProgressReportData {
  coachee: {
    name: string;
    email: string;
  };
  program?: {
    name: string;
    startDate: Date;
    status: string;
    progress: number;
  };
  sessions: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
    list: {
      sessionNumber: number;
      date: Date;
      status: string;
      topic?: string;
    }[];
  };
  tools: {
    total: number;
    completed: number;
    list: {
      name: string;
      status: string;
      completedAt?: Date;
    }[];
  };
  goals: {
    total: number;
    completed: number;
    inProgress: number;
    list: {
      title: string;
      progress: number;
      status: string;
    }[];
  };
  generatedAt: Date;
}

export function generateCoacheeProgressReportPDF(
  report: CoacheeProgressReportData
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Mi Progreso', pageWidth / 2, 25, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(report.coachee.name, pageWidth / 2, 35, { align: 'center' });

  y = 55;

  // Coachee Info Box
  doc.setFillColor(...LIGHT_BG);
  doc.roundedRect(14, y, pageWidth - 28, 20, 3, 3, 'F');

  doc.setTextColor(...DARK_COLOR);
  doc.setFontSize(10);
  doc.text(`Email: ${report.coachee.email}`, 20, y + 8);
  doc.text(
    `Generado: ${report.generatedAt.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}`,
    20,
    y + 15
  );

  y += 30;

  // Program Info (if exists)
  if (report.program) {
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Programa de Coaching', 14, y);
    y += 8;

    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(14, y, pageWidth - 28, 25, 3, 3, 'F');

    doc.setTextColor(...DARK_COLOR);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Programa: ${report.program.name}`, 20, y + 8);
    doc.text(
      `Inicio: ${report.program.startDate.toLocaleDateString('es-CL')}`,
      20,
      y + 15
    );
    doc.text(`Progreso: ${report.program.progress}%`, 20, y + 22);

    // Progress bar
    const barWidth = 80;
    const barX = pageWidth - 28 - barWidth;
    doc.setFillColor(229, 231, 235); // gray-200
    doc.roundedRect(barX, y + 10, barWidth, 8, 2, 2, 'F');
    doc.setFillColor(...PRIMARY_COLOR);
    doc.roundedRect(
      barX,
      y + 10,
      (barWidth * report.program.progress) / 100,
      8,
      2,
      2,
      'F'
    );

    y += 35;
  }

  // Summary Stats
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen', 14, y);
  y += 8;

  const statsWidth = (pageWidth - 42) / 3;

  // Sessions stat
  doc.setFillColor(236, 253, 245); // emerald-50
  doc.roundedRect(14, y, statsWidth, 30, 3, 3, 'F');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${report.sessions.completed}/${report.sessions.total}`,
    14 + statsWidth / 2,
    y + 15,
    { align: 'center' }
  );
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Sesiones', 14 + statsWidth / 2, y + 25, { align: 'center' });

  // Tools stat
  doc.setFillColor(239, 246, 255); // blue-50
  doc.roundedRect(21 + statsWidth, y, statsWidth, 30, 3, 3, 'F');
  doc.setTextColor(37, 99, 235); // blue-600
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${report.tools.completed}/${report.tools.total}`,
    21 + statsWidth + statsWidth / 2,
    y + 15,
    { align: 'center' }
  );
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Herramientas', 21 + statsWidth + statsWidth / 2, y + 25, {
    align: 'center',
  });

  // Goals stat
  doc.setFillColor(254, 243, 199); // amber-100
  doc.roundedRect(28 + statsWidth * 2, y, statsWidth, 30, 3, 3, 'F');
  doc.setTextColor(217, 119, 6); // amber-600
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${report.goals.completed}/${report.goals.total}`,
    28 + statsWidth * 2 + statsWidth / 2,
    y + 15,
    { align: 'center' }
  );
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Metas', 28 + statsWidth * 2 + statsWidth / 2, y + 25, {
    align: 'center',
  });

  y += 45;

  // Sessions List
  if (report.sessions.list.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Sesiones', 14, y);
    y += 8;

    report.sessions.list.forEach((session, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const icon =
        session.status === 'completed'
          ? '✓'
          : session.status === 'scheduled'
          ? '◷'
          : '○';
      const statusColor =
        session.status === 'completed'
          ? [5, 150, 105]
          : session.status === 'scheduled'
          ? [37, 99, 235]
          : [107, 114, 128];

      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(icon, 20, y);
      doc.setTextColor(...DARK_COLOR);
      doc.text(
        `Sesión ${session.sessionNumber} - ${session.date.toLocaleDateString('es-CL')}`,
        30,
        y
      );
      if (session.topic) {
        doc.setTextColor(...GRAY_COLOR);
        doc.setFontSize(9);
        const topicLines = doc.splitTextToSize(session.topic, 100);
        doc.text(topicLines[0], pageWidth - 20, y, { align: 'right' });
      }
      y += 7;
    });

    y += 10;
  }

  // Tools List
  if (report.tools.list.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Herramientas', 14, y);
    y += 8;

    report.tools.list.forEach((tool) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      const icon = tool.status === 'completed' ? '✓' : tool.status === 'in-progress' ? '◐' : '○';
      const statusColor =
        tool.status === 'completed'
          ? [5, 150, 105]
          : tool.status === 'in-progress'
          ? [37, 99, 235]
          : [107, 114, 128];

      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setFontSize(10);
      doc.text(icon, 20, y);
      doc.setTextColor(...DARK_COLOR);
      doc.text(tool.name, 30, y);
      if (tool.completedAt) {
        doc.setTextColor(...GRAY_COLOR);
        doc.setFontSize(9);
        doc.text(tool.completedAt.toLocaleDateString('es-CL'), pageWidth - 20, y, {
          align: 'right',
        });
      }
      y += 7;
    });

    y += 10;
  }

  // Goals List
  if (report.goals.list.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Metas', 14, y);
    y += 8;

    report.goals.list.forEach((goal) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      const icon = goal.progress >= 100 ? '✓' : goal.progress > 0 ? '◐' : '○';
      const statusColor =
        goal.progress >= 100
          ? [5, 150, 105]
          : goal.progress > 0
          ? [37, 99, 235]
          : [107, 114, 128];

      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.setFontSize(10);
      doc.text(icon, 20, y);
      doc.setTextColor(...DARK_COLOR);
      const titleLines = doc.splitTextToSize(goal.title, 100);
      doc.text(titleLines[0], 30, y);

      // Mini progress bar
      const miniBarWidth = 40;
      const miniBarX = pageWidth - 20 - miniBarWidth - 25;
      doc.setFillColor(229, 231, 235);
      doc.roundedRect(miniBarX, y - 4, miniBarWidth, 5, 1, 1, 'F');
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(
        miniBarX,
        y - 4,
        (miniBarWidth * goal.progress) / 100,
        5,
        1,
        1,
        'F'
      );

      doc.setTextColor(...GRAY_COLOR);
      doc.setFontSize(9);
      doc.text(`${goal.progress}%`, pageWidth - 20, y, { align: 'right' });

      y += 10;
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(...GRAY_COLOR);
    doc.setFontSize(8);
    doc.text(
      `AchievingCoach - Mi Progreso | Pagina ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}
