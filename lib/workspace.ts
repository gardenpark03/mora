import prisma from './prisma'
import { Role } from '@prisma/client'

// 워크스페이스 생성
export async function createWorkspace(
  name: string,
  userId: string,
  description?: string
) {
  // slug 생성 (URL 친화적)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  const workspace = await prisma.workspace.create({
    data: {
      name,
      description,
      slug: `${slug}-${Date.now().toString(36)}`,
      members: {
        create: {
          userId,
          role: Role.ADMIN,
        },
      },
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  })

  return workspace
}

// 사용자의 워크스페이스 목록 가져오기
export async function getUserWorkspaces(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: {
      workspace: {
        include: {
          _count: {
            select: {
              members: true,
              projects: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return memberships.map((m) => ({
    ...m.workspace,
    role: m.role,
  }))
}

// 워크스페이스 상세 정보
export async function getWorkspace(workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      projects: {
        include: {
          _count: {
            select: {
              meetings: true,
            },
          },
        },
      },
    },
  })

  return workspace
}

// 사용자의 워크스페이스 내 역할 확인
export async function getUserRole(workspaceId: string, userId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  })

  return membership?.role
}

// 권한 확인
export function canManageWorkspace(role?: Role) {
  return role === Role.ADMIN
}

export function canCreateMeeting(role?: Role) {
  return role === Role.ADMIN || role === Role.MEMBER
}

export function canEditContent(role?: Role) {
  return role === Role.ADMIN || role === Role.MEMBER
}

// 초대 생성
export async function createInvite(
  workspaceId: string,
  email: string,
  role: Role = Role.MEMBER
) {
  const token = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15)
  
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7일 후 만료

  const invite = await prisma.invite.create({
    data: {
      workspaceId,
      email,
      token,
      role,
      expiresAt,
    },
  })

  return invite
}

// 초대 수락
export async function acceptInvite(token: string, userId: string) {
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { workspace: true },
  })

  if (!invite) {
    throw new Error('초대를 찾을 수 없습니다.')
  }

  if (invite.usedAt) {
    throw new Error('이미 사용된 초대입니다.')
  }

  if (invite.expiresAt < new Date()) {
    throw new Error('초대가 만료되었습니다.')
  }

  // 멤버십 생성
  const membership = await prisma.membership.create({
    data: {
      userId,
      workspaceId: invite.workspaceId,
      role: invite.role,
    },
  })

  // 초대 사용 처리
  await prisma.invite.update({
    where: { id: invite.id },
    data: { usedAt: new Date() },
  })

  return { membership, workspace: invite.workspace }
}

