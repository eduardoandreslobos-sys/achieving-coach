'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

const LIFE_AREAS = [
  'Career',
  'Finance',
  'Health',
  'Family',
  'Romance',
  'Personal Growth',
  'Fun & Recreation',
  'Physical Environment',
];

export default function WheelOfLifePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Initialize scores
        const initialScores: Record<string, number> = {};
        LIFE_AREAS.forEach(area => {
          initialScores[area] = 5;
        });
        setScores(initialScores);
      } else {
        router.push('/sign-in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleScoreChange = (area: string, value: number) => {
    setScores({ ...scores, [area]: value });
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save - en producción esto llamaría al API
    console.log('Saving Wheel of Life:', scores);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getAverageScore = () => {
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    return (total / LIFE_AREAS.length).toFixed(1);
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
              <Link href="/tools" className="text-gray-600 hover:text-primary-600">Tools</Link>
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/tools" className="text-primary-600 hover:underline mb-4 inline-block">
            ← Back to Tools
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Wheel of Life</h2>
          <p className="text-gray-600 mt-2">
            Rate your satisfaction in each life area from 1 (lowest) to 10 (highest)
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-primary-600">{getAverageScore()}</div>
            <div className="text-gray-600 mt-2">Overall Balance Score</div>
          </div>

          <div className="space-y-6">
            {LIFE_AREAS.map((area) => (
              <div key={area}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">{area}</label>
                  <span className="text-lg font-bold text-primary-600">{scores[area]}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[area] || 5}
                  onChange={(e) => handleScoreChange(area, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(scores[area] - 1) * 11.11}%, #e5e7eb ${(scores[area] - 1) * 11.11}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
            >
              {saved ? '✓ Saved!' : 'Save Progress'}
            </button>
            <Link
              href="/tools"
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Reflection Questions</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Which areas are you most satisfied with?</li>
            <li>• Which areas need more attention?</li>
            <li>• What would it take to move your lowest score up by just 1 point?</li>
            <li>• Are there areas where you're sacrificing one for another?</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
