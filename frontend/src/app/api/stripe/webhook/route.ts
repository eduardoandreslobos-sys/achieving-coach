import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

function getStripeInstance() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
  // @ts-ignore - Stripe version mismatch between dev/prod, will fix when integrating Stripe
  return new Stripe(key, { apiVersion: '2025-12-15.clover' });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeInstance();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const db = getFirestore();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(db, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(db, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(db, subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(db, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(db, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(
  db: FirebaseFirestore.Firestore,
  session: Stripe.Checkout.Session
) {
  if (session.mode !== 'subscription') return;

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  // Get the full subscription details
  const stripeClient = getStripeInstance();
  const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);

  await updateSubscriptionInFirestore(db, userId, subscription);
}

async function handleSubscriptionUpdate(
  db: FirebaseFirestore.Firestore,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  await updateSubscriptionInFirestore(db, userId, subscription);
}

async function handleSubscriptionDeleted(
  db: FirebaseFirestore.Firestore,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userId = usersSnapshot.docs[0].id;

  await db.collection('subscriptions').doc(userId).update({
    status: 'canceled',
    canceledAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

async function updateSubscriptionInFirestore(
  db: FirebaseFirestore.Firestore,
  userId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id;
  const planId = getPlanIdFromPriceId(priceId);
  const billingInterval = subscription.items.data[0]?.price.recurring?.interval as 'month' | 'year';

  await db.collection('subscriptions').doc(userId).set(
    {
      oderId: userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      planId,
      billingInterval,
      status: subscription.status,
      currentPeriodStart: Timestamp.fromMillis(((subscription as any).current_period_start ?? 0) * 1000),
      currentPeriodEnd: Timestamp.fromMillis(((subscription as any).current_period_end ?? 0) * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? Timestamp.fromMillis(subscription.canceled_at * 1000)
        : null,
      trialStart: subscription.trial_start
        ? Timestamp.fromMillis(subscription.trial_start * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? Timestamp.fromMillis(subscription.trial_end * 1000)
        : null,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

async function handleInvoicePaid(
  db: FirebaseFirestore.Firestore,
  invoice: Stripe.Invoice
) {
  const invoiceAny = invoice as any;
  if (!invoiceAny.subscription) return;

  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) return;

  const userId = usersSnapshot.docs[0].id;

  // Add billing record
  await db.collection('billing_history').add({
    oderId: userId,
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: (invoiceAny.payment_intent as string) || '',
    amount: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    status: 'paid',
    invoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
    periodStart: Timestamp.fromMillis((invoice.period_start || 0) * 1000),
    periodEnd: Timestamp.fromMillis((invoice.period_end || 0) * 1000),
    paidAt: Timestamp.now(),
    createdAt: Timestamp.now(),
  });
}

async function handleInvoicePaymentFailed(
  db: FirebaseFirestore.Firestore,
  invoice: Stripe.Invoice
) {
  if (!(invoice as any).subscription) return;

  const customerId = invoice.customer as string;

  // Find user by Stripe customer ID
  const usersSnapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (usersSnapshot.empty) return;

  const userId = usersSnapshot.docs[0].id;

  // Update subscription status
  await db.collection('subscriptions').doc(userId).update({
    status: 'past_due',
    updatedAt: Timestamp.now(),
  });
}

function getPlanIdFromPriceId(priceId: string): 'core' | 'pro' | 'enterprise' {
  // Map Stripe price IDs to plan IDs
  // This should match the price IDs configured in your environment
  const priceMapping: Record<string, 'core' | 'pro' | 'enterprise'> = {
    [process.env.NEXT_PUBLIC_STRIPE_CORE_MONTHLY_PRICE_ID || '']: 'core',
    [process.env.NEXT_PUBLIC_STRIPE_CORE_YEARLY_PRICE_ID || '']: 'core',
    [process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || '']: 'pro',
    [process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || '']: 'pro',
  };

  return priceMapping[priceId] || 'core';
}
