# 🤖 Mora AI 통합 가이드

실제 AI 파이프라인 (Whisper + GPT-4) 연동이 완료되었습니다!

---

## 🎯 구현된 기능

### 1. **실시간 음성 캡처** (`useAudioCapture` Hook)
- ✅ WebRTC MediaStream API 사용
- ✅ 5초 단위 오디오 청크 자동 생성
- ✅ 마이크 권한 관리
- ✅ 연속 녹음 지원
- ✅ 에러 핸들링

### 2. **Whisper 음성 전사** (`/api/transcribe`)
- ✅ OpenAI Whisper API 연동
- ✅ 한국어 최적화 (`language: 'ko'`)
- ✅ 멀티파트 폼 데이터 처리
- ✅ 25MB 파일 크기 제한
- ✅ 처리 시간 추적

### 3. **GPT-4 요약 생성** (`/api/summarize`)
- ✅ 구조화된 JSON 응답
- ✅ 토픽 추출
- ✅ 요약문 생성
- ✅ 액션 아이템 자동 추출
- ✅ 대화 타입 분류 (진술/질문/결정/액션)

### 4. **AI 프로세서** (`useAIProcessor` Hook)
- ✅ 전사 → 요약 파이프라인
- ✅ 맥락 관리 (최근 500자)
- ✅ 에러 복구 (fallback)
- ✅ 상태 관리

### 5. **듀얼 모드 미팅룸**
- ✅ **라이브 모드**: 실제 AI 처리
- ✅ **데모 모드**: 모의 데이터 시뮬레이션
- ✅ 모드 간 원활한 전환
- ✅ 통합된 UI

---

## 📋 설치 및 설정

### 1. OpenAI 패키지 설치

```bash
npm install openai
```

### 2. API 키 발급

1. **OpenAI 계정 생성**: https://platform.openai.com
2. **API 키 발급**: https://platform.openai.com/api-keys
3. **결제 방법 추가**: API 사용을 위해 필수

### 3. 환경 변수 설정

`.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

편집:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. 서버 재시작

```bash
npm run dev
```

---

## 🚀 사용 방법

### 라이브 모드 시작

1. **http://localhost:3000/meeting/demo** 접속
2. **"실제 녹음 시작"** 버튼 클릭
3. 마이크 권한 허용
4. 말하기 시작! 🎤

### 데모 모드 (API 키 없이)

1. 같은 페이지에서
2. **"데모 모드"** 버튼 클릭
3. 자동으로 한국어 대화 시뮬레이션

---

## 🔄 데이터 플로우

```
사용자 음성 (마이크)
    ↓
[5초마다 청크 생성]
    ↓
useAudioCapture Hook
    ↓
POST /api/transcribe (Whisper)
    ↓
텍스트 반환: "안녕하세요, 오늘 회의를 시작하겠습니다"
    ↓
useAIProcessor Hook
    ↓
POST /api/summarize (GPT-4)
    ↓
JSON 응답:
{
  "topics": ["회의 시작"],
  "summary": "회의가 시작되었습니다",
  "actionItems": [],
  "type": "statement"
}
    ↓
UI 업데이트:
├─→ VisualizationBoard: 새 노드 생성
├─→ SummaryPanel: 요약 추가
├─→ ParticipantPanel: 발언자 하이라이트
└─→ ActionItemPanel: 액션 아이템 추가
```

---

## 📁 새로 추가된 파일

### Hooks
- **`hooks/useAudioCapture.ts`** - 오디오 캡처 및 전송
- **`hooks/useAIProcessor.ts`** - AI 처리 로직

### Components
- **`components/RecordingIndicator.tsx`** - 녹음 상태 표시

### API Routes
- **`app/api/transcribe/route.ts`** - Whisper 연동 (업데이트)
- **`app/api/summarize/route.ts`** - GPT-4 연동 (업데이트)

### 업데이트된 파일
- **`app/meeting/[id]/page.tsx`** - 듀얼 모드 지원
- **`package.json`** - OpenAI SDK 추가

---

## 🎨 UI 개선사항

### 1. 녹음 인디케이터
```tsx
<RecordingIndicator 
  isRecording={true}
  isProcessing={true}
/>
```

- 빨간 점 애니메이션 (🔴 녹음 중)
- 스피너 (⚙️ AI 처리 중)
- 화면 상단 중앙 고정 위치

### 2. 듀얼 버튼
- **실제 녹음 시작**: 빨간 배경 + 마이크 아이콘
- **데모 모드**: 흰 배경 + 재생 아이콘

### 3. 발언자별 색상
```typescript
const speakerColors = {
  '성민': 'border-indigo-400',
  '지은': 'border-violet-400',
  '한빈': 'border-purple-400',
  '수연': 'border-pink-400',
  '나': 'border-green-400',
}
```

---

## 🧪 API 테스트

### Transcribe API 상태 확인

```bash
curl http://localhost:3000/api/transcribe
```

응답:
```json
{
  "status": "ok",
  "service": "Whisper Transcription API",
  "configured": true,
  "message": "API가 정상적으로 설정되었습니다."
}
```

### Summarize API 상태 확인

```bash
curl http://localhost:3000/api/summarize
```

### 실제 전사 테스트

```bash
curl -X POST http://localhost:3000/api/transcribe \
  -F "file=@test-audio.webm" \
  -F "language=ko"
```

### 실제 요약 테스트

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "안녕하세요, 오늘 회의를 시작하겠습니다.",
    "speaker": "테스트"
  }'
```

