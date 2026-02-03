'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generateCoacheeProgressReport } from '@/lib/coachingService';
import { generateCoacheeProgressReportPDF, downloadPDF } from '@/lib/pdfService';
import { CoacheeProgressReport } from '@/types/coaching';
import {
  Download,
  Calendar,
  Target,
  Wrench,
  CheckCircle,
  Clock,
  Circle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function ProgressPage() {
  const { userProfile } = useAuth();
  const [report, setReport] = useState<CoacheeProgressReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      if (!userProfile?.oduid) return;
      setLoading(true);
      try {
        const data = await generateCoacheeProgressReport(userProfile.oduid);
        setReport(data);
      } catch (error) {
        console.error('Error loading progress report:', error);
        toast.error('Error al cargar el reporte de progreso');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [userProfile?.oduid]);

  const loadReport = async () => {
    if (!userProfile?.oduid) return;
    setLoading(true);
    try {
      const data = await generateCoacheeProgressReport(userProfile.oduid);
      setReport(data);
    } catch (error) {
      console.error('Error loading progress report:', error);
      toast.error('Error al cargar el reporte de progreso');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    setDownloading(true);
    try {
      // Convert Timestamps to Dates for PDF generation
      const pdfData = {
        coachee: {
          name: report.coachee.name,
          email: report.coachee.email,
        },
        program: report.program
          ? {
              name: report.program.name,
              startDate: report.program.startDate?.toDate?.() || new Date(),
              status: report.program.status,
              progress: report.program.progress,
            }
          : undefined,
        sessions: {
          ...report.sessions,
          list: report.sessions.list.map((s) => ({
            sessionNumber: s.sessionNumber,
            date: s.date?.toDate?.() || new Date(),
            status: s.status || 'scheduled',
            topic: s.topic,
          })),
        },
        tools: {
          ...report.tools,
          list: report.tools.list.map((t) => ({
            name: t.name,
            status: t.status,
            completedAt: t.completedAt?.toDate?.(),
          })),
        },
        goals: report.goals,
        generatedAt: report.generatedAt?.toDate?.() || new Date(),
      };

      const doc = generateCoacheeProgressReportPDF(pdfData);
      downloadPDF(doc, `mi-progreso-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'scheduled':
      case 'pending_confirmation':
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada';
      case 'scheduled':
        return 'Programada';
      case 'pending_confirmation':
        return 'Por confirmar';
      case 'in-progress':
        return 'En progreso';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-[var(--fg-muted)]">Cargando tu progreso...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            Sin datos de progreso
          </h2>
          <p className="text-[var(--fg-muted)]">
            Aún no tienes sesiones o programas registrados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <Toaster position="top-center" richColors />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-primary)]">Mi Progreso</h1>
            <p className="text-[var(--fg-muted)]">
              Resumen de tu avance en el proceso de coaching
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generando...' : 'Descargar PDF'}
          </button>
        </div>

        {/* Program Info */}
        {report.program && (
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
                  {report.program.name}
                </h2>
                <p className="text-sm text-[var(--fg-muted)]">
                  Inicio: {report.program.startDate?.toDate?.()?.toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-emerald-600">
                  {report.program.progress}%
                </span>
                <p className="text-sm text-[var(--fg-muted)]">completado</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${report.program.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Sessions */}
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Sesiones</p>
                <p className="text-2xl font-bold text-[var(--fg-primary)]">
                  {report.sessions.completed}/{report.sessions.total}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">completadas</p>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Herramientas</p>
                <p className="text-2xl font-bold text-[var(--fg-primary)]">
                  {report.tools.completed}/{report.tools.total}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">realizadas</p>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-[var(--fg-muted)]">Metas</p>
                <p className="text-2xl font-bold text-[var(--fg-primary)]">
                  {report.goals.completed}/{report.goals.total}
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">alcanzadas</p>
          </div>
        </div>

        {/* Sessions List */}
        {report.sessions.list.length > 0 && (
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Sesiones
            </h3>
            <div className="space-y-3">
              {report.sessions.list.map((session, idx) => (
                <div
                  key={session.id || idx}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(session.status || 'scheduled')}
                    <div>
                      <p className="font-medium text-[var(--fg-primary)]">
                        Sesión {session.sessionNumber}
                      </p>
                      <p className="text-sm text-[var(--fg-muted)]">
                        {session.date?.toDate?.()?.toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }) || 'Fecha por definir'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        session.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : session.status === 'scheduled' || session.status === 'pending_confirmation'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {getStatusLabel(session.status || 'scheduled')}
                    </span>
                    {session.topic && (
                      <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-[150px] truncate">
                        {session.topic}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools List */}
        {report.tools.list.length > 0 && (
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" />
              Herramientas Completadas
            </h3>
            <div className="space-y-3">
              {report.tools.list.map((tool, idx) => (
                <div
                  key={tool.id || idx}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {tool.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : tool.status === 'in-progress' ? (
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-[var(--fg-primary)]">{tool.name}</span>
                  </div>
                  {tool.completedAt && (
                    <span className="text-sm text-[var(--fg-muted)]">
                      {tool.completedAt.toDate?.()?.toLocaleDateString('es-CL')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals List */}
        {report.goals.list.length > 0 && (
          <div className="bg-white rounded-xl border border-[var(--border-color)] p-6">
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-600" />
              Metas
            </h3>
            <div className="space-y-4">
              {report.goals.list.map((goal, idx) => (
                <div key={goal.id || idx} className="py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {goal.progress >= 100 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : goal.progress > 0 ? (
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-[var(--fg-primary)]">{goal.title}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--fg-primary)]">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 ml-7">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        goal.progress >= 100
                          ? 'bg-emerald-500'
                          : goal.progress > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
