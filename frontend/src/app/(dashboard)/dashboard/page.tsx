'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    // Si es coach, redirigir a /coach
    if (userProfile?.role === 'coach') {
      router.replace('/coach');
      return;
    }
  }, [userProfile, loading, router]);

  if (loading || userProfile?.role === 'coach') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Dashboard de coachee (el contenido real)
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Good evening, {userProfile?.firstName || 'there'}! 👋
        </h1>
        <p className="text-gray-600 mb-8">Here's what's happening with your coaching journey</p>

        {/* Contenido del dashboard de coachee */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Goals</h3>
            <p className="text-3xl font-bold text-gray-900">3/8</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Sessions</h3>
            <p className="text-3xl font-bold text-gray-900">12/16</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Tools Used</h3>
            <p className="text-3xl font-bold text-gray-900">5</p>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Reflections</h3>
            <p className="text-3xl font-bold text-gray-900">8</p>
          </div>
        </div>
      </div>
    </div>
  );
}
