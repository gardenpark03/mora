// 실시간 미팅을 위한 타입 정의

export interface MeetingMessage {
  id: string
  speaker: string
  text: string
  timestamp: number
  relatedTo?: string // 연결된 메시지 ID
}

export interface SummaryItem {
  id: string
  speaker: string
  text: string
  timestamp: number
  type: 'statement' | 'question' | 'decision' | 'action'
}

export interface VisualizationNode {
  id: string
  type: 'topic' | 'decision' | 'action' | 'question'
  data: {
    label: string
    speaker: string
    timestamp: number
    fullText?: string
  }
  position: { x: number; y: number }
  style?: any
}

export interface VisualizationEdge {
  id: string
  source: string
  target: string
  animated?: boolean
  style?: any
}

export interface Participant {
  id: string
  name: string
  avatar?: string
  status: 'active' | 'idle' | 'speaking'
}

