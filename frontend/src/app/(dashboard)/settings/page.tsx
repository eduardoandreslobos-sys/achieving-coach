'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Bell, Lock, Globe, Palette, CreditCard, 
  Shield, LogOut, Save, Check, ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const { user, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sessionReminders: true,
    weeklyDigest: false,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificaciones', icon: Bell },
    { id: 'security', name: 'Seguridad', icon: Lock },
    { id: 'preferences', name: 'Preferencias', icon: Palette },
  ];

  return (
    <div className="p-6 lg:p-8 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-gray-400">Administra tu cuenta y preferencias.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] border border-gray-800 rounded-xl p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
              
              <hr className="border-gray-800 my-2" />
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Información del Perfil</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg hover:bg-[#222] transition-colors">
                      Cambiar Foto
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      defaultValue={userProfile?.displayName || ''}
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos sobre ti..."
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Preferencias de Notificación</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Notificaciones por Email', desc: 'Recibe actualizaciones importantes en tu correo' },
                    { key: 'push', label: 'Notificaciones Push', desc: 'Alertas en tiempo real en tu navegador' },
                    { key: 'sessionReminders', label: 'Recordatorios de Sesión', desc: 'Alertas antes de tus sesiones programadas' },
                    { key: 'weeklyDigest', label: 'Resumen Semanal', desc: 'Un resumen de tu progreso cada semana' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? 'bg-blue-600' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Seguridad</h2>
                
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Cambiar Contraseña</p>
                        <p className="text-gray-500 text-sm">Actualiza tu contraseña regularmente</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <p className="text-white font-medium">Autenticación de Dos Factores</p>
                        <p className="text-gray-500 text-sm">Añade una capa extra de seguridad</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded">Próximamente</span>
                  </button>

                  <div className="p-4 bg-[#1a1a1a] rounded-lg">
                    <p className="text-white font-medium mb-2">Sesiones Activas</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Este dispositivo</span>
                      <span className="text-emerald-400">Activo ahora</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-[#111111] border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Preferencias</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Idioma</label>
                    <select className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Zona Horaria</label>
                    <select className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500">
                      <option value="America/Santiago">Santiago (GMT-3)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/Madrid">Madrid (GMT+1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Tema</label>
                    <div className="flex gap-3">
                      <button className="flex-1 p-4 bg-[#0a0a0a] border-2 border-blue-500 rounded-lg text-center">
                        <Palette className="w-5 h-5 text-white mx-auto mb-1" />
                        <span className="text-white text-sm">Oscuro</span>
                      </button>
                      <button className="flex-1 p-4 bg-[#1a1a1a] border border-gray-700 rounded-lg text-center opacity-50 cursor-not-allowed">
                        <Palette className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-gray-400 text-sm">Claro</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Guardado
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
