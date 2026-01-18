'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Upload, Shield, Save, Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { db, auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast, Toaster } from 'sonner';
import imageCompression from 'browser-image-compression';

export default function SettingsPage() {
  const router = useRouter();
  const { user, userProfile, refreshProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || user?.displayName || '');
      setEmail(user?.email || '');
    }
  }, [userProfile, user]);

  const handleSaveProfile = async () => {
    if (!user || !name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: name.trim()
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Formato no válido. Usa JPG, PNG o WebP');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 2MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      // Compress image
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 400,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(storageRef, compressedFile);
      const photoURL = await getDownloadURL(storageRef);

      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success('Foto actualizada correctamente');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al subir la foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: null
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      toast.success('Foto eliminada');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Error al eliminar la foto');
    }
  };

  const handleChangePassword = async () => {
    if (!user || !user.email) return;

    if (newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setChangingPassword(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast.success('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Contraseña actual incorrecta');
      } else if (error.code === 'auth/weak-password') {
        toast.error('La contraseña es muy débil');
      } else {
        toast.error('Error al cambiar la contraseña');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const hasChanges = name !== (userProfile?.displayName || user?.displayName || '');

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-8">
      <Toaster position="top-center" richColors />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Ajustes</h1>
            <p className="text-gray-400">Gestiona la configuración de tu perfil y cuenta</p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar Cambios
            </button>
          )}
        </div>

        {/* Profile Section */}
        <div className="bg-[#12131a] border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-semibold">Información de Perfil</h2>
          </div>

          {/* Profile Photo */}
          <div className="flex items-start gap-6 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-white text-2xl font-medium overflow-hidden">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  name.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              {userProfile?.photoURL && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Foto de Perfil</h3>
              <p className="text-gray-400 text-sm mb-3">Sube una foto profesional para ayudar a tu coach a reconocerte.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {uploadingPhoto ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                {uploadingPhoto ? 'Subiendo...' : 'Cambiar Foto'}
              </button>
            </div>
          </div>

          {/* Photo Requirements */}
          <div className="bg-[#1a1b23] border border-gray-800 rounded-lg p-4 mb-6">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">REQUISITOS DE LA FOTO:</p>
            <ul className="text-gray-500 text-sm space-y-1">
              <li>• Formato: JPG, PNG, o WebP</li>
              <li>• Tamaño máximo: 2MB</li>
              <li>• Recomendado: 400×400 píxeles (cuadrado)</li>
            </ul>
          </div>

          <div className="border-t border-gray-800 pt-6 space-y-5">
            {/* Name */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Nombre Visible</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-600 text-xs mt-1">El correo electrónico no se puede cambiar.</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Rol</label>
              <span className="inline-block px-3 py-1 bg-emerald-600/20 text-emerald-400 text-sm rounded-lg capitalize">
                {userProfile?.role || 'Coachee'}
              </span>
            </div>

            {/* Coach Info */}
            {userProfile?.role === 'coachee' && (
              <div>
                <label className="block text-gray-400 text-sm mb-2">Tu Coach</label>
                <p className="text-gray-400 text-sm">
                  Estás conectado con un coach. Ver{' '}
                  <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">dashboard</Link>
                  {' '}para más detalles.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-[#12131a] border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-semibold">Cuenta</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full px-4 py-3 bg-[#1a1b23] border border-gray-800 text-white rounded-xl text-left hover:bg-[#22232d] transition-colors"
            >
              Cambiar contraseña
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600/10 border border-red-900/30 text-red-400 rounded-xl text-left hover:bg-red-600/20 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#12131a] border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Cambiar Contraseña</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Contraseña Actual</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-[#1a1b23] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-[#1a1b23] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Mínimo 8 caracteres</p>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-[#1a1b23] border border-gray-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                  {confirmPassword && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {newPassword === confirmPassword ? (
                        <Check className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-800">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {changingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
