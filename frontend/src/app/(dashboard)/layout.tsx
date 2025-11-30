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
          <div className="min-h-screen bg-gray-50">
            {/* Top bar with notification bell for coachees */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
              <NotificationBell />
            </div>
            
            {/* Main content */}
            <main>
              {children}
            </main>
          </div>
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
