'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  MoreVertical,
  Globe,
  CalendarCheck,
  X,
  Inbox,
  Settings,
  BarChart3,
  Target,
  Kanban,
  UserPlus2,
  CreditCard,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';

const mainNavigation = [
  { name: 'Dashboard', href: '/coach', icon: LayoutDashboard },
  { name: 'Clientes', href: '/coach/clients', icon: Users },
  { name: 'Programas', href: '/coach/programs', icon: Target },
  { name: 'Herramientas', href: '/coach/tools', icon: Wrench },
  { name: 'Invitar Coachees', href: '/coach/invite', icon: UserPlus },
  { name: 'Simulador ICF', href: '/coach/icf-simulator', icon: Award },
];

const communicationNav = [
  { name: 'Mensajes', href: '/messages', icon: MessageSquare, badge: null },
  { name: 'Sesiones', href: '/coach/sessions', icon: Calendar },
];

const bookingNav = [
  { name: 'Reservas', href: '/coach/bookings', icon: CalendarCheck },
  { name: 'Booking Público', href: '/coach/booking', icon: Globe },
];

const crmNav = [
  { name: 'Dashboard', href: '/coach/crm', icon: BarChart3 },
  { name: 'Pipeline', href: '/coach/crm/pipeline', icon: Kanban },
  { name: 'Leads', href: '/coach/crm/leads', icon: UserPlus2 },
];

const directoryNav = [
  { name: 'Configuración', href: '/coach/directory-settings', icon: Settings },
  { name: 'Consultas', href: '/coach/inquiries', icon: Inbox },
];

const accountNav = [
  { name: 'Perfil', href: '/coach/profile', icon: User },
  { name: 'Facturación', href: '/coach/billing', icon: CreditCard },
];

interface CoachSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CoachSidebar({ isOpen = false, onClose }: CoachSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [messageCount, setMessageCount] = useState(0);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

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
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const NavItem = ({ item, badge }: { item: typeof mainNavigation[0], badge?: number | null }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

    return (
      <Link
        href={item.href}
        onClick={handleNavClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-emerald-600 text-white'
            : 'text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--fg-primary)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {item.name}
        </div>
        {badge && badge > 0 && (
          <span className="px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">{badge}</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col w-64 bg-[var(--bg-primary)] border-r border-[var(--border-color)] h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-[var(--fg-primary)]">AchievingCoach</span>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Principal */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">Principal</p>
          <div className="space-y-1">
            {mainNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Comunicación */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">Comunicación</p>
          <div className="space-y-1">
            {communicationNav.map((item) => (
              <NavItem key={item.name} item={item} badge={item.name === 'Mensajes' ? messageCount : null} />
            ))}
          </div>
        </div>

        {/* Booking */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">Booking</p>
          <div className="space-y-1">
            {bookingNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* CRM */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">CRM</p>
          <div className="space-y-1">
            {crmNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Directorio */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">Directorio</p>
          <div className="space-y-1">
            {directoryNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Cuenta */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">Cuenta</p>
          <div className="space-y-1">
            {accountNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      {userProfile && (
        <div className="border-t border-[var(--border-color)] p-4">
          {/* Theme Toggle */}
          <div className="mb-4">
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3">
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
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--fg-primary)] truncate">
                {userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Coach'}
              </p>
              <p className="text-xs text-[var(--fg-muted)] truncate">{userProfile.email}</p>
            </div>
            <button className="p-1 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
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
