'use client';

import { useState, useEffect } from 'react';
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
  ChevronLeft,
  X,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Mi Progreso', href: '/progress', icon: TrendingUp },
  { name: 'Metas', href: '/goals', icon: Target },
  { name: 'Mis Herramientas', href: '/tools', icon: Wrench },
  { name: 'Mensajes', href: '/messages', icon: MessageSquare, badge: 2 },
  { name: 'Mis Programas', href: '/programs', icon: FolderKanban },
  { name: 'Sesiones', href: '/sessions', icon: Calendar },
  { name: 'Reflexiones', href: '/reflections', icon: BookOpen },
  { name: 'Recursos', href: '/resources', icon: FileText },
  { name: 'Configuración', href: '/settings', icon: Settings },
];

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavClick = () => {
    // Close mobile sidebar on navigation
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const sidebarContent = (
    <div className={`relative flex flex-col ${collapsed ? 'w-20' : 'w-64'} bg-[var(--bg-primary)] border-r border-[var(--border-color)] h-full transition-all duration-300`}>
      {/* Header */}
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 px-4`}>
        <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            A
          </div>
          {!collapsed && <span className="text-lg font-semibold text-[var(--accent-primary)]">AchievingCoach</span>}
        </div>
        {/* Mobile close button */}
        {!collapsed && onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Collapse Toggle - hidden on mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex absolute top-5 -right-3 w-6 h-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-full items-center justify-center hover:bg-[var(--bg-tertiary)] z-10"
      >
        <ChevronLeft className={`w-4 h-4 text-[var(--fg-muted)] transition-transform ${collapsed ? 'rotate-180' : ''}`} />
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
              onClick={handleNavClick}
              title={collapsed ? item.name : undefined}
              className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-600/20 text-[var(--accent-primary)] border-l-2 border-emerald-500 -ml-[2px]'
                  : 'text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--fg-primary)]'
              }`}
            >
              <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!collapsed && (
                <span className="flex-1">{item.name}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & User Profile */}
      {userProfile && (
        <div className="border-t border-[var(--border-color)] p-4">
          {/* Theme Toggle */}
          <div className={`mb-4 ${collapsed ? 'flex justify-center' : ''}`}>
            <ThemeToggle />
          </div>

          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-emerald-600/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {userProfile.photoURL ? (
                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[var(--accent-primary)] font-medium">
                  {userProfile.displayName?.charAt(0) || userProfile.firstName?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--fg-primary)] truncate">
                  {userProfile.displayName || `${userProfile.firstName} ${userProfile.lastName}`}
                </p>
                <p className="text-xs text-[var(--fg-muted)] truncate">{userProfile.email}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleSignOut}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button
              onClick={handleSignOut}
              className="mt-3 p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors w-full flex justify-center"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - always visible on md+ */}
      <div className="hidden md:block h-screen">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-64 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
