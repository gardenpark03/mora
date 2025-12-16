import { NextRequest, NextResponse } from 'next/server'
import { createInvite, acceptInvite, getUserRole } from '@/lib/workspace'
import { getCurrentUser } from '@/lib/auth'
import { Role } from '@prisma/client'

/**
 * POST /api/workspaces/invite
 * 워크스페이스에 사용자 초대
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

    const { workspaceId, email, role } = await request.json()

    // 권한 확인 (ADMIN만 초대 가능)
    const userRole = await getUserRole(workspaceId, user.id)
    if (userRole !== Role.ADMIN) {
      return NextResponse.json(
        { success: false, error: '초대 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 초대 생성
    const invite = await createInvite(
      workspaceId,
      email,
      role || Role.MEMBER
    )

    // 초대 링크 생성
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${invite.token}`

    return NextResponse.json({
      success: true,
      invite: {
        id: invite.id,
        email: invite.email,
        token: invite.token,
        link: inviteLink,
        expiresAt: invite.expiresAt,
      },
    })
  } catch (error: any) {
    console.error('[Workspace Invite] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '초대 생성 실패' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/workspaces/invite
 * 초대 수락
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { token } = await request.json()

    // 초대 수락
    const { membership, workspace } = await acceptInvite(token, user.id)

    return NextResponse.json({
      success: true,
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        role: membership.role,
      },
    })
  } catch (error: any) {
    console.error('[Workspace Accept] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '초대 수락 실패' },
      { status: 500 }
    )
  }
}

