'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface TranscriptionResult {
  text: string
  timestamp: number
  confidence?: number
}

interface UseAudioCaptureOptions {
  onTranscription?: (result: TranscriptionResult) => void
  onError?: (error: Error) => void
  chunkDuration?: number // 초 단위 (기본 5초)
  language?: string // 언어 코드 (기본 'ko')
  autoStart?: boolean
}

export function useAudioCapture({
  onTranscription,
  onError,
  chunkDuration = 5,
  language = 'ko',
  autoStart = false
}: UseAudioCaptureOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 마이크 권한 요청
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      streamRef.current = stream
      setHasPermission(true)
      setError(null)
      return stream
    } catch (err) {
      const errorMessage = '마이크 접근 권한이 필요합니다.'
      setError(errorMessage)
      onError?.(new Error(errorMessage))
      setHasPermission(false)
      throw err
    }
  }, [onError])

  // 오디오 청크를 Whisper API로 전송
  const sendAudioChunk = useCallback(async (audioBlob: Blob) => {
    if (audioBlob.size === 0) {
      console.warn('빈 오디오 청크, 건너뜀')
      return
    }

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('language', language)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`전사 실패: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.text && data.text.trim()) {
        const result: TranscriptionResult = {
          text: data.text.trim(),
          timestamp: Date.now(),
          confidence: data.confidence,
        }
        
        onTranscription?.(result)
      }
    } catch (err) {
      console.error('오디오 전사 오류:', err)
      const errorMessage = err instanceof Error ? err.message : '전사 중 오류가 발생했습니다.'
      setError(errorMessage)
      onError?.(new Error(errorMessage))
    } finally {
      setIsProcessing(false)
    }
  }, [language, onTranscription, onError])

  // 녹음 시작
  const startRecording = useCallback(async () => {
    try {
      let stream = streamRef.current
      
      if (!stream) {
        stream = await requestPermission()
      }

      // MediaRecorder 설정
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4'

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      })

      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType })
        chunksRef.current = []
        
        if (audioBlob.size > 0) {
          await sendAudioChunk(audioBlob)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setError(null)

      // 주기적으로 청크 생성 (chunkDuration초마다)
      intervalRef.current = setInterval(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop()
          // 즉시 다시 시작하여 연속 녹음
          setTimeout(() => {
            if (mediaRecorderRef.current?.state === 'inactive') {
              chunksRef.current = []
              mediaRecorderRef.current.start()
            }
          }, 100)
        }
      }, chunkDuration * 1000)

    } catch (err) {
      console.error('녹음 시작 실패:', err)
      const errorMessage = err instanceof Error ? err.message : '녹음을 시작할 수 없습니다.'
      setError(errorMessage)
      onError?.(new Error(errorMessage))
    }
  }, [requestPermission, sendAudioChunk, chunkDuration, onError])

  // 녹음 중지
  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }

    setIsRecording(false)
  }, [])

  // 리소스 정리
  const cleanup = useCallback(() => {
    stopRecording()
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setHasPermission(false)
  }, [stopRecording])

  // 자동 시작
  useEffect(() => {
    if (autoStart) {
      startRecording()
    }
    
    return () => {
      cleanup()
    }
  }, [autoStart])

  return {
    isRecording,
    isProcessing,
    hasPermission,
    error,
    startRecording,
    stopRecording,
    requestPermission,
    cleanup,
  }
}

