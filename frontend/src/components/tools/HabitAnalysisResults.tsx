'use client';

import React, { useState } from 'react';
import { RefreshCw, Lightbulb, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { HabitLoop } from '@/types/habit';

interface HabitAnalysisResultsProps {
  habit: HabitLoop;
  onReset: () => void;
}

export default function HabitAnalysisResults({ habit, onReset }: HabitAnalysisResultsProps) {
  const [actionPlan, setActionPlan] = useState('');

  const getHabitColor = () => {
    switch (habit.type) {
      case 'positive': return { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', icon: '✅' };
      case 'negative': return { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-900', icon: '❌' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-900', icon: '⚪' };
    }
  };

  const colors = getHabitColor();

  // Generate insights based on habit type
  const getInsights = () => {
    if (habit.type === 'negative') {
      return {
        title: 'Breaking Down Your Habit',
        strategies: [
          {
            icon: <Zap className="w-5 h-5" />,
            title: 'Modify the Cue',
            description: 'Can you avoid or change the trigger? Make it harder to encounter.',
            color: 'text-yellow-600'
          },
          {
            icon: <RefreshCw className="w-5 h-5" />,
            title: 'Replace the Routine',
            description: 'Keep the cue and reward, but change the behavior to something healthier.',
            color: 'text-emerald-600'
          },
          {
            icon: <Target className="w-5 h-5" />,
            title: 'Find Alternative Rewards',
            description: 'Identify healthier ways to get the same benefit or feeling.',
            color: 'text-purple-600'
          }
        ]
      };
    } else {
      return {
        title: 'Strengthening Your Habit',
        strategies: [
          {
            icon: <Zap className="w-5 h-5" />,
            title: 'Make the Cue Obvious',
            description: 'Make triggers more visible and consistent to reinforce the habit.',
            color: 'text-yellow-600'
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: 'Simplify the Routine',
            description: 'Make the behavior easier to do by reducing friction and obstacles.',
            color: 'text-green-600'
          },
          {
            icon: <Target className="w-5 h-5" />,
            title: 'Enhance the Reward',
            description: 'Increase the immediate satisfaction to make the habit more attractive.',
            color: 'text-purple-600'
          }
        ]
      };
    }
  };

  const insights = getInsights();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div className={`${colors.bg} rounded-2xl p-8 border-2 ${colors.border}`}>
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{colors.icon}</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {habit.habitName}
            </h2>
            <div className="flex gap-4 text-sm">
              <span className="px-3 py-1 bg-white rounded-full font-medium">
                {habit.frequency}
              </span>
              <span className="px-3 py-1 bg-white rounded-full font-medium capitalize">
                {habit.type} habit
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* The Habit Loop */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <RefreshCw className="text-primary-600" />
          Your Habit Loop
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cue */}
          <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-yellow-600" />
              <h4 className="text-lg font-bold text-yellow-900">
                1. Cue (Trigger)
              </h4>
            </div>
            <p className="text-yellow-800">{habit.cue}</p>
          </div>

          {/* Routine */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-6 h-6 text-emerald-600" />
              <h4 className="text-lg font-bold text-blue-900">
                2. Routine (Behavior)
              </h4>
            </div>
            <p className="text-blue-800">{habit.routine}</p>
          </div>

          {/* Reward */}
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-300">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-6 h-6 text-purple-600" />
              <h4 className="text-lg font-bold text-purple-900">
                3. Reward (Benefit)
              </h4>
            </div>
            <p className="text-purple-800">{habit.reward}</p>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>The Loop:</strong> When you encounter the <span className="font-bold text-yellow-700">cue</span>, 
            you perform the <span className="font-bold text-blue-700">routine</span>, 
            which gives you the <span className="font-bold text-purple-700">reward</span>. 
            This reinforces the habit loop.
          </p>
        </div>
      </div>

      {/* Strategies */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Lightbulb className="text-primary-600" />
          {insights.title}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.strategies.map((strategy, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className={`${strategy.color} mb-3`}>
                {strategy.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {strategy.title}
              </h4>
              <p className="text-gray-600 text-sm">
                {strategy.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="bg-primary-50 rounded-xl p-8 border-2 border-primary-200">
        <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" />
          Your Action Plan
        </h3>
        <p className="text-sm text-primary-800 mb-4">
          {habit.type === 'negative' 
            ? 'Based on your habit analysis, what specific steps will you take to change this habit?' 
            : 'Based on your habit analysis, what specific steps will you take to strengthen this habit?'}
        </p>
        <textarea
          value={actionPlan}
          onChange={(e) => setActionPlan(e.target.value)}
          placeholder="Write your action plan here..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
        />
      </div>

      {/* Key Insights */}
      {habit.type === 'negative' && (
        <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-red-900 mb-2">Remember:</h4>
              <p className="text-sm text-red-800">
                You can't eliminate a craving—you can only change it. The key is to keep the same cue and reward, 
                but insert a new routine. This is the golden rule of habit change.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 justify-center pt-6">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Analyze Another Habit
        </button>
        <button
          onClick={() => window.print()}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-md"
        >
          Download Analysis
        </button>
      </div>

    </div>
  );
}
