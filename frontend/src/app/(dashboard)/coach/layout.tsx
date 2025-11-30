'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import CoachSidebar from '@/components/CoachSidebar';
import NotificationBell from '@/components/NotificationBell';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <ProtectedRoute allowedRoles={['coach']}>
        <div className="flex h-screen bg-gray-50">
          <CoachSidebar />
          <div className="flex-1 flex flex-col">
            {/* Top bar with notification bell */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6">
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
  );
}
