'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MoreVertical,
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';
import { Lead, STAGE_LABELS, OpportunityStage } from '@/types/crm';
import { LeadScoreBadge, getScoreCategory } from './LeadScoreBadge';
import { BANTSummary } from './BANTQualification';
import { SalesPath } from './SalesPath';

interface LeadCardProps {
  lead: Lead;
  variant?: 'default' | 'compact' | 'kanban';
  onStageChange?: (leadId: string, newStage: OpportunityStage) => void;
  onQuickAction?: (leadId: string, action: string) => void;
  isDragging?: boolean;
}

export function LeadCard({
  lead,
  variant = 'default',
  onStageChange,
  onQuickAction,
  isDragging = false,
}: LeadCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return null;
    return timestamp.toDate().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getDaysInStage = () => {
    if (lead.daysInCurrentStage === 0) return 'Hoy';
    if (lead.daysInCurrentStage === 1) return '1 día';
    return `${lead.daysInCurrentStage} días`;
  };

  const isStalled = lead.daysInCurrentStage > 14;
  const needsFollowUp = lead.nextFollowUpDate &&
    lead.nextFollowUpDate.toDate() <= new Date();

  // Kanban card (for pipeline board)
  if (variant === 'kanban') {
    return (
      <div
        className={`bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] p-3 transition-all ${
          isDragging ? 'shadow-lg rotate-2 opacity-90' : 'hover:border-emerald-500/50'
        }`}
      >
        <Link href={`/coach/crm/leads/${lead.id}`} className="block">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-[var(--fg-primary)] truncate">
                {lead.name}
              </h4>
              {lead.company && (
                <p className="text-xs text-[var(--fg-muted)] truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {lead.company}
                </p>
              )}
            </div>
            <LeadScoreBadge
              score={lead.totalScore}
              category={lead.scoreCategory}
              size="sm"
              showScore={false}
            />
          </div>

          {/* Value & Days */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {formatCurrency(lead.estimatedValue)}
            </span>
            <span className={`flex items-center gap-1 ${
              isStalled ? 'text-red-500' : 'text-[var(--fg-muted)]'
            }`}>
              <Clock className="w-3 h-3" />
              {getDaysInStage()}
            </span>
          </div>

          {/* BANT Summary */}
          <div className="flex items-center justify-between">
            <BANTSummary bant={lead.bant} />
            {(isStalled || needsFollowUp) && (
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            )}
          </div>
        </Link>
      </div>
    );
  }

  // Compact card (for lists)
  if (variant === 'compact') {
    return (
      <Link
        href={`/coach/crm/leads/${lead.id}`}
        className="flex items-center gap-4 p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] hover:border-emerald-500/50 transition-colors"
      >
        {/* Score */}
        <LeadScoreBadge
          score={lead.totalScore}
          category={lead.scoreCategory}
          size="sm"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-[var(--fg-primary)] truncate">
              {lead.name}
            </h4>
            {lead.company && (
              <span className="text-xs text-[var(--fg-muted)] truncate">
                @ {lead.company}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--fg-muted)]">
            <span>{STAGE_LABELS[lead.stage]}</span>
            <span>•</span>
            <span>{formatCurrency(lead.estimatedValue)}</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="flex items-center gap-2">
          {isStalled && (
            <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
              Estancado
            </span>
          )}
          {needsFollowUp && (
            <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded">
              Seguimiento
            </span>
          )}
        </div>

        <ChevronRight className="w-4 h-4 text-[var(--fg-muted)]" />
      </Link>
    );
  }

  // Default card (full detail)
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Link
              href={`/coach/crm/leads/${lead.id}`}
              className="text-lg font-semibold text-[var(--fg-primary)] hover:text-emerald-600 transition-colors"
            >
              {lead.name}
            </Link>
            {lead.company && (
              <p className="text-sm text-[var(--fg-muted)] flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {lead.company}
                {lead.jobTitle && ` • ${lead.jobTitle}`}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-[var(--fg-muted)]" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-[var(--bg-primary)] rounded-lg shadow-lg border border-[var(--border-color)] z-10">
                <button
                  onClick={() => {
                    onQuickAction?.(lead.id, 'call');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]"
                >
                  <Phone className="w-4 h-4" />
                  Registrar llamada
                </button>
                <button
                  onClick={() => {
                    onQuickAction?.(lead.id, 'email');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]"
                >
                  <Mail className="w-4 h-4" />
                  Enviar email
                </button>
                <button
                  onClick={() => {
                    onQuickAction?.(lead.id, 'task');
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--fg-primary)] hover:bg-[var(--bg-secondary)]"
                >
                  <CheckSquare className="w-4 h-4" />
                  Crear tarea
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sales Path */}
        <SalesPath
          currentStage={lead.stage}
          onStageClick={onStageChange ? (stage) => onStageChange(lead.id, stage) : undefined}
          compact
        />
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-[var(--fg-muted)] mb-1">Valor</p>
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(lead.estimatedValue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--fg-muted)] mb-1">Probabilidad</p>
            <p className="text-lg font-semibold text-[var(--fg-primary)]">
              {lead.probability}%
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--fg-muted)] mb-1">Score</p>
            <LeadScoreBadge
              score={lead.totalScore}
              category={lead.scoreCategory}
            />
          </div>
        </div>

        {/* BANT & Alerts */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--fg-muted)] mb-1">Calificación BANT</p>
            <BANTSummary bant={lead.bant} />
          </div>
          <div className="flex flex-col items-end gap-1">
            {isStalled && (
              <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Estancado {getDaysInStage()}
              </span>
            )}
            {needsFollowUp && (
              <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Seguimiento pendiente
              </span>
            )}
            {lead.expectedCloseDate && (
              <span className="text-xs text-[var(--fg-muted)]">
                Cierre: {formatDate(lead.expectedCloseDate)}
              </span>
            )}
          </div>
        </div>

        {/* Notes Preview */}
        {lead.notes && (
          <div className="mt-3 p-2 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-xs text-[var(--fg-muted)] line-clamp-2">
              {lead.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          {lead.lastContactedAt && (
            <span>Último contacto: {formatDate(lead.lastContactedAt)}</span>
          )}
        </div>
        <Link
          href={`/coach/crm/leads/${lead.id}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          Ver detalle →
        </Link>
      </div>
    </div>
  );
}
