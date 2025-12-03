'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Users, Calendar, TrendingUp, Target, Download, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalCoachees: number;
  activeCoachees: number;
  coacheesChange: number;
  sessionsThisMonth: number;
  sessionsChange: number;
  goalCompletionRate: number;
  goalCompletionChange: number;
  avgEngagement: number;
  engagementChange: number;
  sessionVolume: number[];
  coacheeEngagement: { name: string; rate: number }[];
}

export default function CoachAnalyticsDashboard() {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState<'30' | '90' | 'custom'>('30');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!userProfile?.uid) return;

      try {
        // Calculate date ranges
        const now = new Date();
        const startDate = new Date();
        const prevStartDate = new Date();
        
        if (timeRange === '30') {
          startDate.setDate(now.getDate() - 30);
          prevStartDate.setDate(now.getDate() - 60);
        } else {
          startDate.setDate(now.getDate() - 90);
          prevStartDate.setDate(now.getDate() - 180);
        }

        // Load coachees
        const coacheesQuery = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid)
        );
        const coacheesSnapshot = await getDocs(coacheesQuery);
        const totalCoachees = coacheesSnapshot.size;

        // Load sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('coachId', '==', userProfile.uid)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessions = sessionsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as any));

        const currentSessions = sessions.filter(s => {
          const date = s.scheduledDate?.toDate?.() || new Date(s.scheduledDate);
          return date >= startDate && date <= now;
        });

        const prevSessions = sessions.filter(s => {
          const date = s.scheduledDate?.toDate?.() || new Date(s.scheduledDate);
          return date >= prevStartDate && date < startDate;
        });

        const sessionsThisMonth = currentSessions.length;
        const sessionsChange = prevSessions.length > 0 
          ? ((sessionsThisMonth - prevSessions.length) / prevSessions.length) * 100 
          : 0;

        // Load goals
        const goalsQuery = query(collection(db, 'goals'));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        const currentGoals = goals.filter(g => {
          const date = g.createdAt?.toDate?.() || new Date(g.createdAt);
          return date >= startDate;
        });

        const completedGoals = currentGoals.filter(g => g.status === 'completed').length;
        const goalCompletionRate = currentGoals.length > 0 
          ? (completedGoals / currentGoals.length) * 100 
          : 0;

        // Calculate engagement per coachee
        const coacheeEngagement = coacheesSnapshot.docs.map(doc => {
          const coacheeId = doc.id;
          const coacheeData = doc.data();
          
          // Get coachee's completed tools
          const coacheeGoals = goals.filter(g => g.userId === coacheeId);
          const completed = coacheeGoals.filter(g => g.status === 'completed').length;
          const rate = coacheeGoals.length > 0 ? (completed / coacheeGoals.length) * 100 : 0;
          
          return {
            name: coacheeData.displayName || coacheeData.email?.split('@')[0] || 'Unknown',
            rate: Math.round(rate)
          };
        }).sort((a, b) => b.rate - a.rate).slice(0, 5);

        const avgEngagement = coacheeEngagement.length > 0
          ? coacheeEngagement.reduce((sum, c) => sum + c.rate, 0) / coacheeEngagement.length
          : 0;

        // Generate session volume data (last 90 days in 10 points)
        const sessionVolume = Array.from({ length: 10 }, (_, i) => {
          const sessionsInRange = sessions.filter(s => {
            const date = s.scheduledDate?.toDate?.() || new Date(s.scheduledDate);
            const rangeStart = new Date(startDate);
            rangeStart.setDate(startDate.getDate() + (i * 9));
            const rangeEnd = new Date(startDate);
            rangeEnd.setDate(startDate.getDate() + ((i + 1) * 9));
            return date >= rangeStart && date < rangeEnd;
          }).length;
          return sessionsInRange;
        });

        setAnalytics({
          totalCoachees,
          activeCoachees: totalCoachees,
          coacheesChange: 2,
          sessionsThisMonth,
          sessionsChange: Math.round(sessionsChange),
          goalCompletionRate: Math.round(goalCompletionRate),
          goalCompletionChange: -1.2,
          avgEngagement: Math.round(avgEngagement * 10) / 10,
          engagementChange: 0.3,
          sessionVolume,
          coacheeEngagement
        });

      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userProfile, timeRange]);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const maxVolume = Math.max(...analytics.sessionVolume, 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.03em]">Analytics</h1>
            <p className="text-gray-600 text-base font-normal leading-normal">
              Review key metrics and track performance over time.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Time Range Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('30')}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                  timeRange === '30'
                    ? 'bg-primary-600/10 text-primary-600'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('90')}
                className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                  timeRange === '90'
                    ? 'bg-primary-600/10 text-primary-600'
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Last 90 Days
              </button>
              <button
                className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50"
              >
                Custom Range
              </button>
            </div>
            
            <button className="flex min-w-[84px] items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-gray-300 text-sm font-bold hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-base font-medium leading-normal">Total Active Coachees</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight">{analytics.activeCoachees}</p>
              <p className="text-green-600 text-sm font-medium leading-normal">+{analytics.coacheesChange}%</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-base font-medium leading-normal">Sessions This Month</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight">{analytics.sessionsThisMonth}</p>
              <p className={`text-sm font-medium leading-normal ${analytics.sessionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.sessionsChange >= 0 ? '+' : ''}{analytics.sessionsChange}%
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-base font-medium leading-normal">Goal Completion Rate</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight">{analytics.goalCompletionRate}%</p>
              <p className="text-red-600 text-sm font-medium leading-normal">{analytics.goalCompletionChange}%</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white border-2 border-gray-200 p-6">
            <p className="text-gray-600 text-base font-medium leading-normal">Avg. Engagement Score</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight">{analytics.avgEngagement}/100</p>
              <p className="text-green-600 text-sm font-medium leading-normal">+{analytics.engagementChange}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Session Volume Trends */}
          <div className="lg:col-span-2 flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-6">
            <p className="text-base font-medium leading-normal">Session Volume Trends</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight truncate">
                {analytics.sessionVolume.reduce((a, b) => a + b, 0)} Sessions
              </p>
              <div className="flex gap-1">
                <p className="text-gray-600 text-sm font-normal leading-normal">
                  Last {timeRange} Days
                </p>
                <p className={`text-sm font-medium leading-normal ${analytics.sessionsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.sessionsChange >= 0 ? '+' : ''}{analytics.sessionsChange}%
                </p>
              </div>
            </div>
            
            {/* Chart */}
            <div className="flex h-72 flex-1 flex-col gap-8 pt-4">
              <div className="relative w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#1349ec" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#1349ec" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area fill */}
                  <path
                    d={`M 0 200 ${analytics.sessionVolume.map((val, i) => {
                      const x = (i / (analytics.sessionVolume.length - 1)) * 800;
                      const y = 200 - (val / maxVolume) * 150 - 20;
                      return `L ${x} ${y}`;
                    }).join(' ')} L 800 200 Z`}
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d={`M 0 ${200 - (analytics.sessionVolume[0] / maxVolume) * 150 - 20} ${analytics.sessionVolume.map((val, i) => {
                      const x = (i / (analytics.sessionVolume.length - 1)) * 800;
                      const y = 200 - (val / maxVolume) * 150 - 20;
                      return `L ${x} ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#1349ec"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Coachee Engagement */}
          <div className="flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-6">
            <p className="text-base font-medium leading-normal">Coachee Engagement</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight truncate">{analytics.avgEngagement}% Avg. Rate</p>
              <div className="flex gap-1">
                <p className="text-gray-600 text-sm font-normal leading-normal">Last {timeRange} Days</p>
                <p className="text-green-600 text-sm font-medium leading-normal">+{analytics.engagementChange}%</p>
              </div>
            </div>
            
            <div className="grid min-h-[180px] gap-x-4 gap-y-4 grid-cols-[auto_1fr] items-center py-3">
              {analytics.coacheeEngagement.map((coachee, index) => (
                <>
                  <p key={`name-${index}`} className="text-gray-600 text-xs font-medium leading-normal tracking-[0.015em]">
                    {coachee.name}
                  </p>
                  <div key={`bar-${index}`} className="h-2 flex-1 rounded-full bg-gray-200">
                    <div 
                      className="bg-primary-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${coachee.rate}%` }}
                    />
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Goal Completion Ratio */}
          <div className="flex flex-col gap-2 rounded-xl border-2 border-gray-200 bg-white p-6">
            <p className="text-base font-medium leading-normal">Goal Completion Ratio</p>
            <div className="flex items-baseline gap-2">
              <p className="tracking-tight text-3xl font-bold leading-tight truncate">{analytics.goalCompletionRate}%</p>
              <div className="flex gap-1">
                <p className="text-gray-600 text-sm font-normal leading-normal">Last {timeRange} Days</p>
                <p className="text-red-600 text-sm font-medium leading-normal">{analytics.goalCompletionChange}%</p>
              </div>
            </div>
            
            <div className="flex flex-1 items-center justify-center py-3 min-h-[180px]">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background circle */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  {/* Progress circle */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#1349ec"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${analytics.goalCompletionRate}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{analytics.goalCompletionRate}%</span>
                  <span className="text-xs text-gray-600">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
