'use client';

import { useState } from 'react';
import { X, Send, CheckCircle, Loader2 } from 'lucide-react';
import {
  InquiryFormData,
  InquiryUrgency,
  ContactMethod,
  InquirySource,
  URGENCY_LABELS,
  SPECIALTIES,
} from '@/types/directory';
import { createInquiry } from '@/services/directory.service';

interface InquiryFormProps {
  coachId: string;
  coachName: string;
  specialties: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CONTACT_METHODS: { value: ContactMethod; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Teléfono' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'video_call', label: 'Videollamada' },
];

export function InquiryForm({
  coachId,
  coachName,
  specialties,
  isOpen,
  onClose,
  onSuccess,
}: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<InquiryFormData>({
    prospectName: '',
    prospectEmail: '',
    prospectPhone: '',
    prospectCompany: '',
    prospectRole: '',
    message: '',
    interestAreas: [],
    urgency: 'exploring',
    preferredContactMethod: 'email',
    hasCoachingExperience: false,
    source: 'directory',
  });

  const updateField = <K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const toggleInterestArea = (area: string) => {
    const current = formData.interestAreas;
    if (current.includes(area)) {
      updateField('interestAreas', current.filter(a => a !== area));
    } else {
      updateField('interestAreas', [...current, area]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.prospectName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    if (!formData.prospectEmail.trim()) {
      setError('Por favor ingresa tu email');
      return;
    }
    if (!formData.message.trim()) {
      setError('Por favor escribe un mensaje');
      return;
    }

    setLoading(true);

    try {
      await createInquiry(coachId, coachName, formData);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      console.error('Error creating inquiry:', err);
      setError('Error al enviar la consulta. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        prospectName: '',
        prospectEmail: '',
        prospectPhone: '',
        prospectCompany: '',
        prospectRole: '',
        message: '',
        interestAreas: [],
        urgency: 'exploring',
        preferredContactMethod: 'email',
        hasCoachingExperience: false,
        source: 'directory',
      });
      setSuccess(false);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[var(--bg-card)] rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-xl font-bold text-[var(--fg-primary)]">
                Contactar a {coachName}
              </h2>
              <p className="text-sm text-[var(--fg-muted)] mt-1">
                Cuéntale sobre tus objetivos y necesidades
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-[var(--fg-muted)]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
                  ¡Consulta enviada!
                </h3>
                <p className="text-[var(--fg-muted)] mb-6">
                  {coachName} recibirá tu mensaje y te contactará pronto.
                </p>
                <button
                  onClick={handleClose}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Email row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--fg-primary)] mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.prospectName}
                      onChange={e => updateField('prospectName', e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                               text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--fg-primary)] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.prospectEmail}
                      onChange={e => updateField('prospectEmail', e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                               text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-primary)] mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.prospectPhone || ''}
                    onChange={e => updateField('prospectPhone', e.target.value)}
                    placeholder="+52 555 123 4567"
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                             text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Interest Areas */}
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                    Áreas de interés
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map(area => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleInterestArea(area)}
                        className={`
                          px-3 py-1.5 text-sm rounded-full transition-colors
                          ${formData.interestAreas.includes(area)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                          }
                        `}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                    ¿Cuándo te gustaría empezar?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(URGENCY_LABELS) as InquiryUrgency[]).map(urgency => (
                      <button
                        key={urgency}
                        type="button"
                        onClick={() => updateField('urgency', urgency)}
                        className={`
                          px-3 py-2 text-sm rounded-lg transition-colors
                          ${formData.urgency === urgency
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                          }
                        `}
                      >
                        {URGENCY_LABELS[urgency]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred contact method */}
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                    Medio de contacto preferido
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT_METHODS.map(method => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => updateField('preferredContactMethod', method.value)}
                        className={`
                          px-3 py-1.5 text-sm rounded-lg transition-colors
                          ${formData.preferredContactMethod === method.value
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                          }
                        `}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-[var(--fg-primary)] mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={e => updateField('message', e.target.value)}
                    rows={4}
                    placeholder="Cuéntale sobre tus objetivos, desafíos actuales o preguntas que tengas..."
                    className="w-full px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]
                             text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                             focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Coaching experience */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasCoachingExperience}
                    onChange={e => updateField('hasCoachingExperience', e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-secondary)]
                             text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-[var(--fg-muted)]">
                    He tenido experiencia previa con coaching
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50
                           text-white font-semibold rounded-xl transition-colors
                           flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar consulta</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InquiryForm;
