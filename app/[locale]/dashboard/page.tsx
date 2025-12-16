'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Calendar, Users, FolderKanban, Loader2 } from 'lucide-react'

interface Workspace {
  id: string
  name: string
  description: string | null
  role: string
  _count: {
    members: number
    projects: number
  }
}

export default function Dashboard() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()
  
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces/list')
      const data = await response.json()
      
      if (data.success) {
        setWorkspaces(data.workspaces || [])
      }
    } catch (error) {
      console.error('워크스페이스 조회 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim() || creating) return

    setCreating(true)
    try {
      const response = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkspaceName.trim(),
          description: newWorkspaceDesc.trim() || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDialogOpen(false)
        setNewWorkspaceName('')
        setNewWorkspaceDesc('')
        router.push(`/${locale}/workspaces/${data.workspace.id}`)
      } else {
        alert(data.error || '워크스페이스 생성 실패')
      }
    } catch (error) {
      console.error('워크스페이스 생성 오류:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground text-lg">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Workspaces Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">{t('workspace.select')}</h2>
              <p className="text-muted-foreground">팀별로 작업을 조직화하세요</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('workspace.create')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('workspace.create')}</DialogTitle>
                  <DialogDescription>
                    새로운 워크스페이스를 생성하여 팀과 협업하세요
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {t('workspace.name')}
                    </label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="예: 제품팀, 마케팅팀"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      {t('workspace.description')} (선택사항)
                    </label>
                    <textarea
                      value={newWorkspaceDesc}
                      onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                      placeholder="워크스페이스에 대한 간단한 설명"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={creating}>
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        워크스페이스 만들기
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <Card 
                  key={workspace.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/${locale}/workspaces/${workspace.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl">{workspace.name}</CardTitle>
                    {workspace.description && (
                      <CardDescription className="line-clamp-2">
                        {workspace.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{workspace._count?.members || 0}명</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FolderKanban className="w-4 h-4" />
                        <span>{workspace._count?.projects || 0}개 프로젝트</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full font-medium">
                        {workspace.role === 'ADMIN' ? '관리자' : workspace.role === 'MEMBER' ? '멤버' : '뷰어'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-16 pb-16 text-center">
                <FolderKanban className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">워크스페이스가 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  첫 번째 워크스페이스를 만들어 시작하세요
                </p>
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 워크스페이스 만들기
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-indigo-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/${locale}/meeting/demo`)}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>빠른 미팅 시작</CardTitle>
                  <CardDescription>즉시 새 미팅 세션 시작</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-indigo-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/${locale}/pricing`)}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Pro로 업그레이드</CardTitle>
                  <CardDescription>무제한 미팅과 고급 기능</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}