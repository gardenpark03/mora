'use client'

import { useState, useCallback } from 'react'
import { MeetingMessage, SummaryItem } from '@/lib/types'

interface SummarizeResponse {
  success: boolean
  topics: string[]
  summary: string
  actionItems: Array<{
    task: string
    owner: string
    due: string
  }>
  type: 'statement' | 'question' | 'decision' | 'action'
}

interface UseAIProcessorOptions {
  onMessage?: (message: MeetingMessage) => void
  onSummary?: (summary: SummaryItem) => void
  defaultSpeaker?: string
}

/**
 * AI 처리 로직을 담당하는 Hook
 * 전사된 텍스트를 받아 요약하고 구조화된 데이터로 변환
 */
export function useAIProcessor({
  onMessage,
  onSummary,
  defaultSpeaker = '발언자'
}: UseAIProcessorOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [context, setContext] = useState<string>('')

  // 텍스트를 요약하고 처리
  const processTranscription = useCallback(async (
    text: string,
    speaker?: string,
    timestamp?: number
  ) => {
    if (!text || text.trim().length === 0) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // 1. 메시지 객체 생성
      const messageId = `msg-${Date.now()}`
      const message: MeetingMessage = {
        id: messageId,
        speaker: speaker || defaultSpeaker,
        text: text.trim(),
        timestamp: timestamp || Date.now(),
      }

      // 즉시 메시지 전달 (UI 업데이트)
      onMessage?.(message)

      // 2. GPT-4로 요약 생성
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          context: context,
          speaker: speaker || defaultSpeaker,
        }),
      })

      if (!response.ok) {
        throw new Error(`요약 실패: ${response.status}`)
      }

      const data: SummarizeResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || '요약을 생성할 수 없습니다.')
      }

      // 3. 요약 객체 생성
      const summary: SummaryItem = {
        id: `summary-${Date.now()}`,
        speaker: speaker || defaultSpeaker,
        text: data.summary,
        timestamp: timestamp || Date.now(),
        type: data.type,
      }

      // 요약 전달
      onSummary?.(summary)

      // 4. 맥락 업데이트 (다음 요약을 위해)
      setContext(prev => {
        const newContext = `${prev}\n${speaker || defaultSpeaker}: ${text}`.trim()
        // 최근 500자만 유지 (토큰 절약)
        return newContext.slice(-500)
      })

      return {
        message,
        summary,
        topics: data.topics,
        actionItems: data.actionItems,
      }

    } catch (err) {
      console.error('[AIProcessor] 처리 오류:', err)
      const errorMessage = err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.'
      setError(errorMessage)
      
      // 에러 발생 시에도 기본 요약 생성
      const fallbackSummary: SummaryItem = {
        id: `summary-${Date.now()}`,
        speaker: speaker || defaultSpeaker,
        text: text.trim(),
        timestamp: timestamp || Date.now(),
        type: 'statement',
      }
      onSummary?.(fallbackSummary)
      
      throw err
    } finally {
      setIsProcessing(false)
    }
  }, [context, onMessage, onSummary, defaultSpeaker])

  // 맥락 초기화
  const resetContext = useCallback(() => {
    setContext('')
  }, [])

  return {
    processTranscription,
    isProcessing,
    error,
    resetContext,
  }
}

