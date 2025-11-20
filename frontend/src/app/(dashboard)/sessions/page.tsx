'use client';

import React from 'react';
import { Calendar, Clock, Video, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

const mockSessions = [
  {
    id: '1',
    title: 'Monthly Progress Review',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '2:00 PM',
    duration: 60,
    type: 'video',
    status: 'upcoming',
    coachName: 'Dr. Sarah Johnson',
  },
  {
    id: '2',
    title: 'Goal Setting Workshop',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '10:00 AM',
    duration: 90,
    type: 'video',
    status: 'upcoming',
    coachName: 'Dr. Sarah Johnson',
  },
  {
    id: '3',
    title: 'Career Development Check-in',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    time: '3:00 PM',
    duration: 60,
    type: 'video',
    status: 'completed',
    coachName: 'Dr. Sarah Johnson',
  },
];

export default function SessionsPage() {
  const upcomingSessions = mockSessions.filter(s => s.status === 'upcoming');
  const pastSessions = mockSessions.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Sessions
            </h1>
            <p className="text-lg text-gray-600">
              View and manage your coaching sessions
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            <Plus size={20} />
            Book New Session
          </button>
        </div>

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          {upcomingSessions.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming sessions</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{session.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.time} ({session.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>Video Call with {session.coachName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Join
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Sessions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Sessions</h2>
          <div className="grid gap-4">
            {pastSessions.map((session) => (
              <div key={session.id} className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{session.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{session.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                    View Notes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
