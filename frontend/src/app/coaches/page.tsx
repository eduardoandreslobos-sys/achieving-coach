'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Users, Sparkles, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CoachCard, CoachFilters, SortDropdown } from '@/components/directory';
import {
  CoachPublicProfile,
  CoachFilters as CoachFiltersType,
  CoachSortOption,
} from '@/types/directory';
import {
  getPublishedCoaches,
  getFeaturedCoaches,
} from '@/services/directory.service';

const DEFAULT_FILTERS: CoachFiltersType = {};
const DEFAULT_SORT: CoachSortOption = 'featured';

export default function CoachesDirectoryPage() {
  const [coaches, setCoaches] = useState<CoachPublicProfile[]>([]);
  const [featuredCoaches, setFeaturedCoaches] = useState<CoachPublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<CoachFiltersType>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<CoachSortOption>(DEFAULT_SORT);
  const [searchQuery, setSearchQuery] = useState('');

  // Load coaches
  useEffect(() => {
    loadCoaches();
  }, [filters, sort]);

  // Load featured coaches on mount
  useEffect(() => {
    loadFeaturedCoaches();
  }, []);

  // Sync search query with filters
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchQuery || undefined }));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const loadCoaches = async () => {
    setLoading(true);
    try {
      const result = await getPublishedCoaches({
        filters,
        sort,
        page: 1,
        limit: 50,
      });
      setCoaches(result.coaches);
    } catch (error) {
      console.error('Error loading coaches:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedCoaches = async () => {
    try {
      const featured = await getFeaturedCoaches(3);
      setFeaturedCoaches(featured);
    } catch (error) {
      console.error('Error loading featured coaches:', error);
    }
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSort(DEFAULT_SORT);
    setSearchQuery('');
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof CoachFiltersType];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-emerald-800/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              Directorio de Coaches Certificados
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--fg-primary)] mb-6">
            Encuentra tu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
              Coach Ideal
            </span>
          </h1>

          <p className="text-xl text-[var(--fg-muted)] max-w-2xl mx-auto mb-10">
            Conecta con coaches profesionales certificados que te ayudarán
            a alcanzar tus metas personales y profesionales.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, especialidad o palabra clave..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]
                       text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                       focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                       text-lg shadow-lg shadow-black/10"
            />
          </div>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--fg-primary)]">
                {coaches.length}+
              </div>
              <div className="text-sm text-[var(--fg-muted)]">Coaches Activos</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-color)]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--fg-primary)]">500+</div>
              <div className="text-sm text-[var(--fg-muted)]">Clientes Satisfechos</div>
            </div>
            <div className="w-px h-10 bg-[var(--border-color)]" />
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--fg-primary)]">4.8</div>
              <div className="text-sm text-[var(--fg-muted)]">Valoración Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coaches */}
      {featuredCoaches.length > 0 && !hasActiveFilters && (
        <section className="py-12 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[var(--fg-primary)]">
                  Coaches Destacados
                </h2>
                <p className="text-[var(--fg-muted)] mt-1">
                  Profesionales con excelentes valoraciones
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredCoaches.map(coach => (
                <CoachCard key={coach.id} coach={coach} variant="default" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-emerald-400" />
                  <h2 className="font-semibold text-[var(--fg-primary)]">Filtros</h2>
                </div>
                <CoachFilters
                  filters={filters}
                  sort={sort}
                  onFiltersChange={setFilters}
                  onSortChange={setSort}
                  onReset={resetFilters}
                />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
                    {loading ? (
                      'Cargando...'
                    ) : (
                      <>
                        {coaches.length} coach{coaches.length !== 1 ? 'es' : ''} encontrado
                        {coaches.length !== 1 ? 's' : ''}
                      </>
                    )}
                  </h2>

                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)]
                             rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg-primary)]"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                </div>

                {/* Sort dropdown - Desktop */}
                <div className="hidden lg:block">
                  <SortDropdown sort={sort} onSortChange={setSort} />
                </div>
              </div>

              {/* Coach grid */}
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-80 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] animate-pulse"
                    />
                  ))}
                </div>
              ) : coaches.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-[var(--fg-muted)] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
                    No se encontraron coaches
                  </h3>
                  <p className="text-[var(--fg-muted)] mb-6">
                    Intenta ajustar los filtros o la búsqueda
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {coaches.map(coach => (
                    <CoachCard key={coach.id} coach={coach} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <CoachFilters
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
          onReset={resetFilters}
          isMobile={true}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* CTA Section */}
      <section className="py-20 border-t border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--fg-primary)] mb-4">
            ¿Eres Coach Profesional?
          </h2>
          <p className="text-xl text-[var(--fg-muted)] mb-8">
            Únete a nuestra comunidad y conecta con clientes que buscan transformar sus vidas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/sign-up?role=coach"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
            >
              Registrarme como Coach
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="/features"
              className="px-8 py-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--fg-primary)] font-medium rounded-xl transition-colors"
            >
              Ver beneficios
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
