'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { Target, Plus, CheckCircle, Circle, Trash2, Calendar, TrendingUp } from 'lucide-react';

interface Action {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  deadline?: string;
  confidenceLevel: number;
  actions: Action[];
  createdAt: Date;
  userId: string;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: '',
    confidenceLevel: 5,
  });

  useEffect(() => {
    if (user?.uid) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'goals'),
        where('coacheeId', '==', user.uid),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Goal[];

      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGoal = async () => {
    if (!user?.uid || !newGoal.title.trim()) return;

    setSaving(true);
    try {
      await addDoc(collection(db, 'goals'), {
        coacheeId: user.uid,
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        deadline: newGoal.deadline || null,
        confidenceLevel: newGoal.confidenceLevel,
        status: 'active',
        actions: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setNewGoal({ title: '', description: '', deadline: '', confidenceLevel: 5 });
      setShowNewGoal(false);
      await loadGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Error saving goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      await updateDoc(doc(db, 'goals', goalId), {
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      await updateDoc(doc(db, 'goals', goalId), {
        status: 'archived',
        updatedAt: serverTimestamp(),
      });
      setGoals(prev => prev.filter(g => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 8) return 'text-green-600 bg-green-100';
    if (level >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Goals</h1>
            <p className="text-lg text-gray-600">Track and manage your coaching goals</p>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Goal
          </button>
        </div>

        {/* New Goal Form */}
        {showNewGoal && (
          <div className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <textarea
                placeholder="Describe your goal in detail..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confidence Level: {newGoal.confidenceLevel}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newGoal.confidenceLevel}
                    onChange={(e) => setNewGoal({ ...newGoal, confidenceLevel: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveGoal}
                  disabled={saving || !newGoal.title.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Goal'}
                </button>
                <button
                  onClick={() => {
                    setShowNewGoal(false);
                    setNewGoal({ title: '', description: '', deadline: '', confidenceLevel: 5 });
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-6">Start your coaching journey by setting your first goal</p>
            <button
              onClick={() => setShowNewGoal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus size={20} />
              Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(goal.confidenceLevel)}`}>
                      {goal.confidenceLevel}/10
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {goal.deadline && (
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <TrendingUp size={16} />
                      <span>Created: {goal.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCompleteGoal(goal.id)}
                      className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as completed"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm">Complete</span>
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
