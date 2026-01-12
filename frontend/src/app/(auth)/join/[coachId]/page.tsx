'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function JoinCoachPage() {
  const params = useParams();
  const router = useRouter();
  const coachId = params?.coachId as string;

  const [coachInfo, setCoachInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const coachDoc = await getDoc(doc(db, 'users', coachId));

        if (coachDoc.exists()) {
          const data = coachDoc.data();

          if (data.role === 'coach') {
            setCoachInfo({ uid: coachDoc.id, ...data });
          } else {
            setError('Este enlace de invitación no es válido.');
          }
        } else {
          setError('Enlace de invitación inválido - coach no encontrado');
        }
      } catch (err: any) {
        setError('Error al cargar la información del coach');
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoach();
    } else {
      setError('No se proporcionó ID de coach');
      setLoading(false);
    }
  }, [coachId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: formData.email,
        role: 'coachee',
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        coacheeInfo: {
          coachId: coachId,
          coachName: coachInfo?.displayName || coachInfo?.firstName || "Coach",
          onboardingCompleted: true,
          goals: [],
        },
        createdAt: serverTimestamp(),
        subscriptionStatus: 'active',
        updatedAt: serverTimestamp(),
      });

      // Create conversation between coach and coachee
      await addDoc(collection(db, 'conversations'), {
        participants: [coachId, userCredential.user.uid],
        participantNames: {
          [coachId]: coachInfo?.displayName || 'Coach',
          [userCredential.user.uid]: `${formData.firstName} ${formData.lastName}`,
        },
        lastMessage: '¡Bienvenido! Tu coach te ha invitado a la plataforma.',
        lastMessageTime: serverTimestamp(),
        createdAt: serverTimestamp(),
        unreadCount: {
          [coachId]: 0,
          [userCredential.user.uid]: 1,
        },
      });

      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al crear la cuenta. Por favor intenta de nuevo.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando información del coach...</p>
        </div>
      </div>
    );
  }

  if (error && !coachInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="max-w-md w-full">
          <div className="bg-[#111111] border border-gray-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Enlace Inválido</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al Inicio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coachInitials = coachInfo?.displayName
    ? coachInfo.displayName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'C';

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-semibold text-white text-xl">AchievingCoach</span>
          </Link>
        </div>

        {/* Coach Info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {coachInitials}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Únete al coaching de {coachInfo?.displayName || 'tu coach'}
          </h1>
          <p className="text-gray-400">Crea tu cuenta para comenzar tu viaje de coaching</p>
        </div>

        {/* Benefits */}
        <div className="bg-[#111111] border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-white mb-3">Lo que obtendrás:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5 w-5 h-5" />
              <span className="text-sm text-gray-300">Sesiones de coaching personalizadas</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5 w-5 h-5" />
              <span className="text-sm text-gray-300">Seguimiento de metas y progreso</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5 w-5 h-5" />
              <span className="text-sm text-gray-300">Mensajería directa con tu coach</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-emerald-400 flex-shrink-0 mt-0.5 w-5 h-5" />
              <span className="text-sm text-gray-300">Acceso a herramientas y recursos</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-gray-800 rounded-xl p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Apellido *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar Contraseña *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear Cuenta
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/sign-in" className="text-blue-400 hover:text-blue-300">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
