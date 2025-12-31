'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Target, Plus, CheckCircle, Flag, Star, Check } from 'lucide-react';
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
  const [newGoal, setNewGoal] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user?.uid) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'goals'), where('coacheeId', '==', user.uid));
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
        dueDate: newGoal.dueDate ? new Date(newGoal.dueDate) : new Date(),
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setNewGoal({ title: '', description: '', dueDate: '' });
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Objetivos</h1>
          <p className="text-gray-400">Rastrea y gestiona tus objetivos de coaching</p>
        </div>

        {goals.length === 0 ? (
          /* Empty State */
          <div className="bg-[#12131a] border border-blue-900/30 rounded-2xl p-12">
            <div className="flex flex-col items-center text-center">
              {/* Stacked Icons Illustration */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center">
                  <Flag className="w-10 h-10 text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-4 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-white mb-3">No tienes objetivos aún</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                Define tu camino hacia el éxito. Comienza creando tu primer objetivo claro y alcanzable para iniciar tu transformación.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Crea tu Primer Objetivo
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Goals List */
          <div className="space-y-4">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-6"
            >
              <Plus className="w-4 h-4" />
              Nuevo Objetivo
            </button>

            {goals.map((goal) => (
              <div key={goal.id} className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      goal.status === 'completed' ? 'bg-emerald-500/20' : 'bg-blue-500/20'
                    }`}>
                      {goal.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Target className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{goal.title}</h3>
                      {goal.description && <p className="text-gray-500 text-sm">{goal.description}</p>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    goal.status === 'completed' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {goal.status === 'completed' ? 'Completado' : `${goal.progress}%`}
                  </span>
                </div>
                
                {goal.status !== 'completed' && (
                  <div className="h-2 bg-[#1a1b23] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda para definir tus objetivos?{' '}
            <Link href="/messages" className="text-blue-400 hover:text-blue-300">
              Consulta a tu coach
            </Link>
          </p>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#12131a] border border-blue-900/30 rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-6">Nuevo Objetivo</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Título del objetivo</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="Ej: Mejorar comunicación"
                    className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Descripción (opcional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                    placeholder="Describe tu objetivo..."
                    className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Fecha límite</label>
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[#1a1b23] border border-blue-900/30 text-white rounded-xl hover:bg-[#22232d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Crear Objetivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
