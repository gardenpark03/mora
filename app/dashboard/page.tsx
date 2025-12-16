'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import MeetingCard from '@/components/MeetingCard'
import WorkspaceList from '@/components/WorkspaceList'
import { Plus, Calendar } from 'lucide-react'
import { mockMeetings } from '@/lib/mockData'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function Dashboard() {
  const router = useRouter()
  const [meetings] = useState(mockMeetings)

  const createNewMeeting = () => {
    // In a real app, this would create a new meeting in the database
    // For now, we'll just redirect to a demo meeting
    router.push('/meeting/demo')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your workspaces and meetings
          </p>
        </div>

        {/* Workspaces */}
        <div className="mb-12">
          <WorkspaceList />
        </div>

        {/* Meetings Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recent Meetings</h2>
              <p className="text-muted-foreground">Access your past and ongoing meetings</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Meeting</DialogTitle>
                  <DialogDescription>
                    Start a new meeting session with AI-powered transcription and visualization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Meeting Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Q4 Planning Session"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Workspace</label>
                    <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600">
                      <option>Product Team</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                  <Button className="w-full" onClick={createNewMeeting}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Meeting
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {meetings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meetings yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first meeting to get started
              </p>
              <Button onClick={createNewMeeting}>
                <Plus className="w-4 h-4 mr-2" />
                Create Meeting
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

