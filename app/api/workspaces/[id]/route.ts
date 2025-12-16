import { NextRequest, NextResponse } from 'next/server'
import { getWorkspace, getUserRole } from '@/lib/workspace'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET /api/workspaces/[id]
 * 워크스페이스 상세 정보
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const workspaceId = params.id

    // 사용자가 해당 워크스페이스 멤버인지 확인
    const role = await getUserRole(workspaceId, user.id)
    if (!role) {
      return NextResponse.json(
        { success: false, error: '워크스페이스에 접근할 수 없습니다.' },
        { status: 403 }
      )
    }

    // 워크스페이스 정보 조회
    const workspace = await getWorkspace(workspaceId)

    if (!workspace) {
      return NextResponse.json(
        { success: false, error: '워크스페이스를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      workspace,
      userRole: role,
    })
  } catch (error: any) {
    console.error('[Workspace Get] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '워크스페이스 조회 실패' },
      { status: 500 }
    )
  }
}

