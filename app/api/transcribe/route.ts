import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/transcribe
 * 
 * OpenAI Whisper API를 사용한 음성-텍스트 변환
 * 
 * 요청 형식: multipart/form-data
 * - file: 오디오 파일 (webm, mp4, mp3 등)
 * - language: 언어 코드 (선택, 기본값: 'ko')
 * 
 * 응답:
 * {
 *   success: boolean
 *   text: string (전사된 텍스트)
 *   duration?: number (처리 시간)
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OPENAI_API_KEY가 설정되지 않았습니다.',
          text: '' 
        },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get('file') as File
    const language = (formData.get('language') as string) || 'ko'

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: '오디오 파일이 필요합니다.', text: '' },
        { status: 400 }
      )
    }

    // 파일 크기 확인 (25MB 제한)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '파일 크기가 너무 큽니다 (최대 25MB)', text: '' },
        { status: 400 }
      )
    }

    console.log(`[Transcribe] 파일 처리 중: ${audioFile.name}, 크기: ${(audioFile.size / 1024).toFixed(2)}KB`)

    // Whisper API 호출
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'json',
    })

    const duration = Date.now() - startTime

    console.log(`[Transcribe] 완료 (${duration}ms): "${transcription.text.substring(0, 50)}..."`)

    return NextResponse.json({
      success: true,
      text: transcription.text,
      duration,
      language,
    })

  } catch (error: any) {
    console.error('[Transcribe] 오류:', error)
    
    const duration = Date.now() - startTime
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '전사 중 오류가 발생했습니다.',
        text: '',
        duration,
      },
      { status: 500 }
    )
  }
}

// GET 요청 시 상태 확인
export async function GET() {
  const hasApiKey = !!process.env.OPENAI_API_KEY
  
  return NextResponse.json({
    status: 'ok',
    service: 'Whisper Transcription API',
    configured: hasApiKey,
    message: hasApiKey 
      ? 'API가 정상적으로 설정되었습니다.' 
      : 'OPENAI_API_KEY를 설정해주세요.',
  })
}
