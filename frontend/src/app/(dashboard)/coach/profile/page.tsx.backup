'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ValueProposition } from '@/types/coaching';
import { CheckCircle, Lightbulb, User } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import { toast, Toaster } from 'sonner';

export default function CoachProfilePage() {
  const { userProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  const [valueProps, setValueProps] = useState<ValueProposition>({
    coachingType: '',
    targetAudience: '',
    desiredOutcome: '',
    problemSolved: '',
  });

  useEffect(() => {
    if (userProfile) {
      if (userProfile.valueProposition) {
        setValueProps(userProfile.valueProposition);
      }
      setDisplayName(userProfile.displayName || '');
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
        displayName: displayName,
        valueProposition: updatedValueProps,
        updatedAt: new Date(),
      });

      toast.success('Profile saved successfully!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refreshProfile?.();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (url: string) => {
    toast.success(url ? 'Photo updated!' : 'Photo removed');
    refreshProfile?.();
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Toaster position="top-center" richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Coach Profile</h1>
          <p className="text-gray-600">
            Manage your profile information and value proposition
          </p>
        </div>

        {/* Profile Photo & Basic Info */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            <PhotoUpload 
              userId={userProfile.uid}
              currentPhotoURL={userProfile.photoURL}
              onUploadComplete={handlePhotoUpload}
            />
            
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name as shown to coachees"
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-600">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Value Proposition</h2>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Formula:</strong> I assume that my <strong>[coaching type]</strong> will help{' '}
              <strong>[target audience]</strong> who want{' '}
              <strong>[desired outcome]</strong> by solving{' '}
              <strong>[specific problem]</strong>
            </p>
          </div>

          <div className="space-y-6">
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
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saved && <CheckCircle size={20} />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
