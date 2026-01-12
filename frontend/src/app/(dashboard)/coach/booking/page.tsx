'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Calendar,
  Clock,
  Globe,
  Copy,
  Check,
  Save,
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Settings,
  Video,
  Link2,
  Unlink,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

interface TimeSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  enabled: boolean;
  slots: TimeSlot[];
}

interface GoogleCalendarTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
}

interface BookingSettings {
  enabled: boolean;
  title: string;
  description: string;
  duration: number;
  bufferBefore: number;
  bufferAfter: number;
  minNotice: number;
  maxAdvance: number;
  timezone: string;
  meetingLink: string;
  googleCalendar?: {
    connected: boolean;
    tokens?: GoogleCalendarTokens;
    syncEnabled: boolean;
    checkBusyTimes: boolean;
  };
  availability: {
    [key: string]: DayAvailability;
  };
}

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

const DEFAULT_SETTINGS: BookingSettings = {
  enabled: true,
  title: 'Sesión de Coaching',
  description: 'Reserva una sesión de coaching conmigo',
  duration: 60,
  bufferBefore: 0,
  bufferAfter: 15,
  minNotice: 24,
  maxAdvance: 30,
  timezone: 'America/Santiago',
  meetingLink: '',
  googleCalendar: {
    connected: false,
    syncEnabled: true,
    checkBusyTimes: true,
  },
  availability: {
    monday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    tuesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    wednesday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    thursday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    friday: { enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    saturday: { enabled: false, slots: [] },
    sunday: { enabled: false, slots: [] },
  },
};

export default function BookingSettingsPage() {
  const { user, userProfile } = useAuth();
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<BookingSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectingCalendar, setConnectingCalendar] = useState(false);

  const bookingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/book/${user?.uid}`
    : '';

  useEffect(() => {
    loadSettings();
  }, [user]);

  // Handle OAuth callback
  useEffect(() => {
    const calendarConnected = searchParams.get('calendar_connected');
    const tokens = searchParams.get('tokens');
    const error = searchParams.get('error');

    if (error) {
      const errorMessages: { [key: string]: string } = {
        oauth_denied: 'Acceso a Google Calendar denegado',
        missing_params: 'Parámetros faltantes en la respuesta',
        invalid_state: 'Estado de autenticación inválido',
        expired: 'La sesión de autenticación expiró',
        callback_failed: 'Error al procesar la autenticación',
      };
      toast.error(errorMessages[error] || 'Error al conectar Google Calendar');

      // Clear URL params
      window.history.replaceState({}, '', '/coach/booking');
    }

    if (calendarConnected === 'true' && tokens) {
      try {
        const tokenData = JSON.parse(Buffer.from(tokens, 'base64').toString());
        setSettings(prev => ({
          ...prev,
          googleCalendar: {
            ...prev.googleCalendar,
            connected: true,
            tokens: tokenData,
            syncEnabled: true,
            checkBusyTimes: true,
          },
        }));
        toast.success('Google Calendar conectado exitosamente');

        // Clear URL params
        window.history.replaceState({}, '', '/coach/booking');
      } catch (err) {
        console.error('Error parsing tokens:', err);
        toast.error('Error al procesar los tokens de Google');
      }
    }
  }, [searchParams]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      const settingsDoc = await getDoc(doc(db, 'booking_settings', user.uid));
      if (settingsDoc.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...settingsDoc.data() as BookingSettings });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'booking_settings', user.uid), {
        ...settings,
        coachId: user.uid,
        coachName: userProfile?.displayName || '',
        coachEmail: user.email,
        updatedAt: serverTimestamp(),
      });
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    toast.success('Link copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectGoogleCalendar = async () => {
    if (!user) return;

    setConnectingCalendar(true);
    try {
      const response = await fetch(`/api/google/auth?userId=${user.uid}`);
      const data = await response.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error('No auth URL received');
      }
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      toast.error('Error al conectar con Google Calendar');
      setConnectingCalendar(false);
    }
  };

  const handleDisconnectGoogleCalendar = () => {
    setSettings(prev => ({
      ...prev,
      googleCalendar: {
        connected: false,
        syncEnabled: false,
        checkBusyTimes: false,
        tokens: undefined,
      },
    }));
    toast.success('Google Calendar desconectado');
  };

  const toggleDay = (day: string) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          enabled: !prev.availability[day].enabled,
          slots: !prev.availability[day].enabled ? [{ start: '09:00', end: '17:00' }] : [],
        },
      },
    }));
  };

  const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: prev.availability[day].slots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          ),
        },
      },
    }));
  };

  const addSlot = (day: string) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: [...prev.availability[day].slots, { start: '09:00', end: '17:00' }],
        },
      },
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setSettings(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          slots: prev.availability[day].slots.filter((_, i) => i !== index),
        },
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Booking Público</h1>
            <p className="text-gray-400">Configura tu disponibilidad y permite que clientes reserven sesiones</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Cambios
          </button>
        </div>

        {/* Booking Link Card */}
        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Tu Link de Booking</h3>
                <p className="text-gray-400 text-sm">Comparte este link con tus clientes potenciales</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${settings.enabled ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                <span className="text-sm text-gray-400">{settings.enabled ? 'Activo' : 'Inactivo'}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={bookingUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-gray-300 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
            <Link
              href={`/book/${user?.uid}`}
              target="_blank"
              className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver
            </Link>
          </div>
        </div>

        {/* Google Calendar Integration */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Google Calendar</h3>
                <p className="text-gray-400 text-sm">
                  {settings.googleCalendar?.connected
                    ? 'Conectado - Las reservas se sincronizarán automáticamente'
                    : 'Sincroniza reservas automáticamente con tu calendario'}
                </p>
              </div>
            </div>
            {settings.googleCalendar?.connected ? (
              <button
                onClick={handleDisconnectGoogleCalendar}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                <Unlink className="w-4 h-4" />
                Desconectar
              </button>
            ) : (
              <button
                onClick={handleConnectGoogleCalendar}
                disabled={connectingCalendar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {connectingCalendar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                Conectar
              </button>
            )}
          </div>

          {settings.googleCalendar?.connected && (
            <div className="border-t border-gray-800 pt-4 mt-4 space-y-3">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm">Crear eventos en calendario</span>
                  <p className="text-gray-500 text-xs">Crea un evento cuando se confirma una reserva</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.googleCalendar?.syncEnabled || false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      googleCalendar: {
                        ...prev.googleCalendar!,
                        syncEnabled: e.target.checked,
                      },
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-white text-sm">Verificar disponibilidad</span>
                  <p className="text-gray-500 text-xs">Bloquea horarios ocupados en tu calendario</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.googleCalendar?.checkBusyTimes || false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      googleCalendar: {
                        ...prev.googleCalendar!,
                        checkBusyTimes: e.target.checked,
                      },
                    }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </label>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Session Settings */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-blue-400" />
              <h2 className="text-white font-semibold">Configuración de Sesión</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Título de la Sesión</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Descripción</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Duración (min)</label>
                  <select
                    value={settings.duration}
                    onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={30}>30 minutos</option>
                    <option value={45}>45 minutos</option>
                    <option value={60}>60 minutos</option>
                    <option value={90}>90 minutos</option>
                    <option value={120}>120 minutos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Buffer después (min)</label>
                  <select
                    value={settings.bufferAfter}
                    onChange={(e) => setSettings({ ...settings, bufferAfter: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={0}>Sin buffer</option>
                    <option value={5}>5 minutos</option>
                    <option value={10}>10 minutos</option>
                    <option value={15}>15 minutos</option>
                    <option value={30}>30 minutos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Aviso mínimo (horas)</label>
                  <select
                    value={settings.minNotice}
                    onChange={(e) => setSettings({ ...settings, minNotice: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={1}>1 hora</option>
                    <option value={2}>2 horas</option>
                    <option value={4}>4 horas</option>
                    <option value={12}>12 horas</option>
                    <option value={24}>24 horas</option>
                    <option value={48}>48 horas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Máximo anticipación (días)</label>
                  <select
                    value={settings.maxAdvance}
                    onChange={(e) => setSettings({ ...settings, maxAdvance: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value={7}>7 días</option>
                    <option value={14}>14 días</option>
                    <option value={30}>30 días</option>
                    <option value={60}>60 días</option>
                    <option value={90}>90 días</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Video className="w-4 h-4 inline mr-1" />
                  Link de Videollamada (Zoom, Meet, etc.)
                </label>
                <input
                  type="url"
                  value={settings.meetingLink}
                  onChange={(e) => setSettings({ ...settings, meetingLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Availability Settings */}
          <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <h2 className="text-white font-semibold">Disponibilidad Semanal</h2>
            </div>

            <div className="space-y-4">
              {DAYS.map(({ key, label }) => (
                <div key={key} className="border border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.availability[key]?.enabled || false}
                          onChange={() => toggleDay(key)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                      <span className={`font-medium ${settings.availability[key]?.enabled ? 'text-white' : 'text-gray-500'}`}>
                        {label}
                      </span>
                    </div>
                    {settings.availability[key]?.enabled && (
                      <button
                        onClick={() => addSlot(key)}
                        className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Agregar
                      </button>
                    )}
                  </div>

                  {settings.availability[key]?.enabled && (
                    <div className="space-y-2">
                      {settings.availability[key].slots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(key, index, 'start', e.target.value)}
                            className="px-3 py-1.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(key, index, 'end', e.target.value)}
                            className="px-3 py-1.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                          />
                          {settings.availability[key].slots.length > 1 && (
                            <button
                              onClick={() => removeSlot(key, index)}
                              className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
