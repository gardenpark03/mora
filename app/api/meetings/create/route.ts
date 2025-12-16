import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * POST /api/meetings/create
 * 새 미팅 생성
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

    const { title, projectId, language } = await request.json()

    if (!title) {
      return NextResponse.json(
        { success: false, error: '미팅 제목이 필요합니다.' },
        { status: 400 }
      )
    }

    // 미팅 생성
    const meeting = await prisma.meeting.create({
      data: {
        title: title.trim(),
        projectId: projectId || null,
        ownerId: user.id,
        language: language || 'ko',
        status: 'active',
      },
    })

    return NextResponse.json({
      success: true,
      meeting,
    })
  } catch (error: any) {
    console.error('[Meeting Create] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '미팅 생성 실패' },
      { status: 500 }
    )
  }
}

