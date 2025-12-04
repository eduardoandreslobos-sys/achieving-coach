'use client';

import { useAuth } from '@/contexts/AuthContext';
import DashboardSidebar from '@/components/DashboardSidebar';
import CoachSidebar from '@/components/CoachSidebar';

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userProfile } = useAuth();
  
  const Sidebar = userProfile?.role === 'coach' ? CoachSidebar : DashboardSidebar;
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
