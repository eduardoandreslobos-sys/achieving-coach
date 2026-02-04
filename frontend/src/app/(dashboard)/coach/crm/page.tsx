'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  CheckSquare,
  Plus,
  BarChart3,
  Kanban,
  List,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Lead, PipelineMetrics, STAGE_LABELS, OpportunityStage } from '@/types/crm';
import { getLeads, getPipelineMetrics } from '@/services/crm.service';
import { LeadCard, LeadScoreBadge, getScoreCategory } from '@/components/crm';
import { FeatureGate } from '@/components/FeatureGate';

export default function CRMDashboardPage() {
  return (
    <FeatureGate feature="crm.leads" fallback="upgrade-prompt">
      <CRMDashboardContent />
    </FeatureGate>
  );
}

function CRMDashboardContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user?.uid]);

  const loadData = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const [leadsData, metricsData] = await Promise.all([
        getLeads(user.uid),
        getPipelineMetrics(user.uid),
      ]);
      setLeads(leadsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get leads needing attention (no activity in 7+ days, not closed)
  const leadsNeedingAttention = leads.filter(
    (l) =>
      !['closed_won', 'closed_lost'].includes(l.stage) &&
      l.daysInCurrentStage > 7
  ).slice(0, 5);

  // Get hot leads
  const hotLeads = leads
    .filter((l) => l.scoreCategory === 'hot' && !['closed_won', 'closed_lost'].includes(l.stage))
    .slice(0, 5);

  // Get upcoming follow-ups
  const upcomingFollowUps = leads
    .filter((l) => l.nextFollowUpDate && !['closed_won', 'closed_lost'].includes(l.stage))
    .sort((a, b) => {
      const dateA = a.nextFollowUpDate?.toDate().getTime() || 0;
      const dateB = b.nextFollowUpDate?.toDate().getTime() || 0;
      return dateA - dateB;
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[var(--bg-tertiary)] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-primary)]">CRM</h1>
          <p className="text-[var(--fg-muted)]">
            Gestiona tus oportunidades de venta
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/coach/crm/leads"
            className="flex items-center gap-2 px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <List className="w-4 h-4" />
            Lista
          </Link>
          <Link
            href="/coach/crm/pipeline"
            className="flex items-center gap-2 px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <Kanban className="w-4 h-4" />
            Pipeline
          </Link>
          <Link
            href="/coach/crm/leads/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Lead
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {formatCurrency(metrics?.totalPipelineValue || 0)}
          </p>
          <p className="text-sm text-[var(--fg-muted)]">Pipeline Total</p>
        </div>

        {/* Weighted Value */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics?.weightedPipelineValue || 0)}
          </p>
          <p className="text-sm text-[var(--fg-muted)]">Valor Ponderado</p>
        </div>

        {/* Active Leads */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {leads.filter((l) => !['closed_won', 'closed_lost'].includes(l.stage)).length}
          </p>
          <p className="text-sm text-[var(--fg-muted)]">Leads Activos</p>
        </div>

        {/* Win Rate */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {Math.round((metrics?.conversionRates?.overallWinRate || 0) * 100)}%
          </p>
          <p className="text-sm text-[var(--fg-muted)]">Tasa de Conversión</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stages */}
        <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
              Pipeline por Etapa
            </h2>
            <Link
              href="/coach/crm/pipeline"
              className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Ver pipeline →
            </Link>
          </div>

          <div className="space-y-3">
            {(['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation'] as OpportunityStage[]).map(
              (stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage);
                const stageValue = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
                const maxValue = Math.max(
                  ...(['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation'] as OpportunityStage[]).map(
                    (s) =>
                      leads
                        .filter((l) => l.stage === s)
                        .reduce((sum, l) => sum + l.estimatedValue, 0)
                  ),
                  1
                );
                const percentage = (stageValue / maxValue) * 100;

                return (
                  <div key={stage} className="flex items-center gap-3">
                    <div className="w-32 flex-shrink-0">
                      <p className="text-sm font-medium text-[var(--fg-primary)]">
                        {STAGE_LABELS[stage]}
                      </p>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {stageLeads.length} leads
                      </p>
                    </div>
                    <div className="flex-1 h-8 bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-lg transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-24 text-right">
                      <p className="text-sm font-medium text-[var(--fg-primary)]">
                        {formatCurrency(stageValue)}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* Hot Leads */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
              Leads Calientes
            </h2>
            <span className="text-xs text-[var(--fg-muted)]">
              Score 80+
            </span>
          </div>

          {hotLeads.length > 0 ? (
            <div className="space-y-3">
              {hotLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/coach/crm/leads/${lead.id}`}
                  className="flex items-center justify-between p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--fg-primary)]">
                      {lead.name}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {STAGE_LABELS[lead.stage]}
                    </p>
                  </div>
                  <LeadScoreBadge
                    score={lead.totalScore}
                    category={lead.scoreCategory}
                    size="sm"
                    showScore={false}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8">
              No hay leads calientes
            </p>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stalled Deals */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
              Deals Estancados
            </h2>
          </div>

          {leadsNeedingAttention.length > 0 ? (
            <div className="space-y-2">
              {leadsNeedingAttention.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/coach/crm/leads/${lead.id}`}
                  className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--fg-primary)]">
                      {lead.name}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {STAGE_LABELS[lead.stage]} • {lead.daysInCurrentStage} días sin movimiento
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-amber-500" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8">
              Todos los deals están activos
            </p>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
              Seguimientos Próximos
            </h2>
          </div>

          {upcomingFollowUps.length > 0 ? (
            <div className="space-y-2">
              {upcomingFollowUps.map((lead) => {
                const date = lead.nextFollowUpDate?.toDate();
                const isOverdue = date && date < new Date();

                return (
                  <Link
                    key={lead.id}
                    href={`/coach/crm/leads/${lead.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isOverdue
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--fg-primary)]">
                        {lead.name}
                      </p>
                      <p className="text-xs text-[var(--fg-muted)]">
                        {date?.toLocaleDateString('es-MX', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    {isOverdue && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                        Vencido
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8">
              Sin seguimientos programados
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {metrics?.activitiesThisWeek || 0}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">Actividades esta semana</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {metrics?.tasksOverdue || 0}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">Tareas vencidas</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {leads.filter((l) => l.stage === 'closed_won').length}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">Cerrados ganados</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-[var(--fg-primary)]">
            {Math.round(metrics?.avgSalesCycle || 0)}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">Días promedio de ciclo</p>
        </div>
      </div>
    </div>
  );
}
