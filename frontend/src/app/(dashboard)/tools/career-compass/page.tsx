'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Compass, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import CareerCompassForm from '@/components/tools/CareerCompassForm';
import CareerCompassResults from '@/components/tools/CareerCompassResults';
import { CareerCompass } from '@/types/career';

export default function CareerCompassPage() {
  const { user, userProfile } = useAuth();
  const [compass, setCompass] = useState<CareerCompass | null>(null);
  const [showResults, setShowResults] = useState(false);
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
          where('toolId', '==', 'career-compass')
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

  const handleComplete = async (completedCompass: CareerCompass) => {
    setCompass(completedCompass);
    setShowResults(true);

    // Guardar resultado
    if (user && userProfile) {
      try {
        const coachId = userProfile.role === 'coachee' 
          ? userProfile.coacheeInfo?.coachId 
          : user.uid;

        await addDoc(collection(db, 'tool_results'), {
          userId: user.uid,
          toolId: 'career-compass',
          toolName: 'Career Compass',
          coachId: coachId,
          results: completedCompass,
          completedAt: serverTimestamp(),
        });

        if (userProfile.role === 'coachee' && coachId) {
          const assignmentQuery = query(
            collection(db, 'tool_assignments'),
            where('coacheeId', '==', user.uid),
            where('toolId', '==', 'career-compass'),
            where('completed', '==', false)
          );
          
          const assignmentSnapshot = await getDocs(assignmentQuery);
          
          if (!assignmentSnapshot.empty) {
            const assignmentDoc = assignmentSnapshot.docs[0];
            
            await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
              completed: true,
              completedAt: serverTimestamp(),
            });

            await addDoc(collection(db, 'notifications'), {
              userId: coachId,
              type: 'tool_completed',
              title: 'Tool Completed',
              message: `${userProfile.displayName || userProfile.email} completed Career Compass`,
              read: false,
              createdAt: serverTimestamp(),
              actionUrl: `/coach/clients/${user.uid}`,
            });
          }
        }

        toast.success('✅ Career Compass saved!', {
          description: 'Your coach has been notified.',
          duration: 4000,
        });
        
        setIsCompleted(true);
      } catch (error) {
        console.error('Error saving:', error);
        toast.error('Error saving. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setCompass(null);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    const isCoach = userProfile?.role === 'coach';
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className={`w-16 h-16 ${isCoach ? 'bg-emerald-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Compass className={`w-8 h-8 ${isCoach ? 'text-[var(--accent-primary)]' : 'text-yellow-400'}`} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">
              {isCoach ? 'Tool for Coachees Only' : 'Access Required'}
            </h2>
            <p className="text-[var(--fg-muted)] mb-6">
              {isCoach
                ? 'This tool is designed to be completed by coachees. You can assign it to your clients from the client management page.'
                : 'This tool needs to be assigned by your coach before you can access it.'}
            </p>
            <Link
              href={isCoach ? '/coach/clients' : '/dashboard'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {isCoach ? 'Go to Clients' : 'Return to Dashboard'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--fg-primary)] mb-4">Tool Completed!</h2>
            <p className="text-[var(--fg-muted)] mb-6">
              You've successfully completed Career Compass. Your coach has been notified.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-[var(--fg-primary)] rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--border-color)] text-[var(--fg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                View Other Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && compass) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-6xl mx-auto mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
        </div>
        <CareerCompassResults
          compass={compass}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-emerald-300 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-500/20 p-4 rounded-xl">
              <Compass className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[var(--fg-primary)]">
                Career Compass Mapping
              </h1>
              <p className="text-[var(--fg-muted)] mt-1">
                Map your career journey and chart your path forward
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-indigo-300 mb-3">
            Navigate Your Career Path
          </h2>
          <div className="space-y-3 text-indigo-200">
            <p>
              The Career Compass helps you gain clarity on where you are, where you want to go,
              and how to get there. This comprehensive tool examines multiple dimensions of your career.
            </p>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 mt-4">
              <p className="font-medium mb-2 text-[var(--fg-primary)]">You'll explore:</p>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-[var(--fg-secondary)]">
                <div>• Your current career satisfaction</div>
                <div>• Your strengths and interests</div>
                <div>• Your core career values</div>
                <div>• Your ideal career direction</div>
                <div>• Barriers and support systems</div>
                <div>• Concrete next steps</div>
              </div>
            </div>
            <p className="text-sm mt-4">
              <strong className="text-[var(--fg-primary)]">Time commitment:</strong> 15-20 minutes
            </p>
          </div>
        </div>

        <CareerCompassForm onComplete={handleComplete} />
      </div>
    </div>
  );
}
