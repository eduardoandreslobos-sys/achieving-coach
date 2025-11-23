'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getCoachingProgram, getProgramSessions, createSession } from '@/lib/coachingService';
import { CoachingProgram, Session, SESSION_TEMPLATES, SessionType } from '@/types/coaching';
import { Calendar, Clock, Plus, Target, CheckCircle, XCircle, Video } from 'lucide-react';

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const programId = params?.programId as string;

  const [program, setProgram] = useState<CoachingProgram | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);

  useEffect(() => {
    if (programId && userProfile?.uid) {
      loadProgram();
      loadSessions();
    }
  }, [programId, userProfile]);

  const loadProgram = async () => {
    try {
      const data = await getCoachingProgram(programId);
      if (data) {
        setProgram(data);
      }
    } catch (error) {
      console.error('Error loading program:', error);
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await getProgramSessions(programId);
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Program not found</h1>
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/coach/clients/${program.coacheeId}`)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to client
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h1>
          <p className="text-gray-600">{program.coacheeName}</p>
        </div>

        {/* Program Overview */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Program Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-900">{program.duration} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sessions Planned</p>
              <p className="text-lg font-bold text-gray-900">{program.sessionsPlanned}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sessions Completed</p>
              <p className="text-lg font-bold text-gray-900">
                {completedSessions.length} / {program.sessionsPlanned}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Program Goals:</h3>
            <ul className="space-y-2">
              {program.overallGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Target className="text-primary-600 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Sessions</h2>
              <button
                onClick={() => setShowNewSession(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus size={20} />
                Schedule Session
              </button>
            </div>

            {upcomingSessions.length === 0 && completedSessions.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No sessions scheduled yet</p>
                <button
                  onClick={() => setShowNewSession(true)}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Schedule your first session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
                
                {completedSessions.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Completed Sessions</h3>
                    {completedSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* New Session Modal */}
        {showNewSession && (
          <NewSessionModal
            program={program}
            sessionNumber={sessions.length + 1}
            onClose={() => setShowNewSession(false)}
            onCreated={() => {
              setShowNewSession(false);
              loadSessions();
            }}
          />
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: SessionType) => {
    switch (type) {
      case 'kickstarter': return 'bg-purple-100 text-purple-800';
      case 'reflection': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900">
              Session {session.sessionNumber}: {session.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(session.type)}`}>
              {session.type}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{session.scheduledDate.toDate().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{session.scheduledTime} ({session.duration} min)</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
          {session.status}
        </span>
      </div>

      {session.goal && (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-700 mb-1">Session Goal:</p>
          <p className="text-sm text-gray-600">{session.goal}</p>
        </div>
      )}

      {session.review && (
        <div className="bg-green-50 rounded-lg p-4 mt-4">
          <h4 className="font-bold text-green-900 mb-2">Session Review</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-800 font-medium">Progress: {session.review.coacheeProgress}/10</p>
              <p className="text-green-800 font-medium">Quality: {session.review.sessionQuality}/10</p>
            </div>
            <div>
              <p className="text-green-800">{session.review.achievements.length} achievements</p>
              <p className="text-green-800">{session.review.insights.length} insights</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NewSessionModal({ program, sessionNumber, onClose, onCreated }: {
  program: CoachingProgram;
  sessionNumber: number;
  onClose: () => void;
  onCreated: () => void;
}) {
  const { userProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<SessionType>('regular');
  const [formData, setFormData] = useState({
    title: '',
    scheduledDate: '',
    scheduledTime: '14:00',
    duration: 60,
    goal: '',
  });

  useEffect(() => {
    const template = SESSION_TEMPLATES[selectedType];
    setFormData(prev => ({
      ...prev,
      title: template.defaultTitle,
      duration: template.defaultDuration,
    }));
  }, [selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid) return;

    setSaving(true);
    try {
      const template = SESSION_TEMPLATES[selectedType];
      
      await createSession(
        program.id,
        userProfile.uid,
        program.coacheeId,
        program.coacheeName,
        {
          sessionNumber,
          title: formData.title,
          scheduledDate: new Date(formData.scheduledDate),
          scheduledTime: formData.scheduledTime,
          duration: formData.duration,
          objective: formData.goal,
        }
      );

      onCreated();
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    } finally {
      setSaving(false);
    }
  };

  const template = SESSION_TEMPLATES[selectedType];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule New Session</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Type *</label>
            <div className="grid grid-cols-3 gap-3">
              {(['kickstarter', 'regular', 'reflection'] as SessionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedType === type
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-bold text-gray-900 capitalize">{type}</p>
                  <p className="text-xs text-gray-600 mt-1">{SESSION_TEMPLATES[type].defaultDuration} min</p>
                </button>
              ))}
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Suggested Agenda:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              {template.suggestedAgenda.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>

          {/* Session Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                required
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Goal *</label>
            <textarea
              required
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              rows={3}
              placeholder="What do you want to achieve in this session?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
