'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Target, Calendar, Book, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function CoacheeDashboard() {
  const { userProfile } = useAuth();
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    toolsAssigned: 0,
    toolsCompleted: 0,
    reflections: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [assignedTools, setAssignedTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.uid) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile?.uid) return;

    try {
      // Load Goals
      const goalsQuery = query(
        collection(db, 'goals'),
        where('userId', '==', userProfile.uid)
      );
      const goalsSnapshot = await getDocs(goalsQuery);
      const goalsData = goalsSnapshot.docs.map(doc => doc.data());
      const completedGoalsCount = goalsData.filter(g => g.status === 'completed').length;

      // Load Sessions
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('coacheeId', '==', userProfile.uid),
        orderBy('scheduledDate', 'asc')
      );
      const sessionsSnapshot = await getDocs(sessionsQuery);
      const sessionsData = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{id: string; status: string; scheduledDate?: any; scheduledTime?: string; title?: string; type?: string; [key: string]: any}>;
      
      const upcoming = sessionsData.filter(s => s.status === 'scheduled').slice(0, 3);
      const completed = sessionsData.filter(s => s.status === 'completed').length;

      // Load Tool Assignments
      const toolsQuery = query(
        collection(db, 'tool_assignments'),
        where('coacheeId', '==', userProfile.uid)
      );
      const toolsSnapshot = await getDocs(toolsQuery);
      const toolsData = toolsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      const completedTools = toolsData.filter(t => t.status === 'completed').length;

      // Load Reflections
      const reflectionsQuery = query(
        collection(db, 'reflections'),
        where('userId', '==', userProfile.uid)
      );
      const reflectionsSnapshot = await getDocs(reflectionsQuery);

      setStats({
        totalGoals: goalsData.length,
        completedGoals: completedGoalsCount,
        upcomingSessions: upcoming.length,
        completedSessions: completed,
        toolsAssigned: toolsData.length,
        toolsCompleted: completedTools,
        reflections: reflectionsSnapshot.size,
      });

      setUpcomingSessions(upcoming);
      setAssignedTools(toolsData.filter(t => t.status !== 'completed').slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasCoach = userProfile?.coacheeInfo?.coachId;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Good {getTimeOfDay()}, {userProfile?.firstName || 'there'}! 👋
          </h1>
          <p className="text-gray-600">Here's what's happening with your coaching journey</p>
        </div>

        {/* No Coach Warning */}
        {!hasCoach && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-bold text-yellow-900 mb-1">No Coach Assigned Yet</h3>
              <p className="text-yellow-800 text-sm mb-3">
                You need to be invited by a coach to start your coaching journey.
              </p>
              <p className="text-yellow-700 text-sm">
                Ask your coach to send you an invitation link, or contact support if you need help.
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Target}
            label="Goals"
            value={`${stats.completedGoals}/${stats.totalGoals}`}
            color="text-green-600"
            bgColor="bg-green-50"
            link="/goals"
          />
          <StatCard
            icon={Calendar}
            label="Sessions"
            value={`${stats.completedSessions}/${stats.completedSessions + stats.upcomingSessions}`}
            color="text-blue-600"
            bgColor="bg-blue-50"
            link="/sessions"
          />
          <StatCard
            icon={Book}
            label="Tools Used"
            value={`${stats.toolsCompleted}`}
            color="text-purple-600"
            bgColor="bg-purple-50"
            link="/my-tools"
          />
          <StatCard
            icon={MessageSquare}
            label="Reflections"
            value={`${stats.reflections}`}
            color="text-orange-600"
            bgColor="bg-orange-50"
            link="/reflections"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
              <Link href="/sessions" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No upcoming sessions scheduled</p>
                {hasCoach && (
                  <p className="text-gray-400 text-xs mt-2">Your coach will schedule sessions soon</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{session.title}</h3>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                        {session.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{session.scheduledDate?.toDate().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{session.scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tools to Complete */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Tools to Complete</h2>
              <Link href="/my-tools" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>

            {assignedTools.length === 0 ? (
              <div className="text-center py-8">
                <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No tools assigned yet</p>
                {hasCoach && (
                  <p className="text-gray-400 text-xs mt-2">Your coach will assign tools for you</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {assignedTools.map((tool) => (
                  <div key={tool.id} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{tool.toolName}</h3>
                      {tool.dueDate && (
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          Due: {new Date(tool.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {tool.instructions && (
                      <p className="text-sm text-gray-600 mb-3">{tool.instructions}</p>
                    )}
                    <Link
                      href={`/my-tools/${tool.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Complete Tool →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {hasCoach && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              icon={Target}
              title="Set a Goal"
              description="Define what you want to achieve"
              link="/goals"
              color="bg-green-600"
            />
            <QuickActionCard
              icon={MessageSquare}
              title="Message Coach"
              description="Get guidance and support"
              link="/messages"
              color="bg-blue-600"
            />
            <QuickActionCard
              icon={Book}
              title="Add Reflection"
              description="Journal your progress"
              link="/reflections"
              color="bg-purple-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor, link }: any) {
  return (
    <Link href={link} className="block">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={color} size={24} />
        </div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Link>
  );
}

function QuickActionCard({ icon: Icon, title, description, link, color }: any) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
          <Icon className="text-white" size={20} />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
