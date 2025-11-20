'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Mail, Calendar, Wrench, Target, TrendingUp } from 'lucide-react';

interface ClientData {
  displayName: string;
  email: string;
  createdAt: any;
  organization?: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const docRef = doc(db, 'users', clientId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setClient(docSnap.data() as ClientData);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Client not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/coach/clients" className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-4 inline-block">
            ← Back to Clients
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{client.displayName}</h1>
        </div>

        {/* Client Info Card */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Client Information</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{client.email}</p>
              </div>
            </div>
            
            {client.organization && (
              <div className="flex items-center gap-3">
                <Target className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Organization</p>
                  <p className="font-medium text-gray-900">{client.organization}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">
                  {client.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href={`/coach/clients/${clientId}/assign-tools`}
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Wrench className="text-primary-600" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Assign Tools</h3>
                <p className="text-sm text-gray-600">Give client access to coaching tools</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <TrendingUp className="text-gray-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">View Progress</h3>
                <p className="text-sm text-gray-600">Coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
