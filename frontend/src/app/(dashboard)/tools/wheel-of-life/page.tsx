'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Target, TrendingUp, Briefcase, DollarSign, Heart, Users, Smile, Home, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const lifeAreas = [
  { id: 'career', name: 'Career', icon: Briefcase, color: 'text-blue-600' },
  { id: 'finance', name: 'Finance', icon: DollarSign, color: 'text-green-600' },
  { id: 'health', name: 'Health', icon: Heart, color: 'text-red-600' },
  { id: 'relationships', name: 'Relationships', icon: Users, color: 'text-purple-600' },
  { id: 'personal-growth', name: 'Personal Growth', icon: Sprout, color: 'text-emerald-600' },
  { id: 'fun', name: 'Fun & Recreation', icon: Smile, color: 'text-orange-600' },
  { id: 'environment', name: 'Physical Environment', icon: Home, color: 'text-indigo-600' },
  { id: 'spirituality', name: 'Spirituality', icon: Sparkles, color: 'text-yellow-600' },
];

export default function WheelOfLifePage() {
  const { user, userProfile } = useAuth();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
          where('toolId', '==', 'wheel-of-life')
        );
        
        const resultsSnapshot = await getDocs(resultsQuery);
        
        if (!resultsSnapshot.empty) {
          const latestResult = resultsSnapshot.docs[0].data();
          if (latestResult.results?.scores) {
            setScores(latestResult.results.scores);
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

      // Guardar resultados
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

      // Si es coachee, actualizar assignment y notificar al coach
      if (userProfile.role === 'coachee' && coachId) {
        // Buscar el assignment
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life'),
          where('completed', '==', false)
        );
        
        const assignmentSnapshot = await getDocs(assignmentQuery);
        
        if (!assignmentSnapshot.empty) {
          const assignmentDoc = assignmentSnapshot.docs[0];
          
          // Actualizar a completado
          await updateDoc(doc(db, 'tool_assignments', assignmentDoc.id), {
            completed: true,
            completedAt: serverTimestamp(),
          });

          // Notificar al coach
          await addDoc(collection(db, 'notifications'), {
            userId: coachId,
            type: 'program',
            title: 'Tool Completed',
            message: `${userProfile.displayName || userProfile.email} completed Wheel of Life`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      // Mostrar success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tool Not Assigned</h2>
          <p className="text-gray-600 mb-6">
            This tool hasn't been assigned to you yet. Please contact your coach to get access.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const averageScore = Object.keys(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-sm">Your results have been saved</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wheel of Life</h1>
          <p className="text-gray-600">
            Rate your satisfaction in each life area (0 = not satisfied, 10 = completely satisfied)
          </p>
        </div>

        {/* Life Areas */}
        <div className="space-y-6 mb-8">
          {lifeAreas.map((area) => {
            const Icon = area.icon;
            const score = scores[area.id] ?? 0;

            return (
              <div key={area.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`${area.color} w-6 h-6`} />
                  <h3 className="text-lg font-bold text-gray-900">{area.name}</h3>
                  <span className="ml-auto text-3xl font-bold text-primary-600">{score}</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={score}
                  onChange={(e) => handleScoreChange(area.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />

                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Average Score */}
        {Object.keys(scores).length > 0 && (
          <div className="bg-primary-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Score</h3>
                <p className="text-sm text-gray-600">Overall life satisfaction</p>
              </div>
              <div className="text-4xl font-bold text-primary-600">{averageScore.toFixed(1)}</div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(scores).length !== lifeAreas.length}
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Results'}
        </button>
      </div>
    </div>
  );
}
