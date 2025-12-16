'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Mic, Circle } from 'lucide-react'
import { Participant } from '@/lib/types'
import { motion } from 'framer-motion'

interface ParticipantPanelProps {
  participants: Participant[]
  currentSpeaker?: string
}

export default function ParticipantPanel({ participants, currentSpeaker }: ParticipantPanelProps) {
  return (
    <Card className="h-full bg-white/80 backdrop-blur-sm border-indigo-100 shadow-lg">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>참여자</span>
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {participants.length}명
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {participants.map((participant) => {
            const isSpeaking = currentSpeaker === participant.name
            
            return (
              <motion.div
                key={participant.id}
                animate={isSpeaking ? {
                  scale: [1, 1.02, 1],
                  transition: { duration: 0.5, repeat: Infinity }
                } : {}}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isSpeaking ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                }`}
              >
                <Avatar className={`h-10 w-10 ${isSpeaking ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-500 text-white">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {participant.name}
                    </span>
                    {isSpeaking && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Mic className="w-3 h-3 text-indigo-600" />
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Circle 
                      className={`w-2 h-2 ${
                        participant.status === 'active' ? 'text-green-500 fill-green-500' :
                        participant.status === 'speaking' ? 'text-indigo-500 fill-indigo-500' :
                        'text-gray-300 fill-gray-300'
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {participant.status === 'active' ? '활성' :
                       participant.status === 'speaking' ? '발언 중' : '대기'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

