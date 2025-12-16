import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

/**
 * POST /api/webhooks/stripe
 * Stripe 웹훅 핸들러
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  try {
    const event = constructWebhookEvent(body, signature)

    console.log(`[Stripe Webhook] 이벤트: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id || session.metadata?.userId

        if (userId && session.subscription) {
          // 구독 정보 업데이트
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              plan: determinePlanFromSession(session),
            },
          })

          console.log(`[Stripe] 사용자 ${userId} 구독 활성화`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // 고객 ID로 사용자 찾기
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: determinePlanFromSubscription(subscription),
            },
          })

          console.log(`[Stripe] 사용자 ${user.id} 구독 업데이트`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'free',
              stripeSubscriptionId: null,
            },
          })

          console.log(`[Stripe] 사용자 ${user.id} 구독 취소`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.error(`[Stripe] 결제 실패: ${invoice.id}`)
        // 사용자에게 알림 전송 (향후 구현)
        break
      }

      default:
        console.log(`[Stripe] 미처리 이벤트: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[Stripe Webhook] 오류:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}

// 세션에서 플랜 결정
function determinePlanFromSession(session: Stripe.Checkout.Session): string {
  // Price ID 기반으로 플랜 결정
  const lineItems = session.line_items?.data
  if (!lineItems || lineItems.length === 0) return 'free'

  const priceId = lineItems[0].price?.id
  
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return 'business'
  
  return 'free'
}

// 구독에서 플랜 결정
function determinePlanFromSubscription(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id
  
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) return 'business'
  
  return 'free'
}

