'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle2, Target } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface GROWData {
  goal: string;
  reality: string;
  options: string;
  way: string;
}

export default function GROWWorksheetPage() {
  const { user, userProfile } = useAuth();
  const [data, setData] = useState<GROWData>({
    goal: '',
    reality: '',
    options: '',
    way: '',
  });
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
          where('toolId', '==', 'grow-model')
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
    
    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'grow-model',
        toolName: 'GROW Worksheet',
        coachId: coachId,
        results: data,
        completedAt: serverTimestamp(),
      });

      if (userProfile.role === 'coachee' && coachId) {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'grow-model'),
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
            message: `${userProfile.displayName || userProfile.email} completed GROW Worksheet`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('✅ GROW Worksheet saved!', {
        description: 'Your coach has been notified.',
        duration: 4000,
      });
      
      setIsCompleted(true);
      
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Error saving. Please try again.');
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
              You've successfully completed the GROW Worksheet. Your coach has been notified.
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GROW Worksheet</h1>
          <p className="text-gray-600">
            A powerful coaching framework to help you achieve your goals
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                G
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Goal</h2>
                <p className="text-sm text-gray-600">What do you want to achieve?</p>
              </div>
            </div>
            <textarea
              value={data.goal}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
              placeholder="Describe your goal in specific, measurable terms..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                R
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reality</h2>
                <p className="text-sm text-gray-600">What is your current situation?</p>
              </div>
            </div>
            <textarea
              value={data.reality}
              onChange={(e) => setData({ ...data, reality: e.target.value })}
              placeholder="Describe where you are now, what's working, what's not..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                O
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Options</h2>
                <p className="text-sm text-gray-600">What could you do?</p>
              </div>
            </div>
            <textarea
              value={data.options}
              onChange={(e) => setData({ ...data, options: e.target.value })}
              placeholder="List all possible options and strategies you could try..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                W
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Way Forward</h2>
                <p className="text-sm text-gray-600">What will you do?</p>
              </div>
            </div>
            <textarea
              value={data.way}
              onChange={(e) => setData({ ...data, way: e.target.value })}
              placeholder="Commit to specific actions with timelines..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !data.goal || !data.reality || !data.options || !data.way}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? 'Saving...' : 'Save Worksheet'}
          </button>
        </div>
      </div>
    </div>
  );
}
