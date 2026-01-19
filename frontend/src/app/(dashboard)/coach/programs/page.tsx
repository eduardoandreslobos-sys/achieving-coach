'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSignature,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

interface Program {
  id: string;
  title: string;
  coacheeId: string;
  coacheeName: string;
  status: 'draft' | 'pending_acceptance' | 'active' | 'completed' | 'paused' | 'cancelled';
  currentPhase: number;
  totalSessions: number;
  completedSessions?: number;
  startDate?: any;
  endDate?: any;
  createdAt: any;
  updatedAt?: any;
}

const statusConfig = {
  draft: { label: 'Borrador', color: 'bg-[var(--bg-secondary)] text-[var(--fg-muted)]', icon: FileSignature },
  pending_acceptance: { label: 'Pendiente Firma', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  active: { label: 'Activo', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  completed: { label: 'Completado', color: 'bg-emerald-100 text-blue-700', icon: CheckCircle },
  paused: { label: 'Pausado', color: 'bg-orange-100 text-orange-700', icon: Clock },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export default function CoachProgramsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      loadPrograms();
    }
  }, [user]);

  const loadPrograms = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'coaching_programs'),
        where('coachId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Program[];
      
      setPrograms(programsData);
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.coacheeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'active').length,
    pending: programs.filter(p => p.status === 'pending_acceptance').length,
    completed: programs.filter(p => p.status === 'completed').length,
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[var(--bg-tertiary)] rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[var(--bg-tertiary)] rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-[var(--bg-tertiary)] rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--fg-primary)]">Coaching Programs</h1>
          <p className="text-[var(--fg-muted)] mt-1">Manage all your executive coaching programs</p>
        </div>
        <Link
          href="/coach/programs/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Program
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[var(--fg-muted)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--fg-primary)]">{stats.total}</p>
              <p className="text-sm text-[var(--fg-muted)]">Total Programs</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--fg-primary)]">{stats.active}</p>
              <p className="text-sm text-[var(--fg-muted)]">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--fg-primary)]">{stats.pending}</p>
              <p className="text-sm text-[var(--fg-muted)]">Pending Signature</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--fg-primary)]">{stats.completed}</p>
              <p className="text-sm text-[var(--fg-muted)]">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border-color)] p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--fg-muted)]" />
            <input
              type="text"
              placeholder="Search by program title or coachee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[var(--fg-muted)]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending_acceptance">Pending Signature</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border-color)] p-12 text-center">
          <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileSignature className="w-8 h-8 text-[var(--fg-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">No programs found</h3>
          <p className="text-[var(--fg-muted)] mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters'
              : 'Create your first coaching program to get started'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link
              href="/coach/programs/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-[var(--fg-primary)] rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Program
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Program</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Coachee</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Phase</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Sessions</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]">Created</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-[var(--fg-primary)]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrograms.map((program) => {
                const status = statusConfig[program.status] || statusConfig.draft;
                const StatusIcon = status.icon;
                
                return (
                  <tr 
                    key={program.id} 
                    className="hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                    onClick={() => router.push(`/coach/programs/${program.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[var(--fg-primary)]">{program.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-[var(--fg-muted)]">{program.coacheeName || 'Not assigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${((program.currentPhase || 1) / 9) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-[var(--fg-muted)]">{program.currentPhase || 1}/9</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[var(--fg-muted)]">
                        {program.completedSessions || 0}/{program.totalSessions || 6}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--fg-muted)] text-sm">
                      {formatDate(program.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight className="w-5 h-5 text-[var(--fg-muted)]" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
