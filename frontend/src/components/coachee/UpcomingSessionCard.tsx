'use client';

import React from 'react';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';

interface Session {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: number;
  type: 'video' | 'in-person' | 'phone';
  location?: string;
  coachName: string;
}

interface UpcomingSessionCardProps {
  session: Session | null;
}

export default function UpcomingSessionCard({ session }: UpcomingSessionCardProps) {
  if (!session) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="text-primary-600" />
          Next Session
        </h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming sessions scheduled</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Schedule a Session
          </button>
        </div>
      </div>
    );
  }

  const isToday = new Date().toDateString() === session.date.toDateString();
  const timeUntil = session.date.getTime() - new Date().getTime();
  const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border-2 border-primary-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="text-primary-600" />
        Next Session
      </h3>

      <div className="bg-white rounded-lg p-4 mb-4">
        <h4 className="font-bold text-gray-900 mb-2">{session.title}</h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{session.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{session.time} ({session.duration} min)</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            {session.type === 'video' && <Video className="w-4 h-4 text-gray-500" />}
            {session.type === 'in-person' && <MapPin className="w-4 h-4 text-gray-500" />}
            <span className="capitalize">{session.type}</span>
            {session.location && <span className="text-gray-500">• {session.location}</span>}
          </div>
        </div>
      </div>

      {isToday && hoursUntil <= 2 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-green-900">
            🎉 Your session starts in {hoursUntil > 0 ? `${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}` : 'less than an hour'}!
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {session.type === 'video' && (
          <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            Join Video Call
          </button>
        )}
        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          View Details
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-3 text-center">
        With {session.coachName}
      </p>
    </div>
  );
}
