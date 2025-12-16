import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/summarize
 * 
 * GPT-4를 사용한 미팅 세그먼트 요약
 * 
 * 요청 형식: JSON
 * {
 *   text: string (전사된 텍스트)
 *   context?: string (이전 대화 맥락)
 *   speaker?: string (발언자 이름)
 * }
 * 
 * 응답:
 * {
 *   success: boolean
 *   topics: string[] (주요 토픽)
 *   summary: string (요약문)
 *   actionItems: Array<{task, owner, due}>
 *   type: 'statement' | 'question' | 'decision' | 'action'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OPENAI_API_KEY가 설정되지 않았습니다.',
        },
        { status: 500 }
      )
    }

    const { text, context, speaker } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '텍스트가 필요합니다.' },
        { status: 400 }
      )
    }

    console.log(`[Summarize] 요약 중 (${text.length}자): "${text.substring(0, 50)}..."`)

    // GPT-4에게 구조화된 요약 요청
    const systemPrompt = `당신은 Mora, AI 미팅 어시스턴트입니다.
주어진 미팅 대화 세그먼트를 분석하여 다음을 JSON 형식으로 출력하세요:

{
  "topics": ["토픽1", "토픽2"],
  "summary": "2-3문장으로 요약한 핵심 내용",
  "actionItems": [
    {"task": "할 일", "owner": "담당자", "due": "기한"}
  ],
  "type": "statement" | "question" | "decision" | "action"
}

- topics: 대화에서 언급된 핵심 주제 (1-3개)
- summary: 간결하고 명확한 요약문
- actionItems: 명시적인 액션 아이템만 추출 (없으면 빈 배열)
- type: 대화의 성격 분류
  - statement: 일반 진술
  - question: 질문
  - decision: 결정 사항
  - action: 액션 아이템 포함

항상 유효한 JSON을 반환하세요.`

    const userPrompt = context 
      ? `[이전 맥락]\n${context}\n\n[현재 발언 - ${speaker || '발언자'}]\n${text}`
      : `[발언 - ${speaker || '발언자'}]\n${text}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    })

    const resultText = completion.choices[0].message.content
    if (!resultText) {
      throw new Error('GPT-4가 응답을 반환하지 않았습니다.')
    }

    const result = JSON.parse(resultText)

    console.log(`[Summarize] 완료: ${result.topics?.length || 0}개 토픽, ${result.actionItems?.length || 0}개 액션`)

    return NextResponse.json({
      success: true,
      topics: result.topics || [],
      summary: result.summary || '',
      actionItems: result.actionItems || [],
      type: result.type || 'statement',
      timestamp: Date.now(),
    })

  } catch (error: any) {
    console.error('[Summarize] 오류:', error)
    
    // 파싱 오류의 경우 기본값 반환
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: true,
        topics: [],
        summary: '(요약 생성 실패)',
        actionItems: [],
        type: 'statement',
        timestamp: Date.now(),
      })
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '요약 중 오류가 발생했습니다.',
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
    service: 'GPT-4 Summarization API',
    configured: hasApiKey,
    message: hasApiKey 
      ? 'API가 정상적으로 설정되었습니다.' 
      : 'OPENAI_API_KEY를 설정해주세요.',
  })
}
