# 🎨 Mora 실시간 시각화 가이드

## 📋 개요

이 문서는 Mora의 **실시간 미팅 시각화 엔진**의 구현 세부사항을 설명합니다.

---

## 🏗️ 아키텍처

### 전체 흐름

```
사용자 → "미팅 시작" 클릭
    ↓
useMockMeetingFeed Hook 시작
    ↓
4초마다 새 메시지 생성
    ↓
├─→ VisualizationBoard (중앙)
├─→ SummaryPanel (오른쪽)
├─→ ParticipantPanel (왼쪽)
└─→ ActionItemPanel (왼쪽)
```

---

## 🎯 핵심 구성요소

### 1. useMockMeetingFeed Hook

**위치**: `hooks/useMockMeetingFeed.ts`

**역할**: WebSocket을 시뮬레이션하여 실시간 메시지 피드 제공

**주요 기능**:
```typescript
// 4초마다 새 메시지 방출
const timer = setTimeout(() => {
  const newMessage: MeetingMessage = {
    id: `msg-${currentIndex}`,
    speaker: '성민',
    text: '안녕하세요...',
    timestamp: Date.now(),
    relatedTo: 'msg-0' // 연결된 메시지
  }
  setMessages(prev => [...prev, newMessage])
}, 4000)
```

**제공하는 값**:
- `messages`: 누적된 메시지 배열
- `isActive`: 현재 활성 상태
- `isComplete`: 모든 메시지 완료 여부
- `start()`, `pause()`, `stop()`, `reset()`: 제어 함수
- `progress`: 진행률 (0-100)

**사용 예시**:
```typescript
const { messages, isActive, start, stop } = useMockMeetingFeed({
  interval: 4000,  // 4초 간격
  autoStart: false // 자동 시작 안 함
})
```

---

### 2. VisualizationBoard 컴포넌트

**위치**: `components/VisualizationBoard.tsx`

**기술**: React Flow + Framer Motion

**노드 생성 로직**:
```typescript
// 메시지 → 노드 변환
const nodes: VisualizationNode[] = messages.map((msg, index) => ({
  id: msg.id,
  type: determineNodeType(msg.text), // 'topic' | 'question' | 'action' | 'decision'
  data: {
    label: msg.text.substring(0, 50), // 50자 제한
    speaker: msg.speaker,
    timestamp: msg.timestamp
  },
  position: {
    x: (index % 3) * 300 + 100,  // 3칼럼 그리드
    y: Math.floor(index / 3) * 180 + 50
  }
}))
```

**엣지 생성**:
```typescript
// relatedTo 필드로 연결
const edges = messages
  .filter(msg => msg.relatedTo)
  .map(msg => ({
    id: `edge-${msg.relatedTo}-${msg.id}`,
    source: msg.relatedTo,
    target: msg.id,
    animated: true  // 애니메이션 효과
  }))
```

**커스텀 노드 디자인**:
```tsx
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  className="px-4 py-3 rounded-lg border-2 border-indigo-300"
>
  <div className="text-xs font-semibold">{speaker}</div>
  <div className="text-sm">{label}</div>
  <div className="text-xs text-gray-400">{timestamp}</div>
</motion.div>
```

---

### 3. SummaryPanel 컴포넌트

**위치**: `components/SummaryPanel.tsx`

**기술**: Framer Motion + Auto Scroll

**주요 기능**:

1. **타입별 분류**:
```typescript
type SummaryType = 'statement' | 'question' | 'decision' | 'action'

const typeIcons = {
  statement: MessageSquare,
  question: MessageSquare,
  decision: Sparkles,
  action: Sparkles
}
```

2. **자동 스크롤**:
```typescript
useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }
}, [summaries.length])
```

3. **애니메이션**:
```tsx
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.4, type: 'spring' }}
>
  {/* 요약 내용 */}
</motion.div>
```

---

### 4. ParticipantPanel 컴포넌트

**위치**: `components/ParticipantPanel.tsx`

**기능**:
- 참여자 목록 표시
- 현재 발언자 하이라이트
- 실시간 상태 표시

**발언자 하이라이트**:
```typescript
const isSpeaking = currentSpeaker === participant.name

<motion.div
  animate={isSpeaking ? {
    scale: [1, 1.02, 1],
    transition: { duration: 0.5, repeat: Infinity }
  } : {}}
  className={isSpeaking ? 'bg-indigo-50 border-indigo-200' : ''}
>
  <Avatar className={isSpeaking ? 'ring-2 ring-indigo-500' : ''}>
    {participant.name.charAt(0)}
  </Avatar>
</motion.div>
```

---

### 5. Meeting Room 페이지

**위치**: `app/meeting/[id]/page.tsx`

**레이아웃**: 3칼럼 그리드 (3:6:3)

```tsx
<div className="grid grid-cols-12 gap-6 h-full">
  {/* 왼쪽: 3칼럼 */}
  <div className="col-span-3">
    <ParticipantPanel />
    <ActionItemPanel />
  </div>

  {/* 중앙: 6칼럼 */}
  <div className="col-span-6">
    <VisualizationBoard />
  </div>

  {/* 오른쪽: 3칼럼 */}
  <div className="col-span-3">
    <SummaryPanel />
  </div>
</div>
```

