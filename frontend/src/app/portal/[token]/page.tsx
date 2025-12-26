'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Users, Target, Calendar, TrendingUp, Clock, CheckCircle,
  AlertCircle, FileText, MessageSquare, ChevronRight, Shield,
  Building, User, Award, Send
} from 'lucide-react';
import { 
  StakeholderPortalData, 
  STAKEHOLDER_ROLE_LABELS,
  StakeholderFeedback 
} from '@/types/stakeholder';
import { 
  getStakeholderPortalData,
  createStakeholderFeedback,
  hasPermission
} from '@/lib/stakeholderService';

export default function StakeholderPortalPage() {
  const params = useParams();
  const token = params?.token as string;
  
  const [portalData, setPortalData] = useState<StakeholderPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | '360'>('overview');
  
  // Feedback form
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'general' as StakeholderFeedback['type'],
    content: '',
    isAnonymous: false,
  });
  const [sendingFeedback, setSendingFeedback] = useState(false);

  useEffect(() => {
    if (token) {
      loadPortalData();
    }
  }, [token]);

  const loadPortalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStakeholderPortalData(token);
      if (!data) {
        setError('expired');
      } else {
        setPortalData(data);
      }
    } catch (err) {
      console.error('Error loading portal:', err);
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalData || !feedbackForm.content.trim()) return;
    
    setSendingFeedback(true);
    try {
      await createStakeholderFeedback({
        stakeholderId: portalData.stakeholder.id,
        programId: portalData.stakeholder.programId,
        coacheeId: portalData.stakeholder.coacheeId,
        type: feedbackForm.type,
        content: feedbackForm.content,
        isAnonymous: feedbackForm.isAnonymous,
      });
      
      setFeedbackForm({ type: 'general', content: '', isAnonymous: false });
      setShowFeedbackForm(false);
      alert('Feedback enviado exitosamente');
    } catch (err) {
      console.error('Error sending feedback:', err);
      alert('Error al enviar feedback');
    } finally {
      setSendingFeedback(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando portal...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (error === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Expirado</h1>
          <p className="text-gray-600 mb-6">
            Este enlace de acceso ha expirado o no es válido. 
            Contacta al coach para solicitar un nuevo enlace.
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    );
  }

  if (error || !portalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-gray-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600">
            Ocurrió un error al cargar el portal. Intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  const { stakeholder, coacheeName, coachName, programTitle, programPhase, programProgress } = portalData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">AchievingCoach</h1>
                <p className="text-xs text-gray-500">Portal de Stakeholder</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{stakeholder.name}</p>
              <p className="text-xs text-gray-500">{STAKEHOLDER_ROLE_LABELS[stakeholder.role]}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary-100 text-sm mb-1">Proceso de Coaching</p>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{coacheeName}</h2>
              <p className="text-primary-100">
                Coach: {coachName} • {programTitle}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-4xl font-bold">{programProgress}%</div>
              <div className="text-sm text-primary-100">Progreso</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-xs text-primary-200 mb-2">
              <span>Fase {programPhase} de 9</span>
              <span>{programProgress}% completado</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${programProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {portalData.sessionsCompleted || 0}/{portalData.totalSessions || 6}
                </p>
                <p className="text-xs text-gray-500">Sesiones</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {portalData.goals?.completed || 0}/{portalData.goals?.total || 0}
                </p>
                <p className="text-xs text-gray-500">Objetivos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Fase {programPhase}</p>
                <p className="text-xs text-gray-500">Actual</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="text-orange-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {portalData.pendingActions.length}
                </p>
                <p className="text-xs text-gray-500">Pendientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Vista General
          </button>
          {hasPermission(stakeholder, 'leave_feedback') && (
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'feedback'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Feedback
            </button>
          )}
          {hasPermission(stakeholder, 'complete_360') && portalData.pending360 && (
            <button
              onClick={() => setActiveTab('360')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === '360'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              360° Feedback
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">1</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Goals */}
            {hasPermission(stakeholder, 'view_goals') && portalData.goals && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="text-primary-600" size={20} />
                  Objetivos del Proceso
                </h3>
                <div className="space-y-3">
                  {portalData.goals.items.map((goal, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className={`p-1 rounded-full ${
                        goal.status === 'completed' ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        {goal.status === 'completed' ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <Clock className="text-gray-400" size={16} />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{goal.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-orange-600" size={20} />
                Acciones Pendientes
              </h3>
              {portalData.pendingActions.length > 0 ? (
                <div className="space-y-3">
                  {portalData.pendingActions.map((action, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.type}</p>
                      </div>
                      <ChevronRight className="text-gray-400" size={20} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto mb-2 text-green-500" size={32} />
                  <p>No tienes acciones pendientes</p>
                </div>
              )}
            </div>

            {/* Your Role Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="text-primary-600" size={20} />
                Tu Rol en el Proceso
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rol</p>
                  <p className="font-medium text-gray-900">{STAKEHOLDER_ROLE_LABELS[stakeholder.role]}</p>
                </div>
                {stakeholder.position && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cargo</p>
                    <p className="font-medium text-gray-900">{stakeholder.position}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 mb-2">Tus permisos en este proceso:</p>
                  <div className="flex flex-wrap gap-2">
                    {stakeholder.permissions.map(perm => (
                      <span 
                        key={perm}
                        className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-lg"
                      >
                        {perm.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-primary-600" size={20} />
                Enviar Feedback
              </h3>
              {!showFeedbackForm && (
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Nuevo Feedback
                </button>
              )}
            </div>

            {showFeedbackForm ? (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Feedback
                  </label>
                  <select
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm({ 
                      ...feedbackForm, 
                      type: e.target.value as StakeholderFeedback['type'] 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="general">Comentario General</option>
                    <option value="progress_observation">Observación de Progreso</option>
                    <option value="praise">Reconocimiento</option>
                    <option value="concern">Preocupación</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tu Feedback
                  </label>
                  <textarea
                    value={feedbackForm.content}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder={`Comparte tu observación sobre el progreso de ${coacheeName}...`}
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={feedbackForm.isAnonymous}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, isAnonymous: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Enviar de forma anónima (no visible para el coachee)</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={sendingFeedback || !feedbackForm.content.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {sendingFeedback ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Enviar Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="mx-auto mb-3 text-gray-400" size={48} />
                <p className="mb-2">Comparte observaciones sobre el progreso de {coacheeName}</p>
                <p className="text-sm">Tu feedback ayuda al coach a personalizar el proceso</p>
              </div>
            )}
          </div>
        )}

        {activeTab === '360' && portalData.pending360 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">360° Feedback Pendiente</h3>
              <p className="text-gray-600 mb-6">
                {portalData.pending360.title}
              </p>
              
              <a
                href={`/360/${portalData.pending360.campaignId}?token=${token}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Completar 360° Feedback
                <ChevronRight size={20} />
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>© 2025 AchievingCoach. Portal de Stakeholder.</p>
          <p className="mt-1">Este es un acceso seguro y privado para participantes del proceso de coaching.</p>
        </div>
      </footer>
    </div>
  );
}
