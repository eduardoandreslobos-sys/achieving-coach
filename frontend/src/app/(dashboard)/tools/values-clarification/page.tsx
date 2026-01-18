'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { trackToolCompleted } from '@/lib/analytics';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Heart, Award, Users, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

const coreValues = [
  { id: 'achievement', name: 'Achievement', description: 'Accomplishing goals and excelling', icon: Award },
  { id: 'adventure', name: 'Adventure', description: 'New experiences and excitement', icon: TrendingUp },
  { id: 'authenticity', name: 'Authenticity', description: 'Being true to yourself', icon: Heart },
  { id: 'balance', name: 'Balance', description: 'Stability and equilibrium in life', icon: Users },
  { id: 'compassion', name: 'Compassion', description: 'Caring for others', icon: Heart },
  { id: 'creativity', name: 'Creativity', description: 'Innovation and self-expression', icon: Lightbulb },
  { id: 'family', name: 'Family', description: 'Close relationships with loved ones', icon: Users },
  { id: 'freedom', name: 'Freedom', description: 'Independence and autonomy', icon: TrendingUp },
  { id: 'growth', name: 'Growth', description: 'Personal development', icon: TrendingUp },
  { id: 'health', name: 'Health', description: 'Physical and mental wellbeing', icon: Heart },
  { id: 'integrity', name: 'Integrity', description: 'Honesty and strong moral principles', icon: Award },
  { id: 'knowledge', name: 'Knowledge', description: 'Learning and understanding', icon: Lightbulb },
  { id: 'leadership', name: 'Leadership', description: 'Guiding and inspiring others', icon: Award },
  { id: 'love', name: 'Love', description: 'Deep affection and connection', icon: Heart },
  { id: 'purpose', name: 'Purpose', description: 'Having meaning and direction', icon: Lightbulb },
  { id: 'respect', name: 'Respect', description: 'Esteem for yourself and others', icon: Users },
  { id: 'security', name: 'Security', description: 'Safety and stability', icon: Award },
  { id: 'service', name: 'Service', description: 'Helping others and contributing', icon: Users },
  { id: 'success', name: 'Success', description: 'Achieving professional goals', icon: Award },
  { id: 'wisdom', name: 'Wisdom', description: 'Deep understanding and insight', icon: Lightbulb },
];

