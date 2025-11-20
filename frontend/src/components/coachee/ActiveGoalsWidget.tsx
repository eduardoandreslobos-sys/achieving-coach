'use client';

import React from 'react';
import { Target, Clock } from 'lucide-react';
import Link from 'next/link';

interface Goal {
  id: string;
  title: string;
  progress: number;
  dueDate: Date;
  category: string;
}

interface ActiveGoalsWidgetProps {
  goals: Goal[];
}

export default function ActiveGoalsWidget({ goals }: ActiveGoalsWidgetProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="text-primary-600" />
          Active Goals
        </h3>
        <Link 
          href="/goals"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All →
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No active goals yet</p>
          <Link
            href="/goals"
            className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.slice(0, 3).map((goal) => {
            const daysUntilDue = Math.ceil((goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysUntilDue <= 7;

            return (
              <div key={goal.id} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-primary-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{goal.title}</h4>
                    <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full mt-1">
                      {goal.category}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-primary-600">
                    {goal.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 text-xs">
                  <Clock className={`w-3 h-3 ${isUrgent ? 'text-red-600' : 'text-gray-500'}`} />
                  <span className={isUrgent ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {daysUntilDue > 0 ? `${daysUntilDue} days left` : 'Due today'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
