'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getSession, 
  getCoachingProgram,
  saveSessionAgreement,
  saveSessionReport,
  saveObservedMeetingReport,
  updateSession
} from '@/lib/coachingService';
import { 
  Session, 
  CoachingProgram,
  SessionAgreement,
  SessionReport,
  ObservedMeetingReport,
  SESSION_TEMPLATES
} from '@/types/coaching';
import { 
  ArrowLeft, Save, Play, Check, Clock, FileText, 
  ClipboardList, Eye, Users, AlertCircle, ChevronDown, ChevronUp
} from 'lucide-react';

type TabType = 'overview' | 'agreement' | 'report' | 'observed';

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [program, setProgram] = useState<CoachingProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const isCoach = userProfile?.role === 'coach';

  useEffect(() => {
    if (sessionId) {
      loadData();
    }
  }, [sessionId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const sessionData = await getSession(sessionId);
      if (sessionData) {
        setSession(sessionData);
        
        if (sessionData.programId) {
          const programData = await getCoachingProgram(sessionData.programId);
          setProgram(programData);
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!session) return;
    setSaving(true);
    try {
      await updateSession(sessionId, { status: 'in-progress' });
      await loadData();
      setActiveTab('agreement');
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--fg-primary)] mb-2">Sesión no encontrada</h1>
          <button onClick={() => router.back()} className="text-primary-600 hover:underline">
            Volver
          </button>
        </div>
      </div>
    );
  }

  const template = SESSION_TEMPLATES[session.type];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="bg-white rounded-xl border-2 border-[var(--border-color)] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[var(--fg-primary)]">{session.title}</h1>
                <SessionStatusBadge status={session.status} />
              </div>
              <p className="text-[var(--fg-muted)]">
                {session.coacheeName} • Sesión {session.sessionNumber || 1}
              </p>
              <p className="text-sm text-[var(--fg-muted)] mt-1">
                {session.scheduledDate?.toDate?.()?.toLocaleDateString('es-CL')} - {session.scheduledTime}
                {session.location && ` • ${session.location}`}
              </p>
            </div>
            
            {isCoach && session.status === 'scheduled' && (
              <button
                onClick={handleStartSession}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-[var(--fg-primary)] rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Play size={18} />
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Progress indicators */}
          <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm">
            <span className={`flex items-center gap-1 ${session.sessionAgreement ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
              {session.sessionAgreement ? <Check size={16} /> : <Clock size={16} />}
              Acuerdo de Sesión
            </span>
            <span className={`flex items-center gap-1 ${session.sessionReport ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
              {session.sessionReport ? <Check size={16} /> : <Clock size={16} />}
              Tabla de Seguimiento
            </span>
            {session.type === 'observed' && (
              <span className={`flex items-center gap-1 ${session.observedMeetingReport ? 'text-green-600' : 'text-[var(--fg-muted)]'}`}>
                {session.observedMeetingReport ? <Check size={16} /> : <Clock size={16} />}
                Reporte Observación
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border-2 border-[var(--border-color)] overflow-hidden">
          <div className="border-b border-[var(--border-color)] flex">
            <TabButton 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              icon={FileText}
              label="Resumen"
            />
            {isCoach && (
              <>
                <TabButton 
                  active={activeTab === 'agreement'} 
                  onClick={() => setActiveTab('agreement')}
                  icon={ClipboardList}
                  label="Acuerdo de Sesión"
                  completed={!!session.sessionAgreement}
                />
                <TabButton 
                  active={activeTab === 'report'} 
                  onClick={() => setActiveTab('report')}
                  icon={FileText}
                  label="Tabla de Seguimiento"
                  completed={!!session.sessionReport}
                />
                {session.type === 'observed' && (
                  <TabButton 
                    active={activeTab === 'observed'} 
                    onClick={() => setActiveTab('observed')}
                    icon={Eye}
                    label="Reunión Observada"
                    completed={!!session.observedMeetingReport}
                  />
                )}
              </>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab session={session} template={template} program={program} />
            )}
            {activeTab === 'agreement' && isCoach && (
              <SessionAgreementTab 
                session={session}
                program={program}
                onSave={async (data) => {
                  setSaving(true);
                  try {
                    await saveSessionAgreement(sessionId, data);
                    await loadData();
                    setActiveTab('report');
                  } catch (error) {
                    console.error('Error saving agreement:', error);
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}
            {activeTab === 'report' && isCoach && (
              <SessionReportTab 
                session={session}
                onSave={async (data) => {
                  setSaving(true);
                  try {
                    await saveSessionReport(sessionId, data);
                    await loadData();
                  } catch (error) {
                    console.error('Error saving report:', error);
                  } finally {
                    setSaving(false);
                  }
                }}
                saving={saving}
              />
            )}
            {activeTab === 'observed' && isCoach && session.type === 'observed' && (
              <ObservedMeetingTab 
                session={session}
                onSave={async (data) => {
                  setSaving(true);
                  try {
                    await saveObservedMeetingReport(sessionId, data);
                    await loadData();
                  } catch (error) {
                    console.error('Error saving observed report:', error);
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

function TabButton({ 
  active, 
  onClick, 
  icon: Icon, 
  label, 
  completed 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: any; 
  label: string;
  completed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-primary-600 text-primary-600 bg-primary-50'
          : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]'
      }`}
    >
      {completed ? <Check size={16} className="text-green-500" /> : <Icon size={16} />}
      {label}
    </button>
  );
}

function SessionStatusBadge({ status }: { status: Session['status'] }) {
  const config = {
    scheduled: { bg: 'bg-[var(--bg-secondary)]', text: 'text-[var(--fg-secondary)]', label: 'Programada' },
    'in-progress': { bg: 'bg-emerald-100', text: 'text-blue-800', label: 'En Progreso' },
    completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completada' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
    'no-show': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'No asistió' },
  };

  const { bg, text, label } = config[status] || config.scheduled;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function OverviewTab({ 
  session, 
  template,
  program 
}: { 
  session: Session; 
  template: any;
  program: CoachingProgram | null;
}) {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <div>
        <h3 className="font-semibold text-[var(--fg-primary)] mb-2">Objetivo de la Sesión</h3>
        <p className="text-[var(--fg-muted)]">{session.goal || session.objective || 'No definido'}</p>
      </div>

      {/* Suggested Agenda */}
      {template && (
        <div>
          <h3 className="font-semibold text-[var(--fg-primary)] mb-2">Agenda Sugerida</h3>
          <ul className="space-y-2">
            {template.suggestedAgenda.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-[var(--fg-muted)]">
                <span className="text-primary-600 font-medium">{idx + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Session Agreement Summary */}
      {session.sessionAgreement && (
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <Check size={18} />
            Acuerdo de Sesión Completado
          </h3>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>Foco:</strong> {session.sessionAgreement.sessionFocus}</p>
            <p><strong>Prácticas:</strong> {session.sessionAgreement.practicesOrCompetencies}</p>
          </div>
        </div>
      )}

      {/* Session Report Summary */}
      {session.sessionReport && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Check size={18} />
            Tabla de Seguimiento Completada
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Tema:</strong> {session.sessionReport.sessionTopic}</p>
            <p><strong>Descubrimientos:</strong> {session.sessionReport.discoveriesAndLearnings}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionAgreementTab({ 
  session, 
  program,
  onSave, 
  saving 
}: { 
  session: Session;
  program: CoachingProgram | null;
  onSave: (data: SessionAgreement) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<SessionAgreement>(
    session.sessionAgreement || {
      previousSessionLink: '',
      sessionFocus: '',
      relevanceToProcess: '',
      practicesOrCompetencies: '',
      sessionIndicators: '',
      learningContext: '',
    }
  );

  const getPreviousSessionHint = () => {
    const num = session.sessionNumber || 1;
    if (num === 1) {
      return 'Enganche con la reunión tripartita inicial';
    }
    return `Enganche con la sesión ${num - 1}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Acuerdo de Sesión de Coaching Ejecutivo
        </h3>
        <p className="text-sm text-blue-800">
          Complete esta pauta antes de comenzar la sesión. Define el foco y los indicadores.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          {getPreviousSessionHint()} *
        </label>
        <textarea
          value={form.previousSessionLink}
          onChange={(e) => setForm({ ...form, previousSessionLink: e.target.value })}
          rows={3}
          placeholder="¿Qué se trabajó anteriormente? ¿Qué tareas quedaron pendientes?"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Qué es lo que se trabajará en la sesión *
        </label>
        <textarea
          value={form.sessionFocus}
          onChange={(e) => setForm({ ...form, sessionFocus: e.target.value })}
          rows={3}
          placeholder="Tema principal o desafío a abordar"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Relevancia dentro del proceso *
        </label>
        <textarea
          value={form.relevanceToProcess}
          onChange={(e) => setForm({ ...form, relevanceToProcess: e.target.value })}
          rows={2}
          placeholder="¿Cómo se conecta con los objetivos generales del programa?"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Prácticas o competencias observables a trabajar *
        </label>
        <textarea
          value={form.practicesOrCompetencies}
          onChange={(e) => setForm({ ...form, practicesOrCompetencies: e.target.value })}
          rows={3}
          placeholder="Integración del objetivo con los objetivos del proceso"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Indicadores particulares para la sesión *
        </label>
        <textarea
          value={form.sessionIndicators}
          onChange={(e) => setForm({ ...form, sessionIndicators: e.target.value })}
          rows={2}
          placeholder="¿Cómo sabremos que la sesión fue exitosa?"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Contexto para experiencias de aprendizaje
        </label>
        <textarea
          value={form.learningContext}
          onChange={(e) => setForm({ ...form, learningContext: e.target.value })}
          rows={2}
          placeholder="Situaciones o ejercicios para practicar"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end pt-4 border-t">
        {/* Required fields validation */}
        {(!form.sessionFocus.trim() || !form.practicesOrCompetencies.trim() || !form.sessionIndicators.trim()) && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle size={16} />
            <span>Complete los campos obligatorios marcados con *</span>
          </div>
        )}
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.previousSessionLink.trim() || !form.sessionFocus.trim() || !form.relevanceToProcess.trim() || !form.practicesOrCompetencies.trim() || !form.sessionIndicators.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Acuerdo'}
        </button>
      </div>
    </div>
  );
}

function SessionReportTab({ 
  session, 
  onSave, 
  saving 
}: { 
  session: Session;
  onSave: (data: SessionReport) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<SessionReport>(
    session.sessionReport || {
      sessionNumber: session.sessionNumber,
      sessionTopic: session.sessionAgreement?.sessionFocus || '',
      practicesWorked: session.sessionAgreement?.practicesOrCompetencies || '',
      previousSessionLink: session.sessionAgreement?.previousSessionLink || '',
      practiceContext: '',
      progressIndicators: '',
      discoveriesAndLearnings: '',
      tasksForNextSession: '',
      observations: '',
    }
  );

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
          <ClipboardList size={18} />
          Tabla de Seguimiento - Sesión {session.sessionNumber || 1}
        </h3>
        <p className="text-sm text-purple-800">
          Complete esta tabla al finalizar la sesión para documentar el progreso.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
            Tema de la sesión *
          </label>
          <textarea
            value={form.sessionTopic}
            onChange={(e) => setForm({ ...form, sessionTopic: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
            Prácticas elegidas para trabajar *
          </label>
          <textarea
            value={form.practicesWorked}
            onChange={(e) => setForm({ ...form, practicesWorked: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Enganche con sesión anterior * *
        </label>
        <textarea
          value={form.previousSessionLink}
          onChange={(e) => setForm({ ...form, previousSessionLink: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Contextos o circunstancias donde se trabaja la práctica *
        </label>
        <textarea
          value={form.practiceContext}
          onChange={(e) => setForm({ ...form, practiceContext: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Indicadores de avance *
        </label>
        <textarea
          value={form.progressIndicators}
          onChange={(e) => setForm({ ...form, progressIndicators: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Descubrimientos y aprendizajes de la sesión *
        </label>
        <textarea
          value={form.discoveriesAndLearnings}
          onChange={(e) => setForm({ ...form, discoveriesAndLearnings: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Tareas propuestas para próxima sesión *
        </label>
        <textarea
          value={form.tasksForNextSession}
          onChange={(e) => setForm({ ...form, tasksForNextSession: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Observaciones
        </label>
        <textarea
          value={form.observations}
          onChange={(e) => setForm({ ...form, observations: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end pt-4 border-t">
        {/* Required fields validation */}
        {(!form.sessionTopic.trim() || !form.discoveriesAndLearnings.trim() || !form.tasksForNextSession.trim()) && (
          <div className="flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle size={16} />
            <span>Complete los campos obligatorios marcados con *</span>
          </div>
        )}
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.sessionTopic.trim() || !form.practicesWorked.trim() || !form.previousSessionLink.trim() || !form.practiceContext.trim() || !form.progressIndicators.trim() || !form.discoveriesAndLearnings.trim() || !form.tasksForNextSession.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-[var(--fg-primary)] rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check size={18} />
          {saving ? 'Guardando...' : 'Completar Sesión'}
        </button>
      </div>
    </div>
  );
}

function ObservedMeetingTab({ 
  session, 
  onSave, 
  saving 
}: { 
  session: Session;
  onSave: (data: ObservedMeetingReport) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<ObservedMeetingReport>(
    session.observedMeetingReport || {
      meetingParticipants: [],
      meetingBackground: '',
      startTime: '',
      endTime: '',
      setupObservations: '',
      setupNotes: '',
      practicesObserved: '',
      practicesNotes: '',
      learningAreas: '',
    }
  );

  const [newParticipant, setNewParticipant] = useState({ name: '', role: '' });

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.role) {
      setForm({
        ...form,
        meetingParticipants: [...form.meetingParticipants, newParticipant]
      });
      setNewParticipant({ name: '', role: '' });
    }
  };

  const removeParticipant = (index: number) => {
    setForm({
      ...form,
      meetingParticipants: form.meetingParticipants.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <Eye size={18} />
          Sesión de Reunión Observada
        </h3>
        <p className="text-sm text-yellow-800">
          Documente la observación del coachee en su contexto de trabajo real.
        </p>
      </div>

      {/* Participants */}
      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">
          Integrantes de la reunión observada
        </label>
        
        {form.meetingParticipants.length > 0 && (
          <div className="mb-3 space-y-2">
            {form.meetingParticipants.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg">
                <Users size={16} className="text-[var(--fg-muted)]" />
                <span className="font-medium">{p.name}</span>
                <span className="text-[var(--fg-muted)]">-</span>
                <span className="text-[var(--fg-muted)]">{p.role}</span>
                <button
                  type="button"
                  onClick={() => removeParticipant(idx)}
                  className="ml-auto text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nombre"
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="text"
            placeholder="Rol/Cargo"
            value={newParticipant.role}
            onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="button"
            onClick={addParticipant}
            className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-tertiary)]"
          >
            Agregar
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Antecedentes generales de la reunión
        </label>
        <textarea
          value={form.meetingBackground}
          onChange={(e) => setForm({ ...form, meetingBackground: e.target.value })}
          rows={3}
          placeholder="Contexto, propósito y antecedentes de la reunión observada"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
            Hora de inicio
          </label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
            Hora de término
          </label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Observación del armado e inicio de la reunión
        </label>
        <textarea
          value={form.setupObservations}
          onChange={(e) => setForm({ ...form, setupObservations: e.target.value })}
          rows={3}
          placeholder="Fenómenos particulares del armado y el inicio que puedan ser significativos"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Observaciones generales del setup
        </label>
        <textarea
          value={form.setupNotes}
          onChange={(e) => setForm({ ...form, setupNotes: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Presencia y aplicación de prácticas/competencias vistas en las sesiones
        </label>
        <textarea
          value={form.practicesObserved}
          onChange={(e) => setForm({ ...form, practicesObserved: e.target.value })}
          rows={3}
          placeholder="¿Qué prácticas y competencias trabajadas se observaron en acción?"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Observaciones de las prácticas
        </label>
        <textarea
          value={form.practicesNotes}
          onChange={(e) => setForm({ ...form, practicesNotes: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
          Áreas de aprendizaje identificadas
        </label>
        <textarea
          value={form.learningAreas}
          onChange={(e) => setForm({ ...form, learningAreas: e.target.value })}
          rows={3}
          placeholder="Oportunidades de mejora y áreas a reforzar"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-[var(--fg-primary)] rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Check size={18} />
          {saving ? 'Guardando...' : 'Guardar Reporte de Observación'}
        </button>
      </div>
    </div>
  );
}
