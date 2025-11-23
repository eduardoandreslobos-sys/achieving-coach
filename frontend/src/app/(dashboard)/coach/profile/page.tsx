'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ValueProposition } from '@/types/coaching';
import { CheckCircle, Lightbulb } from 'lucide-react';

export default function CoachProfilePage() {
  const { userProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [valueProps, setValueProps] = useState<ValueProposition>({
    coachingType: '',
    targetAudience: '',
    desiredOutcome: '',
    problemSolved: '',
  });

  useEffect(() => {
    if (userProfile?.valueProposition) {
      setValueProps(userProfile.valueProposition);
    }
  }, [userProfile]);

  const generatePitch = () => {
    const { problemSolved } = valueProps;
    if (!problemSolved) return '';
    return `You know that problem when ${problemSolved}? Well, I help you solve that problem.`;
  };

  const handleSave = async () => {
    if (!userProfile?.uid) return;

    setSaving(true);
    try {
      const pitch = generatePitch();
      const updatedValueProps = { ...valueProps, pitch };

      await updateDoc(doc(db, 'users', userProfile.uid), {
        valueProposition: updatedValueProps,
        updatedAt: new Date(),
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving value proposition:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Value Proposition</h1>
          <p className="text-gray-600">
            Define what makes your coaching unique and valuable to your clients
          </p>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-blue-900 mb-1">Formula</h3>
              <p className="text-sm text-blue-800">
                I assume that my <strong>[coaching type]</strong> will help{' '}
                <strong>[target audience]</strong> who want{' '}
                <strong>[desired outcome]</strong> by solving{' '}
                <strong>[specific problem]</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coaching Type *
            </label>
            <input
              type="text"
              value={valueProps.coachingType}
              onChange={(e) => setValueProps({ ...valueProps, coachingType: e.target.value })}
              placeholder="e.g., Leadership Coaching, Career Coaching, Life Coaching"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience *
            </label>
            <input
              type="text"
              value={valueProps.targetAudience}
              onChange={(e) => setValueProps({ ...valueProps, targetAudience: e.target.value })}
              placeholder="e.g., Mid-level managers, Career changers, Entrepreneurs"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desired Outcome *
            </label>
            <input
              type="text"
              value={valueProps.desiredOutcome}
              onChange={(e) => setValueProps({ ...valueProps, desiredOutcome: e.target.value })}
              placeholder="e.g., advance in their careers, find work-life balance"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Solved *
            </label>
            <textarea
              value={valueProps.problemSolved}
              onChange={(e) => setValueProps({ ...valueProps, problemSolved: e.target.value })}
              placeholder="e.g., you feel stuck in your current role and don't know how to progress"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {valueProps.problemSolved && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">Your Pitch:</h3>
              <p className="text-green-800">{generatePitch()}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !valueProps.coachingType || !valueProps.targetAudience}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saved && <CheckCircle size={20} />}
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Value Proposition'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
