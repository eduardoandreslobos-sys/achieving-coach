'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  getCoachingProgram,
  getProgramSessions,
  updateCoachingProgram,
  saveBackgroundInfo,
  saveTripartiteMeeting,
  saveAlignmentSession,
  saveCoachingAgreement,
  saveSessionCalendar,
  generateProcessReportWithAI,
  updateProcessReport,
  generateFinalReportWithAI,
  updateFinalReport,
  completeFinalReport,
  createSession,
  getProgramPhaseStatus
} from '@/lib/coachingService';
import {
  CoachingProgram,
  Session,
  PROGRAM_PHASES,
  TRIPARTITE_QUESTIONS,
  DEFAULT_CONFIDENTIALITY_NOTE,
  DEFAULT_ATTENDANCE_POLICY,
  DEFAULT_COACH_RESPONSIBILITIES,
  DEFAULT_COACHEE_RESPONSIBILITIES,
  DEFAULT_SPONSOR_RESPONSIBILITIES,
  BackgroundInfo,
  TripartiteMeeting,
  TripartiteResponse,
  Participant,
  CoachingAgreement,
  SessionCalendarEntry,
  ProcessReport,
  FinalReport,
  AlignmentSession,
  getPendingRequirements,
  isPhaseComplete,
  getPhaseProgress,
  getPhaseName,
  getPhaseDescription,
  FIELD_PLACEHOLDERS,
  FIELD_TOOLTIPS
} from '@/types/coaching';
import GuidanceBox from '@/components/ui/GuidanceBox';
import LabelWithTooltip from '@/components/ui/LabelWithTooltip';
import { Timestamp } from 'firebase/firestore';
import {
  FileText, Users, FileSignature, Calendar, Play, Eye,
  ClipboardList, Award, ChevronRight, Check, Clock, Bell,
  Save, Plus, Trash2, ArrowLeft, AlertCircle, Download,
  Building2, User, Sparkles, Mail
} from 'lucide-react';
import { generateProcessReportPDF, generateFinalReportPDF, generateAgreementPDF, downloadPDF, sendPDFByEmail } from '@/lib/pdfService';
import StakeholderManager from '@/components/Stakeholders/StakeholderManager';
import SignaturePad from '@/components/ui/SignaturePad';
import { signAgreement } from '@/lib/coachingService';
const ICON_MAP: Record<string, any> = {
  FileText, Users, FileSignature, Calendar, Play, Eye, ClipboardList, Award
};

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const programId = params?.programId as string;

  const [program, setProgram] = useState<CoachingProgram | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (programId && userProfile?.uid) {
      loadData();
    }
  }, [programId, userProfile]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [programData, sessionsData] = await Promise.all([
        getCoachingProgram(programId),
        getProgramSessions(programId)
      ]);
      
      if (programData) {
        setProgram(programData);
        setActiveTab(programData.currentPhase || 1);
      }
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--fg-primary)] mb-2">Programa no encontrado</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/coach/clients/${program.coacheeId}`)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft size={20} />
            Volver al cliente
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[var(--fg-primary)]">{program.title}</h1>
            {/* Coaching Type Badge */}
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              program.coachingType === 'individual'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-primary-100 text-primary-800'
            }`}>
              {program.coachingType === 'individual' ? (
                <>
                  <User size={14} />
                  Individual
                </>
              ) : (
                <>
                  <Building2 size={14} />
                  Ejecutivo
                </>
              )}
            </span>
          </div>
          <p className="text-[var(--fg-muted)]">{program.coacheeName}</p>
        </div>

        {/* Progress Bar with Phase Requirements */}
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--fg-muted)]">Progreso del Proceso</span>
            <span className="text-sm text-[var(--fg-muted)]">
              Fase {program.currentPhase || 1} de {PROGRAM_PHASES.length}
            </span>
          </div>
          <div className="flex gap-1 mb-3">
            {PROGRAM_PHASES.map((phase) => {
              const isComplete = isPhaseComplete(phase.id, program, sessions);
              const isCurrent = phase.id === program.currentPhase;
              const progress = getPhaseProgress(phase.id, program, sessions);

              return (
                <div
                  key={phase.id}
                  className="flex-1 relative group"
                  title={`${phase.name}: ${isComplete ? 'Completada' : `${progress}%`}`}
                >
                  <div
                    className={`h-2 rounded ${
                      isComplete
                        ? 'bg-green-500'
                        : isCurrent
                        ? 'bg-primary-500'
                        : 'bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {isCurrent && !isComplete && progress > 0 && (
                      <div
                        className="h-full bg-primary-400 rounded"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Phase Requirements */}
          {program.currentPhase && program.currentPhase <= 9 && (
            <PhaseRequirementsIndicator
              program={program}
              sessions={sessions}
              currentPhase={program.currentPhase}
            />
          )}
        </div>

        {/* Stakeholder Manager */}
        <div className="mb-6">
          <StakeholderManager
            programId={programId}
            coacheeId={program.coacheeId}
            coachId={userProfile?.uid || ''}
            coacheeName={program.coacheeName || 'Coachee'}
            coachName={userProfile?.displayName || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Coach'}
            programTitle={program.title || 'Programa de Coaching'}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-[var(--border-color)] overflow-x-auto">
            <div className="flex">
              {PROGRAM_PHASES.map((phase) => {
                const Icon = ICON_MAP[phase.icon] || FileText;
                const isCompleted = (program.phasesCompleted || []).includes(phase.id);
                const isCurrent = phase.id === program.currentPhase;
                const isAccessible = phase.id <= (program.currentPhase || 1);

                return (
                  <button
                    key={phase.id}
                    onClick={() => isAccessible && setActiveTab(phase.id)}
                    disabled={!isAccessible}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === phase.id
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : isCompleted
                        ? 'border-transparent text-green-600 hover:bg-green-50'
                        : isAccessible
                        ? 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]'
                        : 'border-transparent text-[var(--fg-secondary)] cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Icon size={16} />
                    )}
                    <span className="hidden md:inline">{getPhaseName(phase.id, program.coachingType || 'corporate')}</span>
                    {/* Indicador de reporte nuevo */}
                    {((phase.id === 6 && program.processReport?.autoGenerated && !program.processReport?.editedByCoach) ||
                      (phase.id === 9 && program.finalReport?.autoGenerated && !program.finalReport?.editedByCoach)) && (
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Nuevo reporte para revisar" />
                    )}
                    <span className="md:hidden">{phase.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 1 && (
              <BackgroundInfoTab
                program={program}
                onSave={async (data) => {
                  setSaving(true);
                  try {
                    await saveBackgroundInfo(programId, data);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}

            {activeTab === 2 && (
              program.coachingType === 'individual' ? (
                <AlignmentSessionTab
                  program={program}
                  onSave={async (data) => {
                    setSaving(true);
                    try {
                      await saveAlignmentSession(programId, data);
                      await loadData();
                    } finally {
                      setSaving(false);
                    }
                  }}
                  saving={saving}
                />
              ) : (
                <TripartiteMeetingTab
                  program={program}
                  onSave={async (data) => {
                    setSaving(true);
                    try {
                      await saveTripartiteMeeting(programId, data);
                      await loadData();
                    } finally {
                      setSaving(false);
                    }
                  }}
                  saving={saving}
                />
              )
            )}

            {activeTab === 3 && (
              <AgreementTab
                program={program}
                programId={programId}
                userProfile={userProfile}
                onSave={async (data) => {
                  setSaving(true);
                  try {
                    await saveCoachingAgreement(programId, data);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                onReload={loadData}
                saving={saving}
              />
            )}

            {activeTab === 4 && (
              <CalendarTab
                program={program}
                sessions={sessions}
                onSave={async (calendar) => {
                  setSaving(true);
                  try {
                    await saveSessionCalendar(programId, calendar);
                    // Create sessions from calendar
                    for (const entry of calendar) {
                      if (entry.date && entry.sessionNumber > 0) {
                        await createSession(
                          programId,
                          program.coachId,
                          program.coacheeId,
                          program.coacheeName,
                          {
                            sessionNumber: entry.sessionNumber,
                            title: `Sesión ${entry.sessionNumber}`,
                            scheduledDate: entry.date.toDate(),
                            scheduledTime: entry.time || '10:00',
                            duration: 60,
                            objective: '',
                            type: entry.type,
                            location: entry.location,
                          }
                        );
                      }
                    }
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}

            {activeTab === 5 && (
              <SessionsTab
                program={program}
                sessions={sessions.filter(s => s.sessionNumber <= 3)}
                onRefresh={loadData}
              />
            )}

            {activeTab === 6 && (
              <ProcessReportTab
                coachName={userProfile?.displayName || "Coach"}
                program={program}
                onGenerate={async () => {
                  setSaving(true);
                  try {
                    await generateProcessReportWithAI(programId);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                onUpdate={async (data) => {
                  setSaving(true);
                  try {
                    await updateProcessReport(programId, data);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}

            {activeTab === 7 && (
              <SessionsTab
                program={program}
                sessions={sessions.filter(s => s.sessionNumber === 4)}
                isObserved
                onRefresh={loadData}
              />
            )}

            {activeTab === 8 && (
              <SessionsTab
                program={program}
                sessions={sessions.filter(s => s.sessionNumber >= 5)}
                onRefresh={loadData}
              />
            )}

            {activeTab === 9 && (
              <FinalReportTab
                coachName={userProfile?.displayName || "Coach"}
                program={program}
                onGenerate={async () => {
                  setSaving(true);
                  try {
                    await generateFinalReportWithAI(programId);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                onUpdate={async (data) => {
                  setSaving(true);
                  try {
                    await updateFinalReport(programId, data);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                onComplete={async () => {
                  setSaving(true);
                  try {
                    await completeFinalReport(programId);
                    await loadData();
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PHASE REQUIREMENTS INDICATOR ============

function PhaseRequirementsIndicator({
  program,
  sessions,
  currentPhase
}: {
  program: CoachingProgram;
  sessions: Session[];
  currentPhase: number;
}) {
  const phase = PROGRAM_PHASES.find(p => p.id === currentPhase);
  if (!phase) return null;

  const pendingReqs = getPendingRequirements(currentPhase, program, sessions);
  const completedReqs = phase.requirements.filter(req => req.check(program, sessions));
  const totalReqs = phase.requirements.length;

  const phaseName = getPhaseName(currentPhase, program.coachingType || 'corporate');

  if (pendingReqs.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
        <Check size={16} />
        <span>Fase {currentPhase} completada - {phaseName}</span>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-800">
          Fase {currentPhase}: {phaseName}
        </span>
        <span className="text-xs text-blue-600">
          {completedReqs.length}/{totalReqs} requisitos
        </span>
      </div>
      <div className="space-y-1">
        {phase.requirements.map((req, idx) => {
          const isComplete = req.check(program, sessions);
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 text-xs ${
                isComplete ? 'text-green-600' : 'text-blue-700'
              }`}
            >
              {isComplete ? (
                <Check size={12} className="text-green-500" />
              ) : (
                <Clock size={12} className="text-blue-500" />
              )}
              <span>{req.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ TAB COMPONENTS ============

function BackgroundInfoTab({ 
  program, 
  onSave, 
  saving 
}: {
  program: CoachingProgram;
  onSave: (data: BackgroundInfo) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<BackgroundInfo>(program.backgroundInfo || {});
  const isIndividual = program.coachingType === 'individual';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-[var(--fg-primary)]">Antecedentes Generales del Proceso</h2>
          {isIndividual && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <User size={12} />
              Individual
            </span>
          )}
        </div>
        <p className="text-[var(--fg-muted)] text-sm">
          {isIndividual
            ? 'Complete la información del coachee y del coach.'
            : 'Complete la información general del coachee y los actores del proceso.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coachee */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[var(--fg-primary)] border-b pb-2">Datos del Coachee</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Nombre</label>
            <input
              type="text"
              value={form.coacheeName || program.coacheeName || ''}
              onChange={(e) => setForm({ ...form, coacheeName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Cargo</label>
            <input
              type="text"
              value={form.coacheePosition || ''}
              onChange={(e) => setForm({ ...form, coacheePosition: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Teléfono</label>
            <input
              type="tel"
              value={form.coacheePhone || ''}
              onChange={(e) => setForm({ ...form, coacheePhone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Email</label>
            <input
              type="email"
              value={form.coacheeEmail || ''}
              onChange={(e) => setForm({ ...form, coacheeEmail: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Organización</label>
            <input
              type="text"
              value={form.organizationName || ''}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Supervisor - Solo para coaching corporativo */}
        {!isIndividual && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--fg-primary)] border-b pb-2">Jefe Directo / Sponsor</h3>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Nombre</label>
              <input
                type="text"
                value={form.supervisorName || ''}
                onChange={(e) => setForm({ ...form, supervisorName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Cargo</label>
              <input
                type="text"
                value={form.supervisorPosition || ''}
                onChange={(e) => setForm({ ...form, supervisorPosition: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.supervisorPhone || ''}
                onChange={(e) => setForm({ ...form, supervisorPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Email</label>
              <input
                type="email"
                value={form.supervisorEmail || ''}
                onChange={(e) => setForm({ ...form, supervisorEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* HR - Solo para coaching corporativo */}
        {!isIndividual && (
          <div className="space-y-4">
            <h3 className="font-semibold text-[var(--fg-primary)] border-b pb-2">RRHH (Opcional)</h3>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Nombre</label>
              <input
                type="text"
                value={form.hrName || ''}
                onChange={(e) => setForm({ ...form, hrName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Teléfono</label>
              <input
                type="tel"
                value={form.hrPhone || ''}
                onChange={(e) => setForm({ ...form, hrPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Email</label>
              <input
                type="email"
                value={form.hrEmail || ''}
                onChange={(e) => setForm({ ...form, hrEmail: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {/* Coach */}
        <div className="space-y-4">
          <h3 className="font-semibold text-[var(--fg-primary)] border-b pb-2">Coach</h3>
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Nombre</label>
            <input
              type="text"
              value={form.coachName || ''}
              onChange={(e) => setForm({ ...form, coachName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar y Continuar'}
        </button>
      </div>
    </div>
  );
}

function TripartiteMeetingTab({ 
  program, 
  onSave, 
  saving 
}: { 
  program: CoachingProgram; 
  onSave: (data: TripartiteMeeting) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<TripartiteMeeting>(
    program.tripartiteMeeting || {
      participants: [],
      responses: TRIPARTITE_QUESTIONS.map(q => ({
        questionId: q.id,
        question: q.question,
        coacheeResponse: '',
        sponsorResponse: '',
        hrResponse: '',
      })),
    }
  );

  const updateResponse = (questionId: number, field: string, value: string) => {
    setForm({
      ...form,
      responses: form.responses.map(r =>
        r.questionId === questionId ? { ...r, [field]: value } : r
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">Reunión Tripartita</h2>
        <p className="text-[var(--fg-muted)] text-sm">Pauta de preguntas para la reunión con el coachee, sponsor y RRHH.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Fecha de la reunión</label>
          <input
            type="date"
            value={form.date ? new Date(form.date.seconds * 1000).toISOString().split('T')[0] : ''}
            onChange={(e) => setForm({ ...form, date: Timestamp.fromDate(new Date(e.target.value)) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Lugar</label>
          <input
            type="text"
            value={form.location || ''}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="space-y-8">
        {TRIPARTITE_QUESTIONS.map((question) => {
          const response = form.responses.find(r => r.questionId === question.id);
          
          return (
            <div key={question.id} className="bg-[var(--bg-secondary)] rounded-xl p-4">
              <h3 className="font-semibold text-[var(--fg-primary)] mb-4">
                {question.id}. {question.question}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Coachee: {question.coacheeLabel}
                  </label>
                  <textarea
                    value={response?.coacheeResponse || ''}
                    onChange={(e) => updateResponse(question.id, 'coacheeResponse', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">
                    Sponsor: {question.sponsorLabel}
                  </label>
                  <textarea
                    value={response?.sponsorResponse || ''}
                    onChange={(e) => updateResponse(question.id, 'sponsorResponse', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-1">
                    RRHH: {question.hrLabel}
                  </label>
                  <textarea
                    value={response?.hrResponse || ''}
                    onChange={(e) => updateResponse(question.id, 'hrResponse', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar y Continuar'}
        </button>
      </div>
    </div>
  );
}

function AlignmentSessionTab({
  program,
  onSave,
  saving
}: {
  program: CoachingProgram;
  onSave: (data: AlignmentSession) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<AlignmentSession>(
    program.alignmentSession || {
      personalGoals: '',
      currentSituation: '',
      successVision: '',
      progressIndicators: '',
      strengthsToLeverage: '',
      areasToImprove: '',
      initialCommitments: '',
      observations: '',
    }
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="text-emerald-600" size={24} />
          <h2 className="text-xl font-bold text-[var(--fg-primary)]">Sesión de Alineación Personal</h2>
        </div>
        <p className="text-[var(--fg-muted)] text-sm">
          Esta sesión reemplaza la reunión tripartita para procesos de coaching individual (sin empresa/sponsor).
          El objetivo es establecer una alineación clara entre coach y coachee sobre los objetivos del proceso.
        </p>
      </div>

      {/* Indicador de completado */}
      {program.alignmentSession?.completedAt && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <Check className="text-green-600" size={20} />
          <div>
            <span className="font-medium text-green-800">Sesión de Alineación Completada</span>
            <p className="text-sm text-green-600">
              {program.alignmentSession.completedAt.toDate?.()?.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Fecha de la sesión</label>
          <input
            type="date"
            value={form.date ? new Date((form.date as any).seconds * 1000).toISOString().split('T')[0] : ''}
            onChange={(e) => setForm({ ...form, date: Timestamp.fromDate(new Date(e.target.value)) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Lugar / Modalidad</label>
          <input
            type="text"
            value={form.location || ''}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Presencial / Zoom / Teams"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Metas Personales */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
          <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
            <Sparkles size={18} />
            Metas Personales del Proceso
          </h3>
          <p className="text-xs text-emerald-600 mb-2">¿Qué quieres lograr con este proceso de coaching?</p>
          <textarea
            value={form.personalGoals || ''}
            onChange={(e) => setForm({ ...form, personalGoals: e.target.value })}
            rows={4}
            placeholder="Describe las metas que deseas alcanzar..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Situación Actual */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Situación Actual</h3>
          <p className="text-xs text-blue-600 mb-2">¿Cómo describes tu situación actual respecto a estas metas?</p>
          <textarea
            value={form.currentSituation || ''}
            onChange={(e) => setForm({ ...form, currentSituation: e.target.value })}
            rows={4}
            placeholder="Describe tu punto de partida..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Visión de Éxito */}
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">Visión de Éxito</h3>
          <p className="text-xs text-purple-600 mb-2">¿Cómo se verá tu vida cuando hayas alcanzado estas metas?</p>
          <textarea
            value={form.successVision || ''}
            onChange={(e) => setForm({ ...form, successVision: e.target.value })}
            rows={4}
            placeholder="Describe tu visión de éxito..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Indicadores de Progreso */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2">Indicadores de Progreso</h3>
          <p className="text-xs text-orange-600 mb-2">¿Cómo sabrás que estás avanzando?</p>
          <textarea
            value={form.progressIndicators || ''}
            onChange={(e) => setForm({ ...form, progressIndicators: e.target.value })}
            rows={3}
            placeholder="Define indicadores medibles u observables..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fortalezas */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Fortalezas a Potenciar</h3>
            <p className="text-xs text-green-600 mb-2">¿Qué recursos y fortalezas tienes a tu favor?</p>
            <textarea
              value={form.strengthsToLeverage || ''}
              onChange={(e) => setForm({ ...form, strengthsToLeverage: e.target.value })}
              rows={4}
              placeholder="Lista tus fortalezas..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>

          {/* Áreas de Mejora */}
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Áreas a Desarrollar</h3>
            <p className="text-xs text-red-600 mb-2">¿Qué aspectos necesitas trabajar?</p>
            <textarea
              value={form.areasToImprove || ''}
              onChange={(e) => setForm({ ...form, areasToImprove: e.target.value })}
              rows={4}
              placeholder="Identifica áreas de mejora..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>

        {/* Compromisos Iniciales */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
          <h3 className="font-semibold text-indigo-800 mb-2">Compromisos Iniciales</h3>
          <p className="text-xs text-indigo-600 mb-2">¿Qué te comprometes a hacer para avanzar hacia tus metas?</p>
          <textarea
            value={form.initialCommitments || ''}
            onChange={(e) => setForm({ ...form, initialCommitments: e.target.value })}
            rows={4}
            placeholder="Define tus compromisos iniciales..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Observaciones del Coach */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)]">
          <h3 className="font-semibold text-[var(--fg-primary)] mb-2">Observaciones del Coach</h3>
          <p className="text-xs text-[var(--fg-muted)] mb-2">Notas adicionales del coach sobre esta sesión de alineación.</p>
          <textarea
            value={form.observations || ''}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            rows={3}
            placeholder="Observaciones adicionales..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar y Continuar'}
        </button>
      </div>
    </div>
  );
}

function AgreementTab({
  program,
  programId,
  userProfile,
  onSave,
  onReload,
  saving
}: {
  program: CoachingProgram;
  programId: string;
  userProfile: any;
  onSave: (data: Omit<CoachingAgreement, 'signatures' | 'status'>) => Promise<void>;
  onReload: () => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<Partial<CoachingAgreement>>(
    program.agreement || {
      actors: [],
      generalObjective: '',
      workDomains: [''],
      expectedResults: [''],
      competenciesToDevelop: [''],
      progressIndicators: [''],
      coachResponsibilities: DEFAULT_COACH_RESPONSIBILITIES,
      coacheeResponsibilities: DEFAULT_COACHEE_RESPONSIBILITIES,
      sponsorResponsibilities: DEFAULT_SPONSOR_RESPONSIBILITIES,
      confidentialityNote: DEFAULT_CONFIDENTIALITY_NOTE,
      totalSessions: program.sessionsPlanned || 6,
      includesObservedSession: true,
      sessionAttendancePolicy: DEFAULT_ATTENDANCE_POLICY,
    }
  );

  // Coach signing state
  const [coachSignatureImage, setCoachSignatureImage] = useState<string | null>(null);
  const [signingAsCoach, setSigningAsCoach] = useState(false);

  const hasCoachSigned = program.agreement?.signatures?.some(s => s.role === 'coach') ?? false;

  const handleCoachSign = async () => {
    if (!userProfile || !coachSignatureImage) {
      alert('Por favor, dibuja tu firma antes de continuar');
      return;
    }

    setSigningAsCoach(true);
    try {
      await signAgreement(
        programId,
        userProfile.uid,
        userProfile.displayName || userProfile.name || 'Coach',
        userProfile.email || '',
        'coach',
        ['Acuerdo de Coaching'],
        coachSignatureImage
      );
      alert('¡Acuerdo firmado como coach exitosamente!');
      await onReload();
    } catch (error: any) {
      console.error('Error signing as coach:', error);
      alert(error.message || 'Error al firmar');
    } finally {
      setSigningAsCoach(false);
    }
  };

  const updateArrayField = (field: keyof CoachingAgreement, index: number, value: string) => {
    const arr = [...(form[field] as string[] || [])];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addToArray = (field: keyof CoachingAgreement) => {
    setForm({ ...form, [field]: [...(form[field] as string[] || []), ''] });
  };

  const removeFromArray = (field: keyof CoachingAgreement, index: number) => {
    const arr = [...(form[field] as string[] || [])];
    arr.splice(index, 1);
    setForm({ ...form, [field]: arr });
  };

  const isIndividual = program.coachingType === 'individual';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-[var(--fg-primary)]">
            {isIndividual ? 'Acuerdo de Coaching Personal' : 'Acuerdo de Coaching CE'}
          </h2>
          {isIndividual && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <User size={12} />
              Individual
            </span>
          )}
        </div>
        <p className="text-[var(--fg-muted)] text-sm">
          {isIndividual
            ? 'Este acuerdo formaliza el proceso de coaching personal entre coach y coachee.'
            : 'Este acuerdo es para darle estructura de formalidad al proceso de Coaching Ejecutivo.'}
        </p>
        {isIndividual && (
          <p className="text-emerald-600 text-xs mt-1">
            Solo requiere firma del coach y coachee (sin sponsor).
          </p>
        )}
      </div>

      {/* Status */}
      {program.agreement?.status && (
        <div className={`p-4 rounded-lg ${
          program.agreement.status === 'signed' ? 'bg-green-50 border border-green-200' :
          program.agreement.status === 'pending_signatures' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-[var(--bg-secondary)] border border-[var(--border-color)]'
        }`}>
          <div className="flex items-center gap-2">
            {program.agreement.status === 'signed' ? (
              <Check className="text-green-600" size={20} />
            ) : (
              <Clock className="text-yellow-600" size={20} />
            )}
            <span className="font-medium">
              Estado: {
                program.agreement.status === 'signed' ? 'Firmado' :
                program.agreement.status === 'pending_signatures' ? 'Pendiente de firmas' :
                'Borrador'
              }
            </span>
          </div>
          {program.agreement.signatures && program.agreement.signatures.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {program.agreement.signatures.map((sig, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border">
                  <p className="font-medium text-[var(--fg-primary)]">{sig.name}</p>
                  <p className="text-xs text-[var(--fg-muted)] capitalize">{sig.role}</p>
                  {sig.signatureImage && (
                    <div className="mt-2 border-t pt-2">
                      <img
                        src={sig.signatureImage}
                        alt={`Firma de ${sig.name}`}
                        className="max-h-12 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coach Signing Section */}
      {program.agreement?.status === 'pending_signatures' && !hasCoachSigned && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-[var(--fg-primary)] mb-3 flex items-center gap-2">
            <FileSignature className="text-blue-600" size={18} />
            Firmar como Coach
          </h3>
          <p className="text-sm text-[var(--fg-muted)] mb-4">
            Dibuja tu firma para firmar el acuerdo como coach.
          </p>
          <SignaturePad
            onSignatureChange={setCoachSignatureImage}
            width={350}
            height={120}
            disabled={signingAsCoach}
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCoachSign}
              disabled={signingAsCoach || !coachSignatureImage}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <FileSignature size={18} />
              {signingAsCoach ? 'Firmando...' : 'Firmar Acuerdo'}
            </button>
          </div>
        </div>
      )}

      {hasCoachSigned && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Check className="text-green-600" size={18} />
          <span className="text-green-700 font-medium">Ya has firmado este acuerdo</span>
        </div>
      )}

      {/* Objetivos */}
      <div className="space-y-4">
        <h3 className="font-semibold text-[var(--fg-primary)]">Objetivos del Proceso</h3>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Objetivo General</label>
          <textarea
            value={form.generalObjective || ''}
            onChange={(e) => setForm({ ...form, generalObjective: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="El objetivo general para el proceso es..."
          />
        </div>

        {/* Dominios de trabajo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[var(--fg-muted)]">Dominios de Trabajo</label>
            <button
              type="button"
              onClick={() => addToArray('workDomains')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Agregar
            </button>
          </div>
          {(form.workDomains || []).map((domain, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={domain}
                onChange={(e) => updateArrayField('workDomains', idx, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {(form.workDomains?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray('workDomains', idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Resultados esperados */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[var(--fg-muted)]">Resultados Esperados</label>
            <button
              type="button"
              onClick={() => addToArray('expectedResults')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Agregar
            </button>
          </div>
          {(form.expectedResults || []).map((result, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={result}
                onChange={(e) => updateArrayField('expectedResults', idx, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {(form.expectedResults?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray('expectedResults', idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Competencias */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[var(--fg-muted)]">Prácticas o Competencias a Desarrollar</label>
            <button
              type="button"
              onClick={() => addToArray('competenciesToDevelop')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Agregar
            </button>
          </div>
          {(form.competenciesToDevelop || []).map((comp, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={comp}
                onChange={(e) => updateArrayField('competenciesToDevelop', idx, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {(form.competenciesToDevelop?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray('competenciesToDevelop', idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Indicadores */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-[var(--fg-muted)]">Indicadores de Progreso</label>
            <button
              type="button"
              onClick={() => addToArray('progressIndicators')}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              + Agregar
            </button>
          </div>
          {(form.progressIndicators || []).map((ind, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ind}
                onChange={(e) => updateArrayField('progressIndicators', idx, e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              {(form.progressIndicators?.length || 0) > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArray('progressIndicators', idx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confidencialidad */}
      <div className="space-y-4 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <h3 className="font-semibold text-[var(--fg-primary)] flex items-center gap-2">
          <AlertCircle className="text-yellow-600" size={20} />
          Promesa de Confidencialidad
        </h3>
        <p className="text-sm text-[var(--fg-muted)]">Este texto será mostrado al coachee para su aceptación.</p>
        <textarea
          value={form.confidentialityNote || ''}
          onChange={(e) => setForm({ ...form, confidentialityNote: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Sesiones */}
      <div className="space-y-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h3 className="font-semibold text-[var(--fg-primary)]">Acerca de las Sesiones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Número de Sesiones</label>
            <input
              type="number"
              value={form.totalSessions || 6}
              onChange={(e) => setForm({ ...form, totalSessions: parseInt(e.target.value) })}
              min={1}
              max={20}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.includesObservedSession || false}
                onChange={(e) => setForm({ ...form, includesObservedSession: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-[var(--fg-muted)]">Incluye sesión de reunión observada</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Política de Asistencia y Cancelación</label>
          <textarea
            value={form.sessionAttendancePolicy || ''}
            onChange={(e) => setForm({ ...form, sessionAttendancePolicy: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
      </div>

      {/* Vigencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Vigencia Desde</label>
          <input
            type="date"
            value={form.validFrom ? new Date((form.validFrom as any).seconds * 1000).toISOString().split('T')[0] : ''}
            onChange={(e) => setForm({ ...form, validFrom: Timestamp.fromDate(new Date(e.target.value)) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Vigencia Hasta</label>
          <input
            type="date"
            value={form.validUntil ? new Date((form.validUntil as any).seconds * 1000).toISOString().split('T')[0] : ''}
            onChange={(e) => setForm({ ...form, validUntil: Timestamp.fromDate(new Date(e.target.value)) })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(form as Omit<CoachingAgreement, 'signatures' | 'status'>)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar y Enviar para Firma'}
        </button>
      </div>
    </div>
  );
}

function CalendarTab({ 
  program, 
  sessions,
  onSave, 
  saving 
}: { 
  program: CoachingProgram;
  sessions: Session[];
  onSave: (calendar: SessionCalendarEntry[]) => Promise<void>;
  saving: boolean;
}) {
  const totalSessions = program.agreement?.totalSessions || program.sessionsPlanned || 6;
  const [calendar, setCalendar] = useState<SessionCalendarEntry[]>(
    program.sessionCalendar || 
    Array.from({ length: totalSessions + 1 }, (_, i) => ({
      sessionNumber: i, // 0 = tripartita
      type: i === 0 ? 'kickstarter' as const : i === 4 ? 'observed' as const : 'regular' as const,
    }))
  );

  const updateEntry = (index: number, field: keyof SessionCalendarEntry, value: any) => {
    setCalendar(calendar.map((entry, i) => 
      i === index ? { ...entry, [field]: value } : entry
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">Calendarización de Sesiones</h2>
        <p className="text-[var(--fg-muted)] text-sm">Establezca la línea del tiempo del proceso completo.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--bg-secondary)]">
              <th className="border p-3 text-left text-sm font-medium text-[var(--fg-muted)]">N° Sesión</th>
              <th className="border p-3 text-left text-sm font-medium text-[var(--fg-muted)]">Fecha</th>
              <th className="border p-3 text-left text-sm font-medium text-[var(--fg-muted)]">Hora</th>
              <th className="border p-3 text-left text-sm font-medium text-[var(--fg-muted)]">Lugar</th>
              <th className="border p-3 text-left text-sm font-medium text-[var(--fg-muted)]">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {calendar.map((entry, index) => (
              <tr key={index} className={entry.sessionNumber === 4 ? 'bg-yellow-50' : ''}>
                <td className="border p-3 font-medium">
                  {entry.sessionNumber === 0 ? 'Tripartita' : `Sesión ${entry.sessionNumber}`}
                </td>
                <td className="border p-3">
                  <input
                    type="date"
                    value={entry.date ? new Date((entry.date as any).seconds * 1000).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateEntry(index, 'date', Timestamp.fromDate(new Date(e.target.value)))}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="time"
                    value={entry.time || ''}
                    onChange={(e) => updateEntry(index, 'time', e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="text"
                    value={entry.location || ''}
                    onChange={(e) => updateEntry(index, 'location', e.target.value)}
                    className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500"
                    placeholder="Lugar o link"
                  />
                </td>
                <td className="border p-3 text-sm">
                  {entry.sessionNumber === 0 ? 'Inicial' : 
                   entry.sessionNumber === 4 ? 'Observada' : 
                   entry.sessionNumber === totalSessions ? 'Cierre' : 'Regular'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(calendar)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Calendario'}
        </button>
      </div>
    </div>
  );
}

function SessionsTab({
  program,
  sessions,
  isObserved,
  onRefresh
}: {
  program: CoachingProgram;
  sessions: Session[];
  isObserved?: boolean;
  onRefresh: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">
          {isObserved ? 'Sesión de Reunión Observada' : 'Sesiones de Coaching'}
        </h2>
        <p className="text-[var(--fg-muted)] text-sm">
          {isObserved
            ? 'Sesión especial de observación en contexto de trabajo real.'
            : 'Gestione las sesiones del proceso de coaching. Haga clic en una sesión para ver detalles y completar el acuerdo.'}
        </p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-[var(--fg-muted)]">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay sesiones programadas</p>
          <p className="text-sm mt-2">Complete la calendarización en la fase 4 para crear las sesiones.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => router.push(`/sessions/${session.id}`)}
              className="bg-white border rounded-xl p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--fg-primary)]">{session.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)]">
                    {session.scheduledDate?.toDate?.()?.toLocaleDateString()} - {session.scheduledTime}
                  </p>
                  {session.location && (
                    <p className="text-sm text-[var(--fg-muted)]">{session.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    session.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-[var(--bg-secondary)] text-[var(--fg-secondary)]'
                  }`}>
                    {session.status === 'completed' ? 'Completada' :
                     session.status === 'in-progress' ? 'En Progreso' :
                     session.status === 'cancelled' ? 'Cancelada' : 'Programada'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-[var(--fg-muted)]" />
                </div>
              </div>

              {/* Session Report Status */}
              <div className="mt-3 pt-3 border-t flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-1 ${session.sessionAgreement ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
                  {session.sessionAgreement ? <Check size={16} /> : <Clock size={16} />}
                  Acuerdo de Sesión
                </span>
                <span className={`flex items-center gap-1 ${session.sessionReport ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
                  {session.sessionReport ? <Check size={16} /> : <Clock size={16} />}
                  Tabla de Seguimiento
                </span>
                {isObserved && (
                  <span className={`flex items-center gap-1 ${session.observedMeetingReport ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
                    {session.observedMeetingReport ? <Check size={16} /> : <Clock size={16} />}
                    Reporte Observación
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProcessReportTab({
  coachName,
  program,
  onGenerate,
  onUpdate,
  saving
}: {
  coachName: string;
  program: CoachingProgram;
  onGenerate: () => Promise<void>;
  onUpdate: (data: Partial<ProcessReport>) => Promise<void>;
  saving: boolean;
}) {
  const report = program.processReport;
  const [form, setForm] = useState<Partial<ProcessReport>>(report || {});
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    const email = prompt('Ingresa el email del destinatario:', program.backgroundInfo?.coacheeEmail || '');
    if (!email) return;

    setSendingEmail(true);
    try {
      const doc = generateProcessReportPDF(
        { title: program.title, coacheeName: program.coacheeName || "", coachName: coachName, organizationName: program.backgroundInfo?.organizationName },
        { centralThemes: form.centralThemes, coacheeAspects: form.coacheeAspects, organizationalContext: form.organizationalContext, newPractices: form.newPractices, relevantDiscoveries: form.relevantDiscoveries, observations: form.observations, aiGenerated: report?.aiGenerated },
      );

      const result = await sendPDFByEmail({
        doc,
        fileName: `reporte-proceso-${program.title.replace(/\s+/g, "-")}.pdf`,
        recipientEmail: email,
        recipientName: program.coacheeName || 'Coachee',
        coacheeName: program.coacheeName || 'Coachee',
        coachName: coachName,
        programTitle: program.title,
        reportType: 'process',
      });

      if (result.success) {
        alert('Reporte enviado exitosamente');
      } else {
        alert(`Error al enviar: ${result.error}`);
      }
    } catch (error) {
      alert('Error al enviar el reporte');
    } finally {
      setSendingEmail(false);
    }
  };

  if (!report) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 mx-auto mb-4 text-[var(--fg-secondary)]" />
        <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">Reporte de Seguimiento del Proceso</h2>
        <p className="text-[var(--fg-muted)] mb-6">
          Este reporte se genera automáticamente después de completar la Sesión 3.
        </p>
        <button
          onClick={onGenerate}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuidanceBox
        title="Guía para el Reporte de Proceso"
        tips={[
          'Este reporte captura el estado del proceso después de las primeras 3 sesiones',
          'Identifica las fuerzas que resisten y las que impulsan el cambio',
          'Documenta los temas centrales que se están trabajando',
          'Sirve como punto de referencia para las sesiones siguientes',
        ]}
        variant="info"
        collapsible={true}
        defaultExpanded={false}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--fg-primary)]">Reporte de Seguimiento del Proceso</h2>
          {report.autoGenerated && !report.editedByCoach && (
            <p className="text-sm text-yellow-600">
              Auto-generado. Puede editar los campos según sea necesario.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <LabelWithTooltip
            label="Temas Centrales que se están tratando"
            tooltip="Los hilos conductores del proceso. ¿Cuáles son los temas recurrentes que emergen en las sesiones?"
            className="mb-1"
          />
          <textarea
            value={form.centralThemes || ''}
            onChange={(e) => setForm({ ...form, centralThemes: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.processReport.centralThemes}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-xl p-4">
            <LabelWithTooltip
              label="Fuerzas Conservadoras del Coachee"
              tooltip={FIELD_TOOLTIPS.processReport.conservativeForces}
              className="mb-2 text-red-800"
            />
            <textarea
              value={form.coacheeAspects?.conservativeForces || ''}
              onChange={(e) => setForm({
                ...form,
                coacheeAspects: { ...form.coacheeAspects, conservativeForces: e.target.value } as any
              })}
              rows={3}
              placeholder={FIELD_PLACEHOLDERS.processReport.conservativeForces}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <LabelWithTooltip
              label="Fuerzas Transformadoras del Coachee"
              tooltip={FIELD_TOOLTIPS.processReport.transformativeForces}
              className="mb-2 text-green-800"
            />
            <textarea
              value={form.coacheeAspects?.transformativeForces || ''}
              onChange={(e) => setForm({
                ...form,
                coacheeAspects: { ...form.coacheeAspects, transformativeForces: e.target.value } as any
              })}
              rows={3}
              placeholder={FIELD_PLACEHOLDERS.processReport.transformativeForces}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <LabelWithTooltip
              label="Fuerzas Conservadoras del Sistema"
              tooltip={FIELD_TOOLTIPS.processReport.systemConservative}
              className="mb-2 text-orange-800"
            />
            <textarea
              value={form.organizationalContext?.conservativeForces || ''}
              onChange={(e) => setForm({
                ...form,
                organizationalContext: { ...form.organizationalContext, conservativeForces: e.target.value } as any
              })}
              rows={3}
              placeholder={FIELD_PLACEHOLDERS.processReport.systemConservative}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <LabelWithTooltip
              label="Fuerzas Transformadoras del Sistema"
              tooltip={FIELD_TOOLTIPS.processReport.systemTransformative}
              className="mb-2 text-blue-800"
            />
            <textarea
              value={form.organizationalContext?.transformativeForces || ''}
              onChange={(e) => setForm({
                ...form,
                organizationalContext: { ...form.organizationalContext, transformativeForces: e.target.value } as any
              })}
              rows={3}
              placeholder={FIELD_PLACEHOLDERS.processReport.systemTransformative}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Descubrimientos Relevantes</label>
          <textarea
            value={form.relevantDiscoveries || ''}
            onChange={(e) => setForm({ ...form, relevantDiscoveries: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.processReport.relevantDiscoveries}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Observaciones</label>
          <textarea
            value={form.observations || ''}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            rows={3}
            placeholder="Observaciones adicionales del coach sobre el proceso hasta este punto."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => {
            const doc = generateProcessReportPDF(
              { title: program.title, coacheeName: program.coacheeName || "", coachName: coachName, organizationName: program.backgroundInfo?.organizationName },
              { centralThemes: form.centralThemes, coacheeAspects: form.coacheeAspects, organizationalContext: form.organizationalContext, newPractices: form.newPractices, relevantDiscoveries: form.relevantDiscoveries, observations: form.observations, aiGenerated: report.aiGenerated },
            );
            downloadPDF(doc, `reporte-proceso-${program.title.replace(/\s+/g, "-")}.pdf`);
          }}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-secondary)]"
        >
          <Download size={18} />
          Exportar PDF
        </button>
        <button
          onClick={handleSendEmail}
          disabled={sendingEmail}
          className="flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 disabled:opacity-50"
        >
          <Mail size={18} />
          {sendingEmail ? 'Enviando...' : 'Enviar por Email'}
        </button>
        <button
          onClick={() => onUpdate(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}

function FinalReportTab({ 
  coachName,
  program, 
  onGenerate,
  onUpdate,
  onComplete,
  saving 
}: {
  coachName: string;
  onGenerate: () => Promise<void>;
  program: CoachingProgram;
  onUpdate: (data: Partial<FinalReport>) => Promise<void>;
  onComplete: () => Promise<void>;
  saving: boolean;
}) {
  const report = program.finalReport;
  const [form, setForm] = useState<Partial<FinalReport>>(report || {});
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    const email = prompt('Ingresa el email del destinatario:', program.backgroundInfo?.coacheeEmail || '');
    if (!email) return;

    setSendingEmail(true);
    try {
      const doc = generateFinalReportPDF(
        { title: program.title, coacheeName: program.coacheeName || "", coachName: coachName, organizationName: program.backgroundInfo?.organizationName },
        { startingPointData: form.startingPointData, closingAspects: form.closingAspects, incorporatedPractices: form.incorporatedPractices, gapsToReinforce: form.gapsToReinforce, sustainabilityRecommendations: form.sustainabilityRecommendations, finalObservations: form.finalObservations, aiGenerated: report?.aiGenerated }
      );

      const result = await sendPDFByEmail({
        doc,
        fileName: `informe-final-${program.title.replace(/\s+/g, "-")}.pdf`,
        recipientEmail: email,
        recipientName: program.coacheeName || 'Coachee',
        coacheeName: program.coacheeName || 'Coachee',
        coachName: coachName,
        programTitle: program.title,
        reportType: 'final',
      });

      if (result.success) {
        alert('Informe enviado exitosamente');
      } else {
        alert(`Error al enviar: ${result.error}`);
      }
    } catch (error) {
      alert('Error al enviar el informe');
    } finally {
      setSendingEmail(false);
    }
  };

  if (!report) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 mx-auto mb-4 text-[var(--fg-secondary)]" />
        <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-2">Informe Final CE</h2>
        <p className="text-[var(--fg-muted)] mb-6">
          Este informe se genera automáticamente al completar todas las sesiones.
        </p>
        <button
          onClick={onGenerate}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {saving ? 'Generando...' : 'Generar Informe Final'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GuidanceBox
        title="Guía para el Informe Final"
        tips={[
          'Compara el punto de partida (tripartita) con el punto de cierre actual',
          'Documenta las prácticas que el coachee ha incorporado a su desempeño',
          'Identifica las brechas que aún requieren trabajo futuro',
          'Incluye recomendaciones para que los aprendizajes sean sostenibles',
        ]}
        variant="tip"
        collapsible={true}
        defaultExpanded={false}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--fg-primary)]">Informe Final CE</h2>
          {report.completedAt && (
            <p className="text-sm text-green-600">
              Completado el {report.completedAt.toDate().toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <LabelWithTooltip
            label="Datos del Punto de Partida"
            tooltip={FIELD_TOOLTIPS.finalReport.startingPointData}
            className="mb-1"
          />
          <textarea
            value={form.startingPointData || ''}
            onChange={(e) => setForm({ ...form, startingPointData: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.finalReport.startingPointData}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <LabelWithTooltip
            label="Tres aspectos del coachee que hacen visible el punto de cierre"
            tooltip={FIELD_TOOLTIPS.finalReport.closingAspects}
            className="mb-1"
          />
          <textarea
            value={form.closingAspects || ''}
            onChange={(e) => setForm({ ...form, closingAspects: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.finalReport.closingAspects}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <LabelWithTooltip
            label="Prácticas Organizacionales Incorporadas"
            tooltip={FIELD_TOOLTIPS.finalReport.incorporatedPractices}
            className="mb-1"
          />
          <textarea
            value={form.incorporatedPractices || ''}
            onChange={(e) => setForm({ ...form, incorporatedPractices: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.finalReport.incorporatedPractices}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <LabelWithTooltip
            label="Brechas que el coachee debiera reforzar a futuro"
            tooltip={FIELD_TOOLTIPS.finalReport.gapsToReinforce}
            className="mb-1"
          />
          <textarea
            value={form.gapsToReinforce || ''}
            onChange={(e) => setForm({ ...form, gapsToReinforce: e.target.value })}
            rows={3}
            placeholder={FIELD_PLACEHOLDERS.finalReport.gapsToReinforce}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
            Recomendaciones para sostener los aprendizajes
          </label>
          <textarea
            value={form.sustainabilityRecommendations || ''}
            onChange={(e) => setForm({ ...form, sustainabilityRecommendations: e.target.value })}
            rows={4}
            placeholder={FIELD_PLACEHOLDERS.finalReport.sustainabilityRecommendations}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">Observaciones Finales</label>
          <textarea
            value={form.finalObservations || ''}
            onChange={(e) => setForm({ ...form, finalObservations: e.target.value })}
            rows={3}
            placeholder="Observaciones finales del coach sobre el proceso completado."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          onClick={() => {
            const doc = generateFinalReportPDF(
              { title: program.title, coacheeName: program.coacheeName || "", coachName: coachName, organizationName: program.backgroundInfo?.organizationName },
              { startingPointData: form.startingPointData, closingAspects: form.closingAspects, incorporatedPractices: form.incorporatedPractices, gapsToReinforce: form.gapsToReinforce, sustainabilityRecommendations: form.sustainabilityRecommendations, finalObservations: form.finalObservations, aiGenerated: report.aiGenerated }
            );
            downloadPDF(doc, `informe-final-${program.title.replace(/\s+/g, "-")}.pdf`);
          }}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-secondary)]"
        >
          <Download size={18} />
          Exportar PDF
        </button>
        <button
          onClick={handleSendEmail}
          disabled={sendingEmail}
          className="flex items-center gap-2 px-4 py-2 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 disabled:opacity-50"
        >
          <Mail size={18} />
          {sendingEmail ? 'Enviando...' : 'Enviar por Email'}
        </button>
        <button
          onClick={() => onUpdate(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-[var(--bg-tertiary)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-tertiary)] disabled:opacity-50"
        >
          <Save size={18} />
          Guardar Borrador
        </button>
        {!report.completedAt && (
          <button
            onClick={onComplete}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-[var(--fg-primary)] rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Check size={18} />
            {saving ? "Completando..." : "Completar Proceso"}
          </button>
        )}
      </div>
    </div>
  );
}