**상태 관리**:
```typescript
// 실시간 피드
const { messages, isActive, start, stop } = useMockMeetingFeed()

// 노드 자동 생성
const nodes = useMemo(() => 
  messages.map(msg => createNode(msg))
, [messages])

// 요약 자동 생성
const summaries = useMemo(() => 
  messages.map(msg => createSummary(msg))
, [messages])

// 액션 아이템 자동 추출
const actionItems = useMemo(() => 
  messages
    .filter(msg => isActionItem(msg.text))
    .map(msg => createActionItem(msg))
, [messages])
```

---

## 🎨 스타일링 전략

### TailwindCSS 클래스

**그라디언트**:
```css
bg-gradient-to-br from-gray-50 via-white to-indigo-50/20
bg-gradient-to-r from-indigo-600 to-violet-500
```

**글래스모피즘**:
```css
bg-white/80 backdrop-blur-sm border-indigo-100 shadow-lg
```

**노드 스타일**:
```css
border-2 border-indigo-300 bg-white shadow-lg rounded-lg
```

### 커스텀 CSS

**스크롤바**:
```css
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-indigo-200::-webkit-scrollbar-thumb {
  @apply bg-indigo-200 rounded-full;
}
```

**React Flow**:
```css
.react-flow__node {
  cursor: grab;
}

.react-flow__edge-path {
  stroke-width: 2;
}
```

---

## 🔄 데이터 플로우

### 1. 메시지 수신
```
useMockMeetingFeed → 새 메시지
```

### 2. 상태 업데이트
```typescript
setMessages(prev => [...prev, newMessage])
```

### 3. 파생 상태 계산
```typescript
// useMemo로 자동 재계산
const nodes = useMemo(() => /* ... */, [messages])
const summaries = useMemo(() => /* ... */, [messages])
const actionItems = useMemo(() => /* ... */, [messages])
```

### 4. UI 업데이트
```
React 렌더링 → Framer Motion 애니메이션 → 화면 표시
```

---

## 🎬 애니메이션 타이밍

| 요소 | 타입 | 지속시간 | 이징 |
|------|------|----------|------|
| 노드 생성 | scale + fade | 0.4s | spring |
| 요약 추가 | slide-up + fade | 0.4s | spring |
| 발언자 펄스 | scale loop | 0.5s | infinite |
| 진행률 바 | width | 0.3s | ease |
| LIVE 배지 | opacity loop | 2s | infinite |

---

## 🧪 테스트 시나리오

### 기본 플로우
1. `/meeting/demo` 접속
2. "미팅 시작" 클릭
3. 4초마다 새 메시지 확인
4. 노드가 중앙에 생성되는지 확인
5. 오른쪽에 요약이 추가되는지 확인
6. 왼쪽에 발언자가 하이라이트되는지 확인
7. "미팅 종료" 클릭
8. 대시보드로 이동되는지 확인

### 엣지 케이스
- 빠른 시작/정지 반복
- 페이지 새로고침
- 브라우저 뒤로가기
- 긴 텍스트 처리 (50자 제한)
- 한글 렌더링

---

## 🔧 커스터마이징 가이드

### 메시지 간격 변경
```typescript
// 4초 → 2초
useMockMeetingFeed({ interval: 2000 })
```

### 노드 레이아웃 변경
```typescript
// 3칼럼 → 4칼럼
position: {
  x: (index % 4) * 250 + 100,
  y: Math.floor(index / 4) * 180 + 50
}
```

### 색상 테마 변경
```css
/* tailwind.config.ts */
colors: {
  primary: '#your-color',
  secondary: '#your-color'
}
```

### 애니메이션 속도 조정
```typescript
transition={{ duration: 0.6 }} // 0.4s → 0.6s
```

---

## 📊 성능 최적화

### useMemo 사용
```typescript
// 메시지가 변경될 때만 재계산
const nodes = useMemo(() => 
  messages.map(createNode)
, [messages])
```

### React.memo 적용
```typescript
export default React.memo(VisualizationBoard)
```

### 가상화 (큰 데이터셋용)
```typescript
// react-window 사용 예정
import { FixedSizeList } from 'react-window'
```

---

## 🚀 향후 개선사항

### 1. 실제 WebSocket 연동
```typescript
// Socket.io 사용
const socket = io('ws://localhost:3001')
socket.on('message', (msg) => {
  setMessages(prev => [...prev, msg])
})
```

### 2. GPT-4 통합
```typescript
// 실시간 요약 생성
const summary = await fetch('/api/summarize', {
  method: 'POST',
  body: JSON.stringify({ transcript: messages })
})
```

### 3. 음성 입력
```typescript
// Web Audio API
const mediaRecorder = new MediaRecorder(stream)
mediaRecorder.ondataavailable = (e) => {
  sendToWhisper(e.data)
}
```

---

## 💡 베스트 프랙티스

1. **타입 안정성**: TypeScript 타입을 명확히 정의
2. **컴포넌트 분리**: 각 패널을 독립적으로 유지
3. **상태 최소화**: useMemo로 파생 상태 계산
4. **애니메이션 성능**: transform/opacity만 사용
5. **접근성**: 키보드 네비게이션 지원

---

## 📞 문의 및 지원

이슈 발생 시:
1. `npm run build`로 빌드 에러 확인
2. 브라우저 콘솔 로그 확인
3. React DevTools로 상태 확인

---

실시간 시각화 엔진이 완성되었습니다! 🎉

