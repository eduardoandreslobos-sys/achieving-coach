'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CreditCard,
  Check,
  X,
  ExternalLink,
  Download,
  Calendar,
  AlertTriangle,
  Sparkles,
  Crown,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  SUBSCRIPTION_PLANS,
  CoachSubscription,
  BillingHistory,
  PlanTier,
  formatPrice,
  isActiveSubscription,
  calculateYearlySavingsPercentage,
} from '@/types/subscription';
import {
  getCoachSubscription,
  getBillingHistory,
  createCheckoutSession,
  createBillingPortalSession,
} from '@/services/subscription.service';


export default function BillingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<CoachSubscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [processingPlan, setProcessingPlan] = useState<PlanTier | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user?.uid]);

  useEffect(() => {
    // Check for success/cancel from Stripe checkout
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      // Reload subscription data
      loadData();
    }
  }, [searchParams]);

  const loadData = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const [sub, history] = await Promise.all([
        getCoachSubscription(user.uid),
        getBillingHistory(user.uid),
      ]);
      setSubscription(sub);
      setBillingHistory(history);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: PlanTier) => {
    if (planId === 'core' && subscription?.planId === 'core') return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    setProcessingPlan(planId);

    try {
      const priceId = billingInterval === 'month'
        ? plan.stripePriceIdMonthly
        : plan.stripePriceIdYearly;

      const result = await createCheckoutSession(priceId, billingInterval);

      if ('error' in result) {
        console.error('Checkout error:', result.error);
        alert(result.error);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('Error starting checkout:', error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const result = await createBillingPortalSession();

      if ('error' in result) {
        console.error('Portal error:', result.error);
        alert(result.error);
        return;
      }

      window.location.href = result.url;
    } catch (error) {
      console.error('Error opening portal:', error);
    }
  };

  const formatDate = (timestamp: { toDate: () => Date } | null | undefined) => {
    if (!timestamp) return '-';
    return timestamp.toDate().toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const currentPlanId = subscription?.planId || null;
  const isSubscribed = subscription && isActiveSubscription(subscription.status);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-200">
              ¡Suscripción activada con éxito!
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Ya puedes disfrutar de todas las funciones de tu plan.
            </p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded"
          >
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--fg-primary)]">
          Facturación y Suscripción
        </h1>
        <p className="text-[var(--fg-muted)]">
          Administra tu plan y métodos de pago
        </p>
      </div>

      {/* Current Subscription */}
      {isSubscribed && subscription && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
                  Plan {SUBSCRIPTION_PLANS.find((p) => p.id === subscription.planId)?.name}
                </h2>
                {subscription.status === 'active' && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--fg-muted)]">
                {subscription.billingInterval === 'month' ? 'Facturación mensual' : 'Facturación anual'}
              </p>
              <p className="text-sm text-[var(--fg-muted)] mt-1">
                Próxima facturación: {formatDate(subscription.currentPeriodEnd)}
              </p>
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Se cancelará al final del período</span>
                </div>
              )}
            </div>
            <button
              onClick={handleManageSubscription}
              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Gestionar suscripción
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
            {isSubscribed ? 'Cambiar plan' : 'Elige tu plan'}
          </h2>

          {/* Billing Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[var(--bg-secondary)] rounded-lg">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                billingInterval === 'month'
                  ? 'bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-sm'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 text-sm rounded-md transition-colors flex items-center gap-1 ${
                billingInterval === 'year'
                  ? 'bg-[var(--bg-primary)] text-[var(--fg-primary)] shadow-sm'
                  : 'text-[var(--fg-muted)] hover:text-[var(--fg-primary)]'
              }`}
            >
              Anual
              <span className="px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = currentPlanId === plan.id;
            const price = billingInterval === 'month' ? plan.priceMonthly : plan.priceYearly;
            const savings = calculateYearlySavingsPercentage(plan);

            return (
              <div
                key={plan.id}
                className={`relative bg-[var(--bg-primary)] rounded-xl border-2 p-6 transition-all ${
                  plan.highlighted
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : isCurrentPlan
                    ? 'border-emerald-500'
                    : 'border-[var(--border-color)]'
                }`}
              >
                {/* Popular Badge */}
                {plan.highlighted && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Más popular
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-600 text-white text-xs font-medium rounded-full">
                    Plan actual
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[var(--fg-primary)]">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)] mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-[var(--fg-primary)]">
                      {plan.id === 'enterprise'
                        ? 'Personalizado'
                        : formatPrice(billingInterval === 'month' ? plan.priceMonthly : Math.round(plan.priceYearly / 12))}
                    </span>
                    {plan.id !== 'enterprise' && (
                      <span className="text-[var(--fg-muted)]">/mes</span>
                    )}
                  </div>
                  {billingInterval === 'year' && plan.id !== 'enterprise' && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                      {formatPrice(plan.priceYearly)}/año (ahorra 25%)
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-sm ${
                        feature.included
                          ? 'text-[var(--fg-primary)]'
                          : 'text-[var(--fg-muted)]'
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {plan.id === 'enterprise' ? (
                  // Enterprise - Contact us
                  <a
                    href="/contact?plan=enterprise"
                    className="w-full py-3 text-sm font-medium text-center bg-[var(--fg-primary)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-colors block"
                  >
                    Contáctanos
                  </a>
                ) : isCurrentPlan ? (
                  <button
                    onClick={handleManageSubscription}
                    className="w-full py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Gestionar plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={processingPlan === plan.id}
                    className={`w-full py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      plan.highlighted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-[var(--fg-primary)] text-[var(--bg-primary)] hover:opacity-90'
                    } disabled:opacity-50`}
                  >
                    {processingPlan === plan.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Suscribirse
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing History */}
      {billingHistory.length > 0 && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h2 className="text-lg font-semibold text-[var(--fg-primary)]">
              Historial de facturación
            </h2>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {billingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <Calendar className="w-4 h-4 text-[var(--fg-muted)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--fg-primary)]">
                      {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {invoice.status === 'paid' ? 'Pagado' : invoice.status}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--fg-primary)]">
                    {formatPrice(invoice.amount, invoice.currency)}
                  </span>
                  {invoice.invoicePdf && (
                    <a
                      href={invoice.invoicePdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                      title="Descargar factura"
                    >
                      <Download className="w-4 h-4 text-[var(--fg-muted)]" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ or Help */}
      <div className="text-center text-sm text-[var(--fg-muted)]">
        <p>
          ¿Tienes preguntas sobre facturación?{' '}
          <a href="/contact" className="text-emerald-600 hover:underline">
            Contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
