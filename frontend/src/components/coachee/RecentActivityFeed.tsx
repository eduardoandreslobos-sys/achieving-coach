'use client';

import React from 'react';
import { Activity, Calendar, Target, FileText, CheckCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'session' | 'goal' | 'reflection' | 'tool';
  title: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

export default function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'session': return Calendar;
      case 'goal': return Target;
      case 'reflection': return FileText;
      case 'tool': return CheckCircle;
      default: return Activity;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-blue-100 text-blue-600';
      case 'goal': return 'bg-green-100 text-green-600';
      case 'reflection': return 'bg-yellow-100 text-yellow-600';
      case 'tool': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="text-primary-600" />
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);

            return (
              <div key={activity.id} className="flex gap-3">
                <div className={`${colorClass} p-2 rounded-lg h-fit`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
