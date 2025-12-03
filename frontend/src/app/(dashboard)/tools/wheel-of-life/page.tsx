'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Target, TrendingUp, Briefcase, DollarSign, Heart, Users, Smile, Home, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

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
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !userProfile) return;

      if (userProfile.role === 'coach') {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      if (userProfile.role === 'coachee') {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'wheel-of-life')
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

  const handleSave = async () => {
    if (!user || !userProfile) return;

    const allScored = lifeAreas.every(area => scores[area.id] !== undefined);
    
    if (!allScored) {
      toast.error('Please rate all areas before saving');
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

      toast.success('✅ Wheel of Life completed successfully!', {
        description: 'Your coach has been notified.',
        duration: 4000,
      });
      
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error saving results:', error);
      toast.error('Error saving results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
            <p className="text-gray-600 mb-6">
              This tool needs to be assigned by your coach before you can access it.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <Toaster position="top-center" richColors />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Completed!</h2>
            <p className="text-gray-600 mb-6">
              You've successfully completed the Wheel of Life assessment. Your coach has been notified and can review your results.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Other Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const averageScore = Object.keys(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-4"
          >
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wheel of Life</h1>
              <p className="text-gray-600">Assess your life balance across key areas</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">How to use this tool</h2>
          <p className="text-blue-800">
            Rate each area of your life on a scale from 0-10, where 0 is completely unsatisfied and 10 is completely satisfied.
            Be honest with yourself - this assessment is about understanding where you are now, not where you think you should be.
          </p>
        </div>

        {/* Life Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lifeAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${area.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{area.name}</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Unsatisfied</span>
                    <span>Satisfied</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[area.id] || 0}
                    onChange={(e) => setScores({ ...scores, [area.id]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {scores[area.id] !== undefined ? scores[area.id] : '-'}
                    </span>
                    <span className="text-gray-500">/10</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Average Score */}
        {Object.keys(scores).length > 0 && (
          <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Average Score</h3>
                <p className="text-gray-600">Overall life satisfaction</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary-600">{averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-500">out of 10</div>
              </div>
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
