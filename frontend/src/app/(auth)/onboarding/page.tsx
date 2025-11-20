'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserRole } from '@/types/user';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('coachee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const baseData = {
        uid: user.uid,
        email: user.email,
        role,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`,
        organization: organization || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Solo coaches tienen subscriptionStatus y trial
      if (role === 'coach') {
        await setDoc(doc(db, 'users', user.uid), {
          ...baseData,
          subscriptionStatus: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        });
        router.push('/coach');
      } else {
        // Coachees NO tienen subscriptionStatus (son gratis)
        await setDoc(doc(db, 'users', user.uid), {
          ...baseData,
          coacheeInfo: {
            goals: [],
            onboardingCompleted: true,
            coachId: null, // Se asignará cuando acepten invitación
          },
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to AchievingCoach!</h1>
          <p className="text-gray-600">Let's set up your profile</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">I am a...</h2>
              <div className="space-y-3">
                <button
                  onClick={() => { setRole('coach'); setStep(2); }}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">Coach</p>
                  <p className="text-sm text-gray-600">I help others achieve their goals</p>
                  <p className="text-xs text-primary-600 mt-1">14-day free trial • $29/month after</p>
                </button>
                <button
                  onClick={() => { setRole('coachee'); setStep(2); }}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">Coachee</p>
                  <p className="text-sm text-gray-600">I want to work with a coach</p>
                  <p className="text-xs text-green-600 mt-1">Free with coach invitation</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization (Optional)</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Complete Setup'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
