'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCoacheeProgram } from '@/lib/coachingService';
import { 
  ArrowLeft, 
  MessageSquare, 
  Calendar, 
  Target,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  ChevronDown,
  Activity,
  BarChart3,
  Mail,
  Plus,
  ExternalLink,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface CoacheeData {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photoURL?: string;
  createdAt: any;
}

interface AnalyticsData {
  totalGoals: number;
  completedGoals: number;
  goalCompletionRate: number;
  totalSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  toolsAssigned: number;
  toolsCompleted: number;
  toolCompletionRate: number;
  reflectionsCount: number;
  lastActivityDate: string;
  messagesCount: number;
  avgResponseTime: string;
}

// Available metrics that coach can toggle
const AVAILABLE_METRICS = [
  { id: 'goals', label: 'Goals', icon: Target, enabled: true },
  { id: 'sessions', label: 'Sessions', icon: Calendar, enabled: true },
  { id: 'tools', label: 'Tools', icon: CheckCircle2, enabled: true },
  { id: 'reflections', label: 'Reflections', icon: Activity, enabled: true },
  { id: 'messages', label: 'Messages', icon: MessageSquare, enabled: false },
  { id: 'timeline', label: 'Activity Timeline', icon: Clock, enabled: false },
];

export default function ClientAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const clientId = params?.id as string;

  const [client, setClient] = useState<CoacheeData | null>(null);
  const [program, setProgram] = useState<any>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'30' | '90' | 'all'>('30');
  const [showMetricSelector, setShowMetricSelector] = useState(false);
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(() => 
    AVAILABLE_METRICS.filter(m => m.enabled).map(m => m.id)
  );

  useEffect(() => {
    if (clientId && userProfile?.uid) {
      loadAllData();
    }
  }, [clientId, userProfile, timeRange]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadClient(),
        loadProgram(),
        loadAnalytics()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClient = async () => {
    try {
      const clientDoc = await getDoc(doc(db, 'users', clientId));
      if (clientDoc.exists()) {
        setClient({ id: clientDoc.id, ...clientDoc.data() } as CoacheeData);
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const loadProgram = async () => {
    if (!userProfile?.uid) return;
    
    try {
      const data = await getCoacheeProgram(userProfile.uid, clientId);
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      if (timeRange === '30') {
        startDate.setDate(now.getDate() - 30);
      } else if (timeRange === '90') {
        startDate.setDate(now.getDate() - 90);
      } else {
        startDate = new Date(0); // All time
      }

      // Load Goals
      const goalsQuery = query(
        collection(db, 'goals'),
        where('userId', '==', clientId)
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const completedGoals = goals.filter(g => g.status === 'completed').length;

      // Load Sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('coacheeId', '==', clientId)
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setSessions(sessionsData);
      const sessions = sessionsData;
      const completedSessions = sessions.filter(s => s.status === 'completed').length;
      const upcomingSessions = sessions.filter(s => s.status === 'scheduled').length;

      // Load Tool Assignments
      const toolsQuery = query(
        collection(db, 'tool_assignments'),
        where('coacheeId', '==', clientId)
      );
      const toolsSnapshot = await getDocs(toolsQuery);
      const tools = toolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const completedTools = tools.filter(t => t.completed === true).length;

      // Load Reflections
      const reflectionsQuery = query(
        collection(db, 'reflections'),
        where('userId', '==', clientId)
      );
      const reflectionsSnapshot = await getDocs(reflectionsQuery);

      // Load Messages (for response time calculation)
      const messagesQuery = query(
        collection(db, 'messages'),
        where('userId', '==', clientId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      // Calculate average response time (simplified)
      let avgResponseTime = 'N/A';
      if (messages.length > 0) {
        // In real implementation, calculate actual response time from message timestamps
        avgResponseTime = '< 24h'; // Placeholder - calculate from actual data
      }

      // Calculate rates
      const goalCompletionRate = goals.length > 0 
        ? Math.round((completedGoals / goals.length) * 100) 
        : 0;
      
      const toolCompletionRate = tools.length > 0
        ? Math.round((completedTools / tools.length) * 100)
        : 0;

      // Get last activity date from most recent session, goal, or reflection
      const allDates = [
        ...sessions.map(s => s.createdAt?.seconds * 1000 || 0),
        ...goals.map(g => g.createdAt?.seconds * 1000 || 0),
        ...reflectionsSnapshot.docs.map(doc => doc.data().createdAt?.seconds * 1000 || 0),
      ].filter(d => d > 0);

      const lastActivityDate = allDates.length > 0
        ? new Date(Math.max(...allDates)).toLocaleDateString()
        : 'No activity yet';

      setAnalytics({
        totalGoals: goals.length,
        completedGoals,
        goalCompletionRate,
        totalSessions: sessions.length,
        completedSessions,
        upcomingSessions,
        toolsAssigned: tools.length,
        toolsCompleted: completedTools,
        toolCompletionRate,
        reflectionsCount: reflectionsSnapshot.size,
        lastActivityDate,
        messagesCount: messages.length,
        avgResponseTime,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const toggleMetric = (metricId: string) => {
    setVisibleMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8">
          <Link
            href="/coach/clients"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-4 font-medium"
          >
            <ArrowLeft size={20} />
            Back to clients
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {client.displayName || `${client.firstName} ${client.lastName}`}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={18} />
                <span>{client.email}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/coach/clients/${clientId}/results`}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <BarChart3 size={20} />
                Ver Resultados
              </Link>
              <Link
                href={`/messages?userId=${clientId}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <MessageSquare size={20} />
                Message
              </Link>
            </div>
          </div>
        </div>

        {/* Coaching Program Section */}
        <div className="mb-8">
          {program ? (
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{program.title}</h2>
                  <p className="text-gray-400">{program.description}</p>
                </div>
                <Link
                  href={"/coach/programs/" + program.id}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink size={18} />
                  View Program
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="text-xl font-bold text-white">{program.duration} months</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Sessions</p>
                  <p className="text-xl font-bold text-white">{program.sessionsPlanned}</p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="text-xl font-bold text-white capitalize">{program.status}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white mb-2">Program Goals:</h3>
                <ul className="space-y-1">
                  {program.overallGoals.map((goal: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Target className="text-emerald-400 flex-shrink-0 mt-1" size={16} />
                      <span className="text-gray-300">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-[#111111] border border-yellow-600/30 rounded-xl p-8 text-center">
              <Calendar className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Coaching Program Yet</h3>
              <p className="text-gray-400 mb-6">
                Create a coaching program to define goals and schedule sessions
              </p>
              <Link
                href={"/coach/programs/new?coacheeId=" + clientId}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
              >
                <Plus size={20} />
                Create Coaching Program
              </Link>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="space-y-6">
            {/* Header with controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              <div className="flex items-center gap-3">
                {/* Time Range Filters */}
                <div className="flex bg-[#1a1a1a] rounded-lg p-1">
                  <button
                    onClick={() => setTimeRange('30')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === '30'
                        ? 'bg-[#2a2a2a] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('90')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === '90'
                        ? 'bg-[#2a2a2a] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Last 90 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      timeRange === 'all'
                        ? 'bg-[#2a2a2a] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All Time
                  </button>
                </div>

                {/* Metric Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowMetricSelector(!showMetricSelector)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <Settings size={18} />
                    Customize
                  </button>

                  {showMetricSelector && (
                    <div className="absolute right-0 mt-2 w-64 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-10 p-4">
                      <h3 className="font-bold text-white mb-3">Select Metrics</h3>
                      <div className="space-y-2">
                        {AVAILABLE_METRICS.map(metric => {
                          const Icon = metric.icon;
                          return (
                            <label key={metric.id} className="flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded">
                              <input
                                type="checkbox"
                                checked={visibleMetrics.includes(metric.id)}
                                onChange={() => toggleMetric(metric.id)}
                                className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600"
                              />
                              <Icon size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-300">{metric.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {visibleMetrics.includes('goals') && (
                <StatCard
                  title="Goal Completion"
                  value={`${analytics.goalCompletionRate}%`}
                  subtitle={`${analytics.completedGoals}/${analytics.totalGoals} completed`}
                  icon={Target}
                  color="text-emerald-400"
                  bgColor="bg-emerald-500/10"
                />
              )}

              {visibleMetrics.includes('sessions') && (
                <StatCard
                  title="Sessions"
                  value={analytics.completedSessions.toString()}
                  subtitle={`${analytics.upcomingSessions} upcoming`}
                  icon={Calendar}
                  color="text-emerald-400"
                  bgColor="bg-emerald-500/10"
                />
              )}

              {visibleMetrics.includes('tools') && (
                <StatCard
                  title="Tool Completion"
                  value={`${analytics.toolCompletionRate}%`}
                  subtitle={`${analytics.toolsCompleted}/${analytics.toolsAssigned} completed`}
                  icon={CheckCircle2}
                  color="text-violet-400"
                  bgColor="bg-violet-500/10"
                />
              )}

              {visibleMetrics.includes('reflections') && (
                <StatCard
                  title="Reflections"
                  value={analytics.reflectionsCount.toString()}
                  subtitle="Written reflections"
                  icon={Activity}
                  color="text-orange-400"
                  bgColor="bg-orange-500/10"
                />
              )}

              {visibleMetrics.includes('messages') && (
                <StatCard
                  title="Messages"
                  value={analytics.messagesCount.toString()}
                  subtitle={`Avg response: ${analytics.avgResponseTime}`}
                  icon={MessageSquare}
                  color="text-indigo-400"
                  bgColor="bg-indigo-500/10"
                />
              )}
            </div>

            {/* Detailed Progress Section */}
            {(visibleMetrics.includes('goals') || visibleMetrics.includes('tools') || visibleMetrics.includes('sessions')) && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Progress Overview</h3>
                <div className="space-y-4">
                  {visibleMetrics.includes('goals') && (
                    <ProgressBar
                      label="Goals"
                      value={analytics.completedGoals}
                      max={analytics.totalGoals}
                      color="bg-emerald-500"
                    />
                  )}
                  {visibleMetrics.includes('tools') && (
                    <ProgressBar
                      label="Tools"
                      value={analytics.toolsCompleted}
                      max={analytics.toolsAssigned}
                      color="bg-violet-500"
                    />
                  )}
                  {visibleMetrics.includes('sessions') && (
                    <ProgressBar
                      label="Sessions"
                      value={analytics.completedSessions}
                      max={analytics.totalSessions}
                      color="bg-emerald-500"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Activity Timeline */}
            {visibleMetrics.includes('timeline') && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="text-gray-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Activity Timeline</h3>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Last activity: {analytics.lastActivityDate}</p>
                  <p className="text-xs text-gray-600 mt-2">Detailed timeline coming soon</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Goals Section - PRESERVED FROM ORIGINAL */}
        
        {/* Session Notes Section */}
        {sessions.length > 0 && (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-emerald-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Session Notes</h2>
              <span className="text-sm text-gray-500 ml-2">
                ({sessions.filter(s => s.sessionReport || s.sessionAgreement).length} with notes)
              </span>
            </div>

            {sessions.filter(s => s.sessionReport || s.sessionAgreement).length === 0 ? (
              <p className="text-gray-500 text-center py-6">No session notes recorded yet</p>
            ) : (
              <div className="space-y-3">
                {sessions
                  .filter(s => s.sessionReport || s.sessionAgreement)
                  .sort((a, b) => (b.scheduledDate?.seconds || 0) - (a.scheduledDate?.seconds || 0))
                  .map((session) => (
                  <div key={session.id} className="border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                      className="w-full px-4 py-3 bg-[#1a1a1a] hover:bg-[#2a2a2a] flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-white">
                          {session.title || `Sesión ${session.sessionNumber || ''}`}
                        </span>
                        <span className="text-sm text-gray-500">
                          {session.scheduledDate?.toDate?.()?.toLocaleDateString('es-CL') || 'Sin fecha'}
                        </span>
                        {session.status === 'completed' && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Completada</span>
                        )}
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${expandedSession === session.id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedSession === session.id && (
                      <div className="p-4 space-y-4 bg-[#0d0d0d] border-t border-gray-800">
                        {session.sessionAgreement && (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                              <ClipboardList size={16} />
                              Acuerdo de Sesión
                            </h4>
                            <div className="space-y-2 text-sm text-emerald-300">
                              {session.sessionAgreement.previousSessionLink && (
                                <div><strong className="text-emerald-400">Enganche con sesión anterior:</strong> {session.sessionAgreement.previousSessionLink}</div>
                              )}
                              {session.sessionAgreement.sessionFocus && (
                                <div><strong className="text-emerald-400">Foco de la sesión:</strong> {session.sessionAgreement.sessionFocus}</div>
                              )}
                              {session.sessionAgreement.relevanceToProcess && (
                                <div><strong className="text-emerald-400">Relevancia:</strong> {session.sessionAgreement.relevanceToProcess}</div>
                              )}
                              {session.sessionAgreement.practicesOrCompetencies && (
                                <div><strong className="text-emerald-400">Prácticas/Competencias:</strong> {session.sessionAgreement.practicesOrCompetencies}</div>
                              )}
                              {session.sessionAgreement.sessionIndicators && (
                                <div><strong className="text-emerald-400">Indicadores:</strong> {session.sessionAgreement.sessionIndicators}</div>
                              )}
                            </div>
                          </div>
                        )}

                        {session.sessionReport && (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                              <CheckCircle2 size={16} />
                              Tabla de Seguimiento
                            </h4>
                            <div className="space-y-2 text-sm text-emerald-300">
                              {session.sessionReport.sessionTopic && (
                                <div><strong className="text-emerald-400">Tema:</strong> {session.sessionReport.sessionTopic}</div>
                              )}
                              {session.sessionReport.practicesWorked && (
                                <div><strong className="text-emerald-400">Prácticas trabajadas:</strong> {session.sessionReport.practicesWorked}</div>
                              )}
                              {session.sessionReport.practiceContext && (
                                <div><strong className="text-emerald-400">Contexto:</strong> {session.sessionReport.practiceContext}</div>
                              )}
                              {session.sessionReport.progressIndicators && (
                                <div><strong className="text-emerald-400">Indicadores de avance:</strong> {session.sessionReport.progressIndicators}</div>
                              )}
                              {session.sessionReport.discoveriesAndLearnings && (
                                <div><strong className="text-emerald-400">Descubrimientos y aprendizajes:</strong> {session.sessionReport.discoveriesAndLearnings}</div>
                              )}
                              {session.sessionReport.tasksForNextSession && (
                                <div><strong className="text-emerald-400">Tareas próxima sesión:</strong> {session.sessionReport.tasksForNextSession}</div>
                              )}
                              {session.sessionReport.observations && (
                                <div><strong className="text-emerald-400">Observaciones:</strong> {session.sessionReport.observations}</div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <Link
                            href={`/sessions/${session.id}`}
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1"
                          >
                            Ver sesión completa
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {(client as any).coacheeInfo?.goals && (client as any).coacheeInfo.goals.length > 0 && (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Client Goals</h2>
            <ul className="space-y-2">
              {(client as any).coacheeInfo.goals.map((goal: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Target className="text-emerald-400 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgColor
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-xs uppercase tracking-wider">{title}</p>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={color} size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function ProgressBar({
  label,
  value,
  max,
  color
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-gray-400">
          {value}/{max} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
