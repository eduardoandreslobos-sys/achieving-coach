'use client';

import React from 'react';
import { TrendingUp, Target, Calendar, CheckCircle } from 'lucide-react';

interface ProgressData {
  goalsCompleted: number;
  totalGoals: number;
  sessionsAttended: number;
  totalSessions: number;
  toolsUsed: number;
  reflectionsWritten: number;
}

interface ProgressOverviewProps {
  data: ProgressData;
}

export default function ProgressOverview({ data }: ProgressOverviewProps) {
  const goalsProgress = (data.goalsCompleted / data.totalGoals) * 100;
  const sessionsProgress = (data.sessionsAttended / data.totalSessions) * 100;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="text-primary-600" />
        Your Progress Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Goals Completed */}
        <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-xs font-medium text-green-900">Goals</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {data.goalsCompleted}/{data.totalGoals}
          </p>
          <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
            <div 
              className="bg-green-600 h-1.5 rounded-full transition-all"
              style={{ width: `${goalsProgress}%` }}
            />
          </div>
        </div>

        {/* Sessions Attended */}
        <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Sessions</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {data.sessionsAttended}/{data.totalSessions}
          </p>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${sessionsProgress}%` }}
            />
          </div>
        </div>

        {/* Tools Used */}
        <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-medium text-purple-900">Tools Used</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {data.toolsUsed}
          </p>
          <p className="text-xs text-purple-700 mt-1">Completed</p>
        </div>

        {/* Reflections */}
        <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-900">Reflections</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {data.reflectionsWritten}
          </p>
          <p className="text-xs text-yellow-700 mt-1">This month</p>
        </div>
      </div>
    </div>
  );
}
