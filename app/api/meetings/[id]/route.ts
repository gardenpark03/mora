import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/meetings/[id]
 * 미팅 상세 조회
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

    const meeting = await prisma.meeting.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            workspace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!meeting) {
      return NextResponse.json(
        { success: false, error: '미팅을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      meeting,
    })
  } catch (error: any) {
    console.error('[Meeting Get] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '미팅 조회 실패' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/meetings/[id]
 * 미팅 업데이트 (전사, 요약, 상태 등)
 */
export async function PATCH(
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

    const { transcript, summary, status } = await request.json()

    const meeting = await prisma.meeting.update({
      where: { id: params.id },
      data: {
        transcript: transcript || undefined,
        summary: summary || undefined,
        status: status || undefined,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      meeting,
    })
  } catch (error: any) {
    console.error('[Meeting Update] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '미팅 업데이트 실패' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/meetings/[id]
 * 미팅 삭제
 */
export async function DELETE(
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

    await prisma.meeting.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: '미팅이 삭제되었습니다.',
    })
  } catch (error: any) {
    console.error('[Meeting Delete] 오류:', error)
    return NextResponse.json(
      { success: false, error: error.message || '미팅 삭제 실패' },
      { status: 500 }
    )
  }
}

