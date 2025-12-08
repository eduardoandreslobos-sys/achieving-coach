'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveToolResultComplete } from '@/lib/activityLogger';
import { CheckCircle } from 'lucide-react';

interface GROWData {
  goal: string;
  reality: string;
  options: string;
  way: string;
}

export default function GROWWorksheetPage() {
  const { userProfile } = useAuth();
  const [data, setData] = useState<GROWData>({
    goal: '',
    reality: '',
    options: '',
    way: '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      await saveToolResultComplete(
        userProfile,
        'grow-model',
        'GROW Worksheet',
        'Goal Setting',
        data
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving GROW worksheet:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GROW Worksheet</h1>
          <p className="text-gray-600">
            A powerful coaching framework to help you achieve your goals
          </p>
        </div>

        <div className="space-y-6">
          {/* Goal */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                G
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Goal</h2>
                <p className="text-sm text-gray-600">What do you want to achieve?</p>
              </div>
            </div>
            <textarea
              value={data.goal}
              onChange={(e) => setData({ ...data, goal: e.target.value })}
              placeholder="Describe your goal in specific, measurable terms..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          {/* Reality */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                R
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reality</h2>
                <p className="text-sm text-gray-600">What is your current situation?</p>
              </div>
            </div>
            <textarea
              value={data.reality}
              onChange={(e) => setData({ ...data, reality: e.target.value })}
              placeholder="Describe where you are now, what's working, what's not..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          {/* Options */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                O
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Options</h2>
                <p className="text-sm text-gray-600">What could you do?</p>
              </div>
            </div>
            <textarea
              value={data.options}
              onChange={(e) => setData({ ...data, options: e.target.value })}
              placeholder="List all possible options and strategies you could try..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>

          {/* Way Forward */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                W
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Way Forward</h2>
                <p className="text-sm text-gray-600">What will you do?</p>
              </div>
            </div>
            <textarea
              value={data.way}
              onChange={(e) => setData({ ...data, way: e.target.value })}
              placeholder="Commit to specific actions with timelines..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={4}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!data.goal || !data.reality || !data.options || !data.way}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saved && <CheckCircle size={20} />}
            {saved ? 'Saved!' : 'Save Worksheet'}
          </button>
        </div>
      </div>
    </div>
  );
}
