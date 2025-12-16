import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/auth'

/**
 * POST /api/stripe/checkout
 * Stripe Checkout 세션 생성
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { priceId, planId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { success: false, error: 'Price ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const successUrl = `${origin}/dashboard?checkout=success&plan=${planId}`
    const cancelUrl = `${origin}/pricing?checkout=cancelled`

    const session = await createCheckoutSession(
      user.id,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('[Stripe Checkout] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout 생성 실패' },
      { status: 500 }
    )
  }
}

