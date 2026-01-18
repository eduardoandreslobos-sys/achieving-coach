'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle, ArrowRight, ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface FeedbackItem {
  id: string;
  situation: string;
  feedback: string;
  feedforward: string;
  actionSteps: string[];
}

export default function FeedbackFeedForwardPage() {
  const { user, userProfile } = useAuth();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    situation: '',
    feedback: '',
    feedforward: '',
    actionSteps: ['', '', ''],
  });
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
          where('toolId', '==', 'feedback-feedforward')
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

  const addItem = () => {
    if (!currentItem.situation || !currentItem.feedback || !currentItem.feedforward) return;
    const item: FeedbackItem = {
      id: Date.now().toString(),
      ...currentItem,
      actionSteps: currentItem.actionSteps.filter(s => s.trim() !== ''),
    };
    setItems([...items, item]);
    setCurrentItem({
      situation: '',
      feedback: '',
      feedforward: '',
      actionSteps: ['', '', ''],
    });
  };

  const updateActionStep = (index: number, value: string) => {
    const newSteps = [...currentItem.actionSteps];
    newSteps[index] = value;
    setCurrentItem({ ...currentItem, actionSteps: newSteps });
  };

  const handleSave = async () => {
    if (!user || !userProfile || items.length === 0) return;
    
    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'feedback-feedforward',
        toolName: 'Feedback Feed-Forward',
        coachId: coachId,
        results: { items },
        completedAt: serverTimestamp(),
      });

      if (userProfile.role === 'coachee' && coachId) {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'feedback-feedforward'),
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
            message: `${userProfile.displayName || userProfile.email} completed Feedback Feed-Forward`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('✅ Feedback Feed-Forward saved!', {
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
              <Lightbulb className={`w-8 h-8 ${isCoach ? 'text-emerald-400' : 'text-yellow-400'}`} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isCoach ? 'Tool for Coachees Only' : 'Access Required'}
            </h2>
            <p className="text-gray-400 mb-6">
              {isCoach
                ? 'This tool is designed to be completed by coachees. You can assign it to your clients from the client management page.'
                : 'This tool needs to be assigned by your coach before you can access it.'}
            </p>
            <Link
              href={isCoach ? '/coach/clients' : '/dashboard'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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
              You've successfully completed Feedback Feed-Forward. Your coach has been notified.
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Feedback Feed-Forward Planner</h1>
          <p className="text-gray-400">
            Transform feedback into actionable future-focused strategies
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-emerald-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-emerald-300 mb-1">Feed-Forward vs Feedback</h3>
              <p className="text-sm text-blue-200">
                <strong>Feedback</strong> focuses on the past. <strong>Feed-forward</strong> focuses on future possibilities.
                Instead of "You should have...", try "Next time you could..."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Add New Item</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Situation or Behavior
              </label>
              <input
                type="text"
                value={currentItem.situation}
                onChange={(e) => setCurrentItem({ ...currentItem, situation: e.target.value })}
                placeholder="Describe the situation you want to address"
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeft className="text-orange-400" size={20} />
                  <label className="font-bold text-orange-300">Feedback (Past)</label>
                </div>
                <textarea
                  value={currentItem.feedback}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedback: e.target.value })}
                  placeholder="What happened? What was observed?"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-orange-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="text-emerald-400" size={20} />
                  <label className="font-bold text-emerald-300">Feed-Forward (Future)</label>
                </div>
                <textarea
                  value={currentItem.feedforward}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedforward: e.target.value })}
                  placeholder="What could you do differently next time?"
                  rows={4}
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-emerald-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Action Steps (Optional)
              </label>
              {currentItem.actionSteps.map((step, index) => (
                <input
                  key={index}
                  type="text"
                  value={step}
                  onChange={(e) => updateActionStep(index, e.target.value)}
                  placeholder={`Action step ${index + 1}`}
                  className="w-full px-4 py-2 mb-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              ))}
            </div>
          </div>

          <button
            onClick={addItem}
            disabled={!currentItem.situation || !currentItem.feedback || !currentItem.feedforward}
            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Add Item
          </button>
        </div>

        {items.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="bg-[#111111] rounded-xl border border-gray-800 p-6">
                  <h3 className="font-bold text-white mb-4">{item.situation}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowLeft className="text-orange-400" size={16} />
                        <span className="font-bold text-orange-300 text-sm">Feedback</span>
                      </div>
                      <p className="text-sm text-gray-300">{item.feedback}</p>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="text-emerald-400" size={16} />
                        <span className="font-bold text-emerald-300 text-sm">Feed-Forward</span>
                      </div>
                      <p className="text-sm text-gray-300">{item.feedforward}</p>
                    </div>
                  </div>

                  {item.actionSteps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="font-medium text-white text-sm mb-2">Action Steps:</p>
                      <ul className="space-y-1">
                        {item.actionSteps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 flex items-center gap-2 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Planner'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
