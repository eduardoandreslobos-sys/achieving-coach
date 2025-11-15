'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function DashboardPage() {
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
              <Link href="/goals" className="text-gray-600 hover:text-primary-600 font-medium">
                My Goals
              </Link>
              <Link href="/tools" className="text-gray-600 hover:text-primary-600 font-medium">
                Tools
              </Link>
              <span className="text-gray-700">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            Track your coaching journey and achieve your goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/goals" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">My Goals</h3>
            <p className="text-gray-600">Manage your objectives</p>
          </Link>
          <Link href="/tools" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Coaching Tools</h3>
            <p className="text-gray-600">Access exercises & frameworks</p>
          </Link>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Next Session</h3>
            <p className="text-gray-600">No upcoming sessions</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent activity to show</p>
        </div>
      </main>
    </div>
  );
}
