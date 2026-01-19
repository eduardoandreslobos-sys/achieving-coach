'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationBell from '@/components/NotificationBell';
import DashboardSidebar from '@/components/DashboardSidebar';
import CoachSidebar from '@/components/CoachSidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { userProfile } = useAuth();
  const isCoach = userProfile?.role === 'coach';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {isCoach ? (
        <CoachSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      ) : (
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-emerald-400">AchievingCoach</span>
          </div>
          <NotificationBell />
        </div>

        {/* Desktop Notification Bell */}
        <div className="hidden md:block fixed top-6 right-6 z-50">
          <NotificationBell />
        </div>

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
