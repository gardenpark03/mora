'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/auth'
import { Mail, Lock, AlertCircle, Info } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResendSuccess(false)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // 이메일 미확인 오류
        if (signInError.message === 'Email not confirmed') {
          setError('이메일이 확인되지 않았습니다. 아래 "이메일 재전송" 버튼을 클릭하거나, Supabase 설정을 확인하세요.')
          return
        }
        throw signInError
      }

      if (data.user) {
        // Prisma User 동기화
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
          })
        } catch (syncError) {
          console.error('사용자 동기화 오류:', syncError)
        }
        
        // 로그인 성공 - 대시보드로 이동
        router.push(`/${locale}/dashboard`)
        router.refresh()
      }
    } catch (err: any) {
      console.error('로그인 오류:', err)
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) {
      setError('이메일 주소를 입력해주세요.')
      return
    }

    setResendLoading(true)
    setError('')
    setResendSuccess(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) throw error

      setResendSuccess(true)
    } catch (err: any) {
      console.error('이메일 재전송 오류:', err)
      setError('이메일 재전송에 실패했습니다.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('auth.signIn')}</CardTitle>
          <CardDescription>
            {t('common.appName')}에 로그인하여 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="space-y-3">
                <div className="flex items-start space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p>{error}</p>
                    {error.includes('이메일이 확인되지') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={handleResendEmail}
                        disabled={resendLoading}
                      >
                        {resendLoading ? '전송 중...' : '확인 이메일 재전송'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">빠른 해결 방법:</p>
                    <p className="text-xs">
                      Supabase Dashboard → Authentication → Providers → Email →
                      "Confirm email" 토글을 OFF로 변경하세요
                    </p>
                  </div>
                </div>
              </div>
            )}

            {resendSuccess && (
              <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-md">
                <Mail className="w-4 h-4" />
                <span>확인 이메일이 재전송되었습니다. 이메일을 확인해주세요.</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                href={`/${locale}/auth/forgot-password`}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600"
              disabled={loading}
            >
              {loading ? '로그인 중...' : t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t('auth.noAccount')} </span>
            <Link
              href={`/${locale}/auth/signup`}
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {t('auth.signUp')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}