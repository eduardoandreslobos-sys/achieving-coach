'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
}

export default function GoalsPage() {
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadGoals();
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadGoals = () => {
    // Mock data for now
    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Improve Public Speaking',
        description: 'Give 3 presentations this quarter',
        status: 'In Progress',
        deadline: '2024-12-31',
      },
      {
        id: '2',
        title: 'Learn TypeScript',
        description: 'Complete advanced TypeScript course',
        status: 'Not Started',
        deadline: '2024-11-30',
      },
    ];
    setGoals(mockGoals);
  };

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
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Goals</h2>
          <p className="text-gray-600 mt-2">Track and manage your coaching goals</p>
        </div>

        <div className="grid gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{goal.title}</h3>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Status: {goal.status}</span>
                    <span className="text-sm text-gray-500">Deadline: {goal.deadline}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