---

## ⚙️ 설정 옵션

### useAudioCapture 옵션

```typescript
useAudioCapture({
  chunkDuration: 5,        // 청크 길이 (초)
  language: 'ko',          // 언어 ('ko', 'en', 'ja' 등)
  autoStart: false,        // 자동 시작 여부
  onTranscription: (result) => {
    console.log(result.text)
  },
  onError: (error) => {
    console.error(error)
  }
})
```

### useAIProcessor 옵션

```typescript
useAIProcessor({
  defaultSpeaker: '참여자',
  onMessage: (msg) => {
    // 새 메시지 처리
  },
  onSummary: (summary) => {
    // 새 요약 처리
  }
})
```

---

## 💰 비용 예상

### Whisper API
- **가격**: $0.006 / 분
- **5초 청크**: 약 $0.0005
- **1시간 미팅**: 약 $0.36

### GPT-4 Turbo API
- **입력**: $0.01 / 1K 토큰
- **출력**: $0.03 / 1K 토큰
- **평균 요약**: ~200 토큰
- **1시간 미팅 (720개 청크)**: 약 $5-10

### 총 예상 비용
- **1시간 미팅**: **약 $5-11**
- **최적화 팁**:
  - 청크 길이 늘리기 (5초 → 10초)
  - 침묵 감지하여 불필요한 전사 방지
  - 맥락 길이 제한 (500자)

---

## 🔧 문제 해결

### 1. "OPENAI_API_KEY가 설정되지 않았습니다"

```bash
# .env.local 파일 확인
cat .env.local

# 서버 재시작
npm run dev
```

### 2. "마이크 접근 권한이 필요합니다"

브라우저 설정에서 마이크 권한 허용:
- Chrome: 설정 → 개인정보 및 보안 → 사이트 설정 → 마이크
- Firefox: 설정 → 개인정보 및 보안 → 권한 → 마이크

### 3. "전사 실패: 500"

```bash
# API 키 확인
curl http://localhost:3000/api/transcribe

# 브라우저 콘솔 확인
# 네트워크 탭에서 요청/응답 확인
```

### 4. 오디오 파일이 너무 큼

```typescript
// chunkDuration 줄이기
useAudioCapture({ chunkDuration: 3 })
```

### 5. 느린 응답 속도

- Whisper: 일반적으로 5초 오디오에 1-2초 소요
- GPT-4: 요약 생성에 2-5초 소요
- 네트워크 속도 확인
- API 상태 확인: https://status.openai.com

---

## 🚀 성능 최적화

### 1. 병렬 처리

```typescript
// 전사와 이전 요약을 병렬로 처리
Promise.all([
  transcribeAudio(chunk),
  summarizePrevious(prevText)
])
```

### 2. 디바운싱

```typescript
// 너무 짧은 오디오는 건너뛰기
if (audioBlob.size < 1000) return
```

### 3. 캐싱

```typescript
// 동일한 텍스트 재요약 방지
const cache = new Map()
if (cache.has(text)) return cache.get(text)
```

### 4. 스트리밍 (향후)

```typescript
// GPT-4 스트리밍 응답
const stream = await openai.chat.completions.create({
  stream: true,
  // ...
})
```

---

## 📊 모니터링

### 로그 확인

```typescript
// 브라우저 콘솔
console.log('[Meeting] 전사 완료:', result.text)
console.log('[AIProcessor] 처리 오류:', error)

// 서버 로그
console.log('[Transcribe] 파일 처리 중...')
console.log('[Summarize] 요약 중...')
```

### 메트릭 추적

```typescript
// 처리 시간
const startTime = Date.now()
// ... API 호출
const duration = Date.now() - startTime
console.log(`처리 시간: ${duration}ms`)
```

---

## 🎯 다음 단계

### 즉시 가능
- ✅ 라이브 모드로 실제 음성 테스트
- ✅ 여러 발언자 테스트
- ✅ 긴 미팅 테스트

### 개선 사항
- [ ] 발언자 식별 (화자 분리)
- [ ] 침묵 감지 (VAD)
- [ ] 오디오 품질 향상
- [ ] 실시간 스트리밍
- [ ] WebSocket 연동

### 프로덕션 준비
- [ ] Supabase에 미팅 저장
- [ ] 사용자 인증 연동
- [ ] 비용 최적화
- [ ] 에러 리포팅
- [ ] 분석 대시보드

---

## 💡 베스트 프랙티스

### 1. 에러 핸들링
```typescript
try {
  await transcribe()
} catch (error) {
  // fallback 제공
  onTranscription({ text: '(전사 실패)', timestamp: Date.now() })
}
```

### 2. 사용자 피드백
```tsx
<RecordingIndicator isRecording={true} isProcessing={true} />
```

### 3. 리소스 정리
```typescript
useEffect(() => {
  return () => {
    cleanup() // 마이크 스트림 정리
  }
}, [])
```

### 4. 점진적 개선
- 먼저 데모 모드로 UX 테스트
- 그 다음 라이브 모드로 전환
- API 비용 모니터링

---

## 🎉 완성!

이제 Mora는 **실제 음성을 듣고 AI로 처리**할 수 있습니다!

### 테스트해보세요:

```bash
npm run dev
# http://localhost:3000/meeting/demo
# "실제 녹음 시작" 클릭
# 말하기 시작! 🎤
```

---

**Mora** - 진짜 AI 미팅 어시스턴트 🤖✨

