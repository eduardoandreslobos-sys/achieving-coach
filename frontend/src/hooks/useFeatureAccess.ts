'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCoachSubscription } from '@/services/subscription.service';
import { CoachSubscription, PlanTier, isActiveSubscription } from '@/types/subscription';
import {
  FeatureSKU,
  PlanLimits,
  hasFeature,
  getPlanLimit,
  PLAN_FEATURES,
  PLAN_LIMITS,
} from '@/types/features';

interface FeatureAccessState {
  subscription: CoachSubscription | null;
  planId: PlanTier | null;
  isLoading: boolean;
  isSubscribed: boolean;
}

interface UseFeatureAccessReturn extends FeatureAccessState {
  // Check if user has access to a specific feature
  can: (feature: FeatureSKU) => boolean;

  // Check multiple features at once
  canAll: (features: FeatureSKU[]) => boolean;
  canAny: (features: FeatureSKU[]) => boolean;

  // Get plan limits
  getLimit: (limit: keyof PlanLimits) => number | null;

  // Check if user is within limits
  isWithinLimit: (limit: keyof PlanLimits, currentUsage: number) => boolean;

  // Get the minimum required plan for a feature
  getRequiredPlan: (feature: FeatureSKU) => PlanTier | null;

  // Refresh subscription data
  refresh: () => Promise<void>;
}

export function useFeatureAccess(): UseFeatureAccessReturn {
  const { user } = useAuth();
  const [state, setState] = useState<FeatureAccessState>({
    subscription: null,
    planId: null,
    isLoading: true,
    isSubscribed: false,
  });

  const loadSubscription = useCallback(async () => {
    if (!user?.uid) {
      setState({
        subscription: null,
        planId: null,
        isLoading: false,
        isSubscribed: false,
      });
      return;
    }

    try {
      const subscription = await getCoachSubscription(user.uid);
      const isActive = subscription ? isActiveSubscription(subscription.status) : false;

      // TODO: Revertir cuando Stripe esté activo - por ahora todos tienen acceso Pro
      setState({
        subscription,
        planId: isActive ? subscription?.planId || 'pro' : 'pro',
        isLoading: false,
        isSubscribed: true,
      });
    } catch (error) {
      console.error('Error loading subscription:', error);
      // TODO: Revertir a planId: null, isSubscribed: false cuando Stripe esté activo
      setState({
        subscription: null,
        planId: 'pro',
        isLoading: false,
        isSubscribed: true,
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  // Check if user has access to a specific feature
  const can = useCallback(
    (feature: FeatureSKU): boolean => {
      return hasFeature(state.planId, feature);
    },
    [state.planId]
  );

  // Check if user has access to all specified features
  const canAll = useCallback(
    (features: FeatureSKU[]): boolean => {
      return features.every((feature) => hasFeature(state.planId, feature));
    },
    [state.planId]
  );

  // Check if user has access to any of the specified features
  const canAny = useCallback(
    (features: FeatureSKU[]): boolean => {
      return features.some((feature) => hasFeature(state.planId, feature));
    },
    [state.planId]
  );

  // Get a specific limit for the user's plan
  const getLimit = useCallback(
    (limit: keyof PlanLimits): number | null => {
      return getPlanLimit(state.planId, limit);
    },
    [state.planId]
  );

  // Check if user is within a specific limit
  const isWithinLimit = useCallback(
    (limit: keyof PlanLimits, currentUsage: number): boolean => {
      const planLimit = getPlanLimit(state.planId, limit);
      if (planLimit === null) return true; // null means unlimited
      return currentUsage < planLimit;
    },
    [state.planId]
  );

  // Get the minimum required plan for a feature
  const getRequiredPlan = useCallback((feature: FeatureSKU): PlanTier | null => {
    const plans: PlanTier[] = ['core', 'pro', 'enterprise'];

    for (const plan of plans) {
      if (PLAN_FEATURES[plan]?.includes(feature)) {
        return plan;
      }
    }

    return null;
  }, []);

  return {
    ...state,
    can,
    canAll,
    canAny,
    getLimit,
    isWithinLimit,
    getRequiredPlan,
    refresh: loadSubscription,
  };
}

// Simpler hook for just checking a single feature
export function useCanAccess(feature: FeatureSKU): {
  canAccess: boolean;
  isLoading: boolean;
  requiredPlan: PlanTier | null;
} {
  const { can, isLoading, getRequiredPlan } = useFeatureAccess();

  return {
    canAccess: can(feature),
    isLoading,
    requiredPlan: getRequiredPlan(feature),
  };
}
