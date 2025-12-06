'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function UserMenu() {
  const { userProfile, logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await logout();
    router.push('/sign-in');
  };

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
    return 'U';
  };

  if (!userProfile) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
          {getInitials()}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'User'}
        </span>
      </div>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}
