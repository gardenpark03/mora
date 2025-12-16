# Mora (모라)

**당신의 미팅 기억 — 시각화로**

실시간으로 듣고, 요약하고, 미팅을 그려주는 AI

---

## 🎯 프로젝트 소개

Mora는 **팀 협업**을 위한 **실제 AI 기반** 미팅 워크스페이스로, 음성 대화를 실시간으로 구조화된 시각적 요약으로 변환합니다. 

### ✨ 주요 기능

#### 🤖 AI 음성 처리
- 🎤 **실시간 음성 캡처** - WebRTC로 마이크 입력
- 🎯 **OpenAI Whisper** - 음성을 텍스트로 변환
- 🧠 **GPT-4 Turbo** - 지능적인 요약 및 분석
- 📊 **동적 시각화** - React Flow로 실시간 그래프 생성

#### 🏢 팀 협업 (NEW!)
- 👥 **워크스페이스** - 팀별 작업 공간
- 📁 **프로젝트 관리** - 미팅을 프로젝트별로 정리
- 🔐 **역할 기반 권한** - Admin / Member / Viewer
- 📧 **이메일 초대** - 팀원 초대 시스템
- 💾 **데이터베이스 저장** - PostgreSQL + Prisma

#### 🎨 실시간 시각화
- **React Flow** 기반 그래프
- **Framer Motion** 애니메이션
- 발언자별 색상 구분
- 자동 레이아웃 및 연결

---

## 🚀 빠른 시작

### 1. 저장소 클론 및 설치

```bash
git clone <repository-url>
cd mora
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성:

```env
# PostgreSQL 데이터베이스
DATABASE_URL="postgresql://user:password@localhost:5432/mora?schema=public"

# Supabase (인증)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# OpenAI API
OPENAI_API_KEY=sk-proj-your-api-key-here

# App URL (초대 링크용)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 📘 **상세 가이드**: 
> - [ENV_SETUP.md](ENV_SETUP.md) - 환경 변수
> - [WORKSPACE_SETUP_KR.md](WORKSPACE_SETUP_KR.md) - 데이터베이스 설정

### 3. 데이터베이스 초기화

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push

# (선택) Prisma Studio로 데이터 확인
npx prisma studio
```

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 브라우저에서 테스트

- **랜딩 페이지**: http://localhost:3000
- **대시보드**: http://localhost:3000/dashboard
- **AI 미팅룸**: http://localhost:3000/meeting/demo ⭐

---

## 🎬 사용 방법

### 🏢 워크스페이스 생성

1. 대시보드 접속
2. 워크스페이스 셀렉터 → "+" 버튼 클릭
3. 워크스페이스 이름 입력
4. 자동으로 생성 및 이동

### 👥 팀원 초대

1. 워크스페이스 페이지
2. "팀원 초대" 버튼 클릭
3. 이메일 입력
4. 초대 링크 생성
5. 링크를 팀원에게 전송

### 🎤 라이브 미팅

1. 워크스페이스 선택
2. "첫 미팅 시작하기" 클릭
3. **"실제 녹음 시작"** 선택
4. 마이크 권한 허용
5. 말하기!
   - 🎯 5초마다 Whisper가 전사
   - 🧠 GPT-4가 요약 생성
   - 📊 시각화 자동 업데이트

### 🎮 데모 모드 (API 키 불필요)

1. **"데모 모드"** 클릭
2. 한국어 회의 시뮬레이션 자동 실행
3. UI/UX 먼저 체험 가능

---

## 🏗️ 프로젝트 구조

```
mora/
├── app/
│   ├── api/
│   │   ├── workspaces/        # 워크스페이스 API 🆕
│   │   ├── transcribe/        # Whisper API
│   │   └── summarize/         # GPT-4 API
│   ├── workspaces/[id]/       # 워크스페이스 페이지 🆕
│   ├── invite/[token]/        # 초대 수락 페이지 🆕
│   ├── meeting/[id]/          # 미팅룸 (듀얼 모드)
│   ├── dashboard/             # 대시보드
│   └── page.tsx              # 랜딩 페이지
├── components/
│   ├── WorkspaceSelector.tsx  # 워크스페이스 선택 🆕
│   ├── VisualizationBoard.tsx # React Flow 그래프
│   ├── SummaryPanel.tsx       # 실시간 요약
│   └── ...
├── hooks/
│   ├── useAudioCapture.ts     # 오디오 캡처
│   └── useAIProcessor.ts      # AI 처리
├── lib/
│   ├── prisma.ts             # Prisma 클라이언트 🆕
│   ├── workspace.ts          # 워크스페이스 로직 🆕
│   ├── auth.ts               # Supabase 인증
│   └── types.ts              # TypeScript 타입
├── prisma/
│   └── schema.prisma         # 데이터베이스 스키마 🆕
└── ...
```

---

## 🎨 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**

### 시각화 & 애니메이션
- **React Flow** - 그래프 시각화
- **Framer Motion** - 애니메이션

### AI & 음성
- **OpenAI Whisper** - 음성→텍스트
- **OpenAI GPT-4 Turbo** - 요약 생성
- **Web Audio API** - 마이크 캡처

### 데이터베이스 & 인증 (NEW!)
- **PostgreSQL** - 관계형 데이터베이스
- **Prisma ORM** - 타입 안전 ORM
- **Supabase Auth** - 사용자 인증

### 향후 통합
- **Socket.io** - 실시간 협업
- **TipTap** - 리치 텍스트 편집

---

## 📊 데이터베이스 구조

```
User (사용자)
  ↓ 1:N
