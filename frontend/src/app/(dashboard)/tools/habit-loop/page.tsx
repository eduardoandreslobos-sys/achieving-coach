'use client';

import React, { useState } from 'react';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import HabitLoopForm from '@/components/tools/HabitLoopForm';
import HabitAnalysisResults from '@/components/tools/HabitAnalysisResults';
import { HabitLoop } from '@/types/habit';

export default function HabitLoopPage() {
  const [habit, setHabit] = useState<HabitLoop | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleComplete = (completedHabit: HabitLoop) => {
    setHabit(completedHabit);
    setShowResults(true);
  };

  const handleReset = () => {
    setHabit(null);
    setShowResults(false);
  };

  if (showResults && habit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>
        </div>
        <HabitAnalysisResults 
          habit={habit}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/tools"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6"
          >
            <ArrowLeft size={20} />
            Back to Tools
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-4 rounded-xl">
              <RefreshCw className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Habit Loop Analyzer
              </h1>
              <p className="text-gray-600 mt-1">
                Break down habits into cue, routine, and reward to understand and change them
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-purple-900 mb-3">
            Understanding the Habit Loop
          </h2>
          <div className="space-y-3 text-purple-800">
            <p>
              Every habit follows a simple neurological loop with three parts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-bold mb-1">1. Cue</h3>
                <p className="text-sm">The trigger that starts the behavior</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🔄</div>
                <h3 className="font-bold mb-1">2. Routine</h3>
                <p className="text-sm">The behavior itself</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-bold mb-1">3. Reward</h3>
                <p className="text-sm">The benefit you get from it</p>
              </div>
            </div>
            <p className="text-sm mt-4">
              This tool will help you identify each component and develop strategies to change or strengthen your habits.
            </p>
          </div>
        </div>

        {/* Form */}
        <HabitLoopForm onComplete={handleComplete} />

      </div>
    </div>
  );
}
