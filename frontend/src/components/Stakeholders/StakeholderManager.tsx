'use client';

import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Mail, MoreVertical, RefreshCw,
  Trash2, ExternalLink, Clock, CheckCircle, AlertCircle,
  Send, Copy, Eye, Shield
} from 'lucide-react';
import {
  Stakeholder,
  StakeholderRole,
  STAKEHOLDER_ROLE_LABELS,
  DEFAULT_PERMISSIONS
} from '@/types/stakeholder';
import {
  getProgramStakeholders,
  createStakeholder,
  deleteStakeholder,
  renewStakeholderToken,
  markInvitationSent
} from '@/lib/stakeholderService';
import { Timestamp } from 'firebase/firestore';
import logger from '@/lib/logger';

interface StakeholderManagerProps {
  programId: string;
  coacheeId: string;
  coachId: string;
  coacheeName: string;
  coachName: string;
  programTitle: string;
}

export default function StakeholderManager({
  programId,
  coacheeId,
  coachId,
  coacheeName,
  coachName,
  programTitle
}: StakeholderManagerProps) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    role: 'sponsor' as StakeholderRole,
  });

  useEffect(() => {
    loadStakeholders();
  }, [programId]);

  const loadStakeholders = async () => {
    setLoading(true);
    try {
      const data = await getProgramStakeholders(programId);
      setStakeholders(data);
    } catch (error) {
      logger.firebaseError('loadStakeholders', error, { component: 'StakeholderManager', programId });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStakeholder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    
    setSaving(true);
    try {
      const newStakeholder = await createStakeholder({
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        role: form.role,
        programId,
        coacheeId,
        coachId,
      });
      
      setStakeholders([newStakeholder, ...stakeholders]);
      setForm({ name: '', email: '', phone: '', position: '', role: 'sponsor' });
      setShowAddForm(false);
      
      // Enviar email de invitación automáticamente
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const portalUrl = `${baseUrl}/portal/${newStakeholder.accessToken}`;
      
      try {
        const emailResponse = await fetch('/api/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stakeholderName: form.name,
            stakeholderEmail: form.email,
            stakeholderRole: STAKEHOLDER_ROLE_LABELS[form.role],
            coacheeName,
            coachName,
            programTitle,
            portalUrl,
            expiresAt: newStakeholder.tokenExpiresAt.toDate().toLocaleDateString('es-CL'),
          }),
        });
        
        if (emailResponse.ok) {
          await markInvitationSent(newStakeholder.id);
          alert('Stakeholder agregado e invitación enviada por email');
        } else {
          alert('Stakeholder agregado. Error al enviar email, usa el botón para reenviar.');
        }
      } catch (emailError) {
        logger.apiError('/api/send-invitation', emailError, { component: 'StakeholderManager', action: 'createStakeholder' });
        alert('Stakeholder agregado. Error al enviar email, usa el botón para reenviar.');
      }
      
    } catch (error) {
      logger.firebaseError('createStakeholder', error, { component: 'StakeholderManager', programId });
      alert('Error al agregar stakeholder');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (stakeholderId: string) => {
    if (!confirm('¿Estás seguro de eliminar este stakeholder?')) return;
    
    try {
      await deleteStakeholder(stakeholderId);
      setStakeholders(stakeholders.filter(s => s.id !== stakeholderId));
    } catch (error) {
      logger.firebaseError('deleteStakeholder', error, { component: 'StakeholderManager', stakeholderId });
    }
  };

  const handleRenewToken = async (stakeholderId: string) => {
    try {
      await renewStakeholderToken(stakeholderId);
      await loadStakeholders();
      alert('Token renovado exitosamente');
    } catch (error) {
      logger.firebaseError('renewStakeholderToken', error, { component: 'StakeholderManager', stakeholderId });
    }
  };

  const copyPortalLink = (token: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/portal/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSendEmail = async (stakeholder: Stakeholder) => {
    setSendingEmail(stakeholder.id);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const portalUrl = `${baseUrl}/portal/${stakeholder.accessToken}`;

    try {
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stakeholderName: stakeholder.name,
          stakeholderEmail: stakeholder.email,
          stakeholderRole: STAKEHOLDER_ROLE_LABELS[stakeholder.role],
          coacheeName,
          coachName,
          programTitle,
          portalUrl,
          expiresAt: stakeholder.tokenExpiresAt.toDate().toLocaleDateString('es-CL'),
        }),
      });

      if (response.ok) {
        await markInvitationSent(stakeholder.id);
        await loadStakeholders();
        alert('Invitación enviada exitosamente');
      } else {
        const error = await response.json();
        alert(`Error al enviar email: ${error.error || 'Error desconocido'}`);
      }
    } catch (error) {
      logger.apiError('/api/send-invitation', error, { component: 'StakeholderManager', action: 'sendEmail', stakeholderId: stakeholder.id });
      alert('Error al enviar email');
    } finally {
      setSendingEmail(null);
    }
  };

  const getStatusBadge = (stakeholder: Stakeholder) => {
    const isExpired = stakeholder.tokenExpiresAt.toDate() < new Date();

    if (isExpired || stakeholder.status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
          <AlertCircle size={12} />
          Expirado
        </span>
      );
    }

    if (stakeholder.status === 'active' && stakeholder.accessCount > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
          <CheckCircle size={12} />
          Activo
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
        <Clock size={12} />
        Pendiente
      </span>
    );
  };

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border-2 border-[var(--border-color)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Users className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--fg-primary)]">Stakeholders</h2>
            <p className="text-sm text-[var(--fg-muted)]">
              Gestiona los participantes del proceso de coaching
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          aria-expanded={showAddForm}
          aria-controls="add-stakeholder-form"
        >
          <UserPlus size={18} aria-hidden="true" />
          Agregar Stakeholder
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          id="add-stakeholder-form"
          onSubmit={handleAddStakeholder}
          className="mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]"
          aria-labelledby="add-stakeholder-heading"
        >
          <h3 id="add-stakeholder-heading" className="font-semibold text-[var(--fg-primary)] mb-4">Nuevo Stakeholder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stakeholder-name" className="block text-sm font-medium text-[var(--fg-secondary)] mb-1">
                Nombre completo *
              </label>
              <input
                id="stakeholder-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--bg-primary)] text-[var(--fg-primary)]"
                placeholder="Juan Pérez"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="stakeholder-email" className="block text-sm font-medium text-[var(--fg-secondary)] mb-1">
                Email *
              </label>
              <input
                id="stakeholder-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--bg-primary)] text-[var(--fg-primary)]"
                placeholder="juan@empresa.com"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="stakeholder-role" className="block text-sm font-medium text-[var(--fg-secondary)] mb-1">
                Rol en el proceso *
              </label>
              <select
                id="stakeholder-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as StakeholderRole })}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--bg-primary)] text-[var(--fg-primary)]"
                aria-required="true"
              >
                {Object.entries(STAKEHOLDER_ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stakeholder-position" className="block text-sm font-medium text-[var(--fg-secondary)] mb-1">
                Cargo/Posición
              </label>
              <input
                id="stakeholder-position"
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--bg-primary)] text-[var(--fg-primary)]"
                placeholder="Gerente de Área"
              />
            </div>
            <div>
              <label htmlFor="stakeholder-phone" className="block text-sm font-medium text-[var(--fg-secondary)] mb-1">
                Teléfono
              </label>
              <input
                id="stakeholder-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-[var(--bg-primary)] text-[var(--fg-primary)]"
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>
          
          {/* Permisos preview */}
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-900 dark:text-emerald-300 mb-2">
              <Shield size={16} />
              Permisos para {STAKEHOLDER_ROLE_LABELS[form.role]}:
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_PERMISSIONS[form.role].map(permission => (
                <span key={permission} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs rounded">
                  {permission.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-[var(--fg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.name || !form.email}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Agregar y Enviar Invitación
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Stakeholders List */}
      {loading ? (
        <div className="flex justify-center py-8" role="status" aria-label="Cargando stakeholders">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent" aria-hidden="true"></div>
          <span className="sr-only">Cargando stakeholders...</span>
        </div>
      ) : stakeholders.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
          <Users className="mx-auto text-[var(--fg-muted)] mb-3" size={48} />
          <h3 className="text-lg font-medium text-[var(--fg-primary)] mb-1">No hay stakeholders</h3>
          <p className="text-[var(--fg-muted)] mb-4">
            Agrega sponsor, HR o manager para involucrarlos en el proceso
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            <UserPlus size={18} />
            Agregar primer stakeholder
          </button>
        </div>
      ) : (
        <div className="space-y-3" role="list" aria-label="Lista de stakeholders">
          {stakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              role="listitem"
              className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {stakeholder.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--fg-primary)]">{stakeholder.name}</h4>
                    {getStatusBadge(stakeholder)}
                  </div>
                  <p className="text-sm text-[var(--fg-muted)]">{stakeholder.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-[var(--fg-muted)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
                      {STAKEHOLDER_ROLE_LABELS[stakeholder.role]}
                    </span>
                    {stakeholder.position && (
                      <span className="text-xs text-[var(--fg-muted)]">{stakeholder.position}</span>
                    )}
                    {stakeholder.accessCount > 0 && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        <Eye size={12} className="inline mr-1" />
                        {stakeholder.accessCount} acceso(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2" role="group" aria-label="Acciones para stakeholder">
                {/* Copy Link Button */}
                <button
                  onClick={() => copyPortalLink(stakeholder.accessToken)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--fg-secondary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                  aria-label={`Copiar link del portal para ${stakeholder.name}`}
                >
                  {copiedToken === stakeholder.accessToken ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} aria-hidden="true" />
                      Link
                    </>
                  )}
                </button>

                {/* Send Email Button */}
                <button
                  onClick={() => handleSendEmail(stakeholder)}
                  disabled={sendingEmail === stakeholder.id}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={`Enviar invitación por email a ${stakeholder.name}`}
                  aria-busy={sendingEmail === stakeholder.id}
                >
                  {sendingEmail === stakeholder.id ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail size={16} aria-hidden="true" />
                      Email
                    </>
                  )}
                </button>

                {/* Renew Token (if expired) */}
                {(stakeholder.status === 'expired' || stakeholder.tokenExpiresAt.toDate() < new Date()) && (
                  <button
                    onClick={() => handleRenewToken(stakeholder.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                    aria-label={`Renovar acceso para ${stakeholder.name}`}
                  >
                    <RefreshCw size={16} aria-hidden="true" />
                    Renovar
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(stakeholder.id)}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  aria-label={`Eliminar stakeholder ${stakeholder.name}`}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Info Card */}
      <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
        <h4 className="font-medium text-emerald-900 dark:text-emerald-300 mb-2">💡 Portal de Stakeholders</h4>
        <p className="text-sm text-emerald-800 dark:text-emerald-300">
          Cada stakeholder recibe un link único para acceder a su portal personalizado donde pueden:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
          <li>• <strong>Sponsor/HR:</strong> Ver progreso, completar 360°, participar en tripartita, ver reportes</li>
          <li>• <strong>Manager:</strong> Ver progreso, completar 360°, participar en tripartita</li>
          <li>• <strong>Pares/Reportes:</strong> Completar 360° feedback</li>
        </ul>
      </div>
    </div>
  );
}
