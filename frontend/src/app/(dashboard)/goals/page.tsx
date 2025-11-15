'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiClient } from '@/lib/api-client';

interface Goal {
  id: string;
  title: string;
  description?: string;
  confidenceLevel: number;
  actions: Action[];
  status: string;
}

interface Action {
  id: string;
  description: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    confidenceLevel: 5,
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const token = await user.getIdToken();
        apiClient.setToken(token);
        await fetchGoals();
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchGoals = async () => {
    try {
      const data = await apiClient.get<Goal[]>('/goals');
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/goals', newGoal);
      setNewGoal({ title: '', description: '', confidenceLevel: 5 });
      setShowForm(false);
      await fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to archive this goal?')) return;
    try {
      await apiClient.delete(`/goals/${goalId}`);
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</a>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Goals</h2>
            <p className="text-gray-600 mt-2">Set and track your coaching objectives</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Create New Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level: {newGoal.confidenceLevel}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newGoal.confidenceLevel}
                  onChange={(e) => setNewGoal({ ...newGoal, confidenceLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
              >
                Create Goal
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">No goals yet. Create your first goal to get started!</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-gray-600 mt-2">{goal.description}</p>
                    )}
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">Confidence Level: </span>
                      <span className="text-lg font-bold text-primary-600">{goal.confidenceLevel}/10</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-600 hover:text-red-700 ml-4"
                  >
                    Archive
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
