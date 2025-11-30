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
          <main className="flex-1 overflow-y-auto relative">
            {/* Floating notification bell - top right */}
            <div className="fixed top-6 right-6 z-50">
              <NotificationBell />
            </div>
            
            {children}
          </main>
        </div>
      </ProtectedRoute>
    </NotificationProvider>
  );
}
