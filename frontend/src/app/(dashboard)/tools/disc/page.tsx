'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { CircleDot, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'sonner';
import { DISCAssessment } from '@/components/DISCAssessment';

export default function DISCPage() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      // Coaches cannot complete tools - they can only assign them to coachees
      if (userProfile.role === 'coach') {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      if (userProfile.role === 'coachee') {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'disc')
        );
        
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignment = assignmentSnapshot.docs[0].data();
          setHasAccess(true);
          setIsCompleted(assignment.completed || false);
        }
      }
      
      setLoading(false);
    };
    checkAccess();
  }, [user, userProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    const isCoach = userProfile?.role === 'coach';
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
            <div className={`w-16 h-16 ${isCoach ? 'bg-emerald-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <CircleDot className={`w-8 h-8 ${isCoach ? 'text-emerald-400' : 'text-yellow-400'}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isCoach ? 'Tool for Coachees Only' : 'Access Required'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isCoach
                ? 'This tool is designed to be completed by coachees. You can assign it to your clients from the client management page.'
                : 'This tool needs to be assigned by your coach before you can access it.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={isCoach ? '/coach/clients' : '/dashboard'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                {isCoach ? 'Go to Clients' : 'Return to Dashboard'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Tool Completed!</h2>
            <p className="text-gray-400 mb-6">
              You've successfully completed the DISC Assessment. Your coach has been notified.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                View Other Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">DISC Assessment</h1>
          <p className="text-gray-400 mt-2">
            Discover your behavioral profile and communication style
          </p>
        </div>
        <DISCAssessment />
      </div>
    </div>
  );
}
