'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

const TOOLS = [
  {
    id: 'wheel-of-life',
    name: 'Wheel of Life',
    description: 'Visualize and assess balance across key life areas',
    category: 'Self-Assessment',
    icon: '🎯',
  },
  {
    id: 'grow-model',
    name: 'GROW Model Worksheet',
    description: 'Goal, Reality, Options, Will - structured coaching framework',
    category: 'Goal Setting',
    icon: '📈',
  },
  {
    id: 'values-clarification',
    name: 'Values Clarification Matrix',
    description: 'Identify and prioritize your core values',
    category: 'Self-Discovery',
    icon: '💎',
  },
  {
    id: 'habit-loop',
    name: 'Habit Loop Analyzer',
    description: 'Break down habits into cue, routine, and reward',
    category: 'Behavior Change',
    icon: '🔄',
  },
];

export default function ToolsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-600">AchievingCoach</h1>
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600">Dashboard</Link>
              <Link href="/goals" className="text-gray-600 hover:text-primary-600">My Goals</Link>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Tools & Exercises</h2>
          <p className="text-gray-600 mt-2">
            Powerful coaching tools to support your growth journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{tool.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                  <span className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tool.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
