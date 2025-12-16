'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import WorkspaceSelector from '@/components/WorkspaceSelector'
import { 
  Plus, 
  Users, 
  FolderKanban, 
  Calendar, 
  Mail, 
  Crown,
  User,
  Eye,
  Loader2,
  Palette
} from 'lucide-react'

interface Member {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface Project {
  id: string
  name: string
  description: string | null
  color: string | null
  _count: {
    meetings: number
  }
}

interface Workspace {
  id: string
  name: string
  description: string | null
  members: Member[]
  projects: Project[]
}

const roleIcons = {
  ADMIN: Crown,
  MEMBER: User,
  VIEWER: Eye,
}

const roleLabels = {
  ADMIN: '관리자',
  MEMBER: '멤버',
  VIEWER: '뷰어',
}

const colorOptions = [
  { value: '#4F46E5', label: 'Indigo' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#DB2777', label: 'Pink' },
  { value: '#EA580C', label: 'Orange' },
  { value: '#16A34A', label: 'Green' },
  { value: '#0284C7', label: 'Sky' },
]

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const workspaceId = params.id as string
  const t = useTranslations()

  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  
  // 프로젝트 생성
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#4F46E5')
  const [creatingProject, setCreatingProject] = useState(false)

  useEffect(() => {
    fetchWorkspace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`)
      const data = await response.json()
      if (data.success) {
        setWorkspace(data.workspace)
      }
    } catch (error) {
      console.error('워크스페이스 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || inviting) return

    setInviting(true)
    try {
      const response = await fetch('/api/workspaces/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          email: inviteEmail.trim(),
          role: 'MEMBER',
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`초대가 전송되었습니다!\n초대 링크: ${data.invite.link}`)
        setInviteDialogOpen(false)
        setInviteEmail('')
      } else {
        alert(data.error || '초대 전송 실패')
      }
    } catch (error) {
      console.error('초대 오류:', error)
      alert('초대 중 오류가 발생했습니다.')
    } finally {
      setInviting(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim() || creatingProject) return

    setCreatingProject(true)
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDesc.trim() || null,
          color: newProjectColor,
          workspaceId,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setProjectDialogOpen(false)
        setNewProjectName('')
        setNewProjectDesc('')
        setNewProjectColor('#4F46E5')
        // 워크스페이스 새로고침
        fetchWorkspace()
      } else {
        alert(data.error || '프로젝트 생성 실패')
      }
    } catch (error) {
      console.error('프로젝트 생성 오류:', error)
      alert('오류가 발생했습니다.')
    } finally {
      setCreatingProject(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
          <p className="text-muted-foreground">워크스페이스 로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium">워크스페이스를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>
            대시보드로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20">
      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-6 py-8">
        {/* 워크스페이스 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent mb-2">
                {workspace.name}
              </h1>
              {workspace.description && (
                <p className="text-muted-foreground text-lg">
                  {workspace.description}
                </p>
              )}
            </div>
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Mail className="w-4 h-4 mr-2" />
                  팀원 초대
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>팀원 초대하기</DialogTitle>
                  <DialogDescription>
                    이메일 주소로 워크스페이스에 초대하세요.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      이메일 주소
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="teammate@example.com"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={inviting}>
                    {inviting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        초대 중...
                      </>
                    ) : (
                      '초대 보내기'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 멤버 목록 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>멤버</span>
                <span className="ml-auto text-sm font-normal text-muted-foreground">
                  {workspace.members.length}명
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workspace.members.map((member) => {
                  const RoleIcon = roleIcons[member.role as keyof typeof roleIcons]
                  return (
                    <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-500 text-white">
                          {member.user.name?.charAt(0) || member.user.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {member.user.name || member.user.email}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <RoleIcon className="w-3 h-3" />
                          <span>{roleLabels[member.role as keyof typeof roleLabels]}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 프로젝트 및 미팅 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 프로젝트 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FolderKanban className="w-5 h-5 text-indigo-600" />
                    <span>프로젝트</span>
                  </CardTitle>
                  <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        새 프로젝트
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>새 프로젝트 만들기</DialogTitle>
                        <DialogDescription>
                          미팅을 조직화할 프로젝트를 생성하세요
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateProject} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-2">프로젝트 이름</label>
                          <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="예: Q4 로드맵"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">설명 (선택사항)</label>
                          <textarea
                            value={newProjectDesc}
                            onChange={(e) => setNewProjectDesc(e.target.value)}
                            placeholder="프로젝트에 대한 간단한 설명"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-2">색상</label>
                          <div className="grid grid-cols-6 gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => setNewProjectColor(color.value)}
                                className={`w-full h-10 rounded-md transition-all ${
                                  newProjectColor === color.value
                                    ? 'ring-2 ring-offset-2 ring-indigo-600 scale-110'
                                    : 'hover:scale-105'
                                }`}
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                              />
                            ))}
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={creatingProject}>
                          {creatingProject ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              생성 중...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              프로젝트 만들기
                            </>
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {workspace.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workspace.projects.map((project) => (
                      <div
                        key={project.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        style={{ borderLeftWidth: '4px', borderLeftColor: project.color || '#4F46E5' }}
                      >
                        <h3 className="font-semibold mb-1">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{project._count.meetings}개 미팅</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      아직 프로젝트가 없습니다
                    </p>
                    <Button variant="outline" onClick={() => setProjectDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      첫 프로젝트 만들기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 최근 미팅 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span>최근 미팅</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    아직 미팅이 없습니다
                  </p>
                  <Button onClick={() => router.push(`/${locale}/meeting/demo`)}>
                    <Plus className="w-4 h-4 mr-2" />
                    첫 미팅 시작하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}