import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  CoachSubscription,
  BillingHistory,
  PlanTier,
  SubscriptionStatus,
  SUBSCRIPTION_PLANS,
  getPlanById,
} from '@/types/subscription';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const BILLING_HISTORY_COLLECTION = 'billing_history';

// ==================== Subscription Management ====================

export async function getCoachSubscription(
  coachId: string
): Promise<CoachSubscription | null> {
  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, coachId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as CoachSubscription;
}

export async function createOrUpdateSubscription(
  coachId: string,
  data: Partial<CoachSubscription>
): Promise<void> {
  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, coachId);
  const existing = await getDoc(docRef);

  if (existing.exists()) {
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } else {
    await setDoc(docRef, {
      ...data,
      oderId: coachId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

export async function updateSubscriptionStatus(
  coachId: string,
  status: SubscriptionStatus,
  additionalData?: Partial<CoachSubscription>
): Promise<void> {
  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, coachId);
  await updateDoc(docRef, {
    status,
    ...additionalData,
    updatedAt: Timestamp.now(),
  });
}

export async function cancelSubscription(
  coachId: string,
  cancelAtPeriodEnd: boolean = true
): Promise<void> {
  const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, coachId);
  await updateDoc(docRef, {
    cancelAtPeriodEnd,
    canceledAt: cancelAtPeriodEnd ? null : Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

// ==================== Billing History ====================

export async function getBillingHistory(
  coachId: string
): Promise<BillingHistory[]> {
  const q = query(
    collection(db, BILLING_HISTORY_COLLECTION),
    where('oderId', '==', coachId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BillingHistory[];
}

export async function addBillingRecord(
  data: Omit<BillingHistory, 'id'>
): Promise<string> {
  const docRef = doc(collection(db, BILLING_HISTORY_COLLECTION));
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// ==================== API Calls ====================

export async function createCheckoutSession(
  priceId: string,
  billingInterval: 'month' | 'year'
): Promise<{ sessionId: string; url: string } | { error: string }> {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId, billingInterval }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Error creating checkout session' };
    }

    return { sessionId: data.sessionId, url: data.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'Error connecting to payment service' };
  }
}

export async function createBillingPortalSession(): Promise<
  { url: string } | { error: string }
> {
  try {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Error creating portal session' };
    }

    return { url: data.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    return { error: 'Error connecting to payment service' };
  }
}

// ==================== Plan Helpers ====================

export function getCurrentPlanFeatures(planId: PlanTier) {
  const plan = getPlanById(planId);
  if (!plan) return [];
  return plan.features.filter((f) => f.included);
}

export function getUpgradeOptions(currentPlanId: PlanTier) {
  const planHierarchy: Record<PlanTier, number> = {
    core: 0,
    pro: 1,
    enterprise: 2,
  };

  const currentLevel = planHierarchy[currentPlanId];

  return SUBSCRIPTION_PLANS.filter(
    (plan) => planHierarchy[plan.id] > currentLevel
  );
}

export function calculateYearlySavings(plan: typeof SUBSCRIPTION_PLANS[0]): number {
  const monthlyTotal = plan.priceMonthly * 12;
  return monthlyTotal - plan.priceYearly;
}

export function calculateYearlySavingsPercentage(plan: typeof SUBSCRIPTION_PLANS[0]): number {
  if (plan.priceMonthly === 0) return 0;
  const monthlyTotal = plan.priceMonthly * 12;
  return Math.round(((monthlyTotal - plan.priceYearly) / monthlyTotal) * 100);
}
