'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CreditCard, Clock } from 'lucide-react';

export default function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userProfile && userProfile.subscriptionStatus === 'expired') {
      router.push('/subscription-expired');
    }
  }, [userProfile, router]);

  if (!userProfile) return null;

  const isExpired = userProfile.subscriptionStatus === 'expired';
  const isInTrial = userProfile.subscriptionStatus === 'trial';
  const trialEndsAt = userProfile.trialEndsAt;
  
  if (isExpired) {
    return null;
  }

  const daysRemaining = trialEndsAt 
    ? Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      {isInTrial && daysRemaining <= 3 && (
        <div className="bg-orange-50 border-b-2 border-orange-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-600" size={20} />
              <p className="text-sm font-medium text-orange-900">
                Your free trial ends in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => router.push('/subscribe')}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
