'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Users, Mail, Calendar } from 'lucide-react';

interface Client {
  uid: string;
  displayName: string;
  email: string;
  createdAt: any;
  organization?: string;
}

export default function CoachClientsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Clients</h1>
            <p className="text-gray-600">Manage your coaching relationships</p>
          </div>
          <Link
            href="/coach/invite"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
          >
            <Users size={20} />
            Invite Client
          </Link>
        </div>

        {clients.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No clients yet</h2>
            <p className="text-gray-600 mb-6">Start building your coaching practice by inviting your first client</p>
            <Link
              href="/coach/invite"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              <Users size={20} className="mr-2" />
              Invite Your First Client
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <Link
                key={client.uid}
                href={`/coach/clients/${client.uid}`}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {client.displayName?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{client.displayName}</h3>
                    {client.organization && (
                      <p className="text-sm text-gray-500 truncate">{client.organization}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Since {client.createdAt?.toLocaleDateString() || 'Recently'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-primary-600 font-medium">View Details →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
