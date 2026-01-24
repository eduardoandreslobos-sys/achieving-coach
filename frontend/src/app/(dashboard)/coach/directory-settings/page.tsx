'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Save,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Plus,
  X,
} from 'lucide-react';
import {
  CoachPublicProfile,
  CoachProfileFormData,
  SPECIALTIES,
  LANGUAGES,
  METHODOLOGIES,
  WORK_WITH_OPTIONS,
  CERTIFICATIONS,
  DEFAULT_PRICE_RANGE,
  DEFAULT_AVAILABILITY,
} from '@/types/directory';
import {
  getCoachProfileByUserId,
  createCoachProfile,
  updateCoachProfile,
  setProfilePublishStatus,
  setAcceptingNewClients,
} from '@/services/directory.service';
import { FeatureGate } from '@/components/FeatureGate';

type TabType = 'basic' | 'professional' | 'pricing' | 'preview';

export default function DirectorySettingsPage() {
  return (
    <FeatureGate feature="directory.profile" fallback="upgrade-prompt">
      <DirectorySettingsContent />
    </FeatureGate>
  );
}

function DirectorySettingsContent() {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CoachPublicProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<CoachProfileFormData>({
    displayName: '',
    headline: '',
    bio: '',
    shortBio: '',
    photoURL: '',
    coverPhotoURL: '',
    specialties: [],
    certifications: [],
    languages: ['Español'],
    yearsExperience: 0,
    sessionPrice: DEFAULT_PRICE_RANGE,
    availability: DEFAULT_AVAILABILITY,
    location: {
      city: '',
      country: '',
      timezone: 'America/Mexico_City',
      isRemoteOnly: true,
    },
    worksWith: [],
    industries: [],
    methodology: [],
    linkedInUrl: '',
    websiteUrl: '',
    instagramUrl: '',
    videoIntroUrl: '',
    isPublished: false,
    acceptingNewClients: true,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const existingProfile = await getCoachProfileByUserId(user.uid);
      if (existingProfile) {
        setProfile(existingProfile);
        setFormData({
          displayName: existingProfile.displayName || userProfile?.displayName || '',
          headline: existingProfile.headline || '',
          bio: existingProfile.bio || '',
          shortBio: existingProfile.shortBio || '',
          photoURL: existingProfile.photoURL || userProfile?.photoURL || '',
          coverPhotoURL: existingProfile.coverPhotoURL || '',
          specialties: existingProfile.specialties || [],
          certifications: existingProfile.certifications || [],
          languages: existingProfile.languages || ['Español'],
          yearsExperience: existingProfile.yearsExperience || 0,
          sessionPrice: existingProfile.sessionPrice || DEFAULT_PRICE_RANGE,
          availability: existingProfile.availability || DEFAULT_AVAILABILITY,
          location: existingProfile.location || {
            city: '',
            country: '',
            timezone: 'America/Mexico_City',
            isRemoteOnly: true,
          },
          worksWith: existingProfile.worksWith || [],
          industries: existingProfile.industries || [],
          methodology: existingProfile.methodology || [],
          linkedInUrl: existingProfile.linkedInUrl || '',
          websiteUrl: existingProfile.websiteUrl || '',
          instagramUrl: existingProfile.instagramUrl || '',
          videoIntroUrl: existingProfile.videoIntroUrl || '',
          isPublished: existingProfile.isPublished || false,
          acceptingNewClients: existingProfile.acceptingNewClients ?? true,
        });
      } else {
        // Pre-fill with user data
        setFormData(prev => ({
          ...prev,
          displayName: userProfile?.displayName || '',
          photoURL: userProfile?.photoURL || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Error al cargar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof CoachProfileFormData>(
    field: K,
    value: CoachProfileFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'specialties' | 'certifications' | 'languages' | 'worksWith' | 'methodology', item: string) => {
    const current = formData[field];
    if (current.includes(item)) {
      updateField(field, current.filter(i => i !== item));
    } else {
      updateField(field, [...current, item]);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      if (profile) {
        await updateCoachProfile(profile.id, formData);
      } else {
        const newProfileId = await createCoachProfile(user.uid, formData);
        const newProfile = await getCoachProfileByUserId(user.uid);
        setProfile(newProfile);
      }
      setMessage({ type: 'success', text: 'Perfil guardado correctamente' });
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Error al guardar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!profile) {
      await handleSave();
      return;
    }

    setSaving(true);
    try {
      await setProfilePublishStatus(profile.id, !profile.isPublished);
      setProfile(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
      setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }));
      setMessage({
        type: 'success',
        text: profile.isPublished ? 'Perfil despublicado' : 'Perfil publicado en el directorio',
      });
    } catch (error) {
      console.error('Error toggling publish:', error);
      setMessage({ type: 'error', text: 'Error al cambiar estado de publicación' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvailabilityToggle = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await setAcceptingNewClients(profile.id, !profile.acceptingNewClients);
      setProfile(prev => prev ? { ...prev, acceptingNewClients: !prev.acceptingNewClients } : null);
      setFormData(prev => ({ ...prev, acceptingNewClients: !prev.acceptingNewClients }));
    } catch (error) {
      console.error('Error toggling availability:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'basic', label: 'Información Básica' },
    { id: 'professional', label: 'Profesional' },
    { id: 'pricing', label: 'Precios y Ubicación' },
    { id: 'preview', label: 'Vista Previa' },
  ];

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--fg-primary)]">
            Configuración del Directorio
          </h1>
          <p className="text-[var(--fg-muted)] mt-1">
            Administra tu perfil público en el directorio de coaches
          </p>
        </div>

        <div className="flex items-center gap-3">
          {profile?.isPublished ? (
            <a
              href={`/coaches/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]
                       text-[var(--fg-muted)] rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver perfil público
            </a>
          ) : null}

          <button
            onClick={handlePublishToggle}
            disabled={saving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${formData.isPublished
                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }
            `}
          >
            {formData.isPublished ? (
              <>
                <EyeOff className="w-4 h-4" />
                Despublicar
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Publicar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.isPublished ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                {formData.isPublished ? (
                  <Globe className="w-5 h-5 text-emerald-400" />
                ) : (
                  <EyeOff className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div>
                <div className="font-medium text-[var(--fg-primary)]">Estado</div>
                <div className="text-sm text-[var(--fg-muted)]">
                  {formData.isPublished ? 'Publicado' : 'Borrador'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.acceptingNewClients ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <CheckCircle className={`w-5 h-5 ${formData.acceptingNewClients ? 'text-emerald-400' : 'text-red-400'}`} />
              </div>
              <div>
                <div className="font-medium text-[var(--fg-primary)]">Disponibilidad</div>
                <div className="text-sm text-[var(--fg-muted)]">
                  {formData.acceptingNewClients ? 'Aceptando clientes' : 'No disponible'}
                </div>
              </div>
            </div>
            <button
              onClick={handleAvailabilityToggle}
              disabled={!profile || saving}
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              Cambiar
            </button>
          </div>
        </div>

        <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-medium text-[var(--fg-primary)]">Valoración</div>
              <div className="text-sm text-[var(--fg-muted)]">
                {profile?.rating ? `${profile.rating.toFixed(1)} (${profile.reviewCount} reseñas)` : 'Sin reseñas'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`
          p-4 rounded-xl mb-6 flex items-center gap-3
          ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}
        `}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)] mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'text-emerald-400 border-emerald-400'
                : 'text-[var(--fg-muted)] border-transparent hover:text-[var(--fg-primary)]'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Name and headline */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                  Nombre para mostrar *
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={e => updateField('displayName', e.target.value)}
                  placeholder="Tu nombre profesional"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                  Titular *
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => updateField('headline', e.target.value)}
                  placeholder="Coach Ejecutivo | Especialista en Liderazgo"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Short bio */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                Bio corta (para tarjetas)
              </label>
              <input
                type="text"
                value={formData.shortBio}
                onChange={e => updateField('shortBio', e.target.value)}
                maxLength={150}
                placeholder="Una línea que describa tu enfoque (máx 150 caracteres)"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <div className="text-xs text-[var(--fg-muted)] mt-1">
                {formData.shortBio.length}/150 caracteres
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                Biografía completa *
              </label>
              <textarea
                value={formData.bio}
                onChange={e => updateField('bio', e.target.value)}
                rows={6}
                placeholder="Describe tu experiencia, enfoque y qué te hace único como coach..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                URL de foto de perfil
              </label>
              <input
                type="url"
                value={formData.photoURL}
                onChange={e => updateField('photoURL', e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Video intro */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                Video de presentación (YouTube/Vimeo)
              </label>
              <input
                type="url"
                value={formData.videoIntroUrl || ''}
                onChange={e => updateField('videoIntroUrl', e.target.value)}
                placeholder="https://www.youtube.com/embed/..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                         focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-8">
            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Especialidades *
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(specialty => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleArrayItem('specialties', specialty)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${formData.specialties.includes(specialty)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                      }
                    `}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Certificaciones
              </label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map(cert => (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => toggleArrayItem('certifications', cert)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${formData.certifications.includes(cert)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                      }
                    `}
                  >
                    {cert}
                  </button>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Metodología
              </label>
              <div className="flex flex-wrap gap-2">
                {METHODOLOGIES.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => toggleArrayItem('methodology', method)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${formData.methodology.includes(method)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                      }
                    `}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Works with */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Trabaja con
              </label>
              <div className="flex flex-wrap gap-2">
                {WORK_WITH_OPTIONS.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleArrayItem('worksWith', option)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${formData.worksWith.includes(option)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Idiomas
              </label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(language => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleArrayItem('languages', language)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-colors
                      ${formData.languages.includes(language)
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--fg-muted)] hover:bg-[var(--bg-tertiary)]'
                      }
                    `}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            {/* Years of experience */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                Años de experiencia
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.yearsExperience}
                onChange={e => updateField('yearsExperience', parseInt(e.target.value) || 0)}
                className="w-32 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Social links */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={formData.linkedInUrl || ''}
                  onChange={e => updateField('linkedInUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                  Sitio web
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl || ''}
                  onChange={e => updateField('websiteUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                           text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8">
            {/* Session price */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Precio por sesión
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1">Mínimo</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sessionPrice.min}
                    onChange={e => updateField('sessionPrice', {
                      ...formData.sessionPrice,
                      min: parseInt(e.target.value) || 0,
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                             text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1">Máximo</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sessionPrice.max}
                    onChange={e => updateField('sessionPrice', {
                      ...formData.sessionPrice,
                      max: parseInt(e.target.value) || 0,
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                             text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--fg-muted)] mb-1">Moneda</label>
                  <select
                    value={formData.sessionPrice.currency}
                    onChange={e => updateField('sessionPrice', {
                      ...formData.sessionPrice,
                      currency: e.target.value,
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                             text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-3">
                Ubicación
              </label>
              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.location.isRemoteOnly}
                  onChange={e => updateField('location', {
                    ...formData.location,
                    isRemoteOnly: e.target.checked,
                  })}
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-secondary)]
                           text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                />
                <span className="text-[var(--fg-muted)]">
                  Solo sesiones online (remoto)
                </span>
              </label>

              {!formData.location.isRemoteOnly && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[var(--fg-muted)] mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={e => updateField('location', {
                        ...formData.location,
                        city: e.target.value,
                      })}
                      placeholder="Ciudad de México"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                               text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--fg-muted)] mb-1">País</label>
                    <input
                      type="text"
                      value={formData.location.country}
                      onChange={e => updateField('location', {
                        ...formData.location,
                        country: e.target.value,
                      })}
                      placeholder="México"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                               text-[var(--fg-primary)] placeholder:text-[var(--fg-muted)]
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-[var(--fg-primary)] mb-2">
                Zona horaria
              </label>
              <select
                value={formData.location.timezone}
                onChange={e => updateField('location', {
                  ...formData.location,
                  timezone: e.target.value,
                })}
                className="w-full md:w-auto px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]
                         text-[var(--fg-primary)] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                <option value="America/New_York">Nueva York (GMT-5)</option>
                <option value="America/Los_Angeles">Los Ángeles (GMT-8)</option>
                <option value="America/Bogota">Bogotá (GMT-5)</option>
                <option value="America/Lima">Lima (GMT-5)</option>
                <option value="America/Buenos_Aires">Buenos Aires (GMT-3)</option>
                <option value="America/Santiago">Santiago (GMT-4)</option>
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="text-center py-8">
            <p className="text-[var(--fg-muted)] mb-4">
              Guarda tus cambios y visita tu perfil público para ver cómo se verá.
            </p>
            {profile?.isPublished && (
              <a
                href={`/coaches/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600
                         text-white font-semibold rounded-xl transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Ver perfil público
              </a>
            )}
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600
                   disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </div>
  );
}
