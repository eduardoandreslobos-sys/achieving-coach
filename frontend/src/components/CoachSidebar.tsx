'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, Calendar, UserPlus, Award, Wrench } from 'lucide-react';

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

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">AchievingCoach</h1>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
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
    </div>
  );
}
