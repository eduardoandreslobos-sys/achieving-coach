'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProtectedRoute>
          <div className="relative">
            {/* Floating notification bell - top right */}
            <div className="fixed top-6 right-6 z-50">
              <NotificationBell />
            </div>
            
            {children}
          </div>
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
