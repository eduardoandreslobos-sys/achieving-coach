'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Mock client data
const CLIENT_DATA: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    joinedDate: '2025-09-15',
    status: 'active',
    progress: 75,
    goals: [
      { id: 'g1', title: 'Improve leadership skills', progress: 80, status: 'active' },
      { id: 'g2', title: 'Work-life balance', progress: 70, status: 'active' },
      { id: 'g3', title: 'Public speaking confidence', progress: 75, status: 'active' },
    ],
    sessions: [
      { id: 's1', date: '2025-11-01', duration: 60, notes: 'Great progress on leadership goals', rating: 5 },
      { id: 's2', date: '2025-10-25', duration: 60, notes: 'Discussed work-life balance strategies', rating: 5 },
      { id: 's3', date: '2025-10-18', duration: 60, notes: 'Initial assessment and goal setting', rating: 4 },
    ],
    tools: [
      { id: 't1', name: 'Wheel of Life', completedDate: '2025-10-20', score: 6.5 },
      { id: 't2', name: 'Values Clarification', completedDate: '2025-10-28', score: null },
    ],
  },
  '2': {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    phone: '+1 (555) 234-5678',
    joinedDate: '2025-10-01',
    status: 'active',
    progress: 60,
    goals: [
      { id: 'g1', title: 'Career transition', progress: 50, status: 'active' },
      { id: 'g2', title: 'Networking skills', progress: 65, status: 'active' },
      { id: 'g3', title: 'Personal branding', progress: 60, status: 'active' },
    ],
    sessions: [
      { id: 's1', date: '2025-11-05', duration: 60, notes: 'Career exploration session', rating: 5 },
      { id: 's2', date: '2025-10-29', duration: 60, notes: 'Networking strategy development', rating: 4 },
    ],
    tools: [
      { id: 't1', name: 'Career Compass', completedDate: '2025-11-01', score: null },
    ],
  },
};

export default function ClientDetailPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'sessions' | 'tools'>('overview');
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const client = CLIENT_DATA[clientId];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Client not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
            <div className="flex items-center gap-6">
              <Link href="/coach" className="text-gray-600 hover:text-primary-600 font-medium">
                Dashboard
              </Link>
              <Link href="/coach/clients" className="text-gray-600 hover:text-primary-600 font-medium">
                Clients
              </Link>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/coach/clients" className="text-primary-600 hover:underline mb-4 inline-block">
          ← Back to Clients
        </Link>

        {/* Client Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-3xl">
                  {client.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                <p className="text-gray-600">{client.email}</p>
                <p className="text-gray-600 text-sm">{client.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
                Active
              </span>
              <p className="text-sm text-gray-600">
                Joined {new Date(client.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {(['overview', 'goals', 'sessions', 'tools'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 border-b-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Overall Progress</div>
                  <div className="text-3xl font-bold text-primary-600">{client.progress}%</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Active Goals</div>
                  <div className="text-3xl font-bold text-gray-900">{client.goals.length}</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-gray-600 text-sm mb-1">Total Sessions</div>
                  <div className="text-3xl font-bold text-gray-900">{client.sessions.length}</div>
                </div>
              </div>
            )}

            {activeTab === 'goals' && (
              <div className="space-y-4">
                {client.goals.map((goal: any) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <span className="text-primary-600 font-bold">{goal.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-4">
                {client.sessions.map((session: any) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-gray-600 text-sm mt-1">{session.duration} minutes</div>
                        <p className="text-gray-700 mt-2">{session.notes}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: session.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-4">
                {client.tools.map((tool: any) => (
                  <div key={tool.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                      <p className="text-gray-600 text-sm">
                        Completed {new Date(tool.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                    {tool.score && (
                      <div className="text-primary-600 font-bold text-lg">
                        Score: {tool.score}/10
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
