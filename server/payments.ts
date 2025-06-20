import Stripe from 'stripe';
import type { Request, Response } from 'express';
import { storage } from './storage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
});

export const PRICING_PLANS = {
  basic: {
    name: 'Basic School License',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    annualPrice: 250000, // $2,500 in cents
    studentPrice: 1500, // $15 per student per month in cents
    maxStudents: 50,
    features: [
      'Up to 5 teacher accounts',
      'Basic MPC Studio access',
      'Live streaming (10 concurrent)',
      'Email support',
      'Standard sample library'
    ]
  },
  professional: {
    name: 'Professional School License',
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional',
    annualPrice: 850000, // $8,500 in cents
    studentPrice: 1200, // $12 per student per month in cents
    maxStudents: 200,
    features: [
      'Up to 15 teacher accounts',
      'Full MPC Studio with all samples',
      'Live streaming (50 concurrent)',
      'Priority support',
      'Custom sample uploads (5GB)',
      'White-label options'
    ]
  },
  enterprise: {
    name: 'Enterprise School License',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    annualPrice: 2500000, // $25,000 in cents
    studentPrice: 800, // $8 per student per month in cents
    maxStudents: 999999,
    features: [
      'Unlimited teacher accounts',
      'Complete MPC Studio suite',
      'Unlimited concurrent streaming',
      'Dedicated support manager',
      'Unlimited storage',
      'Full white-label customization',
      'API access'
    ]
  }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId, studentCount, schoolInfo, userEmail } = req.body;
    
    const plan = PRICING_PLANS[planId as keyof typeof PRICING_PLANS];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const students = parseInt(studentCount) || 25;
    const monthlyStudentFee = (plan.studentPrice * students) * 12; // Annual calculation
    const totalAmount = plan.annualPrice + monthlyStudentFee;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: `${plan.name} for ${students} students`,
            },
            unit_amount: totalAmount,
            recurring: {
              interval: 'year',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.DOMAIN || 'http://localhost:5000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN || 'http://localhost:5000'}/auth`,
      metadata: {
        planId,
        studentCount: students.toString(),
        schoolName: schoolInfo?.schoolName || '',
        userEmail,
      },
    });

    res.json({ sessionId: session.id, sessionUrl: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSubscriptionCreated(session);
        break;
      
      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      
      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;
      
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

const handleSubscriptionCreated = async (session: Stripe.Checkout.Session) => {
  const { metadata } = session;
  if (!metadata) return;

  // Update user subscription status in database
  console.log('Subscription created for:', metadata.userEmail);
  
  // In production, you would:
  // 1. Find user by email
  // 2. Update their subscription status
  // 3. Activate their account features
  // 4. Send welcome email
};

const handlePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  console.log('Payment succeeded for customer:', invoice.customer);
  
  // Update payment status in database
  // Send payment confirmation email
};

const handlePaymentFailed = async (invoice: Stripe.Invoice) => {
  console.log('Payment failed for customer:', invoice.customer);
  
  // Update payment status in database
  // Send payment failure notification
  // Potentially suspend account if multiple failures
};

const handleSubscriptionCanceled = async (subscription: Stripe.Subscription) => {
  console.log('Subscription canceled:', subscription.id);
  
  // Update user subscription status
  // Send cancellation confirmation
  // Schedule account deactivation
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    res.json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
};

export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    
    res.json({ subscription });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};