'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, Calendar, Search, Tag, 
  MoreVertical, Edit, Trash2, ChevronRight
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Reflection {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: Date;
}

const MOODS = [
  { value: 'great', label: 'Excelente', emoji: '😊' },
  { value: 'good', label: 'Bien', emoji: '🙂' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'challenging', label: 'Desafiante', emoji: '😤' },
  { value: 'difficult', label: 'Difícil', emoji: '😔' },
];

const SUGGESTED_TAGS = ['Trabajo', 'Relaciones', 'Crecimiento', 'Logro', 'Desafío', 'Aprendizaje'];

export default function ReflectionsPage() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReflection, setSelectedReflection] = useState<Reflection | null>(null);
  const [newReflection, setNewReflection] = useState({
    title: '',
    content: '',
    mood: 'good',
    tags: [] as string[],
  });

  useEffect(() => {
    loadReflections();
  }, [user]);

  const loadReflections = async () => {
    if (!user?.uid) return;
    try {
      const q = query(
        collection(db, 'reflections'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Reflection[];
      setReflections(data);
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user?.uid || !newReflection.title.trim() || !newReflection.content.trim()) return;
    try {
      await addDoc(collection(db, 'reflections'), {
        userId: user.uid,
        ...newReflection,
        createdAt: serverTimestamp(),
      });
      setShowModal(false);
      setNewReflection({ title: '', content: '', mood: 'good', tags: [] });
      loadReflections();
    } catch (error) {
      console.error('Error creating reflection:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reflexión?')) return;
    try {
      await deleteDoc(doc(db, 'reflections', id));
      setReflections(reflections.filter(r => r.id !== id));
      setSelectedReflection(null);
    } catch (error) {
      console.error('Error deleting reflection:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setNewReflection(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const filteredReflections = reflections.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMoodEmoji = (mood: string) => {
    return MOODS.find(m => m.value === mood)?.emoji || '🙂';
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
            <h1 className="text-2xl font-bold text-white mb-1">Mis Reflexiones</h1>
            <p className="text-gray-400">Documenta tu viaje de crecimiento personal.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Reflexión
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar reflexiones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#111111] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Reflections List */}
          <div className="lg:col-span-1 space-y-3">
            {filteredReflections.length > 0 ? (
              filteredReflections.map((reflection) => (
                <button
                  key={reflection.id}
                  onClick={() => setSelectedReflection(reflection)}
                  className={`w-full text-left p-4 rounded-xl transition-colors ${
                    selectedReflection?.id === reflection.id
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'bg-[#111111] border border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{getMoodEmoji(reflection.mood)}</span>
                    <span className="text-gray-500 text-xs">{formatDate(reflection.createdAt)}</span>
                  </div>
                  <h3 className="text-white font-medium mb-1 line-clamp-1">{reflection.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{reflection.content}</p>
                  {reflection.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {reflection.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-[#1a1a1a] text-gray-400 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {reflection.tags.length > 2 && (
                        <span className="text-gray-500 text-xs">+{reflection.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No hay reflexiones aún</p>
              </div>
            )}
          </div>

          {/* Selected Reflection Detail */}
          <div className="lg:col-span-2">
            {selectedReflection ? (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getMoodEmoji(selectedReflection.mood)}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedReflection.title}</h2>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedReflection.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedReflection.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {selectedReflection.tags.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {selectedReflection.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedReflection.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Selecciona una reflexión</h3>
                <p className="text-gray-500">Elige una reflexión de la lista para ver los detalles</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-6">Nueva Reflexión</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">¿Cómo te sientes hoy?</label>
                  <div className="flex gap-2">
                    {MOODS.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setNewReflection({ ...newReflection, mood: mood.value })}
                        className={`flex-1 p-3 rounded-lg text-center transition-colors ${
                          newReflection.mood === mood.value
                            ? 'bg-blue-600/20 border border-blue-500'
                            : 'bg-[#1a1a1a] border border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <span className="text-2xl">{mood.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Título</label>
                  <input
                    type="text"
                    value={newReflection.title}
                    onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                    placeholder="¿Sobre qué reflexionas hoy?"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Tu reflexión</label>
                  <textarea
                    value={newReflection.content}
                    onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                    rows={6}
                    placeholder="Escribe tus pensamientos..."
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Etiquetas</label>
                  <div className="flex gap-2 flex-wrap">
                    {SUGGESTED_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          newReflection.tags.includes(tag)
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#1a1a1a] border border-gray-700 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
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
                  onClick={handleCreate}
                  disabled={!newReflection.title.trim() || !newReflection.content.trim()}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
