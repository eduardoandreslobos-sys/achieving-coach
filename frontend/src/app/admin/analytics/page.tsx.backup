'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrendingUp, Users, Target, Calendar, Activity, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  usersByWeek: { week: string; count: number }[];
  toolUsage: { tool: string; count: number }[];
  roleDistribution: { role: string; count: number }[];
  sessionStats: { total: number; thisMonth: number; lastMonth: number };
  topTools: { name: string; completions: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        ...(doc.data() as { role?: string }),
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      // Calculate users by week (last 8 weeks)
      const usersByWeek: { week: string; count: number }[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - 7);
        const weekEnd = new Date();
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const count = users.filter(u => 
          u.createdAt >= weekStart && u.createdAt < weekEnd
        ).length;
        
        usersByWeek.push({
          week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          count
        });
      }

      // Role distribution
      const roleDistribution = [
        { role: 'Coaches', count: users.filter(u => u.role === 'coach').length },
        { role: 'Coachees', count: users.filter(u => u.role === 'coachee').length },
        { role: 'Admins', count: users.filter(u => u.role === 'admin').length },
      ];

      // Load tool results
      const toolResultsSnapshot = await getDocs(collection(db, 'tool_results'));
      const toolResults = toolResultsSnapshot.docs.map(doc => doc.data());

      // Tool usage aggregation
      const toolCounts: Record<string, number> = {};
      toolResults.forEach(result => {
        const toolId = result.toolId || 'unknown';
        toolCounts[toolId] = (toolCounts[toolId] || 0) + 1;
      });

      const topTools = Object.entries(toolCounts)
        .map(([name, completions]) => ({ name: formatToolName(name), completions }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 5);

      // Sessions stats
      const sessionsSnapshot = await getDocs(collection(db, 'sessions'));
      const sessions = sessionsSnapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const sessionStats = {
        total: sessions.length,
        thisMonth: sessions.filter(s => s.createdAt >= thisMonthStart).length,
        lastMonth: sessions.filter(s => s.createdAt >= lastMonthStart && s.createdAt <= lastMonthEnd).length,
      };

      setData({
        usersByWeek,
        toolUsage: topTools.map(t => ({ tool: t.name, count: t.completions })),
        roleDistribution,
        sessionStats,
        topTools,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatToolName = (toolId: string) => {
    return toolId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const maxUserCount = Math.max(...(data?.usersByWeek.map(w => w.count) || [1]), 1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Platform performance and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Total Users</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.roleDistribution.reduce((sum, r) => sum + r.count, 0) || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Tool Completions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.toolUsage.reduce((sum, t) => sum + t.count, 0) || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Sessions This Month</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data?.sessionStats.thisMonth || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-500">Avg. Tools/User</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {data && data.roleDistribution.reduce((sum, r) => sum + r.count, 0) > 0
              ? (data.toolUsage.reduce((sum, t) => sum + t.count, 0) / data.roleDistribution.reduce((sum, r) => sum + r.count, 0)).toFixed(1)
              : '0'}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">User Signups (Last 8 Weeks)</h2>
          <div className="flex items-end gap-2 h-48">
            {data?.usersByWeek.map((week, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-500 rounded-t transition-all duration-300 hover:bg-primary-600"
                  style={{ height: `${(week.count / maxUserCount) * 100}%`, minHeight: week.count > 0 ? '8px' : '2px' }}
                ></div>
                <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">{week.week}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">User Distribution</h2>
          <div className="space-y-4">
            {data?.roleDistribution.map((role, index) => {
              const total = data.roleDistribution.reduce((sum, r) => sum + r.count, 0);
              const percentage = total > 0 ? (role.count / total) * 100 : 0;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
              return (
                <div key={role.role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{role.role}</span>
                    <span className="text-gray-500">{role.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${colors[index]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Tools */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-6">Most Used Tools</h2>
        {data?.topTools && data.topTools.length > 0 ? (
          <div className="space-y-4">
            {data.topTools.map((tool, index) => {
              const maxCompletions = data.topTools[0].completions || 1;
              const percentage = (tool.completions / maxCompletions) * 100;
              return (
                <div key={tool.name} className="flex items-center gap-4">
                  <span className="w-6 text-sm font-medium text-gray-400">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{tool.name}</span>
                      <span className="text-gray-500">{tool.completions} completions</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-primary-400 to-primary-600"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No tool completions yet</p>
        )}
      </div>
    </div>
  );
}
