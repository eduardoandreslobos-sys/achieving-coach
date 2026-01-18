'use client';

import { useState } from 'react';
import { Save, Settings, UserPlus, Globe, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [settings, setSettings] = useState({
    siteName: 'AchievingCoach',
    supportEmail: 'support@achievingcoach.com',
    maintenanceMode: false,
    allowSignups: true,
    requireEmailVerification: true,
    defaultTrialDays: 14,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Ajustes</h1>
          <p className="text-gray-400 mt-1">
            Configure los parámetros generales de la plataforma, gestione usuarios y establezca preferencias del sistema.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : saved ? '¡Guardado!' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Ajustes Generales */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Ajustes Generales</h2>
              <p className="text-sm text-gray-500">Información básica y configuración del sitio</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nombre del Sitio
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Este nombre aparecerá en la barra de título del navegador.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Correo de Soporte
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1b23] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Dirección para recibir consultas de los usuarios.</p>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="flex items-center justify-between py-4 border-t border-gray-800">
            <div>
              <p className="font-medium text-white">Modo de Mantenimiento</p>
              <p className="text-sm text-gray-500">Al activar esta opción, el sitio solo será accesible para administradores.</p>
            </div>
            <button
              onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.maintenanceMode ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Registro de Usuarios */}
        <div className="bg-[#12131a] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Registro de Usuarios</h2>
              <p className="text-sm text-gray-500">Control de acceso y onboarding</p>
            </div>
          </div>

          {/* Allow Signups */}
          <div className="flex items-center justify-between py-4 border-b border-gray-800">
            <div>
              <p className="font-medium text-white">Permitir Nuevos Registros</p>
              <p className="text-sm text-gray-500">Habilitar o deshabilitar el formulario de registro público.</p>
            </div>
            <button
              onClick={() => handleChange('allowSignups', !settings.allowSignups)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.allowSignups ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.allowSignups ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Require Email Verification */}
          <div className="flex items-center justify-between py-4 border-b border-gray-800">
            <div>
              <p className="font-medium text-white">Requerir Verificación de Correo</p>
              <p className="text-sm text-gray-500">Los usuarios deberán verificar su email antes de iniciar sesión.</p>
            </div>
            <button
              onClick={() => handleChange('requireEmailVerification', !settings.requireEmailVerification)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.requireEmailVerification ? 'bg-emerald-600' : 'bg-gray-700'
              }`}
            >
              <span 
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  settings.requireEmailVerification ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Trial Period */}
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-white">Periodo de Prueba</p>
              <p className="text-sm text-gray-500">Días gratuitos otorgados automáticamente al registrarse.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.defaultTrialDays}
                onChange={(e) => handleChange('defaultTrialDays', parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 bg-[#1a1b23] border border-gray-700 rounded-xl text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="text-gray-400 text-sm">DÍAS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
