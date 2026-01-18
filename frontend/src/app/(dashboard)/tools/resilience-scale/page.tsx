'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import ResilienceQuestionnaire from '@/components/tools/ResilienceQuestionnaire';
import ResilienceResults from '@/components/tools/ResilienceResults';
import { ResilienceQuestion, ResilienceAnswers } from '@/types/resilience';

const RESILIENCE_QUESTIONS: ResilienceQuestion[] = [
  { id: 'emo1', category: 'Emotional', text: 'I am able to adapt when changes occur in my life.' },
  { id: 'emo2', category: 'Emotional', text: 'I can deal with whatever comes my way.' },
  { id: 'emo3', category: 'Emotional', text: 'I tend to bounce back after illness, injury, or other hardships.' },
  { id: 'emo4', category: 'Emotional', text: 'I believe I can achieve my goals even when there are obstacles.' },
  { id: 'emo5', category: 'Emotional', text: 'Even when things look hopeless, I don\'t give up.' },
  { id: 'emo6', category: 'Emotional', text: 'Under pressure, I stay focused and think clearly.' },
  { id: 'emo7', category: 'Emotional', text: 'I am not easily discouraged by failure.' },
  { id: 'phy1', category: 'Physical', text: 'I maintain a regular exercise routine.' },
  { id: 'phy2', category: 'Physical', text: 'I get enough sleep to feel rested and energized.' },
  { id: 'phy3', category: 'Physical', text: 'I eat a balanced and nutritious diet.' },
  { id: 'phy4', category: 'Physical', text: 'I take time to relax and recharge my body.' },
  { id: 'phy5', category: 'Physical', text: 'I manage stress through physical activities or practices.' },
  { id: 'phy6', category: 'Physical', text: 'I listen to my body and address health concerns promptly.' },
  { id: 'men1', category: 'Mental', text: 'I can control my thoughts when feeling anxious or stressed.' },
  { id: 'men2', category: 'Mental', text: 'I practice mindfulness or meditation regularly.' },
  { id: 'men3', category: 'Mental', text: 'I maintain a positive outlook even in difficult situations.' },
  { id: 'men4', category: 'Mental', text: 'I learn from my mistakes and move forward.' },
  { id: 'men5', category: 'Mental', text: 'I can find meaning and purpose in challenging experiences.' },
  { id: 'men6', category: 'Mental', text: 'I engage in activities that stimulate my mind and creativity.' },
  { id: 'soc1', category: 'Social', text: 'I have close relationships that provide support.' },
  { id: 'soc2', category: 'Social', text: 'I feel comfortable asking others for help when needed.' },
  { id: 'soc3', category: 'Social', text: 'I maintain connections with family and friends.' },
  { id: 'soc4', category: 'Social', text: 'I participate in community or group activities.' },
  { id: 'soc5', category: 'Social', text: 'I feel a sense of belonging in my social circles.' },
  { id: 'soc6', category: 'Social', text: 'I contribute to the wellbeing of others in my life.' },
];

export default function ResilienceScalePage() {
  const { user, userProfile } = useAuth();
  const [answers, setAnswers] = useState<ResilienceAnswers | null>(null);
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
          where('toolId', '==', 'resilience-scale')
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

  const handleComplete = async (completedAnswers: ResilienceAnswers) => {
    setAnswers(completedAnswers);
    setShowResults(true);

    if (user && userProfile) {
      try {
        const coachId = userProfile.role === 'coachee' 
          ? userProfile.coacheeInfo?.coachId 
          : user.uid;

        await addDoc(collection(db, 'tool_results'), {
          userId: user.uid,
          toolId: 'resilience-scale',
          toolName: 'Resilience Assessment Scale',
          coachId: coachId,
          results: completedAnswers,
          completedAt: serverTimestamp(),
        });

        if (userProfile.role === 'coachee' && coachId) {
          const assignmentQuery = query(
            collection(db, 'tool_assignments'),
            where('coacheeId', '==', user.uid),
            where('toolId', '==', 'resilience-scale'),
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
              message: `${userProfile.displayName || userProfile.email} completed Resilience Assessment`,
              read: false,
              createdAt: serverTimestamp(),
              actionUrl: `/coach/clients/${user.uid}`,
            });
          }
        }

        toast.success('✅ Resilience Assessment saved!', {
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
    setAnswers(null);
    setShowResults(false);
  };

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
              <Shield className={`w-8 h-8 ${isCoach ? 'text-emerald-400' : 'text-yellow-400'}`} />
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

  if (isCompleted && !showResults) {
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
              You've successfully completed the Resilience Assessment. Your coach has been notified.
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

  if (showResults && answers) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-5xl mx-auto mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
        </div>
        <ResilienceResults
          answers={answers}
          questions={RESILIENCE_QUESTIONS}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-500/20 p-4 rounded-xl">
              <Shield className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Resilience Assessment Scale
              </h1>
              <p className="text-gray-400 mt-1">
                Evaluate your resilience across emotional, physical, mental, and social dimensions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-emerald-300 mb-3">
            Instructions
          </h2>
          <ul className="space-y-2 text-blue-200">
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-emerald-400">•</span>
              <span>This assessment contains 25 questions across 4 categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-emerald-400">•</span>
              <span>Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-emerald-400">•</span>
              <span>Answer honestly based on how you typically feel and behave</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-emerald-400">•</span>
              <span>There are no right or wrong answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold mt-0.5 text-emerald-400">•</span>
              <span>The assessment takes approximately 5-7 minutes to complete</span>
            </li>
          </ul>
        </div>

        <ResilienceQuestionnaire
          questions={RESILIENCE_QUESTIONS}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
