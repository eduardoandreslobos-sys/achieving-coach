'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Upload, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, userProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || user?.displayName || '');
      setEmail(user?.email || '');
    }
  }, [userProfile, user]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Ajustes</h1>
          <p className="text-gray-400">Gestiona la configuración de tu perfil y cuenta</p>
        </div>

        {/* Profile Section */}
        <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-semibold">Información de Perfil</h2>
          </div>

          {/* Profile Photo */}
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-white text-2xl font-medium overflow-hidden">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0) || 'U'
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                ×
              </button>
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Foto de Perfil</h3>
              <p className="text-gray-400 text-sm mb-3">Sube una foto profesional para ayudar a los clientes a reconocerte.</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" />
                Cambiar Foto
              </button>
            </div>
          </div>

          {/* Photo Requirements */}
          <div className="bg-[#1a1b23] border border-blue-900/20 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">REQUISITOS DE LA FOTO:</p>
            <ul className="text-gray-500 text-sm space-y-1">
              <li>• Formato: JPG, PNG, o WebP</li>
              <li>• Tamaño máximo: 2MB</li>
              <li>• Recomendado: 400×400 píxeles (cuadrado)</li>
            </ul>
          </div>

          <div className="border-t border-blue-900/20 pt-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nombre Visible</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 rounded-xl text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-600 text-xs mt-1">El correo electrónico no se puede cambiar.</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Rol</label>
              <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-lg">
                Coachee
              </span>
            </div>

            {/* Coach Info */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Tu Coach</label>
              <p className="text-gray-400 text-sm">
                Estás conectado con un coach. Ver{' '}
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">dashboard</Link>
                {' '}para más detalles.
              </p>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#12131a] border border-blue-900/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-blue-400" />
            <h2 className="text-white font-semibold">Cuenta</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-[#1a1b23] border border-blue-900/30 text-white rounded-xl text-left hover:bg-[#22232d] transition-colors">
              Cambiar contraseña
            </button>
            <button className="w-full px-4 py-3 bg-red-600/10 border border-red-900/30 text-red-400 rounded-xl text-left hover:bg-red-600/20 transition-colors">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
