'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Wrench, UserPlus, Award, MessageSquare, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/coach', icon: LayoutDashboard },
  { name: 'Clients', href: '/coach/clients', icon: Users },
  { name: 'Tools', href: '/coach/tools', icon: Wrench },
  { name: 'Invite Coachees', href: '/coach/invite', icon: UserPlus },
  { name: 'ICF Simulator', href: '/coach/icf-simulator', icon: Award },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, signOut } = useAuth();

  const getInitials = () => {
    if (userProfile?.firstName && userProfile?.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`;
    }
    if (userProfile?.displayName) {
      const parts = userProfile.displayName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`;
      }
      return userProfile.displayName[0];
    }
    return 'C';
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/sign-in');
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">AchievingCoach</h1>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {userProfile && (
        <div className="border-t border-gray-200">
          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Coach'}
                </p>
                <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-4 pb-4">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
