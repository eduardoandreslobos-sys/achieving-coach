'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Video,
  Play,
  CheckCircle,
  XCircle,
  FileText,
  Save,
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff,
  Share2,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import GuidanceBox from '@/components/ui/GuidanceBox';
import LabelWithTooltip from '@/components/ui/LabelWithTooltip';
import {
  getSessionGuidance,
  FIELD_PLACEHOLDERS,
  FIELD_TOOLTIPS,
  CoachingType,
  RescheduleEntry,
  SessionStatus
} from '@/types/coaching';
import {
  cancelSession,
  requestSessionReschedule,
  acceptReschedule,
  rejectReschedule
} from '@/lib/coachingService';
import {
  SessionCancellationModal,
  RescheduleRequestModal,
  RescheduleResponseBanner
} from '@/components/sessions';

interface SessionSharing {
  agreementSharedWithCoachee: boolean;
  reportSharedWithCoachee: boolean;
  sharedAt?: Date;
}

interface Session {
  id: string;
  coachId: string;
  coacheeId: string;
  coacheeName: string;
  coacheeEmail: string;
  scheduledDate: Date;
  duration: number;
  status?: SessionStatus;
  currentRescheduleRequest?: RescheduleEntry;
  meetingLink?: string;
  notes?: string;
  preSessionNotes?: string;
  postSessionNotes?: string;
  programId?: string;
  programName?: string;
  startedAt?: Date;
  completedAt?: Date;
  sessionNumber?: number;
  coachingType?: CoachingType;
  sessionAgreement?: {
    coacheeGoal?: string;
    sessionObjective?: string;
    successIndicators?: string;
    obstacles?: string;
    resources?: string;
    actionPlan?: string;
    commitment?: string;
    // CE fields
    previousSessionLink?: string;
    sessionFocus?: string;
    relevanceToProcess?: string;
    practicesOrCompetencies?: string;
    sessionIndicators?: string;
    learningContext?: string;
  };
  sessionReport?: {
    topicsDiscussed?: string;
    insights?: string;
    actionItems?: string;
    followUp?: string;
    coachNotes?: string;
    // CE fields
    sessionTopic?: string;
    practicesWorked?: string;
    previousSessionLink?: string;
    practiceContext?: string;
    progressIndicators?: string;
    discoveriesAndLearnings?: string;
    tasksForNextSession?: string;
    observations?: string;
  };
  sharing?: SessionSharing;
}

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params?.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'agreement' | 'report'>('overview');

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Session Agreement form state
  const [agreement, setAgreement] = useState({
    coacheeGoal: '',
    sessionObjective: '',
    successIndicators: '',
    obstacles: '',
    resources: '',
    actionPlan: '',
    commitment: ''
  });

  // Session Report form state
  const [report, setReport] = useState({
    topicsDiscussed: '',
    insights: '',
    actionItems: '',
    followUp: '',
    coachNotes: ''
  });

  useEffect(() => {
    loadSession();
  }, [sessionId, user]);

  const loadSession = async () => {
    if (!sessionId || !user) return;

    try {
      const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
      if (!sessionDoc.exists()) {
        toast.error('Sesión no encontrada');
        router.push('/coach/sessions');
        return;
      }

      const data = sessionDoc.data();

      // Verify ownership
      if (data.coachId !== user.uid) {
        toast.error('No tienes acceso a esta sesión');
        router.push('/coach/sessions');
        return;
      }

      let scheduledDate: Date;
      if (data.scheduledDate?.toDate) {
        scheduledDate = data.scheduledDate.toDate();
      } else if (data.scheduledDate) {
        scheduledDate = new Date(data.scheduledDate);
      } else {
        scheduledDate = new Date();
      }

      const sessionData: Session = {
        id: sessionDoc.id,
        coachId: data.coachId,
        coacheeId: data.coacheeId,
        coacheeName: data.coacheeName || 'Unknown',
        coacheeEmail: data.coacheeEmail || '',
        scheduledDate,
        duration: data.duration || 60,
        status: data.status || 'scheduled',
        meetingLink: data.meetingLink || '',
        notes: data.notes || '',
        preSessionNotes: data.preSessionNotes || '',
        postSessionNotes: data.postSessionNotes || '',
        programId: data.programId,
        programName: data.programName,
        startedAt: data.startedAt?.toDate?.() || undefined,
        completedAt: data.completedAt?.toDate?.() || undefined,
        sessionNumber: data.sessionNumber || 1,
        coachingType: data.coachingType || 'corporate',
        sessionAgreement: data.sessionAgreement || {},
        sessionReport: data.sessionReport || {},
        sharing: data.sharing || { agreementSharedWithCoachee: false, reportSharedWithCoachee: false }
      };

      setSession(sessionData);

      // Load existing agreement and report data
      if (data.sessionAgreement) {
        setAgreement({
          coacheeGoal: data.sessionAgreement.coacheeGoal || '',
          sessionObjective: data.sessionAgreement.sessionObjective || '',
          successIndicators: data.sessionAgreement.successIndicators || '',
          obstacles: data.sessionAgreement.obstacles || '',
          resources: data.sessionAgreement.resources || '',
          actionPlan: data.sessionAgreement.actionPlan || '',
          commitment: data.sessionAgreement.commitment || ''
        });
      }

      if (data.sessionReport) {
        setReport({
          topicsDiscussed: data.sessionReport.topicsDiscussed || '',
          insights: data.sessionReport.insights || '',
          actionItems: data.sessionReport.actionItems || '',
          followUp: data.sessionReport.followUp || '',
          coachNotes: data.sessionReport.coachNotes || ''
        });
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Error al cargar la sesión');
    } finally {
      setLoading(false);
    }
  };

  // Cancellation handler
  const handleCancelSession = async (reason: string) => {
    if (!session || !user) return;
    try {
      await cancelSession(sessionId, user.uid, 'coach', reason);
      toast.success('Sesión cancelada');
      loadSession();
    } catch (error: any) {
      toast.error(error.message || 'Error al cancelar la sesión');
    }
  };

  // Reschedule handlers
  const handleRequestReschedule = async (data: {
    proposedDate: Date;
    proposedStartTime: string;
    proposedEndTime: string;
    reason: string;
  }) => {
    if (!session || !user) return;
    try {
      await requestSessionReschedule(
        sessionId,
        user.uid,
        'coach',
        data.proposedDate,
        data.proposedStartTime,
        data.proposedEndTime,
        data.reason
      );
      toast.success('Solicitud de reprogramación enviada');
      loadSession();
    } catch (error: any) {
      toast.error(error.message || 'Error al solicitar reprogramación');
    }
  };

  const handleAcceptReschedule = async () => {
    if (!session || !user) return;
    try {
      await acceptReschedule(sessionId, user.uid);
      toast.success('Reprogramación aceptada');
      loadSession();
    } catch (error: any) {
      toast.error(error.message || 'Error al aceptar reprogramación');
    }
  };

  const handleRejectReschedule = async (note: string) => {
    if (!session || !user) return;
    try {
      await rejectReschedule(sessionId, user.uid, note);
      toast.success('Reprogramación rechazada');
      loadSession();
    } catch (error: any) {
      toast.error(error.message || 'Error al rechazar reprogramación');
    }
  };

  const handleStartSession = async () => {
    if (!session) return;

    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        status: 'in-progress',
        startedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Sesión iniciada');
      loadSession();

      if (session.meetingLink) {
        window.open(session.meetingLink, '_blank');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Error al iniciar sesión');
    }
  };

  const handleCompleteSession = async () => {
    if (!session) return;

    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        status: 'completed',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Sesión completada');
      loadSession();
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Error al completar sesión');
    }
  };

  const handleSaveAgreement = async () => {
    if (!session) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        sessionAgreement: agreement,
        updatedAt: serverTimestamp()
      });
      toast.success('Acuerdo de sesión guardado');
    } catch (error) {
      console.error('Error saving agreement:', error);
      toast.error('Error al guardar acuerdo');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReport = async () => {
    if (!session) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        sessionReport: report,
        updatedAt: serverTimestamp()
      });
      toast.success('Reporte de sesión guardado');
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Error al guardar reporte');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSharing = async (field: 'agreementSharedWithCoachee' | 'reportSharedWithCoachee') => {
    if (!session) return;

    const currentValue = session.sharing?.[field] ?? false;
    const newSharing = {
      ...session.sharing,
      [field]: !currentValue,
      sharedAt: !currentValue ? serverTimestamp() : session.sharing?.sharedAt
    };

    try {
      await updateDoc(doc(db, 'sessions', session.id), {
        sharing: newSharing,
        updatedAt: serverTimestamp()
      });

      setSession({
        ...session,
        sharing: {
          ...session.sharing,
          agreementSharedWithCoachee: session.sharing?.agreementSharedWithCoachee ?? false,
          reportSharedWithCoachee: session.sharing?.reportSharedWithCoachee ?? false,
          [field]: !currentValue
        }
      });

      toast.success(!currentValue ? 'Compartido con el coachee' : 'Ya no está compartido con el coachee');
    } catch (error) {
      console.error('Error updating sharing:', error);
      toast.error('Error al actualizar visibilidad');
    }
  };

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'pending_confirmation':
        return <span className="px-3 py-1 text-sm rounded-full bg-amber-500/20 text-amber-400">Pendiente Confirmación</span>;
      case 'scheduled':
        return <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400">Programada</span>;
      case 'in-progress':
        return <span className="px-3 py-1 text-sm rounded-full bg-emerald-500/20 text-[var(--accent-primary)] animate-pulse">En curso</span>;
      case 'completed':
        return <span className="px-3 py-1 text-sm rounded-full bg-violet-500/20 text-violet-400">Completada</span>;
      case 'cancelled':
        return <span className="px-3 py-1 text-sm rounded-full bg-red-500/20 text-red-400">Cancelada</span>;
      case 'no-show':
        return <span className="px-3 py-1 text-sm rounded-full bg-amber-500/20 text-amber-400">No asistió</span>;
      case 'rejected':
        return <span className="px-3 py-1 text-sm rounded-full bg-red-500/20 text-red-400">Rechazada</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--fg-muted)]">Cargando sesión...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-[var(--fg-muted)]">Sesión no encontrada</div>
      </div>
    );
  }

  const canCancel = session.status && !['completed', 'cancelled', 'rejected'].includes(session.status);
  const isRequester = session.currentRescheduleRequest?.requestedBy === user?.uid;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] p-8">
      <Toaster position="top-center" richColors />

      {/* Modals */}
      <SessionCancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSession}
        sessionTitle={`Sesión con ${session.coacheeName}`}
        coacheeName={session.coacheeName}
      />

      <RescheduleRequestModal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onSubmit={handleRequestReschedule}
        currentDate={session.scheduledDate}
        sessionTitle={`Sesión con ${session.coacheeName}`}
      />

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/coach/sessions"
          className="inline-flex items-center gap-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Sesiones
        </Link>

        {/* Reschedule Response Banner */}
        {session.currentRescheduleRequest && (
          <RescheduleResponseBanner
            rescheduleRequest={session.currentRescheduleRequest}
            onAccept={handleAcceptReschedule}
            onReject={handleRejectReschedule}
            isRequester={isRequester}
          />
        )}

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Sesión con {session.coacheeName}</h1>
              {getStatusBadge(session.status)}
            </div>
            <p className="text-[var(--fg-muted)]">
              {session.scheduledDate.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {' - '}
              {session.duration} minutos
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Show Iniciar button for scheduled sessions or sessions without status */}
            {(!session.status || session.status === 'scheduled') && (
              <button
                onClick={handleStartSession}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
            {session.status === 'in-progress' && (
              <>
                {session.meetingLink && (
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Unirse a Reunión
                  </a>
                )}
                <button
                  onClick={handleCompleteSession}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Completar Sesión
                </button>
              </>
            )}
            {/* Cancel and Reschedule buttons for coach */}
            {canCancel && (
              <>
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Reprogramar
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Session Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--fg-muted)]">Coachee</p>
              <p className="font-medium">{session.coacheeName}</p>
            </div>
          </div>
          <p className="text-sm text-[var(--fg-muted)]">{session.coacheeEmail}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--fg-muted)]">Fecha Programada</p>
              <p className="font-medium">
                {session.scheduledDate.toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
          <p className="text-sm text-[var(--fg-muted)]">
            {session.scheduledDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--fg-muted)]">Duración</p>
              <p className="font-medium">{session.duration} minutos</p>
            </div>
          </div>
          {session.meetingLink && (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              Link de reunión
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[var(--border-color)] mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-500 text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('agreement')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'agreement'
                ? 'border-emerald-500 text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            Acuerdo de Sesión
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'report'
                ? 'border-emerald-500 text-[var(--accent-primary)]'
                : 'border-transparent text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            Reporte de Sesión
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Notas de la Sesión</h3>
              <p className="text-[var(--fg-muted)]">
                {session.notes || 'Sin notas'}
              </p>
            </div>

            {session.startedAt && (
              <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                <Play className="w-4 h-4 text-emerald-400" />
                Iniciada: {session.startedAt.toLocaleString('es-ES')}
              </div>
            )}

            {session.completedAt && (
              <div className="flex items-center gap-2 text-sm text-[var(--fg-muted)]">
                <CheckCircle className="w-4 h-4 text-violet-400" />
                Completada: {session.completedAt.toLocaleString('es-ES')}
              </div>
            )}

            {session.status === 'scheduled' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-400">Sesión programada</p>
                  <p className="text-sm text-[var(--fg-muted)]">
                    Haz clic en "Iniciar Sesión" cuando estés listo para comenzar.
                  </p>
                </div>
              </div>
            )}

            {session.status === 'in-progress' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-start gap-3">
                <Play className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-400">Sesión en curso</p>
                  <p className="text-sm text-[var(--fg-muted)]">
                    Completa el acuerdo de sesión y cuando termines, haz clic en "Completar Sesión".
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'agreement' && (
          <div className="space-y-6">
            {/* Session Guidance Box */}
            {(() => {
              const guidance = getSessionGuidance(session.sessionNumber || 1, session.coachingType || 'corporate');
              return guidance ? (
                <GuidanceBox
                  title={`Guía para Sesión ${session.sessionNumber || 1}: ${guidance.title}`}
                  tips={guidance.agreementTips}
                  variant={guidance.isSpecial ? 'tip' : 'info'}
                  collapsible={true}
                  defaultExpanded={true}
                />
              ) : null;
            })()}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Acuerdo de Sesión</h3>
                {session.sharing?.agreementSharedWithCoachee ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                    <Eye className="w-3 h-3" />
                    Compartido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                    <Lock className="w-3 h-3" />
                    Privado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleSharing('agreementSharedWithCoachee')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    session.sharing?.agreementSharedWithCoachee
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-[var(--bg-primary)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)] border border-[var(--border-color)]'
                  }`}
                >
                  {session.sharing?.agreementSharedWithCoachee ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Visible para Coachee
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Compartir con Coachee
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveAgreement}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <LabelWithTooltip
                  label={session.sessionNumber === 1 ? 'Enganche con Reunión Tripartita' : 'Enganche con Sesión Anterior'}
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.previousSessionLink}
                  required
                  className="mb-2"
                />
                <textarea
                  value={agreement.coacheeGoal}
                  onChange={(e) => setAgreement({ ...agreement, coacheeGoal: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.previousSessionLink}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Qué se trabajará en la Sesión"
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.sessionFocus}
                  required
                  className="mb-2"
                />
                <textarea
                  value={agreement.sessionObjective}
                  onChange={(e) => setAgreement({ ...agreement, sessionObjective: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.sessionFocus}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Prácticas o Competencias Observables"
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.practicesOrCompetencies}
                  required
                  className="mb-2"
                />
                <textarea
                  value={agreement.successIndicators}
                  onChange={(e) => setAgreement({ ...agreement, successIndicators: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.practicesOrCompetencies}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Indicadores Particulares para la Sesión"
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.sessionIndicators}
                  required
                  className="mb-2"
                />
                <textarea
                  value={agreement.obstacles}
                  onChange={(e) => setAgreement({ ...agreement, obstacles: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.sessionIndicators}
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Relevancia dentro del Proceso"
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.relevanceToProcess}
                  className="mb-2"
                />
                <textarea
                  value={agreement.resources}
                  onChange={(e) => setAgreement({ ...agreement, resources: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.relevanceToProcess}
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Contexto para Experiencias de Aprendizaje"
                  tooltip={FIELD_TOOLTIPS.sessionAgreement.learningContext}
                  className="mb-2"
                />
                <textarea
                  value={agreement.actionPlan}
                  onChange={(e) => setAgreement({ ...agreement, actionPlan: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionAgreement.learningContext}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={agreement.commitment}
                  onChange={(e) => setAgreement({ ...agreement, commitment: e.target.value })}
                  placeholder="Observaciones o notas adicionales para esta sesión..."
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            {/* Session Report Guidance Box */}
            {(() => {
              const guidance = getSessionGuidance(session.sessionNumber || 1, session.coachingType || 'corporate');
              return guidance ? (
                <GuidanceBox
                  title={`Guía para Tabla de Seguimiento - Sesión ${session.sessionNumber || 1}`}
                  tips={guidance.reportTips}
                  variant="info"
                  collapsible={true}
                  defaultExpanded={false}
                />
              ) : null;
            })()}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">Tabla de Seguimiento</h3>
                {session.sharing?.reportSharedWithCoachee ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                    <Eye className="w-3 h-3" />
                    Compartido
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-500/20 text-gray-400">
                    <Lock className="w-3 h-3" />
                    Privado
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleSharing('reportSharedWithCoachee')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    session.sharing?.reportSharedWithCoachee
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-[var(--bg-primary)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)] border border-[var(--border-color)]'
                  }`}
                >
                  {session.sharing?.reportSharedWithCoachee ? (
                    <>
                      <Eye className="w-4 h-4" />
                      Visible para Coachee
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Compartir con Coachee
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveReport}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <LabelWithTooltip
                    label="Tema de la Sesión"
                    tooltip={FIELD_TOOLTIPS.sessionReport.sessionTopic}
                    required
                    className="mb-2"
                  />
                  <textarea
                    value={report.topicsDiscussed}
                    onChange={(e) => setReport({ ...report, topicsDiscussed: e.target.value })}
                    placeholder={FIELD_PLACEHOLDERS.sessionReport.sessionTopic}
                    rows={2}
                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div>
                  <LabelWithTooltip
                    label="Enganche con Sesión Anterior"
                    tooltip={FIELD_TOOLTIPS.sessionReport.previousSessionLink}
                    required
                    className="mb-2"
                  />
                  <textarea
                    value={report.followUp}
                    onChange={(e) => setReport({ ...report, followUp: e.target.value })}
                    placeholder={FIELD_PLACEHOLDERS.sessionReport.previousSessionLink}
                    rows={2}
                    className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div>
                <LabelWithTooltip
                  label="Contextos de Práctica"
                  tooltip={FIELD_TOOLTIPS.sessionReport.practiceContext}
                  required
                  className="mb-2"
                />
                <textarea
                  value={report.actionItems}
                  onChange={(e) => setReport({ ...report, actionItems: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionReport.practiceContext}
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Indicadores de Avance"
                  tooltip={FIELD_TOOLTIPS.sessionReport.progressIndicators}
                  required
                  className="mb-2"
                />
                <textarea
                  value={report.insights}
                  onChange={(e) => setReport({ ...report, insights: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionReport.progressIndicators}
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Descubrimientos y Aprendizajes"
                  tooltip={FIELD_TOOLTIPS.sessionReport.discoveriesAndLearnings}
                  required
                  className="mb-2"
                />
                <textarea
                  value={report.coachNotes}
                  onChange={(e) => setReport({ ...report, coachNotes: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionReport.discoveriesAndLearnings}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <LabelWithTooltip
                  label="Tareas para Próxima Sesión"
                  tooltip={FIELD_TOOLTIPS.sessionReport.tasksForNextSession}
                  required
                  className="mb-2"
                />
                <textarea
                  value={report.actionItems}
                  onChange={(e) => setReport({ ...report, actionItems: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionReport.tasksForNextSession}
                  rows={2}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-2">
                  Observaciones (Privadas del Coach)
                </label>
                <textarea
                  value={report.coachNotes}
                  onChange={(e) => setReport({ ...report, coachNotes: e.target.value })}
                  placeholder={FIELD_PLACEHOLDERS.sessionReport.observations}
                  rows={3}
                  className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--fg-primary)] placeholder-[var(--fg-muted)] focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
