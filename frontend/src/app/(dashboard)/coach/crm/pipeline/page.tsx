'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Lead, OpportunityStage, STAGE_LABELS } from '@/types/crm';
import { getLeads, updateLeadStage } from '@/services/crm.service';
import { PipelineBoard } from '@/components/crm';
import { FeatureGate } from '@/components/FeatureGate';

type FilterValue = 'all' | 'hot' | 'warm' | 'neutral' | 'cold';
type SortValue = 'updated' | 'value' | 'score' | 'name';

export default function PipelinePage() {
  return (
    <FeatureGate feature="crm.pipeline" fallback="upgrade-prompt">
      <PipelineContent />
    </FeatureGate>
  );
}

function PipelineContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<FilterValue>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadLeads();
    }
  }, [user?.uid]);

  useEffect(() => {
    applyFilters();
  }, [leads, searchQuery, scoreFilter]);

  const loadLeads = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const data = await getLeads(user.uid);
      setLeads(data);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.company?.toLowerCase().includes(query)
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.scoreCategory === scoreFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleStageChange = async (leadId: string, newStage: OpportunityStage) => {
    try {
      await updateLeadStage(leadId, newStage);

      // Update local state
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                stage: newStage,
                stageChangedAt: { toDate: () => new Date() } as any,
                daysInCurrentStage: 0,
              }
            : lead
        )
      );
    } catch (error) {
      console.error('Error updating lead stage:', error);
    }
  };

  const handleAddLead = (stage: OpportunityStage) => {
    // Navigate to new lead form with pre-selected stage
    window.location.href = `/coach/crm/leads/new?stage=${stage}`;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setScoreFilter('all');
  };

  const hasActiveFilters = searchQuery || scoreFilter !== 'all';

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/coach/crm"
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--fg-muted)]" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--fg-primary)]">Pipeline</h1>
              <p className="text-sm text-[var(--fg-muted)]">
                {filteredLeads.length} de {leads.length} leads
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadLeads}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
              title="Actualizar"
            >
              <RefreshCw className={`w-5 h-5 text-[var(--fg-muted)] ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/coach/crm/leads/new"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Lead
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar leads..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex flex-wrap items-center gap-4">
              {/* Score Filter */}
              <div>
                <label className="text-xs font-medium text-[var(--fg-muted)] mb-1 block">
                  Score del Lead
                </label>
                <div className="flex gap-1">
                  {[
                    { value: 'all', label: 'Todos' },
                    { value: 'hot', label: '🔥 Caliente' },
                    { value: 'warm', label: '🌡️ Tibio' },
                    { value: 'neutral', label: '☀️ Neutral' },
                    { value: 'cold', label: '❄️ Frío' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setScoreFilter(option.value as FilterValue)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        scoreFilter === option.value
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-hidden p-4">
        <PipelineBoard
          leads={filteredLeads}
          onStageChange={handleStageChange}
          onAddLead={handleAddLead}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
