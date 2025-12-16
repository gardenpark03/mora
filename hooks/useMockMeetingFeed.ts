'use client'

import { useState, useEffect, useCallback } from 'react'
import { MeetingMessage } from '@/lib/types'

// 모의 미팅 데이터 (한국어)
const mockMeetingData: Omit<MeetingMessage, 'id' | 'timestamp'>[] = [
  { speaker: '성민', text: '안녕하세요, 오늘 회의 시작하겠습니다. 이번 주 알파 버전 릴리즈에 대해 논의해볼까요?', relatedTo: undefined },
  { speaker: '지은', text: 'UI 디자인은 거의 완료되었고, 피그마 파일 공유드렸습니다.', relatedTo: '0' },
  { speaker: '한빈', text: '백엔드 API는 80% 정도 완성됐어요. 인증 부분만 마무리하면 될 것 같습니다.', relatedTo: '0' },
  { speaker: '수연', text: '모바일 반응형은 어떻게 진행되고 있나요?', relatedTo: '1' },
  { speaker: '지은', text: '태블릿과 모바일 모두 테스트 완료했습니다. 아이폰 SE에서 약간 레이아웃 이슈가 있었는데 수정했어요.', relatedTo: '3' },
  { speaker: '성민', text: '좋네요. 그럼 QA 일정은 언제로 잡을까요?', relatedTo: undefined },
  { speaker: '한빈', text: '이번 주 금요일까지 기능 개발을 완료하고, 다음 주 월요일부터 QA 시작하면 어떨까요?', relatedTo: '5' },
  { speaker: '수연', text: '저도 동의합니다. 테스트 케이스는 제가 목요일까지 준비하겠습니다.', relatedTo: '6' },
  { speaker: '지은', text: '배포 환경 설정은 DevOps 팀과 조율이 필요할 것 같아요.', relatedTo: '6' },
  { speaker: '성민', text: '제가 DevOps 팀에 미팅 요청 드리겠습니다. 그럼 액션 아이템 정리할게요.', relatedTo: undefined },
  { speaker: '한빈', text: '한빈: 금요일까지 백엔드 인증 기능 완료', relatedTo: '9' },
  { speaker: '수연', text: '수연: 목요일까지 QA 테스트 케이스 작성', relatedTo: '9' },
  { speaker: '지은', text: '지은: 모바일 UI 최종 검수 및 디자인 시스템 문서화', relatedTo: '9' },
  { speaker: '성민', text: '성민: DevOps 팀과 배포 일정 조율', relatedTo: '9' },
  { speaker: '성민', text: '모두 수고하셨습니다. 다음 주 월요일에 다시 만나요!', relatedTo: undefined },
]

interface UseMockMeetingFeedOptions {
  interval?: number // 메시지 간격 (ms)
  autoStart?: boolean
}

export function useMockMeetingFeed(options: UseMockMeetingFeedOptions = {}) {
  const { interval = 4000, autoStart = false } = options
  
  const [messages, setMessages] = useState<MeetingMessage[]>([])
  const [isActive, setIsActive] = useState(autoStart)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // 미팅 시작
  const start = useCallback(() => {
    setIsActive(true)
    setIsComplete(false)
  }, [])

  // 미팅 일시정지
  const pause = useCallback(() => {
    setIsActive(false)
  }, [])

  // 미팅 종료
  const stop = useCallback(() => {
    setIsActive(false)
    setIsComplete(true)
  }, [])

  // 리셋
  const reset = useCallback(() => {
    setMessages([])
    setCurrentIndex(0)
    setIsActive(false)
    setIsComplete(false)
  }, [])

  // 실시간 메시지 피드
  useEffect(() => {
    if (!isActive || currentIndex >= mockMeetingData.length) {
      if (currentIndex >= mockMeetingData.length && isActive) {
        setIsComplete(true)
        setIsActive(false)
      }
      return
    }

    const timer = setTimeout(() => {
      const nextMessage = mockMeetingData[currentIndex]
      const newMessage: MeetingMessage = {
        ...nextMessage,
        id: `msg-${currentIndex}`,
        timestamp: Date.now(),
        relatedTo: nextMessage.relatedTo ? `msg-${nextMessage.relatedTo}` : undefined,
      }

      setMessages(prev => [...prev, newMessage])
      setCurrentIndex(prev => prev + 1)
    }, interval)

    return () => clearTimeout(timer)
  }, [isActive, currentIndex, interval])

  return {
    messages,
    isActive,
    isComplete,
    start,
    pause,
    stop,
    reset,
    progress: mockMeetingData.length > 0 ? (currentIndex / mockMeetingData.length) * 100 : 0,
  }
}

