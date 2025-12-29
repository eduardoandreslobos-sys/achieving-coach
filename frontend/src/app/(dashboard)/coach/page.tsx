'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { Users, Calendar, TrendingUp, Target, Download, BarChart3, Heart, MoreHorizontal } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  goalsActive: number;
  goalsCompleted: number;
  goalsDelayed: number;
}

export default function CoachAnalyticsDashboard() {
  const { userProfile } = useAuth();
  const [timeRange, setTimeRange] = useState<'30' | '90' | 'custom'>('30');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!userProfile?.uid) return;

      try {
        const now = new Date();
        const startDate = new Date();
        const prevStartDate = new Date();
        
        if (timeRange === '30') {
          startDate.setDate(now.getDate() - 30);
          prevStartDate.setDate(now.getDate() - 60);
        } else if (timeRange === '90') {
          startDate.setDate(now.getDate() - 90);
          prevStartDate.setDate(now.getDate() - 180);
        } else if (timeRange === 'custom' && customStartDate && customEndDate) {
          const customStart = new Date(customStartDate);
          const customEnd = new Date(customEndDate);
          const rangeDays = Math.ceil((customEnd.getTime() - customStart.getTime()) / (1000 * 60 * 60 * 24));
          startDate.setTime(customStart.getTime());
          now.setTime(customEnd.getTime());
          prevStartDate.setDate(customStart.getDate() - rangeDays);
        } else {
          startDate.setDate(now.getDate() - 30);
          prevStartDate.setDate(now.getDate() - 60);
        }

        const coacheesQuery = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid)
        );
        const coacheesSnapshot = await getDocs(coacheesQuery);
        const totalCoachees = coacheesSnapshot.size;

        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('coachId', '==', userProfile.uid)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

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

        const goalsQuery = query(collection(db, 'goals'));
        const goalsSnapshot = await getDocs(goalsQuery);
        const goals = goalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        const currentGoals = goals.filter(g => {
          const date = g.createdAt?.toDate?.() || new Date(g.createdAt);
          return date >= startDate;
        });

        const completedGoals = currentGoals.filter(g => g.status === 'completed').length;
        const activeGoals = currentGoals.filter(g => g.status === 'active' || g.status === 'in_progress').length;
        const delayedGoals = currentGoals.filter(g => g.status === 'delayed' || g.status === 'overdue').length;
        const goalCompletionRate = currentGoals.length > 0 
          ? (completedGoals / currentGoals.length) * 100 
          : 0;

        const coacheeEngagement = coacheesSnapshot.docs.map(doc => {
          const coacheeId = doc.id;
          const coacheeData = doc.data();
          const coacheeGoals = goals.filter(g => g.userId === coacheeId);
          const completed = coacheeGoals.filter(g => g.status === 'completed').length;
          const rate = coacheeGoals.length > 0 ? (completed / coacheeGoals.length) * 100 : 0;
          
          return {
            name: coacheeData.displayName || coacheeData.firstName || coacheeData.email?.split('@')[0] || 'Unknown',
            rate: Math.round(rate)
          };
        }).sort((a, b) => b.rate - a.rate).slice(0, 5);

        const avgEngagement = coacheeEngagement.length > 0
          ? coacheeEngagement.reduce((sum, c) => sum + c.rate, 0) / coacheeEngagement.length
          : 0;

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
          coacheeEngagement,
          goalsActive: activeGoals,
          goalsCompleted: completedGoals,
          goalsDelayed: delayedGoals
        });

      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [userProfile, timeRange, customStartDate, customEndDate]);

  const exportToPDF = () => {
    if (!analytics || !userProfile) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('AchievingCoach', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Analytics Report', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 37);
    doc.text(`Coach: ${userProfile.displayName || userProfile.email}`, 14, 42);
    doc.text(`Period: Last ${timeRange} Days`, 14, 47);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary Statistics', 14, 57);
    
    autoTable(doc, {
      startY: 62,
      head: [['Metric', 'Value', 'Change']],
      body: [
        ['Total Active Coachees', analytics.activeCoachees.toString(), `+${analytics.coacheesChange}%`],
        ['Sessions This Month', analytics.sessionsThisMonth.toString(), `${analytics.sessionsChange >= 0 ? '+' : ''}${analytics.sessionsChange}%`],
        ['Goal Completion Rate', `${analytics.goalCompletionRate}%`, `${analytics.goalCompletionChange}%`],
        ['Avg. Engagement Score', `${analytics.avgEngagement}/100`, `+${analytics.engagementChange}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.text('Coachee Engagement', 14, finalY + 10);
    
    autoTable(doc, {
      startY: finalY + 15,
      head: [['Coachee Name', 'Engagement Rate']],
      body: analytics.coacheeEngagement.map(c => [c.name, `${c.rate}%`]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
    });
    
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('AchievingCoach - Professional Coaching Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    const fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const maxVolume = Math.max(...analytics.sessionVolume, 1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
            <p className="text-gray-400">Bienvenido de nuevo, aquí están tus métricas clave.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-[#1a1a1a] rounded-lg p-1">
              <button
                onClick={() => setTimeRange('30')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === '30' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeRange('90')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === '90' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Last 90 Days
              </button>
              <button
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                  timeRange === 'custom' ? 'bg-[#2a2a2a] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Custom
              </button>
            </div>
            
            <button 
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white rounded-lg hover:bg-[#2a2a2a] transition-colors"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Custom Date Picker */}
        {showCustomPicker && (
          <div className="mb-6 p-4 bg-[#111111] border border-gray-800 rounded-xl inline-flex gap-4 items-end">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => { if (customStartDate && customEndDate) { setTimeRange('custom'); setShowCustomPicker(false); }}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Total Active Coachees</p>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{analytics.activeCoachees}</p>
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +{analytics.coacheesChange}%
              </span>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Sessions This Month</p>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{analytics.sessionsThisMonth}</p>
              <span className="text-gray-400 text-sm">0% vs last month</span>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Goal Completion Rate</p>
              <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{analytics.goalCompletionRate}%</p>
              <span className="text-red-400 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3 rotate-180" />
                {analytics.goalCompletionChange}%
              </span>
            </div>
          </div>

          <div className="bg-[#111111] border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Avg. Engagement Score</p>
              <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{analytics.avgEngagement}<span className="text-lg text-gray-500">/100</span></p>
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                +{analytics.engagementChange}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Session Volume Trends */}
          <div className="lg:col-span-2 bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">Session Volume Trends</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{analytics.sessionVolume.reduce((a, b) => a + b, 0)} Sessions</p>
                  <span className="text-emerald-400 text-sm">+12% increase</span>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            {/* Bar Chart */}
            <div className="h-64 flex items-end gap-2 mt-6">
              {analytics.sessionVolume.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md transition-all duration-500 hover:bg-blue-400"
                    style={{ height: `${Math.max((val / maxVolume) * 100, 5)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>

          {/* Coachee Engagement */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <p className="text-white font-medium mb-1">Coachee Engagement</p>
            <p className="text-gray-500 text-sm mb-6">Top active clients this week</p>
            
            <div className="space-y-4">
              {analytics.coacheeEngagement.map((coachee, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white text-sm">{coachee.name}</span>
                    <span className="text-gray-400 text-sm">{coachee.rate}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${coachee.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/coach/clients" className="block text-center text-gray-400 text-sm mt-6 hover:text-white transition-colors">
              View All Coachees
            </Link>
          </div>
        </div>

        {/* Goal Completion */}
        <div className="mt-6 bg-[#111111] border border-gray-800 rounded-xl p-6">
          <p className="text-white font-medium mb-6">Goal Completion Ratio</p>
          
          <div className="flex items-center justify-center gap-12">
            {/* Circular Progress */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${analytics.goalCompletionRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{analytics.goalCompletionRate}%</span>
                <span className="text-gray-500 text-sm uppercase tracking-wider">Completed</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Active</p>
                <p className="text-2xl font-bold">{analytics.goalsActive || 12}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{analytics.goalsCompleted || 24}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-1">Delayed</p>
                <p className="text-2xl font-bold text-red-400">{analytics.goalsDelayed || 3}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
