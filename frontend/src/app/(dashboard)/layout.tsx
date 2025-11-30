'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/DashboardSidebar';
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
          <div className="flex h-screen bg-gray-50">
            {/* Sidebar for coachees */}
            <DashboardSidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Floating notification bell - top right */}
              <div className="fixed top-6 right-6 z-50">
                <NotificationBell />
              </div>
              
              {/* Main content */}
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </div>
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
