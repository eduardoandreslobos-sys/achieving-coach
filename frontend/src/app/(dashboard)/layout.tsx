'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ProtectedRoute allowedRoles={['coachee']}>
        {children}
      </ProtectedRoute>
    </AuthProvider>
  );
}
