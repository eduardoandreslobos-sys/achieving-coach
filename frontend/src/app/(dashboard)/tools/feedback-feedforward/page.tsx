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

      if (userProfile.role === 'coach') {
        setHasAccess(true);
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
              <Lightbulb className="w-8 h-8 text-yellow-600" />
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
              You've successfully completed Feedback Feed-Forward. Your coach has been notified.
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Feed-Forward Planner</h1>
          <p className="text-gray-600">
            Transform feedback into actionable future-focused strategies
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Feed-Forward vs Feedback</h3>
              <p className="text-sm text-blue-800">
                <strong>Feedback</strong> focuses on the past. <strong>Feed-forward</strong> focuses on future possibilities.
                Instead of "You should have...", try "Next time you could..."
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Item</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Situation or Behavior
              </label>
              <input
                type="text"
                value={currentItem.situation}
                onChange={(e) => setCurrentItem({ ...currentItem, situation: e.target.value })}
                placeholder="Describe the situation you want to address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeft className="text-orange-600" size={20} />
                  <label className="font-bold text-orange-900">Feedback (Past)</label>
                </div>
                <textarea
                  value={currentItem.feedback}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedback: e.target.value })}
                  placeholder="What happened? What was observed?"
                  rows={4}
                  className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                />
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="text-green-600" size={20} />
                  <label className="font-bold text-green-900">Feed-Forward (Future)</label>
                </div>
                <textarea
                  value={currentItem.feedforward}
                  onChange={(e) => setCurrentItem({ ...currentItem, feedforward: e.target.value })}
                  placeholder="What could you do differently next time?"
                  rows={4}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Steps (Optional)
              </label>
              {currentItem.actionSteps.map((step, index) => (
                <input
                  key={index}
                  type="text"
                  value={step}
                  onChange={(e) => updateActionStep(index, e.target.value)}
                  placeholder={`Action step ${index + 1}`}
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              ))}
            </div>
          </div>

          <button
            onClick={addItem}
            disabled={!currentItem.situation || !currentItem.feedback || !currentItem.feedforward}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        </div>

        {items.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{item.situation}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowLeft className="text-orange-600" size={16} />
                        <span className="font-bold text-orange-900 text-sm">Feedback</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.feedback}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="text-green-600" size={16} />
                        <span className="font-bold text-green-900 text-sm">Feed-Forward</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.feedforward}</p>
                    </div>
                  </div>

                  {item.actionSteps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="font-medium text-gray-900 text-sm mb-2">Action Steps:</p>
                      <ul className="space-y-1">
                        {item.actionSteps.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-primary-600">•</span>
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
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
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
