import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getUserRole, canCreateMeeting } from '@/lib/workspace'
import prisma from '@/lib/prisma'

/**
 * POST /api/projects/create
 * 새 프로젝트 생성
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

    const { name, description, color, workspaceId } = await request.json()

    if (!name || !workspaceId) {
      return NextResponse.json(
        { success: false, error: '프로젝트 이름과 워크스페이스가 필요합니다.' },
        { status: 400 }
      )
    }

    // 권한 확인
    const role = await getUserRole(workspaceId, user.id)
    if (!canCreateMeeting(role)) {
      return NextResponse.json(
        { success: false, error: '프로젝트 생성 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 프로젝트 생성
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || '#4F46E5',
        workspaceId,
      },
    })

    return NextResponse.json({
      success: true,
      project,
    })
  } catch (error: any) {
    console.error('[Project Create] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '프로젝트 생성 실패' },
      { status: 500 }
    )
  }
}

