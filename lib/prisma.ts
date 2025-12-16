import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// DATABASE_URL이 없으면 null 반환 (데모 모드)
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('[YOUR_PASSWORD]') || process.env.DATABASE_URL.includes('[PASSWORD]')) {
    console.warn('⚠️  DATABASE_URL이 설정되지 않았습니다. 데모 모드로 실행됩니다.')
    return null as any
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
