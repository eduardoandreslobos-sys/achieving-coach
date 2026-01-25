'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  User,
  Building,
  Send,
  Loader2,
  Filter,
  RefreshCw,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import {
  CoachInquiry,
  InquiryStatus,
  INQUIRY_STATUS_LABELS,
  URGENCY_LABELS,
} from '@/types/directory';
import {
  getCoachInquiries,
  getInquiryCounts,
  respondToInquiry,
  markInquiryAsViewed,
} from '@/services/directory.service';
import { convertInquiryToLead } from '@/services/crm.service';
import { getCoachProfileByUserId } from '@/services/directory.service';
import { FeatureGate } from '@/components/FeatureGate';

const STATUS_COLORS: Record<InquiryStatus, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  viewed: 'bg-amber-500/20 text-amber-400',
  responded: 'bg-emerald-500/20 text-emerald-400',
  converted: 'bg-purple-500/20 text-purple-400',
  declined: 'bg-red-500/20 text-red-400',
};

export default function InquiriesPage() {
  return (
    <FeatureGate feature="directory.inquiries" fallback="upgrade-prompt">
      <InquiriesContent />
    </FeatureGate>
  );
}

function InquiriesContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<CoachInquiry[]>([]);
  const [counts, setCounts] = useState<Record<InquiryStatus, number>>({
    new: 0,
    viewed: 0,
    responded: 0,
    converted: 0,
    declined: 0,
  });
  const [selectedInquiry, setSelectedInquiry] = useState<CoachInquiry | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);
  const [converting, setConverting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InquiryStatus | 'all'>('all');
  const [coachId, setCoachId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCoachProfile();
    }
  }, [user]);

  useEffect(() => {
    if (coachId) {
      loadInquiries();
      loadCounts();
    }
  }, [coachId, filterStatus]);

  const loadCoachProfile = async () => {
    if (!user) return;
    try {
      const profile = await getCoachProfileByUserId(user.uid);
      if (profile) {
        setCoachId(profile.id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading coach profile:', error);
      setLoading(false);
    }
  };

  const loadInquiries = async () => {
    if (!coachId) return;

    setLoading(true);
    try {
      const statusFilter = filterStatus === 'all' ? undefined : [filterStatus];
      const data = await getCoachInquiries(coachId, statusFilter);
      setInquiries(data);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCounts = async () => {
    if (!coachId) return;
    try {
      const data = await getInquiryCounts(coachId);
      setCounts(data);
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const handleSelectInquiry = async (inquiry: CoachInquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText('');

    // Mark as viewed if new
    if (inquiry.status === 'new') {
      try {
        await markInquiryAsViewed(inquiry.id);
        setInquiries(prev =>
          prev.map(i => (i.id === inquiry.id ? { ...i, status: 'viewed' as InquiryStatus } : i))
        );
        loadCounts();
      } catch (error) {
        console.error('Error marking as viewed:', error);
      }
    }
  };

  const handleRespond = async (accepted: boolean) => {
    if (!selectedInquiry || !responseText.trim()) return;

    setResponding(true);
    try {
      await respondToInquiry(
        selectedInquiry.id,
        responseText,
        accepted ? 'accepted' : 'declined'
      );

      setInquiries(prev =>
        prev.map(i =>
          i.id === selectedInquiry.id
            ? { ...i, status: 'responded' as InquiryStatus, coachResponse: responseText }
            : i
        )
      );
      setSelectedInquiry(null);
      setResponseText('');
      loadCounts();
    } catch (error) {
      console.error('Error responding:', error);
    } finally {
      setResponding(false);
    }
  };

  const handleConvertToLead = async () => {
    if (!selectedInquiry) return;

    setConverting(true);
    try {
      await convertInquiryToLead(selectedInquiry.id);
      setInquiries(prev =>
        prev.map(i =>
          i.id === selectedInquiry.id ? { ...i, status: 'converted' as InquiryStatus } : i
        )
      );
      setSelectedInquiry(null);
      loadCounts();
    } catch (error) {
      console.error('Error converting to lead:', error);
    } finally {
      setConverting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('es', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const totalInquiries = Object.values(counts).reduce((a, b) => a + b, 0);

  if (!coachId && !loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--fg-primary)] mb-2">
            Configura tu perfil primero
          </h2>
          <p className="text-[var(--fg-muted)] mb-6">
            Necesitas configurar tu perfil en el directorio para recibir consultas.
          </p>
          <a
            href="/coach/directory-settings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600
                     text-white font-semibold rounded-xl transition-colors"
          >
            Configurar perfil
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-primary)]">
            Consultas del Directorio
          </h1>
          <p className="text-[var(--fg-muted)] mt-1">
            Gestiona las consultas de potenciales clientes
          </p>
        </div>

        <button
          onClick={loadInquiries}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]
                   text-[var(--fg-muted)] rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => setFilterStatus('all')}
          className={`
            p-4 rounded-xl border transition-colors text-left
            ${filterStatus === 'all'
              ? 'bg-emerald-500/10 border-emerald-500/50'
              : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--fg-muted)]'
            }
          `}
        >
          <div className="text-2xl font-bold text-[var(--fg-primary)]">{totalInquiries}</div>
          <div className="text-sm text-[var(--fg-muted)]">Total</div>
        </button>

        {(Object.keys(counts) as InquiryStatus[]).slice(0, 4).map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`
              p-4 rounded-xl border transition-colors text-left
              ${filterStatus === status
                ? 'bg-emerald-500/10 border-emerald-500/50'
                : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:border-[var(--fg-muted)]'
              }
            `}
          >
            <div className="text-2xl font-bold text-[var(--fg-primary)]">{counts[status]}</div>
            <div className="text-sm text-[var(--fg-muted)]">{INQUIRY_STATUS_LABELS[status]}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inquiries list */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h2 className="font-semibold text-[var(--fg-primary)]">
              {filterStatus === 'all' ? 'Todas las consultas' : INQUIRY_STATUS_LABELS[filterStatus]}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="w-12 h-12 text-[var(--fg-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-[var(--fg-muted)]">No hay consultas</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)] max-h-[600px] overflow-y-auto">
              {inquiries.map(inquiry => (
                <button
                  key={inquiry.id}
                  onClick={() => handleSelectInquiry(inquiry)}
                  className={`
                    w-full p-4 text-left hover:bg-[var(--bg-secondary)] transition-colors
                    ${selectedInquiry?.id === inquiry.id ? 'bg-[var(--bg-secondary)]' : ''}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[var(--fg-primary)] truncate">
                          {inquiry.prospectName}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[inquiry.status]}`}>
                          {INQUIRY_STATUS_LABELS[inquiry.status]}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--fg-muted)] line-clamp-2">
                        {inquiry.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[var(--fg-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(inquiry.createdAt)}
                        </span>
                        <span className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded">
                          {URGENCY_LABELS[inquiry.urgency]}
                        </span>
                      </div>
                    </div>
                    {inquiry.status === 'new' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
          {selectedInquiry ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-[var(--border-color)]">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--fg-primary)]">
                      {selectedInquiry.prospectName}
                    </h2>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${STATUS_COLORS[selectedInquiry.status]}`}>
                      {INQUIRY_STATUS_LABELS[selectedInquiry.status]}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--fg-muted)]">
                    {formatDate(selectedInquiry.createdAt)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                {/* Contact info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[var(--fg-muted)]" />
                    <a href={`mailto:${selectedInquiry.prospectEmail}`} className="text-emerald-400 hover:underline">
                      {selectedInquiry.prospectEmail}
                    </a>
                  </div>
                  {selectedInquiry.prospectPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[var(--fg-muted)]" />
                      <span className="text-[var(--fg-primary)]">{selectedInquiry.prospectPhone}</span>
                    </div>
                  )}
                  {selectedInquiry.prospectCompany && (
                    <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-[var(--fg-muted)]" />
                      <span className="text-[var(--fg-primary)]">
                        {selectedInquiry.prospectCompany}
                        {selectedInquiry.prospectRole && ` - ${selectedInquiry.prospectRole}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-sm font-medium text-[var(--fg-muted)] mb-2">Mensaje</h3>
                  <div className="p-4 bg-[var(--bg-secondary)] rounded-xl">
                    <p className="text-[var(--fg-primary)] whitespace-pre-line">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>

                {/* Interest areas */}
                {selectedInquiry.interestAreas.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--fg-muted)] mb-2">Áreas de interés</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInquiry.interestAreas.map(area => (
                        <span key={area} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="text-xs text-[var(--fg-muted)] mb-1">Urgencia</div>
                    <div className="text-[var(--fg-primary)] font-medium">
                      {URGENCY_LABELS[selectedInquiry.urgency]}
                    </div>
                  </div>
                  <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
                    <div className="text-xs text-[var(--fg-muted)] mb-1">Contacto preferido</div>
                    <div className="text-[var(--fg-primary)] font-medium capitalize">
                      {selectedInquiry.preferredContactMethod}
                    </div>
                  </div>
                </div>

                {/* Previous response */}
                {selectedInquiry.coachResponse && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--fg-muted)] mb-2">Tu respuesta</h3>
                    <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      <p className="text-[var(--fg-primary)] whitespace-pre-line">
                        {selectedInquiry.coachResponse}
                      </p>
                    </div>
                  </div>
                )}

                {/* Response form */}
                {(selectedInquiry.status === 'new' || selectedInquiry.status === 'viewed') && (
                  <div>
                    <h3 className="text-sm font-medium text-[var(--fg-muted)] mb-2">Responder</h3>
                    <textarea
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      rows={4}
                      placeholder="Escribe tu respuesta..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                               text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedInquiry.status !== 'converted' && selectedInquiry.status !== 'declined' && (
                <div className="p-4 border-t border-[var(--border-color)] space-y-3">
                  {(selectedInquiry.status === 'new' || selectedInquiry.status === 'viewed') && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRespond(true)}
                        disabled={responding || !responseText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600
                                 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                      >
                        {responding ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Responder
                      </button>
                      <button
                        onClick={() => handleRespond(false)}
                        disabled={responding || !responseText.trim()}
                        className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400
                                 disabled:opacity-50 rounded-xl transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {selectedInquiry.status === 'responded' && (
                    <button
                      onClick={handleConvertToLead}
                      disabled={converting}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-purple-500 hover:bg-purple-600
                               disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
                    >
                      {converting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      Convertir a Lead (CRM)
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div>
                <MessageSquare className="w-12 h-12 text-[var(--fg-muted)] mx-auto mb-3 opacity-50" />
                <p className="text-[var(--fg-muted)]">
                  Selecciona una consulta para ver los detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
