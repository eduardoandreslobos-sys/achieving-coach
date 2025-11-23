'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CreditCard } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export default function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const router = useRouter();
  const { userProfile, loading } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!loading && userProfile?.role === 'coach') {
      const status = userProfile.subscriptionStatus;
      
      if (status === 'expired' || status === 'canceled') {
        router.push('/subscription-expired');
      } else if (status === 'trial' && userProfile.trialEndsAt) {
        // Convert Firestore Timestamp to Date
        const trialEndDate = userProfile.trialEndsAt.toDate();
        const daysRemaining = Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 3) {
          setShowWarning(true);
        }
      }
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const trialEndsAt = userProfile?.trialEndsAt;
  const daysRemaining = trialEndsAt 
    ? Math.ceil((trialEndsAt.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      {showWarning && (
        <div className="bg-yellow-50 border-b-2 border-yellow-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="text-yellow-600" size={24} />
              <div>
                <p className="font-bold text-yellow-900">
                  Trial ending in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                </p>
                <p className="text-sm text-yellow-800">
                  Subscribe now to continue using all features
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/subscription')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              <CreditCard size={18} />
              Subscribe Now
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
