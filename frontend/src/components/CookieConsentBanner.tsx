'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Settings, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp?: string;
  version?: string;
}

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1.0.0';

export default function CookieConsentBanner() {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: true,
  });

  useEffect(() => {
    // Check if consent has been given
    const storedConsent = localStorage.getItem(CONSENT_KEY);

    if (storedConsent) {
      try {
        const parsed = JSON.parse(storedConsent) as CookiePreferences;
        // Check if consent version is current
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed);
          applyConsent(parsed);
          return;
        }
      } catch {
        // Invalid stored consent, show banner
      }
    }

    // Show banner after a short delay
    const timer = setTimeout(() => setShowBanner(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const applyConsent = (prefs: CookiePreferences) => {
    // Enable/disable analytics based on consent
    if (typeof window !== 'undefined') {
      if (prefs.analytics) {
        // Enable Google Analytics
        (window as any).gtag?.('consent', 'update', {
          analytics_storage: 'granted',
        });
      } else {
        // Disable Google Analytics
        (window as any).gtag?.('consent', 'update', {
          analytics_storage: 'denied',
        });
      }

      if (prefs.marketing) {
        // Enable marketing cookies
        (window as any).gtag?.('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else {
        // Disable marketing cookies
        (window as any).gtag?.('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  const saveConsent = async (prefs: CookiePreferences) => {
    const consentData: CookiePreferences = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    // Save to localStorage
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));

    // Apply consent settings
    applyConsent(prefs);

    // Sync with backend if user is authenticated
    if (user) {
      try {
        const token = await user.getIdToken();
        await fetch('/api/v1/privacy/consent/cookies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            analytics: prefs.analytics,
            marketing: prefs.marketing,
            functional: prefs.functional,
          }),
        });
      } catch (error) {
        console.error('Failed to sync cookie consent:', error);
      }
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: true,
    };
    setPreferences(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustom = () => {
    saveConsent(preferences);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
          {!showSettings ? (
            // Main Banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-600/20 rounded-xl">
                  <Cookie className="w-6 h-6 text-[var(--accent-primary)]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
                    Usamos cookies para mejorar tu experiencia
                  </h3>
                  <p className="text-[var(--fg-muted)] text-sm mb-4">
                    Utilizamos cookies esenciales para el funcionamiento del sitio, y cookies opcionales
                    para analytics y marketing. Puedes personalizar tus preferencias o aceptar todas.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Aceptar todas
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="px-5 py-2.5 bg-[var(--bg-tertiary)] text-[var(--fg-primary)] border border-[var(--border-color)] rounded-lg font-medium hover:bg-[var(--bg-primary)] transition-colors"
                    >
                      Solo necesarias
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-5 py-2.5 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--fg-primary)]">
                    Preferencias de Cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[var(--fg-primary)]">Cookies Necesarias</h4>
                    <p className="text-sm text-[var(--fg-muted)]">
                      Esenciales para el funcionamiento del sitio. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-600 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[var(--fg-primary)]">Cookies Funcionales</h4>
                    <p className="text-sm text-[var(--fg-muted)]">
                      Permiten recordar preferencias y mejorar la funcionalidad.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, functional: !preferences.functional })}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.functional ? 'bg-emerald-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[var(--fg-primary)]">Cookies de Analytics</h4>
                    <p className="text-sm text-[var(--fg-muted)]">
                      Nos ayudan a entender cómo usas el sitio para mejorarlo.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? 'bg-emerald-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl">
                  <div>
                    <h4 className="font-medium text-[var(--fg-primary)]">Cookies de Marketing</h4>
                    <p className="text-sm text-[var(--fg-muted)]">
                      Permiten mostrarte anuncios relevantes en otros sitios.
                    </p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.marketing ? 'bg-emerald-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full" />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-2.5 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCustom}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Guardar preferencias
                </button>
              </div>
            </div>
          )}

          {/* Footer with links */}
          <div className="px-6 py-3 bg-[var(--bg-tertiary)] border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--fg-muted)]">
            <span>Cumplimos con GDPR y CCPA</span>
            <div className="flex gap-4">
              <a href="/privacy-policy" className="hover:text-[var(--fg-primary)] transition-colors">
                Política de Privacidad
              </a>
              <a href="/cookie-policy" className="hover:text-[var(--fg-primary)] transition-colors">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
