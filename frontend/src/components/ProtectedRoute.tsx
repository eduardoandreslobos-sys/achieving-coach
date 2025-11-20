'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // No hay usuario autenticado
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Usuario autenticado pero sin perfil -> onboarding
    if (!userProfile) {
      router.push('/onboarding');
      return;
    }

    // Verificar rol si es necesario
    if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
      // Redirigir según el rol
      if (userProfile.role === 'coach') {
        router.push('/coach');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // Verificar suscripción SOLO para COACHES (ellos pagan la plataforma)
    if (userProfile.role === 'coach') {
      const now = new Date();
      
      // Convertir Timestamp de Firestore a Date si es necesario
      let trialEndsAt: Date | null = null;
      if (userProfile.trialEndsAt) {
        if (typeof userProfile.trialEndsAt === 'object' && 'toDate' in userProfile.trialEndsAt) {
          trialEndsAt = (userProfile.trialEndsAt as any).toDate();
        } else if (userProfile.trialEndsAt instanceof Date) {
          trialEndsAt = userProfile.trialEndsAt;
        } else {
          trialEndsAt = new Date(userProfile.trialEndsAt as any);
        }
      }
      
      // LÓGICA CORREGIDA:
      // 1. Si está en trial, verificar si expiró
      if (userProfile.subscriptionStatus === 'trial' && trialEndsAt) {
        if (now > trialEndsAt) {
          router.push('/subscription-expired');
          return;
        }
      }
      
      // 2. Si está 'expired' PERO tiene trialEndsAt válido, verificar la fecha
      if (userProfile.subscriptionStatus === 'expired' && trialEndsAt) {
        if (now > trialEndsAt) {
          router.push('/subscription-expired');
          return;
        }
        // Si tiene 'expired' pero el trial no expiró, dejar pasar (es un error de datos)
      }
      
      // 3. Si está 'expired' y NO tiene trialEndsAt, bloquear
      if (userProfile.subscriptionStatus === 'expired' && !trialEndsAt) {
        router.push('/subscription-expired');
        return;
      }
      
      // 4. Si está 'canceled', bloquear siempre
      if (userProfile.subscriptionStatus === 'canceled') {
        router.push('/subscription-expired');
        return;
      }
      
      // 5. Si está 'past_due', permitir acceso pero mostrar advertencia (futuro)
      // if (userProfile.subscriptionStatus === 'past_due') {
      //   // Mostrar banner de advertencia pero permitir acceso
      // }
    }

    // Coachees NO necesitan suscripción (son clientes de los coaches)

    // Todo OK
    setIsChecking(false);
  }, [user, userProfile, loading, router, allowedRoles]);

  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
