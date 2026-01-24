'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter, RotateCcw } from 'lucide-react';
import {
  CoachFilters as CoachFiltersType,
  CoachSortOption,
  SPECIALTIES,
  LANGUAGES,
  METHODOLOGIES,
  CERTIFICATIONS,
} from '@/types/directory';

interface CoachFiltersProps {
  filters: CoachFiltersType;
  sort: CoachSortOption;
  onFiltersChange: (filters: CoachFiltersType) => void;
  onSortChange: (sort: CoachSortOption) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const SORT_OPTIONS: { value: CoachSortOption; label: string }[] = [
  { value: 'featured', label: 'Destacados' },
  { value: 'rating_desc', label: 'Mejor valorados' },
  { value: 'reviews_desc', label: 'Más reseñas' },
  { value: 'experience_desc', label: 'Más experiencia' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'newest', label: 'Más recientes' },
];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[var(--border-color)] pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-semibold text-[var(--fg-primary)]">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[var(--fg-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--fg-muted)]" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

interface CheckboxListProps {
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxVisible?: number;
}

function CheckboxList({ options, selected, onChange, maxVisible = 6 }: CheckboxListProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, maxVisible);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(s => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-2">
      {visibleOptions.map(option => (
        <label
          key={option}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggleOption(option)}
            className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-secondary)]
                     text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
          />
          <span className="text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg-primary)] transition-colors">
            {option}
          </span>
        </label>
      ))}
      {options.length > maxVisible && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-emerald-400 hover:text-emerald-300 mt-2"
        >
          {showAll ? 'Ver menos' : `Ver ${options.length - maxVisible} más`}
        </button>
      )}
    </div>
  );
}

export function CoachFilters({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  onReset,
  isMobile = false,
  onClose,
}: CoachFiltersProps) {
  const updateFilter = <K extends keyof CoachFiltersType>(
    key: K,
    value: CoachFiltersType[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = [
    filters.specialties?.length || 0,
    filters.languages?.length || 0,
    filters.methodology?.length || 0,
    filters.certifications?.length || 0,
    filters.minRating ? 1 : 0,
    filters.priceMin || filters.priceMax ? 1 : 0,
    filters.acceptingNewClients !== undefined ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`
      ${isMobile
        ? 'fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-y-auto'
        : 'sticky top-4'
      }
    `}>
      {/* Header */}
      <div className={`
        flex items-center justify-between p-4 border-b border-[var(--border-color)]
        ${isMobile ? '' : 'hidden'}
      `}>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-[var(--fg-primary)]">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs bg-emerald-500 text-white rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--fg-muted)]" />
          </button>
        )}
      </div>

      <div className={`${isMobile ? 'p-4' : ''}`}>
        {/* Sort (mobile only shows as filter section) */}
        {isMobile && (
          <FilterSection title="Ordenar por" defaultOpen={true}>
            <select
              value={sort}
              onChange={e => onSortChange(e.target.value as CoachSortOption)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                       text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>
        )}

        {/* Availability */}
        <FilterSection title="Disponibilidad" defaultOpen={true}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.acceptingNewClients === true}
              onChange={e => updateFilter('acceptingNewClients', e.target.checked ? true : undefined)}
              className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-secondary)]
                       text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
            />
            <span className="text-sm text-[var(--fg-muted)]">
              Solo coaches disponibles
            </span>
          </label>
        </FilterSection>

        {/* Specialties */}
        <FilterSection title="Especialidades">
          <CheckboxList
            options={SPECIALTIES}
            selected={filters.specialties || []}
            onChange={selected => updateFilter('specialties', selected)}
          />
        </FilterSection>

        {/* Languages */}
        <FilterSection title="Idiomas">
          <CheckboxList
            options={LANGUAGES}
            selected={filters.languages || []}
            onChange={selected => updateFilter('languages', selected)}
            maxVisible={4}
          />
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Precio por sesión">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs text-[var(--fg-muted)] mb-1 block">Mínimo</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.priceMin || ''}
                  onChange={e => updateFilter('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[var(--fg-muted)] mb-1 block">Máximo</label>
                <input
                  type="number"
                  placeholder="$500+"
                  value={filters.priceMax || ''}
                  onChange={e => updateFilter('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Valoración mínima">
          <div className="flex gap-2">
            {[0, 3, 4, 4.5].map(rating => (
              <button
                key={rating}
                onClick={() => updateFilter('minRating', rating === 0 ? undefined : rating)}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${(filters.minRating || 0) === rating
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
                {rating === 0 ? 'Todas' : `${rating}+`}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Methodology */}
        <FilterSection title="Metodología" defaultOpen={false}>
          <CheckboxList
            options={METHODOLOGIES}
            selected={filters.methodology || []}
            onChange={selected => updateFilter('methodology', selected)}
          />
        </FilterSection>

        {/* Certifications */}
        <FilterSection title="Certificaciones" defaultOpen={false}>
          <CheckboxList
            options={CERTIFICATIONS}
            selected={filters.certifications || []}
            onChange={selected => updateFilter('certifications', selected)}
            maxVisible={4}
          />
        </FilterSection>

        {/* Reset button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2
                     text-[var(--fg-muted)] hover:text-[var(--fg-primary)]
                     hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Mobile apply button */}
      {isMobile && onClose && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Ver resultados
          </button>
        </div>
      )}
    </div>
  );
}

// Desktop sort dropdown
export function SortDropdown({
  sort,
  onSortChange,
}: {
  sort: CoachSortOption;
  onSortChange: (sort: CoachSortOption) => void;
}) {
  return (
    <select
      value={sort}
      onChange={e => onSortChange(e.target.value as CoachSortOption)}
      className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
               text-[var(--fg-primary)] text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    >
      {SORT_OPTIONS.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default CoachFilters;
