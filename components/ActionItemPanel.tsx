'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActionItem } from '@/lib/supabase'
import { CheckCircle2, Circle, Calendar, User } from 'lucide-react'

interface ActionItemPanelProps {
  actionItems: ActionItem[]
}

export default function ActionItemPanel({ actionItems }: ActionItemPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          <span>Action Items</span>
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {actionItems.length} items
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actionItems.length > 0 ? (
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border ${
                  item.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.task}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{item.owner}</span>
                      </div>
                      {item.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.deadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No action items yet. They will appear here automatically during the meeting.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

