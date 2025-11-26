'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Plus, CheckCircle, XCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

interface Session {
  id: string;
  title: string;
  scheduledAt: Date;
  duration: number;
  type: 'video' | 'in-person' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  coachId: string;
  coacheeId: string;
  coachName?: string;
  coacheeName?: string;
  notes?: string;
  meetingLink?: string;
}

export default function SessionsPage() {
  const { user, userProfile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewSession, setShowNewSession] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as const,
    notes: '',
  });

  const isCoach = userProfile?.role === 'coach';

  useEffect(() => {
    if (user?.uid) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const fieldName = isCoach ? 'coachId' : 'coacheeId';
      const q = query(
        collection(db, 'sessions'),
        where(fieldName, '==', user.uid),
        orderBy('scheduledAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledAt: doc.data().scheduledAt?.toDate() || new Date(),
      })) as Session[];

      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    if (!user?.uid || !newSession.title.trim() || !newSession.date || !newSession.time) return;

    setSaving(true);
    try {
      const scheduledAt = new Date(`${newSession.date}T${newSession.time}`);

      await addDoc(collection(db, 'sessions'), {
        title: newSession.title.trim(),
        scheduledAt: Timestamp.fromDate(scheduledAt),
        duration: newSession.duration,
        type: newSession.type,
        status: 'scheduled',
        coachId: isCoach ? user.uid : userProfile?.coacheeInfo?.coachId || '',
        coacheeId: isCoach ? '' : user.uid,
        coachName: isCoach ? userProfile?.displayName : '',
        coacheeName: !isCoach ? userProfile?.displayName : '',
        notes: newSession.notes,
        createdAt: serverTimestamp(),
      });

      setNewSession({ title: '', date: '', time: '', duration: 60, type: 'video', notes: '' });
      setShowNewSession(false);
      await loadSessions();
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving session. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (sessionId: string, status: Session['status']) => {
    try {
      await updateDoc(doc(db, 'sessions', sessionId), {
        status,
        updatedAt: serverTimestamp(),
      });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled' && s.scheduledAt > new Date());
  const pastSessions = sessions.filter(s => s.status !== 'scheduled' || s.scheduledAt <= new Date());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Cancelled</span>;
      case 'no-show':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">No Show</span>;
      default:
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Scheduled</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Sessions</h1>
            <p className="text-lg text-gray-600">View and manage your coaching sessions</p>
          </div>
          <button 
            onClick={() => setShowNewSession(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus size={20} />
            Book New Session
          </button>
        </div>

        {/* New Session Form */}
        {showNewSession && (
          <div className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule New Session</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Session title (e.g., Weekly Check-in, Goal Review)"
                value={newSession.title}
                onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newSession.date}
                    onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <select
                    value={newSession.duration}
                    onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Session notes or agenda (optional)"
                value={newSession.notes}
                onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveSession}
                  disabled={saving || !newSession.title.trim() || !newSession.date || !newSession.time}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Schedule Session'}
                </button>
                <button
                  onClick={() => {
                    setShowNewSession(false);
                    setNewSession({ title: '', date: '', time: '', duration: 60, type: 'video', notes: '' });
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
          {upcomingSessions.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming sessions</p>
              <button
                onClick={() => setShowNewSession(true)}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Schedule your first session →
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{session.title}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{session.scheduledAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.scheduledAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} ({session.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          <span>Video Call</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Join
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(session.id, 'cancelled')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Sessions */}
        {pastSessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Sessions</h2>
            <div className="grid gap-4">
              {pastSessions.map((session) => (
                <div key={session.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{session.title}</h3>
                        {getStatusBadge(session.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{session.scheduledAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.duration} min</span>
                        </div>
                      </div>
                    </div>
                    {session.status === 'scheduled' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(session.id, 'completed')}
                          className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <CheckCircle size={16} />
                          <span className="text-sm">Completed</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(session.id, 'no-show')}
                          className="flex items-center gap-1 px-3 py-1 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <XCircle size={16} />
                          <span className="text-sm">No Show</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
