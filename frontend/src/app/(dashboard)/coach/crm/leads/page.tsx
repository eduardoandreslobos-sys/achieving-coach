'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  Download,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Lead, OpportunityStage, STAGE_LABELS } from '@/types/crm';
import { getLeads, deleteLead } from '@/services/crm.service';
import { LeadCard, LeadScoreBadge } from '@/components/crm';
import { FeatureGate } from '@/components/FeatureGate';

type ViewMode = 'list' | 'cards';
type SortField = 'updatedAt' | 'estimatedValue' | 'totalScore' | 'name';
type SortOrder = 'asc' | 'desc';

export default function LeadsListPage() {
  return (
    <FeatureGate feature="crm.leads" fallback="upgrade-prompt">
      <LeadsListContent />
    </FeatureGate>
  );
}

function LeadsListContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<OpportunityStage | 'all'>('all');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'hot' | 'warm' | 'neutral' | 'cold'>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      loadLeads();
    }
  }, [user?.uid]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [leads, searchQuery, stageFilter, scoreFilter, sortField, sortOrder]);

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

  const applyFiltersAndSort = () => {
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

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.stage === stageFilter);
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.scoreCategory === scoreFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'estimatedValue':
          comparison = a.estimatedValue - b.estimatedValue;
          break;
        case 'totalScore':
          comparison = a.totalScore - b.totalScore;
          break;
        case 'updatedAt':
          comparison =
            (a.updatedAt?.toDate().getTime() || 0) -
            (b.updatedAt?.toDate().getTime() || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredLeads(filtered);
  };

  const handleDelete = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStageFilter('all');
    setScoreFilter('all');
  };

  const hasActiveFilters = searchQuery || stageFilter !== 'all' || scoreFilter !== 'all';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
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
        <div className="flex items-center gap-3">
          <Link
            href="/coach/crm"
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--fg-muted)]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--fg-primary)]">Leads</h1>
            <p className="text-sm text-[var(--fg-muted)]">
              {filteredLeads.length} de {leads.length} leads
            </p>
          </div>
        </div>
        <Link
          href="/coach/crm/leads/new"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Lead
        </Link>
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
            placeholder="Buscar por nombre, email o empresa..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* View Toggle */}
        <div className="flex bg-[var(--bg-secondary)] rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-sm'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'cards'
                ? 'bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-sm'
                : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
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
        </button>

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
        <div className="p-4 bg-[var(--bg-secondary)] rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage Filter */}
            <div>
              <label className="text-sm font-medium text-[var(--fg-primary)] mb-2 block">
                Etapa
              </label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value as OpportunityStage | 'all')}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Todas las etapas</option>
                {Object.entries(STAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Score Filter */}
            <div>
              <label className="text-sm font-medium text-[var(--fg-primary)] mb-2 block">
                Score
              </label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Todos los scores</option>
                <option value="hot">🔥 Caliente (80+)</option>
                <option value="warm">🌡️ Tibio (60-79)</option>
                <option value="neutral">☀️ Neutral (40-59)</option>
                <option value="cold">❄️ Frío (0-39)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {viewMode === 'list' ? (
        /* Table View */
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--bg-secondary)]">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-[var(--fg-primary)]"
                  >
                    Nombre
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('estimatedValue')}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-[var(--fg-primary)]"
                  >
                    Valor
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('totalScore')}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-[var(--fg-primary)]"
                  >
                    Score
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => toggleSort('updatedAt')}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider hover:text-[var(--fg-primary)]"
                  >
                    Actualizado
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--fg-muted)] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/coach/crm/leads/${lead.id}`}>
                      <div>
                        <p className="text-sm font-medium text-[var(--fg-primary)] hover:text-emerald-600">
                          {lead.name}
                        </p>
                        {lead.company && (
                          <p className="text-xs text-[var(--fg-muted)]">
                            {lead.company}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        lead.stage === 'closed_won'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : lead.stage === 'closed_lost'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {STAGE_LABELS[lead.stage]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--fg-primary)]">
                    {formatCurrency(lead.estimatedValue)}
                  </td>
                  <td className="px-4 py-3">
                    <LeadScoreBadge
                      score={lead.totalScore}
                      category={lead.scoreCategory}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[var(--fg-muted)]">
                    {formatDate(lead.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/coach/crm/leads/${lead.id}`}
                        className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4 text-[var(--fg-muted)]" />
                      </Link>
                      <button
                        onClick={() => setShowDeleteConfirm(lead.id)}
                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--fg-muted)]">No se encontraron leads</p>
            </div>
          )}
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} variant="default" />
          ))}

          {filteredLeads.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-[var(--fg-muted)]">No se encontraron leads</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
              Eliminar Lead
            </h3>
            <p className="text-[var(--fg-muted)] mb-6">
              ¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
