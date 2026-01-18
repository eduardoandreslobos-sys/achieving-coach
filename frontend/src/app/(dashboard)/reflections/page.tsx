'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Lightbulb, PenTool, Lock } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Reflection {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function ReflectionsPage() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReflection, setNewReflection] = useState({ title: '', content: '' });

  useEffect(() => {
    loadReflections();
  }, [user]);

  const loadReflections = async () => {
    if (!user?.uid) { setLoading(false); return; }
    try {
      const q = query(collection(db, 'reflections'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Reflection[];
      setReflections(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user?.uid || !newReflection.title.trim() || !newReflection.content.trim()) return;
    try {
      await addDoc(collection(db, 'reflections'), {
        userId: user.uid,
        title: newReflection.title,
        content: newReflection.content,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setNewReflection({ title: '', content: '' });
      loadReflections();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mis Reflexiones</h1>
            <p className="text-gray-400">Documenta tu viaje de coaching y tus ideas.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Reflexión
          </button>
        </div>

        {reflections.length === 0 ? (
          <>
            {/* Empty State */}
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-12 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-3">Aún no hay reflexiones</h2>
                <p className="text-gray-400 mb-8 max-w-md">
                  Comienza a documentar tu viaje de coaching escribiendo tu primera reflexión. Es una excelente manera de seguir tu progreso.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  <PenTool className="w-5 h-5" />
                  Escribe tu Primera Reflexión
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#12131a] border border-gray-800 rounded-xl p-5">
                <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">¿Por qué reflexionar?</h3>
                <p className="text-gray-400 text-sm">
                  Tomarse el tiempo para reflexionar después de las sesiones ayuda a consolidar el aprendizaje y a identificar patrones de comportamiento.
                </p>
              </div>

              <div className="bg-[#12131a] border border-gray-800 rounded-xl p-5">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <PenTool className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Tips de escritura</h3>
                <p className="text-gray-400 text-sm">
                  No te preocupes por la gramática. Concéntrate en capturar tus sentimientos, dudas y momentos "aha!" más importantes.
                </p>
              </div>

              <div className="bg-[#12131a] border border-gray-800 rounded-xl p-5">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Privacidad</h3>
                <p className="text-gray-400 text-sm">
                  Tus reflexiones son privadas. Tú decides si quieres compartirlas con tu coach en tu próxima sesión.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Reflections List */
          <div className="space-y-4">
            {reflections.map((r) => (
              <div key={r.id} className="bg-[#12131a] border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{r.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-3">{r.content}</p>
                <span className="text-gray-500 text-xs">
                  {r.createdAt.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold text-white mb-6">Nueva Reflexión</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Título</label>
                  <input
                    type="text"
                    value={newReflection.title}
                    onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                    placeholder="¿Sobre qué reflexionas hoy?"
                    className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tu reflexión</label>
                  <textarea
                    value={newReflection.content}
                    onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                    rows={6}
                    placeholder="Escribe tus pensamientos..."
                    className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-[#1a1b23] border border-gray-800 text-white rounded-xl hover:bg-[#22232d] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newReflection.title.trim() || !newReflection.content.trim()}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
