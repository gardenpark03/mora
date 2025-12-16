import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Meeting } from '@/lib/supabase'
import { Clock, Users, CheckCircle2 } from 'lucide-react'

interface MeetingCardProps {
  meeting: Meeting
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const completedTasks = meeting.action_items.filter(item => item.completed).length
  const totalTasks = meeting.action_items.length

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{meeting.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {meeting.summary || 'No summary available'}
            </CardDescription>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            meeting.status === 'active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {meeting.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{meeting.participants.length} participants</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {totalTasks > 0 && (
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-muted-foreground">
                {completedTasks}/{totalTasks} action items completed
              </span>
            </div>
          )}

          <Link href={`/meeting/${meeting.id}`} className="block">
            <Button variant="outline" className="w-full mt-2">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

