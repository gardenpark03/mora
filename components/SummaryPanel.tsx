'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, MessageSquare } from 'lucide-react'
import { SummaryItem } from '@/lib/types'

interface SummaryPanelProps {
  summaries: SummaryItem[]
  isLive?: boolean
}

const typeIcons = {
  statement: MessageSquare,
  question: MessageSquare,
  decision: Sparkles,
  action: Sparkles,
}

const typeColors = {
  statement: 'text-blue-600 bg-blue-50',
  question: 'text-purple-600 bg-purple-50',
  decision: 'text-green-600 bg-green-50',
  action: 'text-orange-600 bg-orange-50',
}

export default function SummaryPanel({ summaries, isLive = false }: SummaryPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 새 요약이 추가되면 자동 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [summaries.length])

  return (
    <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-indigo-100 shadow-lg">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>실시간 요약</span>
          </div>
          {isLive && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium flex items-center space-x-1"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>LIVE</span>
            </motion.div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"
        >
          {summaries.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div className="space-y-2">
                <Sparkles className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm text-muted-foreground">
                  미팅이 시작되면<br />AI 요약이 여기에 표시됩니다
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {summaries.map((summary, index) => {
                const Icon = typeIcons[summary.type]
                const colorClass = typeColors[summary.type]
                
                return (
                  <motion.div
                    key={summary.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.4,
                      delay: 0.05,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }}
                    className="group"
                  >
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {summary.speaker}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(summary.timestamp).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {summary.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
