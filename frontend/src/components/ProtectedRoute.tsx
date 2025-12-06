'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'coach' | 'coachee' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated - redirect to sign in
        router.push('/sign-in');
        return;
      }

      if (userProfile && allowedRoles && allowedRoles.length > 0) {
        // Check if user has required role
        if (!allowedRoles.includes(userProfile.role)) {
          // User doesn't have allowed role - redirect to their correct dashboard
          if (userProfile.role === 'admin') {
            router.push('/admin');
          } else if (userProfile.role === 'coach') {
            router.push('/coach');
          } else {
            router.push('/dashboard');
          }
          return;
        }
      }
    }
  }, [user, userProfile, loading, router, allowedRoles]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or wrong role
  if (!user || (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role))) {
    return null;
  }

  return <>{children}</>;
}
