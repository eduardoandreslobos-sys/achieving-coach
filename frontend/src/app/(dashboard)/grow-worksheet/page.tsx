'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GrowWorksheet from '@/components/GrowWorksheet';
import { ArrowLeft, Plus, FileText, Clock, CheckCircle2 } from 'lucide-react';

interface GrowSessionSummary {
  id: string;
  sessionDate: Date;
  status: string;
  goal: {
    description: string;
  };
}

export default function GrowWorksheetPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<GrowSessionSummary[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = 'user-123';
  const coachId = 'coach-456';

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const mockSessions: GrowSessionSummary[] = [
        {
          id: '1',
          sessionDate: new Date('2024-11-10'),
          status: 'completed',
          goal: { description: 'Improve time management skills' },
        },
        {
          id: '2',
          sessionDate: new Date('2024-11-05'),
          status: 'in-progress',
          goal: { description: 'Build confidence in public speaking' },
        },
        {
          id: '3',
          sessionDate: new Date('2024-10-28'),
          status: 'draft',
          goal: { description: 'Develop leadership capabilities' },
        },
      ];
      setSessions(mockSessions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setSelectedSessionId(null);
    setShowWorksheet(true);
  };

  const handleEditSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setShowWorksheet(true);
  };

  const handleBack = () => {
    setShowWorksheet(false);
    setSelectedSessionId(null);
    loadSessions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'draft':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (showWorksheet) {
    return (
      <div>
        <button onClick={handleBack} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Sessions
        </button>
        <GrowWorksheet
          sessionId={selectedSessionId || undefined}
          coacheeId={userId}
          coachId={coachId}
          onSave={(session) => {
            console.log('Session saved:', session);
          }}
          onComplete={(session) => {
            console.log('Session completed:', session);
            handleBack();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GROW Model Sessions</h1>
        <p className="text-gray-600">Structured coaching sessions using the GROW framework</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What is the GROW Model?</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">G</div>
              <h3 className="font-semibold text-gray-900">Goal</h3>
            </div>
            <p className="text-sm text-gray-600">What do you want to achieve?</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">R</div>
              <h3 className="font-semibold text-gray-900">Reality</h3>
            </div>
            <p className="text-sm text-gray-600">Where are you now?</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">O</div>
              <h3 className="font-semibold text-gray-900">Options</h3>
            </div>
            <p className="text-sm text-gray-600">What could you do?</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">W</div>
              <h3 className="font-semibold text-gray-900">Will</h3>
            </div>
            <p className="text-sm text-gray-600">What will you do?</p>
          </div>
        </div>
      </div>

      <button onClick={handleNewSession} className="mb-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
        <Plus className="w-5 h-5" />
        Start New GROW Session
      </button>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions yet</h3>
          <p className="text-gray-600 mb-4">Start your first GROW session to begin your coaching journey</p>
          <button onClick={handleNewSession} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            Create Your First Session
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer" onClick={() => handleEditSession(session.id)}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(session.sessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.goal.description || 'Untitled Session'}</h3>
                  <p className="text-sm text-gray-600">Click to {session.status === 'completed' ? 'view' : 'continue'} this session</p>
                </div>
                <div className="text-gray-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-gray-900">{sessions.length}</div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-blue-600">{sessions.filter((s) => s.status === 'in-progress').length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-2xl font-bold text-green-600">{sessions.filter((s) => s.status === 'completed').length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
}
