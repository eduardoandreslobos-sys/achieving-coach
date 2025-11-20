'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const lifeAreas = [
  { id: 'career', name: 'Career', icon: '💼' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'health', name: 'Health', icon: '❤️' },
  { id: 'relationships', name: 'Relationships', icon: '👥' },
  { id: 'personal', name: 'Personal Growth', icon: '🌱' },
  { id: 'fun', name: 'Fun & Recreation', icon: '🎉' },
  { id: 'environment', name: 'Physical Environment', icon: '🏡' },
  { id: 'spirituality', name: 'Spirituality', icon: '🧘' },
];

export default function WheelOfLifePage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      // Coaches siempre tienen acceso
      if (userProfile.role === 'coach') {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Coachees deben tener la herramienta asignada
      try {
        const q = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life')
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setHasAccess(true);

        // Cargar último resultado si existe
        const resultsQuery = query(
          collection(db, 'tool_results'),
          where('userId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life'),
          orderBy('completedAt', 'desc'),
          limit(1)
        );
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const lastDoc = resultsSnapshot.docs[0];
          setLastResult(lastDoc.data());
          setScores(lastDoc.data().results.scores || {});
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

  const handleScoreChange = (areaId: string, value: number) => {
    setScores(prev => ({ ...prev, [areaId]: value }));
  };

  const handleSave = async () => {
    if (!user || !userProfile) return;

    const allScored = lifeAreas.every(area => scores[area.id] !== undefined);
    if (!allScored) {
      alert('Please rate all areas before saving');
      return;
    }

    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'wheel-of-life',
        toolName: 'Wheel of Life',
        coachId: coachId,
        results: {
          scores,
          averageScore: Object.values(scores).reduce((a, b) => a + b, 0) / lifeAreas.length,
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

  const chartData = {
    labels: lifeAreas.map(area => area.name),
    datasets: [
      {
        label: 'Current',
        data: lifeAreas.map(area => scores[area.id] || 0),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wheel of Life</h1>
          <p className="text-gray-600">
            Rate your satisfaction in each life area from 0 (very dissatisfied) to 10 (very satisfied)
          </p>
        </div>

        {lastResult && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-900">
              📊 Last completed: {lastResult.completedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
              {' - '}Average: {lastResult.results.averageScore.toFixed(1)}/10
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scores Input */}
          <div className="space-y-4">
            {lifeAreas.map(area => (
              <div key={area.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{area.icon}</span>
                    <span className="font-medium text-gray-900">{area.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {scores[area.id] || 0}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={scores[area.id] || 0}
                  onChange={(e) => handleScoreChange(area.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Wheel</h3>
            <Radar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || Object.keys(scores).length < lifeAreas.length}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Results'}
          </button>
        </div>
      </div>
    </div>
  );
}
