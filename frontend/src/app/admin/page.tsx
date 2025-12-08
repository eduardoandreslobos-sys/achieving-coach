'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, FileText, Target, TrendingUp, TrendingDown, Calendar, Activity } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalCoaches: number;
  totalCoachees: number;
  totalSessions: number;
  totalToolResults: number;
  totalBlogPosts: number;
  newUsersThisWeek: number;
  newUsersLastWeek: number;
}

interface RecentUser {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  role: string;
  createdAt: Date;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'tool_completed' | 'session_created' | 'blog_published';
  description: string;
  createdAt: Date;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCoaches: 0,
    totalCoachees: 0,
    totalSessions: 0,
    totalToolResults: 0,
    totalBlogPosts: 0,
    newUsersThisWeek: 0,
    newUsersLastWeek: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const coaches = users.filter(u => u.role === 'coach').length;
      const coachees = users.filter(u => u.role === 'coachee').length;

      // Calculate new users this week vs last week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      const newUsersThisWeek = users.filter(u => u.createdAt >= oneWeekAgo).length;
      const newUsersLastWeek = users.filter(u => u.createdAt >= twoWeeksAgo && u.createdAt < oneWeekAgo).length;

      // Load sessions
      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      
      // Load tool results
      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));
      
      // Load blog posts
      const blogSnapshot = await getDocs(collection(db, 'blog_posts'));

      setStats({
        totalUsers: users.length,
        totalCoaches: coaches,
        totalCoachees: coachees,
        totalSessions: sessionsSnapshot.size,
        totalToolResults: toolResultsSnapshot.size,
        totalBlogPosts: blogSnapshot.size,
        newUsersThisWeek,
        newUsersLastWeek,
      });

      // Recent users (sorted by createdAt)
      const sortedUsers = users
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map(u => ({
          id: u.id,
          email: u.email,
          displayName: u.displayName,
          firstName: u.firstName,
          role: u.role,
          createdAt: u.createdAt,
        }));
      setRecentUsers(sortedUsers);

      // Build recent activity from multiple sources
      const activities: RecentActivity[] = [];

      // Add recent user signups
      users.slice(0, 3).forEach(u => {
        activities.push({
          id: `user-${u.id}`,
          type: 'user_signup',
          description: `${u.displayName || u.firstName || u.email} signed up as ${u.role}`,
          createdAt: u.createdAt,
        });
      });

      // Add recent tool completions
      const toolResults = toolResultsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completedAt: doc.data().completedAt?.toDate() || new Date(),
      }));
      toolResults.slice(0, 3).forEach(t => {
        activities.push({
          id: `tool-${t.id}`,
          type: 'tool_completed',
          description: `${t.toolId || 'Tool'} completed`,
          createdAt: t.completedAt,
        });
      });

      // Sort all activities by date
      activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setRecentActivity(activities.slice(0, 8));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const userGrowth = calculateGrowth(stats.newUsersThisWeek, stats.newUsersLastWeek);
  const isPositiveGrowth = parseFloat(userGrowth) >= 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">Here's a summary of platform activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Coaches */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Total Active Coaches</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalCoaches.toLocaleString()}</div>
              <div className={`text-sm mt-1 flex items-center gap-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveGrowth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositiveGrowth ? '+' : ''}{userGrowth}% vs last week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Coachees */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Total Active Coachees</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalCoachees.toLocaleString()}</div>
              <div className="text-sm mt-1 text-gray-500">
                {stats.totalUsers} total users
              </div>
            </div>
          </div>
        </div>

        {/* New Sign-ups */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">New Sign-ups</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">+{stats.newUsersThisWeek}</div>
              <div className={`text-sm mt-1 flex items-center gap-1 ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveGrowth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>in last 7 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Completions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Tool Completions</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalToolResults.toLocaleString()}</div>
              <div className="text-sm mt-1 text-gray-500">
                {stats.totalSessions} sessions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Sign-ups */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Sign-ups</h2>
            <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Manage Users →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <div key={user.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {(user.displayName || user.firstName || user.email)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.displayName || user.firstName || user.email}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'coach' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      {user.createdAt?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                No users yet
              </div>
            )}
          </div>
        </div>

        {/* Content Engagement */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Content Overview</h2>
            <Link href="/admin/blog" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Manage Content →
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="text-sm font-medium text-gray-600">Blog Posts</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalBlogPosts}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalSessions}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Tools Used</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalToolResults}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Total Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
