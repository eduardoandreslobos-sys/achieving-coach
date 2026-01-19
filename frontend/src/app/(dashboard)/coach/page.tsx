'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Link from 'next/link';
import {
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Target,
  Download,
  Heart,
  MoreHorizontal,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SkeletonBentoGrid } from '@/components/ui/Skeleton';
import logger from '@/lib/logger';

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
  upcomingSessions: { id: string; coacheeName: string; date: Date; type: string }[];
}

export default function CoachDashboard() {
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

        // Fetch coachees
        const coacheesQuery = query(
          collection(db, 'users'),
          where('role', '==', 'coachee'),
          where('coacheeInfo.coachId', '==', userProfile.uid),
          limit(50)
        );
        const coacheesSnapshot = await getDocs(coacheesQuery);
        const totalCoachees = coacheesSnapshot.size;

        // Fetch sessions
        const sessionsQuery = query(
          collection(db, 'sessions'),
          where('coachId', '==', userProfile.uid),
          limit(100)
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

        // Upcoming sessions
        const upcomingSessions = sessions
          .filter(s => {
            const date = s.scheduledDate?.toDate?.() || new Date(s.scheduledDate);
            return date >= new Date();
          })
          .sort((a, b) => {
            const dateA = a.scheduledDate?.toDate?.() || new Date(a.scheduledDate);
            const dateB = b.scheduledDate?.toDate?.() || new Date(b.scheduledDate);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3)
          .map(s => ({
            id: s.id,
            coacheeName: s.coacheeName || 'Coachee',
            date: s.scheduledDate?.toDate?.() || new Date(s.scheduledDate),
            type: s.type || 'Sesión'
          }));

        // Fetch goals
        const goalsQuery = query(collection(db, 'goals'), limit(200));
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

        // Coachee engagement
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

        // Session volume for chart
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
          goalsDelayed: delayedGoals,
          upcomingSessions
        });

      } catch (error) {
        logger.firebaseError('loadAnalytics', error, { component: 'CoachDashboard' });
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
    doc.setTextColor(16, 185, 129);
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
      headStyles: { fillColor: [16, 185, 129] },
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
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 14 },
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('AchievingCoach - Professional Coaching Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });

    const fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Loading state with skeleton
  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="skeleton-shimmer h-10 w-64 rounded-lg mb-2" />
            <div className="skeleton-shimmer h-5 w-96 rounded-lg" />
          </div>
          <SkeletonBentoGrid />
        </div>
      </div>
    );
  }

  const maxVolume = Math.max(...analytics.sessionVolume, 1);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--fg-primary)] p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header with Greeting */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-display mb-2">
              {getGreeting()}, {userProfile?.firstName || 'Coach'}
            </h1>
            <p className="text-body flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              Aquí está el resumen de tu práctica de coaching
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-1">
              {(['30', '90'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg calm-transition ${
                    timeRange === range
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  {range}d
                </button>
              ))}
              <button
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className={`px-4 py-2 text-sm font-medium rounded-lg calm-transition flex items-center gap-2 ${
                  timeRange === 'custom'
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={exportToPDF}
              className="btn-micro flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] hover:border-[var(--accent-primary)]"
              aria-label="Exportar reporte PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        {/* Custom Date Picker */}
        {showCustomPicker && (
          <div className="mb-6 p-4 glass-card inline-flex gap-4 items-end animate-fade-in">
            <div>
              <label className="text-caption block mb-2">Inicio</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="input-base rounded-xl"
              />
            </div>
            <div>
              <label className="text-caption block mb-2">Fin</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="input-base rounded-xl"
              />
            </div>
            <button
              onClick={() => { if (customStartDate && customEndDate) { setTimeRange('custom'); setShowCustomPicker(false); }}}
              className="btn-micro px-5 py-3 bg-[var(--accent-primary)] text-white rounded-xl font-medium"
            >
              Aplicar
            </button>
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4 lg:gap-6">

          {/* Stat Card 1: Coachees */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card animate-fade-in stagger-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption">Coachees Activos</span>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.activeCoachees}</p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">+{analytics.coacheesChange}%</span>
              <span className="text-[var(--fg-muted)]">vs mes anterior</span>
            </div>
          </div>

          {/* Stat Card 2: Sessions */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card animate-fade-in stagger-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption">Sesiones del Mes</span>
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.sessionsThisMonth}</p>
            <div className="flex items-center gap-1 text-sm">
              {analytics.sessionsChange >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">+{analytics.sessionsChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{analytics.sessionsChange}%</span>
                </>
              )}
              <span className="text-[var(--fg-muted)]">vs mes anterior</span>
            </div>
          </div>

          {/* Stat Card 3: Goal Completion */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card animate-fade-in stagger-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption">Metas Completadas</span>
              <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">{analytics.goalCompletionRate}%</p>
            <div className="flex items-center gap-1 text-sm">
              {analytics.goalCompletionChange >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">+{analytics.goalCompletionChange}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">{analytics.goalCompletionChange}%</span>
                </>
              )}
              <span className="text-[var(--fg-muted)]">vs mes anterior</span>
            </div>
          </div>

          {/* Stat Card 4: Engagement */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 bento-card animate-fade-in stagger-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-caption">Engagement Promedio</span>
              <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-1">
              {analytics.avgEngagement}
              <span className="text-lg text-[var(--fg-muted)]">/100</span>
            </p>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-500">+{analytics.engagementChange}</span>
              <span className="text-[var(--fg-muted)]">puntos</span>
            </div>
          </div>

          {/* Session Volume Chart - Large Card */}
          <div className="col-span-12 lg:col-span-8 bento-card animate-fade-in stagger-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-title">Volumen de Sesiones</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{analytics.sessionVolume.reduce((a, b) => a + b, 0)}</p>
                  <span className="text-[var(--accent-primary)] text-sm">sesiones en el período</span>
                </div>
              </div>
              <button className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg calm-transition">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Animated Bar Chart */}
            <div className="h-48 flex items-end gap-2">
              {analytics.sessionVolume.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg calm-transition hover:from-emerald-500 hover:to-emerald-300"
                    style={{
                      height: `${Math.max((val / maxVolume) * 100, 8)}%`,
                      transitionDelay: `${i * 50}ms`
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-[var(--fg-muted)]">
              <span>Inicio</span>
              <span>Fin del período</span>
            </div>
          </div>

          {/* Upcoming Sessions - Side Card */}
          <div className="col-span-12 lg:col-span-4 bento-card animate-fade-in stagger-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-title">Próximas Sesiones</p>
              <Link
                href="/coach/sessions"
                className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {analytics.upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {analytics.upcomingSessions.map((session, index) => (
                  <div
                    key={session.id}
                    className={`p-3 rounded-xl bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--accent-primary)] calm-transition animate-fade-in stagger-${index + 1}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[var(--fg-primary)]">{session.coacheeName}</p>
                        <p className="text-sm text-[var(--fg-muted)]">
                          {session.date.toLocaleDateString('es-CL', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-lg bg-emerald-500/10 text-[var(--accent-primary)]">
                        {session.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[var(--fg-muted)]">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay sesiones programadas</p>
              </div>
            )}
          </div>

          {/* Coachee Engagement - Medium Card */}
          <div className="col-span-12 lg:col-span-5 bento-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-title">Engagement de Coachees</p>
                <p className="text-sm text-[var(--fg-muted)]">Top 5 clientes activos</p>
              </div>
              <Link
                href="/coach/clients"
                className="text-sm text-[var(--accent-primary)] hover:underline flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {analytics.coacheeEngagement.map((coachee, index) => (
                <div key={index} className={`animate-fade-in stagger-${index + 1}`}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--fg-primary)]">{coachee.name}</span>
                    <span className="text-sm text-[var(--fg-muted)]">{coachee.rate}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${coachee.rate}%`, transitionDelay: `${index * 100}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Status - Donut Chart Card */}
          <div className="col-span-12 lg:col-span-7 bento-card animate-fade-in">
            <p className="text-title mb-6">Estado de Metas</p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Circular Progress */}
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="var(--bg-tertiary)"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${analytics.goalCompletionRate}, 100`}
                    className="calm-transition"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{analytics.goalCompletionRate}%</span>
                  <span className="text-xs text-[var(--fg-muted)] uppercase tracking-wider">Completado</span>
                </div>
              </div>

              {/* Goal Stats */}
              <div className="flex gap-6">
                <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold">{analytics.goalsActive}</p>
                  <p className="text-xs text-[var(--fg-muted)]">Activas</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-[var(--accent-primary)]">{analytics.goalsCompleted}</p>
                  <p className="text-xs text-[var(--fg-muted)]">Completadas</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-2xl font-bold text-red-400">{analytics.goalsDelayed}</p>
                  <p className="text-xs text-[var(--fg-muted)]">Retrasadas</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
