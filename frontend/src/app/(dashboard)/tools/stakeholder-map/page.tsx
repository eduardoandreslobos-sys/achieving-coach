'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { CheckCircle2, Users, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: number;
  support: number;
  strategy: string;
}

export default function StakeholderMapPage() {
  const { user, userProfile } = useAuth();
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [newStakeholder, setNewStakeholder] = useState({
    name: '',
    role: '',
    influence: 3,
    support: 3,
    strategy: '',
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
          where('toolId', '==', 'stakeholder-map')
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

  const addStakeholder = () => {
    if (!newStakeholder.name || !newStakeholder.role) return;

    const stakeholder: Stakeholder = {
      id: Date.now().toString(),
      ...newStakeholder,
    };

    setStakeholders([...stakeholders, stakeholder]);
    setNewStakeholder({
      name: '',
      role: '',
      influence: 3,
      support: 3,
      strategy: '',
    });
  };

  const removeStakeholder = (id: string) => {
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (!user || !userProfile || stakeholders.length === 0) return;
    
    setSaving(true);
    try {
      const coachId = userProfile.role === 'coachee' 
        ? userProfile.coacheeInfo?.coachId 
        : user.uid;

      await addDoc(collection(db, 'tool_results'), {
        userId: user.uid,
        toolId: 'stakeholder-map',
        toolName: 'Stakeholder Map',
        coachId: coachId,
        results: { stakeholders },
        completedAt: serverTimestamp(),
      });

      if (userProfile.role === 'coachee' && coachId) {
        const assignmentQuery = query(
          collection(db, 'tool_assignments'),
          where('coacheeId', '==', user.uid),
          where('toolId', '==', 'stakeholder-map'),
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
            message: `${userProfile.displayName || userProfile.email} completed Stakeholder Map`,
            read: false,
            createdAt: serverTimestamp(),
            actionUrl: `/coach/clients/${user.uid}`,
          });
        }
      }

      toast.success('✅ Stakeholder Map saved!', {
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

  const getQuadrant = (influence: number, support: number) => {
    if (influence >= 3 && support >= 3) return { label: 'Key Players', color: 'bg-green-100 border-green-300' };
    if (influence >= 3 && support < 3) return { label: 'Keep Satisfied', color: 'bg-yellow-100 border-yellow-300' };
    if (influence < 3 && support >= 3) return { label: 'Show Consideration', color: 'bg-blue-100 border-blue-300' };
    return { label: 'Monitor', color: 'bg-gray-100 border-gray-300' };
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
              <Users className="w-8 h-8 text-yellow-600" />
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
              You've successfully completed the Stakeholder Map. Your coach has been notified.
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stakeholder Map</h1>
          <p className="text-gray-600">
            Identify and analyze key stakeholders in your project or goal
          </p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus size={24} />
            Add Stakeholder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newStakeholder.name}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })}
                placeholder="Stakeholder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={newStakeholder.role}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, role: e.target.value })}
                placeholder="Their role or position"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Influence (1-5): {newStakeholder.influence}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newStakeholder.influence}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, influence: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support (1-5): {newStakeholder.support}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={newStakeholder.support}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, support: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Blocker</span>
                <span>Champion</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Strategy</label>
              <textarea
                value={newStakeholder.strategy}
                onChange={(e) => setNewStakeholder({ ...newStakeholder, strategy: e.target.value })}
                placeholder="How will you engage with this stakeholder?"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <button
            onClick={addStakeholder}
            disabled={!newStakeholder.name || !newStakeholder.role}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Map
          </button>
        </div>

        {stakeholders.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stakeholders.map((stakeholder) => {
                const quadrant = getQuadrant(stakeholder.influence, stakeholder.support);
                return (
                  <div
                    key={stakeholder.id}
                    className={`${quadrant.color} border-2 rounded-xl p-4`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{stakeholder.name}</h3>
                        <p className="text-sm text-gray-600">{stakeholder.role}</p>
                      </div>
                      <button
                        onClick={() => removeStakeholder(stakeholder.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-700 mb-2">
                      {quadrant.label}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                      <div>
                        <span className="text-gray-600">Influence:</span>
                        <span className="ml-1 font-medium">{'⭐'.repeat(stakeholder.influence)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Support:</span>
                        <span className="ml-1 font-medium">{'❤️'.repeat(stakeholder.support)}</span>
                      </div>
                    </div>

                    {stakeholder.strategy && (
                      <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-300">
                        <strong>Strategy:</strong> {stakeholder.strategy}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? 'Saving...' : 'Save Map'}
              </button>
            </div>
          </>
        )}

        {stakeholders.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stakeholders yet</h3>
            <p className="text-gray-600">Add stakeholders to start mapping your network</p>
          </div>
        )}
      </div>
    </div>
  );
}
