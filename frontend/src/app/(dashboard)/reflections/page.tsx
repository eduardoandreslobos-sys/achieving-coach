'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Calendar, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

interface Reflection {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  userId: string;
}

export default function ReflectionsPage() {
  const { user } = useAuth();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewReflection, setShowNewReflection] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newReflection, setNewReflection] = useState({ title: '', content: '', tags: '' });

  // Cargar reflections del usuario
  useEffect(() => {
    if (user?.uid) {
      loadReflections();
    }
  }, [user]);

  const loadReflections = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
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

  const handleSaveReflection = async () => {
    if (!user?.uid || !newReflection.title.trim() || !newReflection.content.trim()) return;
    
    setSaving(true);
    try {
      const tagsArray = newReflection.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await addDoc(collection(db, 'reflections'), {
        userId: user.uid,
        title: newReflection.title.trim(),
        content: newReflection.content.trim(),
        tags: tagsArray,
        createdAt: serverTimestamp(),
      });

      setNewReflection({ title: '', content: '', tags: '' });
      setShowNewReflection(false);
      await loadReflections();
    } catch (error) {
      console.error('Error saving reflection:', error);
      alert('Error saving reflection. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReflection = async (reflectionId: string) => {
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    
    try {
      await deleteDoc(doc(db, 'reflections', reflectionId));
      setReflections(prev => prev.filter(r => r.id !== reflectionId));
    } catch (error) {
      console.error('Error deleting reflection:', error);
      alert('Error deleting reflection. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Reflections
            </h1>
            <p className="text-lg text-gray-600">
              Document your coaching journey and insights
            </p>
          </div>
          <button 
            onClick={() => setShowNewReflection(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Reflection
          </button>
        </div>

        {/* New Reflection Form */}
        {showNewReflection && (
          <div className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Reflection</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newReflection.title}
                onChange={(e) => setNewReflection({ ...newReflection, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <textarea
                placeholder="What's on your mind? Reflect on your progress, challenges, insights, or learnings..."
                value={newReflection.content}
                onChange={(e) => setNewReflection({ ...newReflection, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <input
                type="text"
                placeholder="Tags (comma separated, e.g., Leadership, Progress, Insights)"
                value={newReflection.tags}
                onChange={(e) => setNewReflection({ ...newReflection, tags: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleSaveReflection}
                  disabled={saving || !newReflection.title.trim() || !newReflection.content.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Reflection'}
                </button>
                <button 
                  onClick={() => {
                    setShowNewReflection(false);
                    setNewReflection({ title: '', content: '', tags: '' });
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reflections List */}
        {reflections.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No reflections yet</h3>
            <p className="text-gray-600 mb-6">Start documenting your coaching journey by writing your first reflection</p>
            <button 
              onClick={() => setShowNewReflection(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus size={20} />
              Write Your First Reflection
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reflections.map((reflection) => (
              <div key={reflection.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{reflection.title}</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{reflection.createdAt.toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteReflection(reflection.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete reflection"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{reflection.content}</p>
                {reflection.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {reflection.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
