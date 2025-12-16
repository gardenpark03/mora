import { NextRequest, NextResponse } from 'next/server'
import { createWorkspace } from '@/lib/workspace'
import { getCurrentUser } from '@/lib/auth'

/**
 * POST /api/workspaces/create
 * 새 워크스페이스 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { name, description } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '워크스페이스 이름이 필요합니다.' },
        { status: 400 }
      )
    }

    // 워크스페이스 생성
    const workspace = await createWorkspace(name.trim(), user.id, description)

    return NextResponse.json({
      success: true,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        description: workspace.description,
        role: 'ADMIN',
      },
    })
  } catch (error: any) {
    console.error('[Workspace Create] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '워크스페이스 생성 실패' },
      { status: 500 }
    )
  }
}

