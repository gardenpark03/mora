'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')

  useEffect(() => {
    acceptInvite()
  }, [token])

  const acceptInvite = async () => {
    try {
      const response = await fetch('/api/workspaces/invite', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      
      if (data.success) {
        setStatus('success')
        setWorkspaceName(data.workspace.name)
        setMessage(`${data.workspace.name} 워크스페이스에 참여했습니다!`)
        
        // 3초 후 워크스페이스로 이동
        setTimeout(() => {
          router.push(`/workspaces/${data.workspace.id}`)
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || '초대를 수락할 수 없습니다.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('초대 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">워크스페이스 초대</CardTitle>
          <CardDescription>
            {status === 'loading' && '초대를 확인하는 중입니다...'}
            {status === 'success' && '초대를 수락했습니다'}
            {status === 'error' && '초대를 수락할 수 없습니다'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-12 h-12 mx-auto text-indigo-600 animate-spin mb-4" />
              <p className="text-muted-foreground">처리 중...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 space-y-4">
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <div>
                <p className="text-lg font-semibold text-green-900 mb-2">
                  {message}
                </p>
                <p className="text-sm text-muted-foreground">
                  잠시 후 워크스페이스로 이동합니다...
                </p>
              </div>
              <Button 
                onClick={() => router.push(`/workspaces`)}
                className="w-full"
              >
                지금 이동하기
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-600" />
              <div>
                <p className="text-lg font-semibold text-red-900 mb-2">
                  {message}
                </p>
                <p className="text-sm text-muted-foreground">
                  초대 링크가 만료되었거나 이미 사용되었을 수 있습니다.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                대시보드로 돌아가기
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

