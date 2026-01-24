import { Timestamp } from 'firebase/firestore';

// Plan tiers
export type PlanTier = 'core' | 'pro' | 'enterprise';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number | 'unlimited';
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: PlanFeature[];
  highlighted?: boolean;
  maxCoachees: number | 'unlimited';
  maxSessionsPerMonth: number | 'unlimited';
}

// Subscription status from Stripe
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export interface CoachSubscription {
  id: string;
  oderId: string;

  // Stripe IDs
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;

  // Plan info
  planId: PlanTier;
  billingInterval: 'month' | 'year';

  // Status
  status: SubscriptionStatus;

  // Dates
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Timestamp;
  trialStart?: Timestamp;
  trialEnd?: Timestamp;

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BillingHistory {
  id: string;
  oderId: string;
  stripeInvoiceId: string;
  stripePaymentIntentId?: string;

  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible' | 'draft';

  invoiceUrl?: string;
  invoicePdf?: string;

  periodStart: Timestamp;
  periodEnd: Timestamp;
  paidAt?: Timestamp;
  createdAt: Timestamp;
}

// Plan definitions
// Prices in USD, yearly = monthly price with 25% discount
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'core',
    name: 'Core',
    description: 'Para comenzar tu práctica de coaching',
    priceMonthly: 25,
    priceYearly: 228, // $19/month * 12 = $228/year (25% off from $25/month)
    currency: 'USD',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_CORE_MONTHLY_PRICE_ID || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_CORE_YEARLY_PRICE_ID || '',
    maxCoachees: 15,
    maxSessionsPerMonth: 'unlimited',
    features: [
      { name: 'Hasta 15 clientes activos', included: true, limit: 15 },
      { name: 'Agendamiento de sesiones', included: true },
      { name: '10 herramientas de coaching', included: true, limit: 10 },
      { name: 'Dashboard de analíticas básico', included: true },
      { name: 'Soporte por email', included: true },
      { name: 'Simulador ICF', included: false },
      { name: 'Analíticas con IA', included: false },
      { name: 'Branding personalizado', included: false },
      { name: 'Soporte prioritario', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para coaches en crecimiento',
    priceMonthly: 40,
    priceYearly: 360, // $30/month * 12 = $360/year (25% off from $40/month)
    currency: 'USD',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '',
    stripePriceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '',
    maxCoachees: 'unlimited',
    maxSessionsPerMonth: 'unlimited',
    highlighted: true,
    features: [
      { name: 'Clientes ilimitados', included: true, limit: 'unlimited' },
      { name: 'Todo lo de Core', included: true },
      { name: 'Biblioteca completa de 12+ herramientas', included: true },
      { name: 'Simulador ICF incluido', included: true },
      { name: 'Analíticas avanzadas con IA', included: true },
      { name: 'Soporte prioritario', included: true },
      { name: 'Branding personalizado', included: true },
      { name: 'Perfil en directorio de coaches', included: true },
      { name: 'CRM de oportunidades', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Para organizaciones y equipos',
    priceMonthly: 0, // Custom pricing
    priceYearly: 0,
    currency: 'USD',
    stripePriceIdMonthly: '', // Custom - requires contact
    stripePriceIdYearly: '',
    maxCoachees: 'unlimited',
    maxSessionsPerMonth: 'unlimited',
    features: [
      { name: 'Todo lo de Pro', included: true },
      { name: 'Multi-coach / multi-tenant', included: true },
      { name: 'SSO y controles de seguridad', included: true },
      { name: 'Integraciones personalizadas', included: true },
      { name: 'Onboarding dedicado', included: true },
      { name: 'SLA garantizado', included: true },
      { name: 'Account manager asignado', included: true },
      { name: 'API access', included: true },
      { name: 'Reportes personalizados', included: true },
    ],
  },
];

export function getPlanById(planId: PlanTier): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function isActiveSubscription(status: SubscriptionStatus): boolean {
  return ['active', 'trialing'].includes(status);
}

export function canAccessFeature(
  subscription: CoachSubscription | null,
  requiredPlan: PlanTier
): boolean {
  if (!subscription) {
    return false; // No subscription means no access to any paid features
  }

  if (!isActiveSubscription(subscription.status)) {
    return false;
  }

  const planHierarchy: Record<PlanTier, number> = {
    core: 0,
    pro: 1,
    enterprise: 2,
  };

  return planHierarchy[subscription.planId] >= planHierarchy[requiredPlan];
}

export function calculateYearlySavingsPercentage(plan: SubscriptionPlan): number {
  if (plan.priceMonthly === 0) return 0;
  const monthlyTotal = plan.priceMonthly * 12;
  const yearlyTotal = plan.priceYearly;
  return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
}
