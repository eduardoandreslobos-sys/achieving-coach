'use client';

import React from 'react';
import { Calendar, Clock, Video } from 'lucide-react';

interface Session {
  id: string;
  clientName: string;
  clientAvatar?: string;
  scheduledAt: Date;
  duration: number;
  type: 'video' | 'phone' | 'in-person';
}

interface UpcomingSessionsProps {
  sessions: Session[];
  onJoinSession?: (sessionId: string) => void;
  onViewDetails?: (sessionId: string) => void;
}

export default function UpcomingSessions({ 
  sessions, 
  onJoinSession,
  onViewDetails 
}: UpcomingSessionsProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(date);
  };

  const formatDate = (date: Date) => {
    if (!mounted) {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No upcoming sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const isToday = mounted && new Date().toDateString() === session.scheduledAt.toDateString();
        
        return (
          <div 
            key={session.id}
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {session.clientAvatar ? (
                <img 
                  src={session.clientAvatar} 
                  alt={session.clientName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                session.clientName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">
                {session.clientName}
              </h4>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(session.scheduledAt)}, {formatTime(session.scheduledAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {session.duration} min
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isToday && session.type === 'video' && (
                <button
                  onClick={() => onJoinSession?.(session.id)}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join
                </button>
              )}
              <button
                onClick={() => onViewDetails?.(session.id)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
