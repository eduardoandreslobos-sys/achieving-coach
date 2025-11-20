'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

interface Belief {
  limiting: string;
  empowering: string;
  evidence: string;
}

export default function LimitingBeliefsPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [beliefs, setBeliefs] = useState<Belief[]>([{ limiting: '', empowering: '', evidence: '' }]);
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
          where('toolId', '==', 'limiting-beliefs')
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
          where('toolId', '==', 'limiting-beliefs'),
          orderBy('completedAt', 'desc'),
          limit(1)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const lastDoc = resultsSnapshot.docs[0];
          setLastResult(lastDoc.data());
          if (lastDoc.data().results.beliefs) {
            setBeliefs(lastDoc.data().results.beliefs);
          }
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

  const updateBelief = (index: number, field: keyof Belief, value: string) => {
    const newBeliefs = [...beliefs];
    newBeliefs[index][field] = value;
    setBeliefs(newBeliefs);
  };

  const addBelief = () => {
    setBeliefs([...beliefs, { limiting: '', empowering: '', evidence: '' }]);
  };

  const removeBelief = (index: number) => {
    if (beliefs.length > 1) {
      setBeliefs(beliefs.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    const validBeliefs = beliefs.filter(b => b.limiting.trim() && b.empowering.trim());
    if (validBeliefs.length === 0) {
      alert('Please complete at least one belief transformation');
      return;
    }

    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'limiting-beliefs',
        toolName: 'Limiting Beliefs',
        coachId: coachId,
        results: {
          beliefs: validBeliefs,
          totalTransformed: validBeliefs.length,
        },
        completedAt: serverTimestamp(),
      });

      alert('Results saved successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Limiting Beliefs Transformation</h1>
          <p className="text-gray-600">
            Identify limiting beliefs and transform them into empowering ones
          </p>
        </div>

        {lastResult && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              📊 Last completed: {lastResult.completedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              {' - '}Transformed {lastResult.results.totalTransformed} beliefs
            </p>
          </div>
        )}

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
                <li>Identify a limiting belief that's holding you back</li>
                <li>Reframe it into an empowering belief</li>
                <li>Find evidence that supports your new empowering belief</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {beliefs.map((belief, index) => (
            <div key={index} className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Belief #{index + 1}</h3>
                {beliefs.length > 1 && (
                  <button
                    onClick={() => removeBelief(index)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-red-500" size={20} />
                    <label className="block text-sm font-medium text-gray-700">
                      Limiting Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.limiting}
                    onChange={(e) => updateBelief(index, 'limiting', e.target.value)}
                    placeholder="e.g., I'm not good enough to succeed..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <label className="block text-sm font-medium text-gray-700">
                      Empowering Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.empowering}
                    onChange={(e) => updateBelief(index, 'empowering', e.target.value)}
                    placeholder="e.g., I have unique skills and experiences that make me capable..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="text-blue-500" size={20} />
                    <label className="block text-sm font-medium text-gray-700">
                      Evidence for Empowering Belief
                    </label>
                  </div>
                  <textarea
                    value={belief.evidence}
                    onChange={(e) => updateBelief(index, 'evidence', e.target.value)}
                    placeholder="e.g., I successfully completed X project, my colleagues value my input..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={addBelief}
            className="px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50"
          >
            + Add Another Belief
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Results'}
          </button>
        </div>
      </div>
    </div>
  );
}
