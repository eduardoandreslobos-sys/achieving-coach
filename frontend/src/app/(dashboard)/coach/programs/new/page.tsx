'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createCoachingProgram } from '@/lib/coachingService';
import { Plus, Trash2, Target } from 'lucide-react';

interface Coachee {
  id: string;
  displayName?: string;
  email?: string;
  [key: string]: any;
}

export default function NewProgramPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile } = useAuth();
  const coacheeId = searchParams?.get('coacheeId') || '';

  const [coachee, setCoachee] = useState<Coachee | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 3,
    sessionsPlanned: 6,
    startDate: new Date().toISOString().split('T')[0],
    goals: [''],
  });

  useEffect(() => {
    if (coacheeId) {
      loadCoachee();
    }
  }, [coacheeId]);

  const loadCoachee = async () => {
    try {
      const docRef = doc(db, 'users', coacheeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Coachee;
        setCoachee(data);
        
        // Pre-fill title with coachee name
        setFormData(prev => ({
          ...prev,
          title: `Coaching Program - ${data.displayName || data.email}`,
        }));
      }
    } catch (error) {
      console.error('Error loading coachee:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = () => {
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, ''],
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.map((goal, i) => i === index ? value : goal),
    }));
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uid || !coachee) return;

    setSaving(true);

    try {
      // Filter out empty goals
      const validGoals = formData.goals.filter(g => g.trim() !== '');
      
      if (validGoals.length === 0) {
        alert('Please add at least one program goal');
        setSaving(false);
        return;
      }

      const programId = await createCoachingProgram(
        userProfile.uid,
        coachee.id,
        coachee.displayName || coachee.email || 'Unknown',
        {
          title: formData.title,
          description: formData.description,
          overallGoals: validGoals,
          duration: formData.duration,
          sessionsPlanned: formData.sessionsPlanned,
          startDate: new Date(formData.startDate),
        }
      );

      alert('Coaching program created successfully!');
      router.push(`/coach/programs/${programId}`);
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!coachee) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-[var(--fg-primary)] mb-2">Coachee not found</h1>
          <button
            onClick={() => router.push('/coach/clients')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push(`/coach/clients/${coacheeId}`)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to client
          </button>
          <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-2">Create Coaching Program</h1>
          <p className="text-[var(--fg-muted)]">
            For: {coachee.displayName || coachee.email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border-2 border-[var(--border-color)] p-6">
            <h2 className="text-xl font-bold text-[var(--fg-primary)] mb-4">Program Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Leadership Development Program"
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the coaching program..."
                  className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
                    Duration (months) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="24"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
                    Sessions Planned *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.sessionsPlanned}
                    onChange={(e) => setFormData({ ...formData, sessionsPlanned: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Program Goals */}
          <div className="bg-white rounded-xl border-2 border-[var(--border-color)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[var(--fg-primary)]">Program Goals</h2>
              <button
                type="button"
                onClick={addGoal}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700"
              >
                <Plus size={16} />
                Add Goal
              </button>
            </div>

            <p className="text-sm text-[var(--fg-muted)] mb-4">
              What are the main objectives for this coaching program?
            </p>

            <div className="space-y-3">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="text-primary-600 flex-shrink-0 mt-3" size={18} />
                  <textarea
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    rows={2}
                    placeholder={`Program goal ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  {formData.goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoal(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg mt-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--fg-muted)] rounded-lg hover:bg-[var(--bg-tertiary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
