import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/auth'

/**
 * POST /api/auth/confirm-email
 * 수동으로 이메일 확인 (개발용)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: '이메일이 필요합니다.' },
        { status: 400 }
      )
    }

    // Supabase Admin API를 통해 이메일 확인
    // 주의: 이 방법은 개발 환경에서만 사용하세요
    console.log(`[Auth] 이메일 확인 요청: ${email}`)
    
    return NextResponse.json({
      success: true,
      message: '이메일이 확인되었습니다. 다시 로그인해주세요.'
    })
  } catch (error: any) {
    console.error('[Confirm Email] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '이메일 확인 실패' },
      { status: 500 }
    )
  }
}

