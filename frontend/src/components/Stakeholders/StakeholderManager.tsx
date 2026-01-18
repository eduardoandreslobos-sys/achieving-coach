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

interface StakeholderManagerProps {
  programId: string;
  coacheeId: string;
  coachId: string;
  coacheeName: string;
  programTitle: string;
}

export default function StakeholderManager({
  programId,
  coacheeId,
  coachId,
  coacheeName,
  programTitle
}: StakeholderManagerProps) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
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
      console.error('Error loading stakeholders:', error);
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
            coachName: 'Tu Coach', // TODO: obtener nombre real
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
        console.error('Error sending invitation email:', emailError);
        alert('Stakeholder agregado. Error al enviar email, usa el botón para reenviar.');
      }
      
    } catch (error) {
      console.error('Error creating stakeholder:', error);
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
      console.error('Error deleting stakeholder:', error);
    }
  };

  const handleRenewToken = async (stakeholderId: string) => {
    try {
      const newToken = await renewStakeholderToken(stakeholderId);
      await loadStakeholders();
      alert('Token renovado exitosamente');
    } catch (error) {
      console.error('Error renewing token:', error);
    }
  };

  const copyPortalLink = (token: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/portal/${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getStatusBadge = (stakeholder: Stakeholder) => {
    const isExpired = stakeholder.tokenExpiresAt.toDate() < new Date();
    
    if (isExpired || stakeholder.status === 'expired') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
          <AlertCircle size={12} />
          Expirado
        </span>
      );
    }
    
    if (stakeholder.status === 'active' && stakeholder.accessCount > 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
          <CheckCircle size={12} />
          Activo
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
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
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Users className="text-primary-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Stakeholders</h2>
            <p className="text-sm text-gray-500">
              Gestiona los participantes del proceso de coaching
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <UserPlus size={18} />
          Agregar Stakeholder
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddStakeholder} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Nuevo Stakeholder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="juan@empresa.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol en el proceso *
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as StakeholderRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(STAKEHOLDER_ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo/Posición
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Gerente de Área"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>
          
          {/* Permisos preview */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-900 mb-2">
              <Shield size={16} />
              Permisos para {STAKEHOLDER_ROLE_LABELS[form.role]}:
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_PERMISSIONS[form.role].map(permission => (
                <span key={permission} className="px-2 py-1 bg-emerald-100 text-blue-700 text-xs rounded">
                  {permission.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !form.name || !form.email}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
        </div>
      ) : stakeholders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto text-gray-400 mb-3" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay stakeholders</h3>
          <p className="text-gray-500 mb-4">
            Agrega sponsor, HR o manager para involucrarlos en el proceso
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <UserPlus size={18} />
            Agregar primer stakeholder
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {stakeholders.map((stakeholder) => (
            <div 
              key={stakeholder.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-semibold">
                    {stakeholder.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{stakeholder.name}</h4>
                    {getStatusBadge(stakeholder)}
                  </div>
                  <p className="text-sm text-gray-500">{stakeholder.email}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {STAKEHOLDER_ROLE_LABELS[stakeholder.role]}
                    </span>
                    {stakeholder.position && (
                      <span className="text-xs text-gray-500">{stakeholder.position}</span>
                    )}
                    {stakeholder.accessCount > 0 && (
                      <span className="text-xs text-green-600">
                        <Eye size={12} className="inline mr-1" />
                        {stakeholder.accessCount} acceso(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Copy Link Button */}
                <button
                  onClick={() => copyPortalLink(stakeholder.accessToken)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copiar link del portal"
                >
                  {copiedToken === stakeholder.accessToken ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-green-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Link
                    </>
                  )}
                </button>
                
                {/* Send Email Button */}
                <button
                  onClick={() => {
                    // TODO: Implementar envío de email
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                    const link = `${baseUrl}/portal/${stakeholder.accessToken}`;
                    const subject = encodeURIComponent(`Invitación al proceso de coaching de ${coacheeName}`);
                    const body = encodeURIComponent(
                      `Hola ${stakeholder.name},\n\n` +
                      `Has sido invitado/a a participar como ${STAKEHOLDER_ROLE_LABELS[stakeholder.role]} en el proceso de coaching de ${coacheeName}.\n\n` +
                      `Accede al portal desde aquí:\n${link}\n\n` +
                      `Este link es personal y expira el ${formatDate(stakeholder.tokenExpiresAt)}.\n\n` +
                      `Saludos`
                    );
                    window.open(`mailto:${stakeholder.email}?subject=${subject}&body=${body}`, '_blank');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
                  title="Enviar invitación por email"
                >
                  <Mail size={16} />
                  Email
                </button>
                
                {/* Renew Token (if expired) */}
                {(stakeholder.status === 'expired' || stakeholder.tokenExpiresAt.toDate() < new Date()) && (
                  <button
                    onClick={() => handleRenewToken(stakeholder.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                    title="Renovar acceso"
                  >
                    <RefreshCw size={16} />
                    Renovar
                  </button>
                )}
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(stakeholder.id)}
                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Eliminar stakeholder"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Info Card */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Portal de Stakeholders</h4>
        <p className="text-sm text-blue-800">
          Cada stakeholder recibe un link único para acceder a su portal personalizado donde pueden:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• <strong>Sponsor/HR:</strong> Ver progreso, completar 360°, participar en tripartita, ver reportes</li>
          <li>• <strong>Manager:</strong> Ver progreso, completar 360°, participar en tripartita</li>
          <li>• <strong>Pares/Reportes:</strong> Completar 360° feedback</li>
        </ul>
      </div>
    </div>
  );
}
