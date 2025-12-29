'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/DashboardSidebar';
import CoachSidebar from '@/components/CoachSidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();

  // Show appropriate sidebar based on user role
  const isCoach = userProfile?.role === 'coach';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Show correct sidebar based on role */}
      {isCoach ? <CoachSidebar /> : <DashboardSidebar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Floating notification bell */}
        <div className="fixed top-6 right-6 z-50">
          <NotificationBell />
        </div>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProtectedRoute>
          <DashboardContent>{children}</DashboardContent>
        </ProtectedRoute>
      </NotificationProvider>
    </AuthProvider>
  );
}
