'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Heart, Award, Users, TrendingUp, Lightbulb } from 'lucide-react';

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
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      if (userProfile.role === 'coach') {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'values-clarification')
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
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

  const handleContinue = () => {
    if (selectedValues.length >= 5) {
      setTopValues(selectedValues.slice(0, 5));
      setStep('rank');
    }
  };

  const moveValue = (index: number, direction: 'up' | 'down') => {
    const newValues = [...topValues];
    if (direction === 'up' && index > 0) {
      [newValues[index], newValues[index - 1]] = [newValues[index - 1], newValues[index]];
    } else if (direction === 'down' && index < newValues.length - 1) {
      [newValues[index], newValues[index + 1]] = [newValues[index + 1], newValues[index]];
    }
    setTopValues(newValues);
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
          allSelectedValues: selectedValues,
        },
        completedAt: serverTimestamp(),
      });

      setStep('complete');
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tool Not Assigned</h1>
          <p className="text-gray-600 mb-6">
            This tool hasn't been assigned to you yet. Please contact your coach to get access.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Values Identified!</h1>
            <p className="text-gray-600 mb-8">Here are your top 5 core values in order of importance:</p>
            
            <div className="space-y-3 mb-8">
              {topValues.map((id, index) => {
                const value = coreValues.find(v => v.id === id);
                const Icon = value?.icon || Heart;
                return (
                  <div key={id} className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {index + 1}
                    </div>
                    <Icon className="text-primary-600" size={24} />
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{value?.name}</p>
                      <p className="text-sm text-gray-600">{value?.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'rank') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rank Your Top 5 Values</h1>
            <p className="text-gray-600">
              Arrange these values in order of importance (1 = most important)
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {topValues.map((id, index) => {
              const value = coreValues.find(v => v.id === id);
              const Icon = value?.icon || Heart;
              return (
                <div key={id} className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                      {index + 1}
                    </div>
                    <Icon className="text-primary-600" size={24} />
                    <div>
                      <p className="font-bold text-gray-900">{value?.name}</p>
                      <p className="text-sm text-gray-600">{value?.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveValue(index, 'up')}
                      disabled={index === 0}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveValue(index, 'down')}
                      disabled={index === topValues.length - 1}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('select')}
              className="px-8 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save My Values'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Values Clarification</h1>
          <p className="text-gray-600">
            Select 5-10 values that resonate most with you ({selectedValues.length} selected)
          </p>
        </div>

        {lastResult && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              📊 Last completed: {lastResult.completedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {coreValues.map(value => {
            const Icon = value.icon;
            const isSelected = selectedValues.includes(value.id);
            return (
              <button
                key={value.id}
                onClick={() => toggleValue(value.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <Icon className={isSelected ? 'text-primary-600' : 'text-gray-400'} size={24} />
                <h3 className="font-bold text-gray-900 mt-2">{value.name}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={selectedValues.length < 5}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Ranking →
          </button>
        </div>
      </div>
    </div>
  );
}
