'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle, Heart, AlertCircle, Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface TriggerEntry {
  id: string;
  date: string;
  trigger: string;
  emotion: string;
  intensity: number;
  physicalSensations: string;
  thoughts: string;
  response: string;
  alternativeResponse: string;
  pattern?: string;
}

const emotions = [
  'Anger', 'Anxiety', 'Fear', 'Sadness', 'Joy', 'Excitement',
  'Frustration', 'Guilt', 'Shame', 'Pride', 'Jealousy', 'Love'
];

export default function EmotionalTriggersPage() {
  const { user, userProfile } = useAuth();
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState({
    trigger: '',
    emotion: '',
    intensity: 5,
    physicalSensations: '',
    thoughts: '',
    response: '',
    alternativeResponse: '',
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
          where('toolId', '==', 'emotional-triggers')
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

  const addEntry = () => {
    if (!currentEntry.trigger || !currentEntry.emotion) return;
    const entry: TriggerEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...currentEntry,
    };
    setEntries([entry, ...entries]);
    setCurrentEntry({
      trigger: '',
      emotion: '',
      intensity: 5,
      physicalSensations: '',
      thoughts: '',
      response: '',
      alternativeResponse: '',
    });
  };

  const handleSave = async () => {
    if (!user || !userProfile || entries.length === 0) return;
    
    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'emotional-triggers',
        toolName: 'Emotional Triggers Journal',
        coachId: coachId,
        results: { entries },
        completedAt: serverTimestamp(),
      });

      if (userProfile.role === 'coachee' && coachId) {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'emotional-triggers'),
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
            message: `${userProfile.displayName || userProfile.email} completed Emotional Triggers Journal`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('✅ Emotional Triggers Journal saved!', {
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

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-500/20 border-green-500/50 text-green-300';
    if (intensity <= 6) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
    return 'bg-red-500/20 border-red-500/50 text-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!hasAccess) {
    const isCoach = userProfile?.role === 'coach';
    return (
      <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
            <div className={`w-16 h-16 ${isCoach ? 'bg-blue-500/20' : 'bg-yellow-500/20'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Heart className={`w-8 h-8 ${isCoach ? 'text-blue-400' : 'text-yellow-400'}`} />
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
              You've successfully completed the Emotional Triggers Journal. Your coach has been notified.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <h1 className="text-3xl font-bold text-white mb-2">Emotional Triggers Journal</h1>
          <p className="text-gray-400">
            Identify patterns and develop healthier responses to emotional triggers
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Heart className="text-purple-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-purple-300 mb-1">Understanding Triggers</h3>
              <p className="text-sm text-purple-200">
                Emotional triggers are situations, people, or events that provoke strong emotional reactions.
                By tracking them, you can identify patterns and develop conscious responses.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#111111] rounded-xl border border-gray-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">New Trigger Entry</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                What triggered this emotion?
              </label>
              <input
                type="text"
                value={currentEntry.trigger}
                onChange={(e) => setCurrentEntry({ ...currentEntry, trigger: e.target.value })}
                placeholder="Describe the situation or event"
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Primary Emotion
                </label>
                <select
                  value={currentEntry.emotion}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, emotion: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select emotion</option>
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Intensity (1-10): {currentEntry.intensity}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.intensity}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, intensity: parseInt(e.target.value) })}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Mild</span>
                  <span>Intense</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Physical Sensations
              </label>
              <input
                type="text"
                value={currentEntry.physicalSensations}
                onChange={(e) => setCurrentEntry({ ...currentEntry, physicalSensations: e.target.value })}
                placeholder="e.g., tight chest, racing heart, tension in shoulders"
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Automatic Thoughts
              </label>
              <textarea
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({ ...currentEntry, thoughts: e.target.value })}
                placeholder="What thoughts came up immediately?"
                rows={2}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                How did you respond?
              </label>
              <textarea
                value={currentEntry.response}
                onChange={(e) => setCurrentEntry({ ...currentEntry, response: e.target.value })}
                placeholder="What did you do or say?"
                rows={2}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <label className="block text-sm font-medium text-emerald-300 mb-1 flex items-center gap-2">
                <Lightbulb size={16} />
                Alternative Response (Reflection)
              </label>
              <textarea
                value={currentEntry.alternativeResponse}
                onChange={(e) => setCurrentEntry({ ...currentEntry, alternativeResponse: e.target.value })}
                placeholder="How could you respond differently next time?"
                rows={3}
                className="w-full px-4 py-2 bg-[#1a1a1a] border border-emerald-500/30 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            onClick={addEntry}
            disabled={!currentEntry.trigger || !currentEntry.emotion}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Add Entry
          </button>
        </div>

        {entries.length > 0 && (
          <>
            <div className="space-y-4 mb-6">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-[#111111] rounded-xl border border-gray-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getIntensityColor(entry.intensity)}`}>
                          {entry.emotion} - {entry.intensity}/10
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-white">{entry.trigger}</h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entry.physicalSensations && (
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm font-medium text-gray-300">Physical: </span>
                          <span className="text-sm text-gray-400">{entry.physicalSensations}</span>
                        </div>
                      </div>
                    )}

                    {entry.thoughts && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-300">Thoughts: </span>
                        <span className="text-sm text-gray-400">{entry.thoughts}</span>
                      </div>
                    )}

                    {entry.response && (
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-gray-300">Response: </span>
                        <span className="text-sm text-gray-400">{entry.response}</span>
                      </div>
                    )}

                    {entry.alternativeResponse && (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-start gap-2">
                        <TrendingUp className="text-emerald-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <span className="text-sm font-medium text-emerald-300">Alternative: </span>
                          <span className="text-sm text-emerald-200">{entry.alternativeResponse}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 flex items-center gap-2 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Journal'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
