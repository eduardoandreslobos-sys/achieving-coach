'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Download,
  Trash2,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  Cookie,
  Mail,
  Database,
  X,
  Check,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast, Toaster } from 'sonner';

interface PrivacySettings {
  doNotSellData: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
  thirdPartySharing: boolean;
  cookieConsent?: {
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
  };
}

interface DeletionRequest {
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestedAt: string;
  scheduledAt: string;
  reason?: string;
}

export default function PrivacySettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PrivacySettings | null>(null);
  const [deletionRequest, setDeletionRequest] = useState<DeletionRequest | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPrivacySettings();
      fetchDeletionStatus();
    }
  }, [user]);

  const getAuthHeaders = async () => {
    const token = await user?.getIdToken();
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchPrivacySettings = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/settings', { headers });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeletionStatus = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/deletion-status', { headers });
      if (response.ok) {
        const data = await response.json();
        if (data.deletionRequest?.status === 'pending') {
          setDeletionRequest(data.deletionRequest);
        }
      }
    } catch (error) {
      console.error('Error fetching deletion status:', error);
    }
  };

  const updateSetting = async (key: keyof PrivacySettings, value: boolean) => {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/settings', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      toast.success('Preferencia actualizada');
    } catch (error) {
      // Revert on error
      setSettings(settings);
      toast.error('Error al actualizar preferencia');
    }
  };

  const handleDoNotSell = async (doNotSell: boolean) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/do-not-sell', {
        method: 'POST',
        headers,
        body: JSON.stringify({ doNotSell }),
      });

      if (response.ok) {
        setSettings(settings ? { ...settings, doNotSellData: doNotSell } : null);
        toast.success(
          doNotSell
            ? 'Tus datos no serán vendidos a terceros'
            : 'Preferencia actualizada'
        );
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Error al actualizar preferencia');
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/export', {
        method: 'POST',
        headers,
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mis-datos-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Datos exportados correctamente');
    } catch (error) {
      toast.error('Error al exportar datos');
    } finally {
      setExporting(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      toast.error('Por favor escribe ELIMINAR para confirmar');
      return;
    }

    setDeleting(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/delete-account', {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: deleteReason }),
      });

      const data = await response.json();

      if (response.ok) {
        setDeletionRequest(data.deletionRequest);
        setShowDeleteModal(false);
        setDeleteReason('');
        setDeleteConfirmText('');
        toast.success('Solicitud de eliminación enviada');
      } else {
        toast.error(data.reason || data.error || 'Error al solicitar eliminación');
      }
    } catch (error) {
      toast.error('Error al solicitar eliminación');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDeletion = async () => {
    setCancelling(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/v1/privacy/cancel-deletion', {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        setDeletionRequest(null);
        toast.success('Solicitud de eliminación cancelada');
      } else {
        throw new Error('Failed to cancel');
      }
    } catch (error) {
      toast.error('Error al cancelar solicitud');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/settings"
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[var(--fg-muted)]" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg-primary)] mb-1">Privacidad</h1>
            <p className="text-[var(--fg-muted)]">Controla tus datos y preferencias de privacidad</p>
          </div>
        </div>

        {/* Pending Deletion Warning */}
        {deletionRequest && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-400 font-medium mb-1">Eliminación programada</h3>
                <p className="text-[var(--fg-muted)] text-sm mb-3">
                  Tu cuenta será eliminada el{' '}
                  <strong className="text-[var(--fg-primary)]">
                    {new Date(deletionRequest.scheduledAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                  . Puedes cancelar esta solicitud en cualquier momento antes de esa fecha.
                </p>
                <button
                  onClick={handleCancelDeletion}
                  disabled={cancelling}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cancelar eliminación'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CCPA - Do Not Sell */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-[var(--fg-primary)] font-semibold">CCPA - No Vender Mis Datos</h2>
          </div>
          <p className="text-[var(--fg-muted)] text-sm mb-4">
            Bajo la Ley de Privacidad del Consumidor de California (CCPA), tienes derecho a optar por
            que tus datos personales no sean vendidos a terceros.
          </p>
          <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
            <div>
              <h4 className="font-medium text-[var(--fg-primary)]">No vender mis datos personales</h4>
              <p className="text-sm text-[var(--fg-muted)]">
                {settings?.doNotSellData
                  ? 'Tus datos no serán vendidos a terceros'
                  : 'Activa esta opción para proteger tus datos'}
              </p>
            </div>
            <button
              onClick={() => handleDoNotSell(!settings?.doNotSellData)}
              className="text-[var(--accent-primary)]"
            >
              {settings?.doNotSellData ? (
                <ToggleRight className="w-10 h-10" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-[var(--fg-primary)] font-semibold">Preferencias de Comunicación</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
              <div>
                <h4 className="font-medium text-[var(--fg-primary)]">Emails de marketing</h4>
                <p className="text-sm text-[var(--fg-muted)]">Promociones, ofertas y novedades</p>
              </div>
              <button
                onClick={() => updateSetting('marketingEmails', !settings?.marketingEmails)}
                className="text-[var(--accent-primary)]"
              >
                {settings?.marketingEmails ? (
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-500" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
              <div>
                <h4 className="font-medium text-[var(--fg-primary)]">Actualizaciones del producto</h4>
                <p className="text-sm text-[var(--fg-muted)]">Nuevas funcionalidades y mejoras</p>
              </div>
              <button
                onClick={() => updateSetting('productUpdates', !settings?.productUpdates)}
                className="text-[var(--accent-primary)]"
              >
                {settings?.productUpdates ? (
                  <ToggleRight className="w-10 h-10" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Data Export */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-[var(--fg-primary)] font-semibold">Exportar Mis Datos (GDPR)</h2>
          </div>
          <p className="text-[var(--fg-muted)] text-sm mb-4">
            Bajo el Artículo 20 del GDPR, tienes derecho a recibir una copia de todos tus datos
            personales en un formato portable y legible por máquina.
          </p>
          <button
            onClick={handleExportData}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {exporting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {exporting ? 'Exportando...' : 'Descargar mis datos (JSON)'}
          </button>
        </div>

        {/* Cookie Settings Link */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-[var(--fg-primary)] font-semibold">Preferencias de Cookies</h2>
          </div>
          <p className="text-[var(--fg-muted)] text-sm mb-4">
            Puedes cambiar tus preferencias de cookies en cualquier momento.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('cookie_consent');
              window.location.reload();
            }}
            className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--fg-primary)] rounded-xl font-medium hover:bg-[var(--bg-primary)] transition-colors"
          >
            <Cookie className="w-5 h-5" />
            Actualizar preferencias de cookies
          </button>
        </div>

        {/* Delete Account */}
        {!deletionRequest && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
              <h2 className="text-red-400 font-semibold">Eliminar Cuenta (GDPR Art. 17)</h2>
            </div>
            <p className="text-[var(--fg-muted)] text-sm mb-4">
              Bajo el Artículo 17 del GDPR (Derecho al Olvido), puedes solicitar la eliminación
              permanente de tu cuenta y todos los datos asociados. Esta acción tiene un período de
              gracia de 30 días durante el cual puedes cancelar la solicitud.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Solicitar eliminación de cuenta
            </button>
          </div>
        )}
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-[var(--fg-primary)]">Eliminar Cuenta</h2>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm">
                  <strong>Advertencia:</strong> Esta acción eliminará permanentemente tu cuenta y todos
                  los datos asociados después de 30 días. Esta acción no se puede deshacer.
                </p>
              </div>

              <div>
                <label className="block text-[var(--fg-muted)] text-sm mb-2">
                  ¿Por qué quieres eliminar tu cuenta? (opcional)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] focus:outline-none focus:border-red-500 resize-none"
                  placeholder="Tu feedback nos ayuda a mejorar..."
                />
              </div>

              <div>
                <label className="block text-[var(--fg-muted)] text-sm mb-2">
                  Escribe <strong className="text-red-400">ELIMINAR</strong> para confirmar
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--fg-primary)] focus:outline-none focus:border-red-500"
                  placeholder="ELIMINAR"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRequestDeletion}
                disabled={deleting || deleteConfirmText !== 'ELIMINAR'}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Confirmar Eliminación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
