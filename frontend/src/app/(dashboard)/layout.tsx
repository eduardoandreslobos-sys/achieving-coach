'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/DashboardSidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't show DashboardSidebar for coach routes
  const isCoachRoute = pathname?.startsWith('/coach');

  return (
    <AuthProvider>
      <NotificationProvider>
        <ProtectedRoute>
          {isCoachRoute ? (
            // Coach routes - no sidebar here (handled by /coach/layout.tsx)
            <div className="relative">
              <div className="fixed top-6 right-6 z-50">
                <NotificationBell />
              </div>
              {children}
            </div>
          ) : (
            // Coachee routes - show DashboardSidebar
            <div className="flex h-screen bg-gray-50">
              <DashboardSidebar />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="fixed top-6 right-6 z-50">
                  <NotificationBell />
                </div>
                
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          )}
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
