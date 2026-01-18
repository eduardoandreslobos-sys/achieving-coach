'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Target, TrendingUp, Briefcase, DollarSign, Heart, Users, Smile, Home, Sprout, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

const lifeAreas = [
  { id: 'career', name: 'Career', icon: Briefcase, color: 'text-emerald-600' },
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
              <Target className={`w-8 h-8 ${isCoach ? 'text-emerald-400' : 'text-yellow-400'}`} />
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
              {isCoach && (
                <Link
                  href="/coach/tools"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                  View Tools Library
                </Link>
              )}
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
              You've successfully completed the Wheel of Life assessment. Your coach has been notified and can review your results.
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

  const averageScore = Object.keys(scores).length > 0
    ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-4"
          >
            ← Back to Tools
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Wheel of Life</h1>
              <p className="text-gray-400">Assess your life balance across key areas</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-emerald-400 mb-2">How to use this tool</h2>
          <p className="text-emerald-300">
            Rate each area of your life on a scale from 0-10, where 0 is completely unsatisfied and 10 is completely satisfied.
            Be honest with yourself - this assessment is about understanding where you are now, not where you think you should be.
          </p>
        </div>

        {/* Life Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lifeAreas.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.id} className="bg-[#111111] rounded-xl border border-gray-800 p-6 hover:border-emerald-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${area.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{area.name}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Unsatisfied</span>
                    <span>Satisfied</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scores[area.id] || 0}
                    onChange={(e) => setScores({ ...scores, [area.id]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-emerald-400">
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
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Average Score</h3>
                <p className="text-gray-400">Overall life satisfaction</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-emerald-400">{averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-500">out of 10</div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(scores).length !== lifeAreas.length}
          className="w-full bg-emerald-600 text-white py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'Saving...' : 'Save Results'}
        </button>
      </div>
    </div>
  );
}
