'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function SubscriptionExpiredPage() {
  const { userProfile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-orange-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Trial Has Ended
          </h1>
          <p className="text-gray-600">
            Thanks for trying AchievingCoach! Subscribe now to continue your coaching journey.
          </p>
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Continue Your Growth
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-gray-900">Unlimited Coaching Sessions</p>
                <p className="text-sm text-gray-600">Connect with your coach anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-gray-900">All Coaching Tools</p>
                <p className="text-sm text-gray-600">Access to all 7 professional tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-gray-900">Progress Tracking</p>
                <p className="text-sm text-gray-600">Monitor your growth and achievements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-gray-900">Direct Messaging</p>
                <p className="text-sm text-gray-600">Real-time communication with your coach</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Starting at</p>
              <p className="text-4xl font-bold text-gray-900 mb-1">$29<span className="text-lg text-gray-600">/month</span></p>
              <p className="text-sm text-gray-600">Cancel anytime</p>
            </div>
          </div>

          <button
            disabled
            className="w-full py-4 bg-gray-400 text-white rounded-lg font-medium text-lg cursor-not-allowed"
          >
            Payment Integration Coming Soon
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Payment processing will be available soon. Contact support for early access.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={signOut}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
