'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mic } from 'lucide-react'

interface TranscriptEntry {
  speaker: string
  text: string
  timestamp: string
}

interface TranscriptPanelProps {
  transcript: TranscriptEntry[]
  isLive?: boolean
}

export default function TranscriptPanel({ transcript, isLive = false }: TranscriptPanelProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-indigo-600" />
          <span>Live Transcript</span>
          {isLive && (
            <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span>Recording</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        {transcript.length > 0 ? (
          <div className="space-y-4">
            {transcript.map((entry, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-500 text-white text-xs">
                    {entry.speaker.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{entry.speaker}</span>
                    <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Waiting for audio input... Transcript will appear here in real-time.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

