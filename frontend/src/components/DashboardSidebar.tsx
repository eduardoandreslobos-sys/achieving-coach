'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Target, 
  Wrench, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  FileText, 
  LogOut,
  Settings,
  FolderKanban,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Mis Herramientas', href: '/tools', icon: Wrench },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare, badge: 2 },
  { name: 'Mis Programas', href: '/programs', icon: FolderKanban },
  { name: 'Sesiones', href: '/sessions', icon: Calendar },
  { name: 'Reflexiones', href: '/reflections', icon: BookOpen },
  { name: 'Recursos', href: '/resources', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    await logout();
    router.push('/sign-in');
  };

  return (
    <div className={`relative flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-[#0a0a0f] border-r border-gray-800/50 h-screen transition-all duration-300`}>
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} h-16 px-4`}>
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        {!collapsed && <span className="text-lg font-semibold text-blue-400">AchievingCoach</span>}
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 w-6 h-6 bg-[#12131a] border border-gray-700 rounded-full flex items-center justify-center hover:bg-[#1a1b23] z-10"
      >
        <ChevronLeft className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500 -ml-[2px]'
                  : 'text-gray-400 hover:bg-[#12131a] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      {userProfile && (
        <div className="border-t border-gray-800/50 p-4">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {userProfile.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-medium">
                  {userProfile.displayName?.charAt(0) || userProfile.firstName?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`}
                </p>
                <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#12131a] rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleSignOut}
              className="mt-3 p-2 text-gray-400 hover:text-white hover:bg-[#12131a] rounded-lg transition-colors w-full flex justify-center"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
