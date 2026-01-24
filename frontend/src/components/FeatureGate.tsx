'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { FeatureSKU, FEATURE_DEFINITIONS } from '@/types/features';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';

interface FeatureGateProps {
  feature: FeatureSKU;
  children: ReactNode;
  // What to show when feature is not available
  fallback?: 'hide' | 'blur' | 'upgrade-prompt' | ReactNode;
  // Custom message for upgrade prompt
  upgradeMessage?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback = 'upgrade-prompt',
  upgradeMessage,
}: FeatureGateProps) {
  const { can, isLoading, getRequiredPlan } = useFeatureAccess();

  // While loading, show nothing or a skeleton
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  // If user has access, show the content
  if (can(feature)) {
    return <>{children}</>;
  }

  // User doesn't have access, show fallback
  const requiredPlan = getRequiredPlan(feature);
  const featureInfo = FEATURE_DEFINITIONS[feature];
  const planInfo = requiredPlan ? SUBSCRIPTION_PLANS.find((p) => p.id === requiredPlan) : null;

  // Hide completely
  if (fallback === 'hide') {
    return null;
  }

  // Blur the content
  if (fallback === 'blur') {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 rounded-lg">
          <div className="text-center p-4">
            <Lock className="w-8 h-8 text-[var(--fg-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--fg-muted)]">
              Requiere plan {planInfo?.name || 'superior'}
            </p>
            <Link
              href="/coach/billing"
              className="inline-flex items-center gap-1 mt-2 text-sm text-emerald-600 hover:text-emerald-700"
            >
              Actualizar plan
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show upgrade prompt
  if (fallback === 'upgrade-prompt') {
    return (
      <div className="border-2 border-dashed border-[var(--border-color)] rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--fg-primary)] mb-2">
          {featureInfo?.name || 'Función Premium'}
        </h3>
        <p className="text-sm text-[var(--fg-muted)] mb-4 max-w-md mx-auto">
          {upgradeMessage ||
            featureInfo?.description ||
            'Esta función está disponible en planes superiores.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs text-[var(--fg-muted)]">
            Disponible en: <strong>{planInfo?.name || 'Pro'}</strong>
          </span>
          <Link
            href="/coach/billing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Actualizar Plan
          </Link>
        </div>
      </div>
    );
  }

  // Custom fallback component
  return <>{fallback}</>;
}

// Simpler component for inline feature checks
interface FeatureCheckProps {
  feature: FeatureSKU;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureCheck({ feature, children, fallback = null }: FeatureCheckProps) {
  const { can, isLoading } = useFeatureAccess();

  if (isLoading) return null;
  if (can(feature)) return <>{children}</>;
  return <>{fallback}</>;
}

// Component to show upgrade badge
interface UpgradeBadgeProps {
  feature: FeatureSKU;
  size?: 'sm' | 'md';
}

export function UpgradeBadge({ feature, size = 'sm' }: UpgradeBadgeProps) {
  const { can, getRequiredPlan } = useFeatureAccess();

  if (can(feature)) return null;

  const requiredPlan = getRequiredPlan(feature);
  const planInfo = requiredPlan ? SUBSCRIPTION_PLANS.find((p) => p.id === requiredPlan) : null;

  return (
    <span
      className={`inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      <Lock className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {planInfo?.name || 'Pro'}
    </span>
  );
}

// Component for sidebar/navigation items that need feature check
interface FeatureNavItemProps {
  feature: FeatureSKU;
  children: ReactNode;
  href: string;
}

export function FeatureNavItem({ feature, children, href }: FeatureNavItemProps) {
  const { can } = useFeatureAccess();
  const hasAccess = can(feature);

  if (hasAccess) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <Link href="/coach/billing" className="opacity-50 cursor-not-allowed">
      <div className="flex items-center justify-between">
        {children}
        <Lock className="w-3 h-3 text-[var(--fg-muted)]" />
      </div>
    </Link>
  );
}
