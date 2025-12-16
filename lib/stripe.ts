import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

function initStripe(): Stripe {
  const apiKey = process.env.STRIPE_SECRET_KEY
  
  if (!apiKey) {
    console.warn('⚠️  STRIPE_SECRET_KEY is not defined. Stripe features will not work.')
    // Return a dummy object during build time to prevent errors
    return null as any
  }
  
  if (!stripeInstance) {
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  }
  
  return stripeInstance
}

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = initStripe()
  }
  return stripeInstance
}

// 요금제 정의
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      meetingsPerMonth: 3,
      workspaces: 1,
      transcription: 'basic',
      visualization: 'simple',
      support: 'community',
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      meetingsPerMonth: -1, // unlimited
      workspaces: 5,
      transcription: 'advanced',
      visualization: 'full',
      support: 'priority',
      export: true,
      branding: true,
    },
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: {
      meetingsPerMonth: -1,
      workspaces: -1, // unlimited
      transcription: 'advanced',
      visualization: 'full',
      support: 'dedicated',
      export: true,
      branding: true,
      analytics: true,
      sso: true,
      api: true,
      sla: true,
    },
  },
} as const

export type PlanId = keyof typeof PLANS

// Checkout 세션 생성
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const stripe = getStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
    },
  })

  return session
}

// 고객 포털 세션 생성
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const stripe = getStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

// 구독 상태 확인
export async function getSubscription(subscriptionId: string) {
  const stripe = getStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

// 구독 취소
export async function cancelSubscription(subscriptionId: string) {
  const stripe = getStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

// 웹훅 이벤트 검증
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const stripe = getStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not configured')
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined')
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
