'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  UserPlus, 
  Award, 
  MessageSquare, 
  Calendar, 
  LogOut, 
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const navigation = [
  { name: 'Dashboard', href: '/coach', icon: LayoutDashboard },
  { name: 'Clients', href: '/coach/clients', icon: Users },
  { name: 'Tools', href: '/coach/tools', icon: Wrench },
  { name: 'Invite Coachees', href: '/coach/invite', icon: UserPlus },
  { name: 'ICF Simulator', href: '/coach/icf-simulator', icon: Award },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Profile', href: '/coach/profile', icon: User },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('coachSidebarCollapsed');
    if (saved !== null) {
      setCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem('coachSidebarCollapsed', JSON.stringify(newState));
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
    return 'C';
  };

  const handleSignOut = async () => {
    await logout();
    router.push('/sign-in');
  };

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className={`flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen transition-all duration-300`}>
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 border-b border-gray-200 px-4`}>
        {!collapsed && <h1 className="text-xl font-bold text-primary-600">AchievingCoach</h1>}
        {collapsed && <span className="text-xl font-bold text-primary-600">AC</span>}
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute top-20 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 z-10"
        style={{ left: collapsed ? '68px' : '248px' }}
      >
        {collapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              title={collapsed ? item.name : undefined}
              className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}>
              <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
              {!collapsed && item.name}
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      {userProfile && (
        <div className="border-t border-gray-200">
          <div className={`p-4 ${collapsed ? 'flex flex-col items-center' : ''}`}>
            <div className={`flex items-center ${collapsed ? 'flex-col' : 'gap-3'}`}>
              {userProfile.photoURL ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={userProfile.photoURL}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials()}
                </div>
              )}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              title={collapsed ? 'Sign Out' : undefined}
              className={`${collapsed ? 'mt-3 p-2' : 'mt-3 w-full flex items-center justify-center gap-2 px-4 py-2'} text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors`}>
              <LogOut className="w-4 h-4" />
              {!collapsed && 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
