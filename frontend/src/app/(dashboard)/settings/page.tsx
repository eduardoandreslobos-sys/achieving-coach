'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, CheckCircle, Shield } from 'lucide-react';
import PhotoUpload from '@/components/PhotoUpload';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

export default function SettingsPage() {
  const { userProfile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!userProfile?.uid) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        displayName: displayName,
        updatedAt: new Date(),
      });

      toast.success('Settings saved successfully!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      refreshProfile?.();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your profile and account settings
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
                placeholder="Your name"
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-600">{userProfile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 capitalize">
                {userProfile.role}
              </span>
            </div>

            {userProfile.role === 'coachee' && userProfile.coacheeInfo?.coachId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Coach
                </label>
                <p className="text-gray-600">
                  You are connected to a coach. View your{' '}
                  <Link href="/dashboard" className="text-primary-600 hover:underline">
                    dashboard
                  </Link>{' '}
                  for more details.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Account</h2>
          </div>
          
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">Account created:</span>{' '}
              {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </p>
            <p>
              <span className="font-medium text-gray-700">Last updated:</span>{' '}
              {userProfile.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </p>
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
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