Membership (멤버십) - 역할 (ADMIN/MEMBER/VIEWER)
  ↓ N:1
Workspace (워크스페이스)
  ↓ 1:N
Project (프로젝트)
  ↓ 1:N
Meeting (미팅) - 전사, 요약, 시각화 데이터
```

---

## 💰 비용 예상

### OpenAI API (1시간 미팅 기준)

| 서비스 | 가격 | 비용 |
|--------|------|------|
| Whisper | $0.006/분 | $0.36 |
| GPT-4 Turbo | $0.01-0.03/1K토큰 | $5-10 |
| **총계** | | **$5-11** |

### 데이터베이스

- **Supabase 무료 티어**: 500MB, 충분함
- **PostgreSQL**: 로컬/클라우드 자유 선택

---

## 📚 문서

### 시작하기
- **[QUICKSTART_AI_KR.md](QUICKSTART_AI_KR.md)** - 3분 빠른 시작 ⭐
- **[ENV_SETUP.md](ENV_SETUP.md)** - 환경 변수 설정
- **[WORKSPACE_SETUP_KR.md](WORKSPACE_SETUP_KR.md)** - 데이터베이스 설정 🆕

### 기능별 가이드
- **[AI_INTEGRATION_KR.md](AI_INTEGRATION_KR.md)** - AI 통합 완벽 가이드 🤖
- **[WORKSPACE_GUIDE_KR.md](WORKSPACE_GUIDE_KR.md)** - 워크스페이스 시스템 🆕
- **[REALTIME_GUIDE_KR.md](REALTIME_GUIDE_KR.md)** - 실시간 엔진 상세

### 개발자
- **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - 아키텍처 분석
- **[SETUP.md](SETUP.md)** - 상세 설치 가이드

---

## 🔐 보안 및 권한

### 역할 시스템

- **ADMIN**: 워크스페이스 관리, 멤버 초대/제거
- **MEMBER**: 미팅 생성, 문서 편집
- **VIEWER**: 읽기 전용

### 권한 확인

```typescript
import { canManageWorkspace, canCreateMeeting } from '@/lib/workspace'

if (canManageWorkspace(userRole)) {
  // 관리자 기능
}

if (canCreateMeeting(userRole)) {
  // 미팅 시작
}
```

---

## 🧪 테스트

### 1. 워크스페이스 생성
```bash
# http://localhost:3000/dashboard
# 워크스페이스 셀렉터 → "+" → 이름 입력
✅ 워크스페이스 페이지로 이동
```

### 2. 팀원 초대
```bash
# "팀원 초대" → 이메일 입력
✅ 초대 링크 생성
```

### 3. AI 미팅
```bash
# /meeting/demo → "실제 녹음 시작"
✅ 5초마다 AI 처리
```

---

## 🔄 워크플로우

### 팀 미팅 진행

```
1. 워크스페이스 생성 (팀장)
2. 팀원 초대
3. 프로젝트 생성 (선택)
4. 미팅 시작
5. AI 실시간 전사 및 요약
6. 미팅 자동 저장
7. 팀원들이 언제든 조회
```

---

## 🚀 다음 단계

### 현재 완료 ✅
- ✅ 실시간 시각화 엔진
- ✅ OpenAI Whisper 연동
- ✅ GPT-4 요약 연동
- ✅ 워크스페이스 시스템
- ✅ 팀원 초대 시스템
- ✅ 역할 기반 권한
- ✅ PostgreSQL + Prisma

### 진행 중 🔄
- [ ] 프로젝트 CRUD
- [ ] 미팅 저장 및 조회
- [ ] 미팅 히스토리
- [ ] 멤버 관리

### 향후 계획 📅
- [ ] 실시간 협업 (Socket.io)
- [ ] 공유 문서 편집 (TipTap)
- [ ] 코멘트 시스템
- [ ] 알림 시스템
- [ ] 모바일 앱

---

## 💡 베스트 프랙티스

### 워크스페이스 구조

```
회사
├── 제품팀
│   ├── Q4 로드맵 프로젝트
│   └── 디자인 시스템 프로젝트
├── 마케팅팀
└── 영업팀
```

### 역할 할당

- 팀 리더 → **ADMIN**
- 팀원 → **MEMBER**
- 외부 이해관계자 → **VIEWER**

---

## 🐛 문제 해결

### "Cannot connect to database"

PostgreSQL 실행 확인:
```bash
# macOS
brew services start postgresql@15

# Docker
docker start mora-postgres
```

### "Prisma Client not found"

```bash
npx prisma generate
```

### "로그인이 필요합니다"

Supabase 설정 확인:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## 🎓 학습 자료

### 공식 문서
- [Next.js 14](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Supabase](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

### Mora 문서
- [빠른 시작](QUICKSTART_AI_KR.md)
- [AI 통합](AI_INTEGRATION_KR.md)
- [워크스페이스](WORKSPACE_GUIDE_KR.md)

---

## 🤝 기여

이슈와 PR은 언제나 환영합니다!

---

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

## 🎉 완성!

**Mora는 이제 완전한 팀 협업 AI 미팅 플랫폼입니다!**

- 🎤 실제 음성 처리
- 🤖 AI 요약 및 분석
- 🏢 워크스페이스 시스템
- 👥 팀 협업 기능
- 💾 데이터베이스 저장

### 지금 바로 시작:

```bash
npm install
npx prisma db push
npm run dev
```

**Mora** - 팀과 함께 성장하는 AI 미팅 플랫폼 🏢🤖✨

*Made with ❤️ using Next.js, OpenAI, Prisma, React Flow, and TailwindCSS*
