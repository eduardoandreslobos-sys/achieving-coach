'use client';

import { useState, useCallback } from 'react';
import { Plus, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lead, OpportunityStage, STAGE_LABELS, STAGE_PROBABILITIES } from '@/types/crm';
import { LeadCard } from './LeadCard';

interface PipelineBoardProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: OpportunityStage) => Promise<void>;
  onAddLead?: (stage: OpportunityStage) => void;
  isLoading?: boolean;
}

const activeStages: OpportunityStage[] = [
  'prospecting',
  'qualification',
  'needs_analysis',
  'proposal',
  'negotiation',
];

const closedStages: OpportunityStage[] = ['closed_won', 'closed_lost'];

interface PipelineColumnProps {
  stage: OpportunityStage;
  leads: Lead[];
  onStageChange: (leadId: string, newStage: OpportunityStage) => Promise<void>;
  onAddLead?: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stage: OpportunityStage) => void;
  isDropTarget: boolean;
}

function PipelineColumn({
  stage,
  leads,
  onStageChange,
  onAddLead,
  onDragOver,
  onDrop,
  isDropTarget,
}: PipelineColumnProps) {
  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const weightedValue = leads.reduce(
    (sum, lead) => sum + lead.estimatedValue * (lead.probability / 100),
    0
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const isClosedStage = stage === 'closed_won' || stage === 'closed_lost';

  return (
    <div
      className={`flex-shrink-0 w-72 flex flex-col bg-[var(--bg-secondary)] rounded-xl transition-all ${
        isDropTarget ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
    >
      {/* Column Header */}
      <div className={`p-3 rounded-t-xl ${
        isClosedStage
          ? stage === 'closed_won'
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
          : 'bg-[var(--bg-tertiary)]'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-semibold ${
              isClosedStage
                ? stage === 'closed_won'
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-red-700 dark:text-red-300'
                : 'text-[var(--fg-primary)]'
            }`}>
              {STAGE_LABELS[stage]}
            </h3>
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
              isClosedStage
                ? stage === 'closed_won'
                  ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}>
              {leads.length}
            </span>
          </div>
          {!isClosedStage && (
            <span className="text-xs text-[var(--fg-muted)]">
              {STAGE_PROBABILITIES[stage]}%
            </span>
          )}
        </div>
        {!isClosedStage && (
          <div className="text-xs text-[var(--fg-muted)]">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalValue)}
            </span>
            <span className="mx-1">•</span>
            <span>Ponderado: {formatCurrency(weightedValue)}</span>
          </div>
        )}
      </div>

      {/* Cards Container */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px] max-h-[calc(100vh-300px)]">
        {leads.map((lead) => (
          <div
            key={lead.id}
            draggable={!isClosedStage}
            onDragStart={(e) => {
              e.dataTransfer.setData('leadId', lead.id);
              e.dataTransfer.effectAllowed = 'move';
            }}
            className={!isClosedStage ? 'cursor-grab active:cursor-grabbing' : ''}
          >
            <LeadCard
              lead={lead}
              variant="kanban"
              onStageChange={onStageChange}
            />
          </div>
        ))}

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-[var(--border-color)] rounded-lg">
            <p className="text-sm text-[var(--fg-muted)]">Sin leads</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      {!isClosedStage && onAddLead && (
        <div className="p-2 border-t border-[var(--border-color)]">
          <button
            onClick={onAddLead}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar lead
          </button>
        </div>
      )}
    </div>
  );
}

export function PipelineBoard({
  leads,
  onStageChange,
  onAddLead,
  isLoading = false,
}: PipelineBoardProps) {
  const [dropTarget, setDropTarget] = useState<OpportunityStage | null>(null);
  const [showClosedStages, setShowClosedStages] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getLeadsByStage = useCallback(
    (stage: OpportunityStage) => {
      return leads.filter((lead) => lead.stage === stage);
    },
    [leads]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, newStage: OpportunityStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const lead = leads.find((l) => l.id === leadId);

    if (!lead || lead.stage === newStage) {
      setDropTarget(null);
      return;
    }

    setIsUpdating(true);
    try {
      await onStageChange(leadId, newStage);
    } finally {
      setIsUpdating(false);
      setDropTarget(null);
    }
  };

  const handleDragEnter = (stage: OpportunityStage) => {
    setDropTarget(stage);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  // Calculate totals
  const activePipelineValue = leads
    .filter((l) => !closedStages.includes(l.stage))
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const weightedPipelineValue = leads
    .filter((l) => !closedStages.includes(l.stage))
    .reduce((sum, l) => sum + l.estimatedValue * (l.probability / 100), 0);

  const wonValue = leads
    .filter((l) => l.stage === 'closed_won')
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pipeline Summary */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-[var(--bg-secondary)] rounded-xl">
        <div>
          <p className="text-xs text-[var(--fg-muted)]">Pipeline Activo</p>
          <p className="text-xl font-bold text-[var(--fg-primary)]">
            {formatCurrency(activePipelineValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--fg-muted)]">Valor Ponderado</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(weightedPipelineValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--fg-muted)]">Cerrado Ganado</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(wonValue)}
          </p>
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setShowClosedStages(!showClosedStages)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
          >
            {showClosedStages ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                Ocultar cerrados
              </>
            ) : (
              <>
                Ver cerrados
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto" />
            <p className="text-sm text-[var(--fg-muted)] mt-2">Actualizando...</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {/* Active Stages */}
        {activeStages.map((stage) => (
          <div
            key={stage}
            onDragEnter={() => handleDragEnter(stage)}
            onDragLeave={handleDragLeave}
          >
            <PipelineColumn
              stage={stage}
              leads={getLeadsByStage(stage)}
              onStageChange={onStageChange}
              onAddLead={onAddLead ? () => onAddLead(stage) : undefined}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDropTarget={dropTarget === stage}
            />
          </div>
        ))}

        {/* Closed Stages */}
        {showClosedStages && (
          <>
            <div className="w-px bg-[var(--border-color)] mx-2" />
            {closedStages.map((stage) => (
              <div
                key={stage}
                onDragEnter={() => handleDragEnter(stage)}
                onDragLeave={handleDragLeave}
              >
                <PipelineColumn
                  stage={stage}
                  leads={getLeadsByStage(stage)}
                  onStageChange={onStageChange}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDropTarget={dropTarget === stage}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
