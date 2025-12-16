# 🔐 환경 변수 설정 가이드

## 📋 필요한 환경 변수

### OpenAI API (필수)

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

- **목적**: Whisper (음성→텍스트) 및 GPT-4 (요약) API 사용
- **발급처**: https://platform.openai.com/api-keys
- **비용**: 종량제 (Whisper: $0.006/분, GPT-4: $0.01-0.03/1K토큰)

### Supabase (선택사항 - 향후 사용)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- **목적**: 데이터베이스 저장 및 사용자 인증
- **발급처**: https://supabase.com

---

## 🚀 설정 방법

### 1. 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
cd /Users/garden/Desktop/mora
touch .env.local
```

### 2. 내용 작성

`.env.local` 파일에 다음 내용 추가:

```env
# OpenAI API (필수)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase (선택 - 나중에 설정 가능)
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### 3. API 키 발급

#### OpenAI API 키 발급 (2분)

1. https://platform.openai.com 접속
2. 계정 생성 (Gmail로 간편 가입)
3. 결제 방법 추가 (신용카드)
4. https://platform.openai.com/api-keys 접속
5. "Create new secret key" 클릭
6. 키 이름 입력 (예: "Mora")
7. 생성된 키 복사 (`sk-proj-...`로 시작)
8. `.env.local` 파일에 붙여넣기

> ⚠️ **주의**: API 키는 절대 GitHub에 커밋하지 마세요!

### 4. 서버 재시작

환경 변수 변경 후 반드시 서버 재시작:

```bash
# 기존 서버 중지 (Ctrl + C)
# 다시 시작
npm run dev
```

---

## ✅ 설정 확인

### 방법 1: API 엔드포인트 테스트

```bash
# Whisper API 상태 확인
curl http://localhost:3000/api/transcribe

# 정상 응답:
# {
#   "status": "ok",
#   "configured": true,
#   "message": "API가 정상적으로 설정되었습니다."
# }
```

```bash
# GPT-4 API 상태 확인
curl http://localhost:3000/api/summarize
```

### 방법 2: 브라우저 테스트

1. http://localhost:3000/meeting/demo 접속
2. "실제 녹음 시작" 버튼 클릭
3. 마이크 권한 허용
4. 말하기
5. 5초 후 텍스트 변환 확인

---

## 🔒 보안

### .gitignore 확인

`.env.local` 파일이 Git에서 무시되는지 확인:

```bash
cat .gitignore | grep .env
```

출력:
```
.env*.local
.env
```

### API 키 노출 시 조치

1. https://platform.openai.com/api-keys 접속
2. 해당 키 삭제
3. 새 키 발급
4. `.env.local` 업데이트

---

## 💰 비용 관리

### 사용량 확인

https://platform.openai.com/usage

### 한도 설정

https://platform.openai.com/account/billing/limits

권장 한도:
- 소프트 한도: $10
- 하드 한도: $20

### 비용 절감 팁

1. **테스트 시 데모 모드 사용**
2. **청크 길이 늘리기** (5초 → 10초)
3. **침묵 구간 필터링**
4. **맥락 길이 제한** (현재 500자)

---

## 🐛 문제 해결

### "OPENAI_API_KEY가 설정되지 않았습니다"

```bash
# 1. 파일 존재 확인
ls -la .env.local

# 2. 내용 확인
cat .env.local

# 3. 올바른 형식인지 확인
# OPENAI_API_KEY=sk-proj-... (따옴표 없이)

# 4. 서버 재시작
npm run dev
```

### "Invalid API key"

- API 키가 올바른지 확인
- OpenAI 대시보드에서 키 상태 확인
- 결제 방법이 추가되었는지 확인

### "Rate limit exceeded"

- 너무 많은 요청 발생
- 무료 티어 한도 초과
- 잠시 대기 후 재시도

---

## 📝 예시 파일

### `.env.local` (완전한 예시)

```env
# OpenAI API - 필수
OPENAI_API_KEY=sk-proj-abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef

# Supabase - 선택사항
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmno.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...

# 기타 설정
NODE_ENV=development
```

---

## 🎯 다음 단계

환경 변수 설정이 완료되면:

1. ✅ **QUICKSTART_AI_KR.md** 참고하여 AI 기능 테스트
2. ✅ **AI_INTEGRATION_KR.md** 읽고 상세 구현 이해
3. ✅ 실제 미팅 시나리오로 테스트

---

**Mora** - 안전하게 AI 기능 사용하기 🔐

