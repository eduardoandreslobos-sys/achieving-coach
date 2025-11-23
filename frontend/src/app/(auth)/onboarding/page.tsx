'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function OnboardingPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'coach' | 'coachee'>('coachee');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
  });

  useEffect(() => {
    if (!userProfile) {
      router.push('/sign-in');
    }
  }, [userProfile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setLoading(true);

    try {
      const userData: any = {
        uid: userProfile.uid,
        email: userProfile.email,
        role: role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        updatedAt: serverTimestamp(),
      };

      if (role === 'coach') {
        userData.organization = formData.organization;
        userData.subscriptionStatus = 'trial';
        userData.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      } else {
        userData.coacheeInfo = {
          coachId: '',
          coachName: '',
          onboardingCompleted: true,
          goals: [],
        };
      }

      await setDoc(doc(db, 'users', userProfile.uid), userData, { merge: true });

      if (role === 'coach') {
        router.push('/coach');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AchievingCoach</h1>
          <p className="text-gray-600">Let's set up your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
            <div className="space-y-2">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  value="coach"
                  checked={role === 'coach'}
                  onChange={(e) => setRole(e.target.value as 'coach' | 'coachee')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Coach</div>
                  <div className="text-sm text-gray-600">I provide coaching services</div>
                </div>
              </label>
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                <input
                  type="radio"
                  value="coachee"
                  checked={role === 'coachee'}
                  onChange={(e) => setRole(e.target.value as 'coach' | 'coachee')}
                  className="w-4 h-4 text-primary-600"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Coachee</div>
                  <div className="text-sm text-gray-600">I'm seeking coaching</div>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {role === 'coach' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization (Optional)
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Your coaching practice or company"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  );
}
