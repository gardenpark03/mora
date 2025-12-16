'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import VisualizationBoard from '@/components/VisualizationBoard'
import SummaryPanel from '@/components/SummaryPanel'
import ParticipantPanel from '@/components/ParticipantPanel'
import ActionItemPanel from '@/components/ActionItemPanel'
import RecordingIndicator from '@/components/RecordingIndicator'
import { useMockMeetingFeed } from '@/hooks/useMockMeetingFeed'
import { useAudioCapture } from '@/hooks/useAudioCapture'
import { useAIProcessor } from '@/hooks/useAIProcessor'
import { Play, Pause, StopCircle, ArrowLeft, Mic, MicOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VisualizationNode, VisualizationEdge, SummaryItem, Participant, MeetingMessage } from '@/lib/types'
import { ActionItem } from '@/lib/supabase'

type MeetingMode = 'demo' | 'live' | 'idle'

export default function MeetingRoom() {
  const params = useParams()
  const router = useRouter()
  const meetingId = params.id as string

  const [mode, setMode] = useState<MeetingMode>('idle')
  const [messages, setMessages] = useState<MeetingMessage[]>([])
  const [summaries, setSummaries] = useState<SummaryItem[]>([])
  const [currentSpeaker, setCurrentSpeaker] = useState<string | undefined>()

  // 데모 모드 (기존 모의 피드)
  const mockFeed = useMockMeetingFeed({
    interval: 4000,
    autoStart: false,
  })

  // 라이브 모드 (실제 AI 처리)
  const aiProcessor = useAIProcessor({
    onMessage: useCallback((msg: MeetingMessage) => {
      setMessages(prev => [...prev, msg])
      setCurrentSpeaker(msg.speaker)
      setTimeout(() => setCurrentSpeaker(undefined), 3000)
    }, []),
    onSummary: useCallback((summary: SummaryItem) => {
      setSummaries(prev => [...prev, summary])
    }, []),
    defaultSpeaker: '참여자',
  })

  const audioCapture = useAudioCapture({
    onTranscription: useCallback(async (result) => {
      console.log('[Meeting] 전사 완료:', result.text)
      await aiProcessor.processTranscription(result.text, '나', result.timestamp)
    }, [aiProcessor]),
    onError: (error) => {
      console.error('[Meeting] 오디오 캡처 오류:', error)
    },
    chunkDuration: 5,
    language: 'ko',
  })

  // 데모 모드에서 메시지 동기화
  useEffect(() => {
    if (mode === 'demo') {
      setMessages(mockFeed.messages)
      if (mockFeed.messages.length > 0) {
        const latestSpeaker = mockFeed.messages[mockFeed.messages.length - 1].speaker
        setCurrentSpeaker(latestSpeaker)
        setTimeout(() => setCurrentSpeaker(undefined), 3000)
      }
    }
  }, [mode, mockFeed.messages])

  // 시각화 노드 생성
  const visualizationNodes: VisualizationNode[] = useMemo(() => {
    const sourceMessages = mode === 'demo' ? mockFeed.messages : messages
    
    return sourceMessages.map((msg, index) => {
      // 발언자별 색상 매핑
      const speakerColors: Record<string, string> = {
        '성민': 'border-indigo-400',
        '지은': 'border-violet-400',
        '한빈': 'border-purple-400',
        '수연': 'border-pink-400',
        '나': 'border-green-400',
        '참여자': 'border-gray-400',
      }
      
      return {
        id: msg.id,
        type: msg.text.includes('?') ? 'question' : 
              msg.text.includes('완료') || msg.text.includes('마무리') ? 'action' :
              msg.text.includes('동의') || msg.text.includes('결정') ? 'decision' : 'topic',
        data: {
          label: msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text,
          speaker: msg.speaker,
          timestamp: msg.timestamp,
          fullText: msg.text,
          color: speakerColors[msg.speaker] || 'border-gray-400',
        },
        position: {
          x: (index % 3) * 300 + 100,
          y: Math.floor(index / 3) * 180 + 50,
        },
      }
    })
  }, [mode, mockFeed.messages, messages])

  // 엣지 생성
  const visualizationEdges: VisualizationEdge[] = useMemo(() => {
    const sourceMessages = mode === 'demo' ? mockFeed.messages : messages
    
    return sourceMessages
      .filter(msg => msg.relatedTo)
      .map(msg => ({
        id: `edge-${msg.relatedTo}-${msg.id}`,
        source: msg.relatedTo!,
        target: msg.id,
        animated: true,
      }))
  }, [mode, mockFeed.messages, messages])

  // 요약 생성 (데모 모드)
  const displaySummaries: SummaryItem[] = useMemo(() => {
    if (mode === 'live') {
      return summaries
    }
    
    // 데모 모드: 메시지를 그대로 요약으로 사용
    return mockFeed.messages.map(msg => ({
      id: msg.id,
      speaker: msg.speaker,
      text: msg.text,
      timestamp: msg.timestamp,
      type: msg.text.includes('?') ? 'question' as const :
            msg.text.includes('완료') || msg.text.includes('마무리') ? 'action' as const :
            msg.text.includes('동의') || msg.text.includes('결정') ? 'decision' as const : 
            'statement' as const,
    }))
  }, [mode, mockFeed.messages, summaries])

  // 참여자 목록
  const participants: Participant[] = useMemo(() => {
    const sourceMessages = mode === 'demo' ? mockFeed.messages : messages
    const uniqueSpeakers = Array.from(new Set(sourceMessages.map(m => m.speaker)))
    const allParticipants = mode === 'demo' 
      ? ['성민', '지은', '한빈', '수연']
      : [...new Set([...uniqueSpeakers, '나'])]
    
    return allParticipants.map(name => ({
      id: name,
      name,
      status: uniqueSpeakers.includes(name) ? 'active' as const : 'idle' as const,
    }))
  }, [mode, mockFeed.messages, messages])

  // 액션 아이템 추출
  const actionItems: ActionItem[] = useMemo(() => {
    const sourceMessages = mode === 'demo' ? mockFeed.messages : messages
    
    return sourceMessages
      .filter(msg => 
        msg.text.includes('완료') || 
        msg.text.includes('작성') || 
        msg.text.includes('조율') ||
        msg.text.includes('검수') ||
        msg.text.includes('준비')
      )
      .map((msg, index) => ({
        id: msg.id,
        task: msg.text,
        owner: msg.speaker,
        deadline: new Date(Date.now() + (index + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false,
      }))
  }, [mode, mockFeed.messages, messages])

  // 데모 모드 시작
  const startDemo = () => {
    setMode('demo')
    setMessages([])
    setSummaries([])
    mockFeed.reset()
    mockFeed.start()
  }

  // 라이브 모드 시작
  const startLive = async () => {
    try {
      await audioCapture.startRecording()
      setMode('live')
      setMessages([])
      setSummaries([])
    } catch (err) {
      console.error('라이브 녹음 시작 실패:', err)
      alert('마이크 접근 권한을 허용해주세요.')
    }
  }

  // 일시정지
  const pause = () => {
    if (mode === 'demo') {
      mockFeed.pause()
    } else if (mode === 'live') {
      audioCapture.stopRecording()
    }
  }

  // 종료
  const handleEndMeeting = () => {
    if (mode === 'demo') {
      mockFeed.stop()
    } else if (mode === 'live') {
      audioCapture.stopRecording()
    }
    setMode('idle')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  const isActive = mode === 'demo' ? mockFeed.isActive : audioCapture.isRecording
  const isComplete = mode === 'demo' ? mockFeed.isComplete : false
  const progress = mode === 'demo' ? mockFeed.progress : 0

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 flex flex-col">
      {/* 녹음 인디케이터 */}
      <RecordingIndicator 
        isRecording={audioCapture.isRecording}
        isProcessing={aiProcessor.isProcessing}
      />

      {/* 헤더 */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                  {mode === 'live' ? '🎙️ 라이브 미팅' : mode === 'demo' ? '데모 미팅' : '미팅 세션'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {mode === 'idle' && (
                <>
                  <Button onClick={startLive} size="lg" className="bg-red-600 hover:bg-red-700">
                    <Mic className="w-5 h-5 mr-2" />
                    실제 녹음 시작
                  </Button>
                  <Button onClick={startDemo} size="lg" variant="outline">
                    <Play className="w-5 h-5 mr-2" />
                    데모 모드
                  </Button>
                </>
              )}
              
              {isActive && (
                <>
                  <Button onClick={pause} variant="outline" size="lg">
                    <Pause className="w-5 h-5 mr-2" />
                    일시정지
                  </Button>
                  <Button onClick={handleEndMeeting} variant="destructive" size="lg">
                    <StopCircle className="w-5 h-5 mr-2" />
                    미팅 종료
                  </Button>
                </>
              )}

              {isComplete && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                  미팅 완료
                </div>
              )}
            </div>
          </div>

          {/* 진행률 바 (데모 모드만) */}
          {mode === 'demo' && isActive && (
            <motion.div 
              className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}

          {/* 오류 메시지 */}
          {(audioCapture.error || aiProcessor.error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
            >
              {audioCapture.error || aiProcessor.error}
            </motion.div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 - 3칼럼 레이아웃 */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-6 py-6 h-full">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* 왼쪽 패널 - 참여자 & 액션 아이템 */}
            <div className="col-span-3 space-y-6 overflow-y-auto">
              <ParticipantPanel 
                participants={participants}
                currentSpeaker={currentSpeaker}
              />
              <ActionItemPanel actionItems={actionItems} />
            </div>

            {/* 중앙 패널 - 시각화 보드 */}
            <div className="col-span-6 h-full">
              <AnimatePresence mode="wait">
                {visualizationNodes.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl border-2 border-dashed border-gray-300"
                  >
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600 to-violet-500 rounded-full flex items-center justify-center">
                        {mode === 'idle' ? (
                          <Play className="w-10 h-10 text-white" />
                        ) : (
                          <Mic className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {mode === 'idle' ? '시각화 준비 완료' : '음성 대기 중'}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          {mode === 'idle' 
                            ? '실제 녹음 또는 데모 모드로 실시간 대화 시각화를 시작하세요'
                            : '말씀하시면 AI가 자동으로 분석하고 시각화합니다'
                          }
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="board"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full"
                  >
                    <VisualizationBoard 
                      nodes={visualizationNodes}
                      edges={visualizationEdges}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 오른쪽 패널 - 요약 */}
            <div className="col-span-3 h-full">
              <SummaryPanel summaries={displaySummaries} isLive={isActive} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
