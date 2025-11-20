'use client';

import React from 'react';
import { Calendar, Target, FileText, Wrench, MessageCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  {
    icon: Target,
    label: 'Add Goal',
    href: '/goals',
    color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
  },
  {
    icon: Calendar,
    label: 'Book Session',
    href: '/sessions',
    color: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
  },
  {
    icon: FileText,
    label: 'Write Reflection',
    href: '/reflections',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
  },
  {
    icon: Wrench,
    label: 'Use a Tool',
    href: '/tools',
    color: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
  },
  {
    icon: MessageCircle,
    label: 'Message Coach',
    href: '/messages',
    color: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
  },
  {
    icon: BookOpen,
    label: 'View Resources',
    href: '/resources',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
  },
];

export default function QuickActionsWidget() {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium text-center">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
