import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, syncUserToPrisma } from '@/lib/auth'

/**
 * POST /api/auth/sync-user
 * Supabase Auth User를 Prisma DB와 동기화
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseUser = await getCurrentUser()
    
    if (!supabaseUser) {
      return NextResponse.json(
        { success: false, error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    // Prisma User 생성/업데이트
    const prismaUser = await syncUserToPrisma(supabaseUser)

    return NextResponse.json({
      success: true,
      user: {
        id: prismaUser.id,
        email: prismaUser.email,
        name: prismaUser.name,
        avatarUrl: prismaUser.avatarUrl,
        plan: prismaUser.plan,
      },
    })
  } catch (error: any) {
    console.error('[Sync User] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '사용자 동기화 실패' },
      { status: 500 }
    )
  }
}
