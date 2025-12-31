'use client';

import { useState, useEffect } from 'react';
import { 
  Target, Plus, CheckCircle, Clock, Calendar,
  TrendingUp, MoreVertical, Edit, Trash2, Filter
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  dueDate: Date;
  createdAt: Date;
}

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, 'goals'),
        where('coacheeId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const goalsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Goal[];
      setGoals(goalsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!user?.uid || !newGoal.title.trim()) return;
    try {
      await addDoc(collection(db, 'goals'), {
        coacheeId: user.uid,
        title: newGoal.title,
        description: newGoal.description,
        progress: 0,
        status: 'active',
        dueDate: new Date(newGoal.dueDate),
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setNewGoal({ title: '', description: '', dueDate: '' });
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    try {
      const status = progress >= 100 ? 'completed' : 'active';
      await updateDoc(doc(db, 'goals', goalId), { progress, status });
      setGoals(goals.map(g => g.id === goalId ? { ...g, progress, status } : g));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return;
    try {
      await deleteDoc(doc(db, 'goals', goalId));
      setGoals(goals.filter(g => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.status === filter;
  });

  const stats = {
    total: goals.length,
    active: goals.filter(g => g.status === 'active').length,
    completed: goals.filter(g => g.status === 'completed').length,
    avgProgress: goals.length > 0 
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0,
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOverdue = (date: Date) => {
    return new Date() > date;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mis Metas</h1>
            <p className="text-gray-400">Define y rastrea tu progreso hacia tus objetivos.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Meta
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Activas</p>
            <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Completadas</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Progreso Promedio</p>
            <p className="text-2xl font-bold text-violet-400">{stats.avgProgress}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#111111] border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Completadas'}
            </button>
          ))}
        </div>

        {/* Goals List */}
        {filteredGoals.length > 0 ? (
          <div className="space-y-4">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      goal.status === 'completed' 
                        ? 'bg-emerald-500/10' 
                        : 'bg-violet-500/10'
                    }`}>
                      {goal.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Target className="w-5 h-5 text-violet-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-500 text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progreso</span>
                    <span className="text-white font-medium">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        goal.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Progress Buttons */}
                {goal.status !== 'completed' && (
                  <div className="flex gap-2 mb-4">
                    {[25, 50, 75, 100].map((p) => (
                      <button
                        key={p}
                        onClick={() => handleUpdateProgress(goal.id, p)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          goal.progress >= p
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                )}

                {/* Due Date */}
                <div className={`flex items-center gap-2 text-sm ${
                  isOverdue(goal.dueDate) && goal.status !== 'completed'
                    ? 'text-red-400'
                    : 'text-gray-500'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {isOverdue(goal.dueDate) && goal.status !== 'completed' ? 'Vencida: ' : 'Vence: '}
                    {formatDate(goal.dueDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
            <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No tienes metas</h3>
            <p className="text-gray-500 mb-4">Crea tu primera meta para empezar a rastrear tu progreso.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Meta
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-6">Nueva Meta</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Título</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ej: Mejorar habilidades de comunicación"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Descripción (opcional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                    placeholder="Describe tu meta..."
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha límite</label>
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#222] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear Meta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
