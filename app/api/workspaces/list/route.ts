import { NextRequest, NextResponse } from 'next/server'
import { getUserWorkspaces } from '@/lib/workspace'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/workspaces/list
 * 사용자의 워크스페이스 목록
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const workspaces = await getUserWorkspaces(user.id)

    return NextResponse.json({
      success: true,
      workspaces,
    })
  } catch (error: any) {
    console.error('[Workspace List] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '워크스페이스 목록 조회 실패' },
      { status: 500 }
    )
  }
}

