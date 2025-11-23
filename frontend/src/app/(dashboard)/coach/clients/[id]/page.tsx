'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCoacheeProgram } from '@/lib/coachingService';
import { MessageSquare, Target, Calendar, Mail, Plus, ExternalLink } from 'lucide-react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile } = useAuth();
  const clientId = params?.id as string;

  const [client, setClient] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId && userProfile?.uid) {
      loadClient();
      loadProgram();
    }
  }, [clientId, userProfile]);

  const loadClient = async () => {
    try {
      const docRef = doc(db, 'users', clientId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setClient({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error loading client:', error);
    }
  };

  const loadProgram = async () => {
    if (!userProfile?.uid) return;
    
    setLoading(true);
    try {
      const data = await getCoacheeProgram(userProfile.uid, clientId);
      setProgram(data);
    } catch (error) {
      console.error('Error loading program:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/coach/clients" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
            ← Back to clients
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {client.displayName || `${client.firstName} ${client.lastName}`}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={18} />
                <span>{client.email}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/messages?userId=${clientId}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-300"
              >
                <MessageSquare size={20} />
                Message
              </Link>
            </div>
          </div>
        </div>

        {/* Coaching Program Section */}
        <div className="mb-8">
          {loading ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : program ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h2>
                  <p className="text-gray-600">{program.description}</p>
                </div>
                <Link
                  href={`/coach/programs/${program.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <ExternalLink size={18} />
                  View Program
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-xl font-bold text-gray-900">{program.duration} months</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Sessions</p>
                  <p className="text-xl font-bold text-gray-900">{program.sessionsPlanned}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-xl font-bold text-gray-900 capitalize">{program.status}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Program Goals:</h3>
                <ul className="space-y-1">
                  {program.overallGoals.map((goal: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Target className="text-primary-600 flex-shrink-0 mt-1" size={16} />
                      <span className="text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
              <Calendar className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-yellow-900 mb-2">No Coaching Program Yet</h3>
              <p className="text-yellow-800 mb-6">
                Create a coaching program to define goals and schedule sessions
              </p>
              <Link
                href={`/coach/programs/new?coacheeId=${clientId}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                <Plus size={20} />
                Create Coaching Program
              </Link>
            </div>
          )}
        </div>

        {/* Goals Section */}
        {client.coacheeInfo?.goals && client.coacheeInfo.goals.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Goals</h2>
            <ul className="space-y-2">
              {client.coacheeInfo.goals.map((goal: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Target className="text-green-600 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-700">{goal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
