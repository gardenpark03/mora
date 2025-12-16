import { createClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import prisma from './prisma'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * 현재 로그인한 사용자 가져오기
 */
export async function getCurrentUser() {
  try {
    // 환경 변수가 설정되지 않은 경우 null 반환
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('getCurrentUser 오류:', error)
    return null
  }
}

/**
 * Prisma User와 Supabase Auth 동기화
 * 회원가입/로그인 시 자동으로 Prisma User 생성/업데이트
 */
export async function syncUserToPrisma(supabaseUser: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
    })

    if (existingUser) {
      // 기존 사용자 업데이트
      return await prisma.user.update({
        where: { id: supabaseUser.id },
        data: {
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || existingUser.name,
          avatarUrl: supabaseUser.user_metadata?.avatar_url || existingUser.avatarUrl,
          updatedAt: new Date(),
        },
      })
    } else {
      // 신규 사용자 생성
      return await prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || null,
          avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
        },
      })
    }
  } catch (error) {
    console.error('syncUserToPrisma 오류:', error)
    throw error
  }
}

/**
 * Prisma User 정보 가져오기
 */
export async function getPrismaUser(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          include: {
            workspace: true,
          },
        },
      },
    })
  } catch (error) {
    console.error('getPrismaUser 오류:', error)
    return null
  }
}

/**
 * 로그아웃
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('signOut 오류:', error)
    return { success: false, error }
  }
}