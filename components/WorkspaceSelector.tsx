'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Plus, Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Workspace {
  id: string
  name: string
  role: string
}

export default function WorkspaceSelector({ currentWorkspaceId }: { currentWorkspaceId?: string }) {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces/list')
      const data = await response.json()
      if (data.success) {
        setWorkspaces(data.workspaces)
      }
    } catch (error) {
      console.error('워크스페이스 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkspaceChange = (workspaceId: string) => {
    router.push(`/workspaces/${workspaceId}`)
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWorkspaceName.trim() || creating) return

    setCreating(true)
    try {
      const response = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWorkspaceName.trim() }),
      })

      const data = await response.json()
      if (data.success) {
        setDialogOpen(false)
        setNewWorkspaceName('')
        router.push(`/workspaces/${data.workspace.id}`)
      } else {
        alert(data.error || '워크스페이스 생성 실패')
      }
    } catch (error) {
      console.error('워크스페이스 생성 오류:', error)
      alert('워크스페이스 생성 중 오류가 발생했습니다.')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Building2 className="w-5 h-5 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">로딩 중...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Select value={currentWorkspaceId} onValueChange={handleWorkspaceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="워크스페이스 선택" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((workspace) => (
            <SelectItem key={workspace.id} value={workspace.id}>
              {workspace.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 워크스페이스 만들기</DialogTitle>
            <DialogDescription>
              팀원들과 협업할 워크스페이스를 생성하세요.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                워크스페이스 이름
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
            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? '생성 중...' : '워크스페이스 만들기'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

