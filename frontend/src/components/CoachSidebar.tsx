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
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

const mainNavigation = [
  { name: 'Dashboard', href: '/coach', icon: LayoutDashboard },
  { name: 'Clientes', href: '/coach/clients', icon: Users },
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

const accountNav = [
  { name: 'Perfil', href: '/coach/profile', icon: User },
];

export default function CoachSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [messageCount, setMessageCount] = useState(0);

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

  const NavItem = ({ item, badge }: { item: typeof mainNavigation[0], badge?: number | null }) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
    
    return (
      <Link
        href={item.href}
        className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {item.name}
        </div>
        {badge && badge > 0 && (
          <span className="px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">{badge}</span>
        )}
      </Link>
    );
  };

  return (
    <div className="flex flex-col w-64 bg-[#0f1419] border-r border-gray-800 h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-semibold text-white">AchievingCoach</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {/* Principal */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</p>
          <div className="space-y-1">
            {mainNavigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Comunicación */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Comunicación</p>
          <div className="space-y-1">
            {communicationNav.map((item) => (
              <NavItem key={item.name} item={item} badge={item.name === 'Mensajes' ? messageCount : null} />
            ))}
          </div>
        </div>

        {/* Booking */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</p>
          <div className="space-y-1">
            {bookingNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>

        {/* Cuenta */}
        <div>
          <p className="px-3 mb-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Cuenta</p>
          <div className="space-y-1">
            {accountNav.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      {userProfile && (
        <div className="border-t border-gray-800 p-4">
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {userProfile.displayName || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Coach'}
              </p>
              <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
            </div>
            <button className="p-1 text-gray-500 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleSignOut}
            className="mt-3 w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
