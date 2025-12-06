'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function SubscriptionExpiredPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-orange-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Subscription Expired
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your subscription has expired. Please renew to continue accessing all features.
        </p>

        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            View Pricing Plans
          </Link>
          
          <button
            onClick={logout}
            className="block w-full px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
