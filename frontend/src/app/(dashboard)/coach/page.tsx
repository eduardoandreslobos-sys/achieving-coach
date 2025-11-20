'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import { Users, Calendar, TrendingUp } from 'lucide-react';

interface Client {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: any;
}

export default function CoachDashboardPage() {
  const { userProfile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      if (!userProfile?.uid) return;

      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid)
        );
        
        const snapshot = await getDocs(q);
        const clientsData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        })) as Client[];
        
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activeClients = clients.length;
  const trialEndingSoon = clients.filter(c => {
    // Clientes cuyo trial termina en menos de 3 días
    return true; // Por ahora todos
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Good evening, {userProfile?.firstName || 'Coach'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here is your coaching overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{activeClients}</h3>
            <p className="text-sm text-gray-600">Active Clients</p>
            {trialEndingSoon > 0 && (
              <p className="text-xs text-orange-600 mt-2">{trialEndingSoon} trials ending soon</p>
            )}
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">0</h3>
            <p className="text-sm text-gray-600">Sessions This Week</p>
            <p className="text-xs text-gray-500 mt-2">Schedule sessions with your clients</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">-</h3>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-2">Tool assignments completed</p>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Clients</h2>
            <Link href="/coach/clients" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All →
            </Link>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
              <p className="text-gray-600 mb-6">Start by inviting coachees to join your coaching practice</p>
              <Link 
                href="/coach/invite"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
              >
                Invite Coachees
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {clients.map((client) => (
                <Link
                  key={client.uid}
                  href={`/coach/clients/${client.uid}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                      {client.displayName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.displayName}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Member since {client.createdAt?.toLocaleDateString() || 'Recently'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/coach/invite" className="block p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <p className="font-medium text-primary-900">Invite New Coachee</p>
                <p className="text-sm text-primary-700">Generate invitation link</p>
              </Link>
              <Link href="/coach/icf-simulator" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="font-medium text-blue-900">Practice ICF Exam</p>
                <p className="text-sm text-blue-700">Take the ACC simulator</p>
              </Link>
              <Link href="/messages" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <p className="font-medium text-green-900">View Messages</p>
                <p className="text-sm text-green-700">Check client messages</p>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Started</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Account Setup Complete</p>
                  <p className="text-sm text-gray-600">Your coach profile is ready</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-gray-600">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Invite Your First Client</p>
                  <p className="text-sm text-gray-600">Send an invitation to start coaching</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-gray-600">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Assign First Tool</p>
                  <p className="text-sm text-gray-600">Help clients with coaching tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
