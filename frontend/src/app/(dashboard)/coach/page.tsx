'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

// Mock data de clientes
const MOCK_CLIENTS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    status: 'active',
    nextSession: '2025-11-20T14:00:00',
    progress: 75,
    goals: 3,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    status: 'active',
    nextSession: '2025-11-22T10:00:00',
    progress: 60,
    goals: 5,
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    status: 'active',
    nextSession: null,
    progress: 40,
    goals: 2,
  },
];

const STATS = {
  totalClients: 12,
  activeSessions: 8,
  completedThisMonth: 24,
  avgProgress: 68,
};

export default function CoachDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState(MOCK_CLIENTS);
  const router = useRouter();

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
              <Link href="/coach/clients" className="text-gray-600 hover:text-primary-600 font-medium">
                Clients
              </Link>
              <Link href="/tools" className="text-gray-600 hover:text-primary-600 font-medium">
                Tools
              </Link>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Coach Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your clients and track their progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-gray-600 text-sm mb-1">Total Clients</div>
            <div className="text-3xl font-bold text-primary-600">{STATS.totalClients}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-gray-600 text-sm mb-1">Active Sessions</div>
            <div className="text-3xl font-bold text-green-600">{STATS.activeSessions}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-gray-600 text-sm mb-1">Completed This Month</div>
            <div className="text-3xl font-bold text-blue-600">{STATS.completedThisMonth}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-gray-600 text-sm mb-1">Avg Progress</div>
            <div className="text-3xl font-bold text-purple-600">{STATS.avgProgress}%</div>
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Clients</h3>
            <Link 
              href="/coach/clients"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-4">
            {clients.map((client) => (
              <Link
                key={client.id}
                href={`/coach/clients/${client.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-bold text-lg">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{client.name}</h4>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Next Session</div>
                      <div className="font-medium text-gray-900">
                        {formatDate(client.nextSession)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Progress</div>
                      <div className="font-bold text-primary-600">{client.progress}%</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600">Goals</div>
                      <div className="font-bold text-gray-900">{client.goals}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