export default function ValuesClarificationPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [topValues, setTopValues] = useState<string[]>([]);
  const [step, setStep] = useState<'select' | 'rank' | 'complete'>('select');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      // Coaches cannot complete tools - they can only assign them to coachees
      if (userProfile.role === 'coach') {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'values-clarification'),
          where('completed', '==', false)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          // Check if already completed
          const completedQuery = query(
            collection(db, 'tool_assignments'),
            where('coacheeId', '==', user.uid),
            where('toolId', '==', 'values-clarification'),
            where('completed', '==', true)
          );
          const completedSnapshot = await getDocs(completedQuery);
          
          if (!completedSnapshot.empty) {
            setIsCompleted(true);
            setHasAccess(true);
            setLoading(false);
            return;
          }
          
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setHasAccess(true);

        const resultsQuery = query(
          collection(db, 'tool_results'),
          where('userId', '==', user.uid),
          where('toolId', '==', 'values-clarification'),
          orderBy('completedAt', 'desc'),
          limit(1)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const lastDoc = resultsSnapshot.docs[0];
          setLastResult(lastDoc.data());
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, userProfile]);

  const toggleValue = (valueId: string) => {
    if (selectedValues.includes(valueId)) {
      setSelectedValues(selectedValues.filter(v => v !== valueId));
    } else if (selectedValues.length < 10) {
      setSelectedValues([...selectedValues, valueId]);
    }
  };

  const proceedToRanking = () => {
    if (selectedValues.length < 5) {
      toast.error('Please select at least 5 values to continue');
      return;
    }
      trackToolCompleted('values-clarification', 'Values Clarification');
    setTopValues([...selectedValues]);
    setStep('rank');
  };

  const moveValue = (index: number, direction: 'up' | 'down') => {
    const newTopValues = [...topValues];
    if (direction === 'up' && index > 0) {
      [newTopValues[index - 1], newTopValues[index]] = [newTopValues[index], newTopValues[index - 1]];
    } else if (direction === 'down' && index < topValues.length - 1) {
      [newTopValues[index], newTopValues[index + 1]] = [newTopValues[index + 1], newTopValues[index]];
    }
    setTopValues(newTopValues);
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'values-clarification',
        toolName: 'Values Clarification',
        coachId: coachId,
        results: {
          topValues: topValues.map((id, index) => ({
            id,
            name: coreValues.find(v => v.id === id)?.name,
            rank: index + 1,
          })),
          allSelected: selectedValues,
        },
        completedAt: serverTimestamp(),
      });

      // Update tool_assignment to completed
      if (userProfile.role === 'coachee') {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'values-clarification'),
          where('completed', '==', false)
        );
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignmentDoc = assignmentSnapshot.docs[0];
          await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
            completed: true,
            completedAt: serverTimestamp(),
          });

          // Create notification for coach
          await addDoc(collection(db, 'notifications'), {
            userId: coachId,
            type: 'tool_completed',
            title: 'Tool Completed',
            message: `${userProfile.displayName || userProfile.email} completed Values Clarification`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('✅ Values Clarification completed successfully!', {
        duration: 3000,
      });
      
      setIsCompleted(true);
      setStep('complete');
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Error saving results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    const isCoach = userProfile?.role === 'coach';
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
        <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center max-w-md">
          <div className={`w-16 h-16 ${isCoach ? 'bg-emerald-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Heart className={`w-8 h-8 ${isCoach ? 'text-emerald-400' : 'text-yellow-400'}`} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {isCoach ? 'Tool for Coachees Only' : 'Access Required'}
          </h2>
          <p className="text-gray-400 mb-6">
            {isCoach
              ? 'This tool is designed to be completed by coachees. You can assign it to your clients from the client management page.'
              : 'This tool has not been assigned to you yet.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href={isCoach ? '/coach/clients' : '/dashboard'}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              {isCoach ? 'Go to Clients' : 'Return to Dashboard'}
            </Link>
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
              You've successfully completed the Values Clarification exercise. Your coach has been notified and can review your results.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/tools"
                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors"
              >
                Explore More Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Values Clarification</h1>
          <p className="text-xl text-gray-400">
            Discover and prioritize your core values to guide your decisions and actions
          </p>
        </div>

        {step === 'select' && (
          <div className="space-y-8">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 1: Select Your Values</h2>
                <p className="text-gray-400">
                  Choose up to 10 values that resonate most with you. Selected: {selectedValues.length}/10
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {coreValues.map((value) => {
                  const Icon = value.icon;
                  const isSelected = selectedValues.includes(value.id);
                  return (
                    <button
                      key={value.id}
                      onClick={() => toggleValue(value.id)}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-400' : 'text-gray-500'}`} />
                        <div>
                          <h3 className="font-semibold text-white">{value.name}</h3>
                          <p className="text-sm text-gray-400">{value.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={proceedToRanking}
                disabled={selectedValues.length < 5}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                Continue to Ranking
              </button>
            </div>
          </div>
        )}

        {step === 'rank' && (
          <div className="space-y-8">
            <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Step 2: Rank Your Values</h2>
                <p className="text-gray-400">
                  Arrange your selected values in order of importance (most important at the top)
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {topValues.map((valueId, index) => {
                  const value = coreValues.find(v => v.id === valueId);
                  if (!value) return null;
                  const Icon = value.icon;

                  return (
                    <div key={valueId} className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-gray-800 rounded-xl">
                      <span className="text-2xl font-bold text-emerald-400 w-8">{index + 1}</span>
                      <Icon className="w-6 h-6 text-gray-500" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{value.name}</h3>
                        <p className="text-sm text-gray-400">{value.description}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveValue(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-[#2a2a2a] rounded disabled:opacity-30 text-gray-400"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveValue(index, 'down')}
                          disabled={index === topValues.length - 1}
                          className="p-1 hover:bg-[#2a2a2a] rounded disabled:opacity-30 text-gray-400"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500"
                >
                  {saving ? 'Saving...' : 'Save Results'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
