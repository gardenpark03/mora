# 🏢 Mora 워크스페이스 가이드

팀 협업을 위한 워크스페이스 시스템이 완성되었습니다!

---

## 🎯 개요

Mora의 워크스페이스 시스템을 통해:
- 👥 팀원들과 함께 작업
- 📁 프로젝트별로 미팅 정리
- 🔐 역할 기반 권한 관리
- 📧 이메일 초대 기능

---

## 🏗️ 데이터베이스 구조

```
User (사용자)
  ↓ 1:N
Membership (멤버십)
  ↓ N:1
Workspace (워크스페이스)
  ↓ 1:N
Project (프로젝트)
  ↓ 1:N
Meeting (미팅)
```

### 역할 (Role)
- **ADMIN**: 워크스페이스 관리, 멤버 초대/제거
- **MEMBER**: 미팅 생성, 문서 편집
- **VIEWER**: 읽기 전용

---

## 📦 설치 및 설정

### 1. Prisma 설치

```bash
npm install @prisma/client prisma
```

### 2. 데이터베이스 설정

`.env` 파일에 PostgreSQL 연결 추가:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mora?schema=public"
```

### 3. Prisma 마이그레이션

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push

# Prisma Studio 실행 (GUI)
npx prisma studio
```

---

## 🚀 주요 기능

### 1. 워크스페이스 생성

**UI**: 네비게이션 바 → 워크스페이스 셀렉터 → "+" 버튼

```typescript
POST /api/workspaces/create
{
  "name": "제품팀",
  "description": "제품 개발 및 기획"
}
```

**응답**:
```json
{
  "success": true,
  "workspace": {
    "id": "clxxx",
    "name": "제품팀",
    "slug": "제품팀-abc123",
    "role": "ADMIN"
  }
}
```

### 2. 워크스페이스 목록

**UI**: 자동으로 로드됨

```typescript
GET /api/workspaces/list
```

**응답**:
```json
{
  "success": true,
  "workspaces": [
    {
      "id": "clxxx",
      "name": "제품팀",
      "role": "ADMIN",
      "_count": {
        "members": 5,
        "projects": 3
      }
    }
  ]
}
```

### 3. 팀원 초대

**UI**: 워크스페이스 페이지 → "팀원 초대" 버튼

```typescript
POST /api/workspaces/invite
{
  "workspaceId": "clxxx",
  "email": "teammate@example.com",
  "role": "MEMBER"
}
```

**응답**:
```json
{
  "success": true,
  "invite": {
    "id": "clyyy",
    "email": "teammate@example.com",
    "token": "abc123def456",
    "link": "http://localhost:3000/invite/abc123def456",
    "expiresAt": "2025-10-17T..."
  }
}
```

### 4. 초대 수락

**UI**: 초대 링크 클릭 → 자동 처리

```
/invite/[token]
```

초대 링크를 클릭하면:
1. 자동으로 토큰 검증
2. 워크스페이스에 멤버로 추가
3. 워크스페이스 페이지로 리다이렉트

---

## 🎨 UI 컴포넌트

### WorkspaceSelector

네비게이션 바에 표시되는 워크스페이스 선택 드롭다운

```tsx
<WorkspaceSelector currentWorkspaceId="clxxx" />
```

**기능**:
- 워크스페이스 목록 표시
- 워크스페이스 전환
- 새 워크스페이스 생성

### 워크스페이스 페이지

`/workspaces/[id]/page.tsx`

**섹션**:
1. **헤더**: 워크스페이스 이름, 설명, 초대 버튼
2. **멤버 목록**: 아바타, 이름, 역할
3. **프로젝트**: 프로젝트 카드 그리드
4. **최근 미팅**: 미팅 목록

---

## 🔐 권한 시스템

### 권한 확인 함수

```typescript
import { canManageWorkspace, canCreateMeeting, canEditContent } from '@/lib/workspace'

// 워크스페이스 관리 (ADMIN만)
if (canManageWorkspace(userRole)) {
  // 멤버 초대, 삭제, 워크스페이스 설정 변경
}

// 미팅 생성 (ADMIN, MEMBER)
if (canCreateMeeting(userRole)) {
  // 새 미팅 시작
}

// 콘텐츠 편집 (ADMIN, MEMBER)
if (canEditContent(userRole)) {
  // 문서 편집, 노트 작성
}
```

### 미들웨어 보호

`middleware.ts` (향후 추가):
```typescript
export async function middleware(request: NextRequest) {
  const user = await getCurrentUser()
  const workspaceId = request.nextUrl.pathname.split('/')[2]
  const role = await getUserRole(workspaceId, user.id)
  
  if (!role) {
    return NextResponse.redirect('/dashboard')
  }
}
```

---

## 📊 데이터 모델

### User (사용자)
```prisma
model User {
  id          String       @id @default(cuid())
  email       String       @unique
  name        String?
  avatarUrl   String?
  memberships Membership[]
  meetings    Meeting[]
}
```

### Workspace (워크스페이스)
```prisma
model Workspace {
  id          String       @id @default(cuid())
  name        String
  description String?
  slug        String       @unique
  members     Membership[]
  projects    Project[]
  invites     Invite[]
}
```

### Membership (멤버십)
```prisma
model Membership {
  id          String    @id @default(cuid())
  role        Role      @default(MEMBER)
  user        User      @relation(...)
  workspace   Workspace @relation(...)
  
  @@unique([userId, workspaceId])
}
```

### Project (프로젝트)
```prisma
model Project {
  id          String    @id @default(cuid())
  name        String
  description String?
  color       String?   @default("#4F46E5")
  workspace   Workspace @relation(...)
  meetings    Meeting[]
}
```

### Meeting (미팅)
```prisma
model Meeting {
  id          String    @id @default(cuid())
  title       String
  transcript  String?   @db.Text
  summary     Json?
  status      String    @default("draft")
  project     Project?  @relation(...)
  owner       User?     @relation(...)
}
```

### Invite (초대)
```prisma
model Invite {
  id          String    @id @default(cuid())
  email       String
  token       String    @unique
  role        Role      @default(MEMBER)
  workspace   Workspace @relation(...)
  expiresAt   DateTime
  usedAt      DateTime?
  
  @@unique([workspaceId, email])
}
```

---

## 🧪 테스트 시나리오

### 1. 워크스페이스 생성
```bash
# 1. 대시보드 접속
http://localhost:3000/dashboard

# 2. 워크스페이스 셀렉터에서 "+" 클릭
# 3. "제품팀" 입력
# 4. "워크스페이스 만들기" 클릭
# 5. 워크스페이스 페이지로 자동 이동
```

### 2. 팀원 초대
```bash
# 1. 워크스페이스 페이지에서 "팀원 초대" 클릭
# 2. 이메일 입력: teammate@example.com
# 3. "초대 보내기" 클릭
# 4. 초대 링크 복사
# 5. 링크를 팀원에게 전송
```

### 3. 초대 수락
```bash
# 1. 초대 링크 클릭
# 2. 로그인 (필요시)
# 3. 자동으로 워크스페이스 추가
# 4. 워크스페이스 페이지로 이동
```

### 4. 워크스페이스 전환
```bash
# 1. 네비게이션 바의 워크스페이스 셀렉터 클릭
# 2. 다른 워크스페이스 선택
# 3. 해당 워크스페이스로 전환
```

---

## 🔄 워크플로우

### 새 팀 시작
```
1. 팀장이 워크스페이스 생성
2. 팀원들 이메일로 초대
3. 팀원들이 초대 링크로 참여
4. 프로젝트 생성
5. 미팅 시작
```

### 미팅 진행
```
1. 워크스페이스 선택
2. 프로젝트 선택 (선택사항)
3. "첫 미팅 시작하기" 클릭
4. AI 실시간 전사 및 요약
5. 미팅 종료 후 자동 저장
```

---

## 🛠️ 향후 기능

### Priority 1
- [ ] 프로젝트 CRUD
- [ ] 미팅-프로젝트 연결
- [ ] 미팅 히스토리 조회
- [ ] 멤버 역할 변경
- [ ] 멤버 제거

### Priority 2
- [ ] 워크스페이스 설정
- [ ] 워크스페이스 아이콘/색상
- [ ] 프로젝트 색상 커스터마이징
- [ ] 미팅 필터링/검색
- [ ] 통계 대시보드

### Priority 3
- [ ] 실시간 협업 (Socket.io)
- [ ] 공유 문서 편집
- [ ] 코멘트 시스템
- [ ] 알림 시스템
- [ ] 활동 로그

---

## 💡 베스트 프랙티스

### 1. 워크스페이스 구조

**좋은 예시**:
```
회사
├── 제품팀
├── 마케팅팀
└── 영업팀
```

각 팀별로 워크스페이스를 분리하고, 프로젝트로 세부 분류

### 2. 역할 할당

- **ADMIN**: 팀 리더, 관리자
- **MEMBER**: 대부분의 팀원
- **VIEWER**: 외부 이해관계자, 임시 참여자

### 3. 초대 관리

- 초대 링크는 7일 후 자동 만료
- 한 이메일당 하나의 활성 초대만 유지
- 초대 사용 후 자동으로 비활성화

---

## 🐛 문제 해결

### "로그인이 필요합니다"

Supabase Auth 설정 확인:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### "워크스페이스에 접근할 수 없습니다"

사용자가 해당 워크스페이스의 멤버인지 확인

### "초대가 만료되었습니다"

새 초대 생성 필요 (7일 제한)

### Prisma 오류

```bash
# 스키마 재적용
npx prisma db push

# 클라이언트 재생성
npx prisma generate
```

---

## 📚 API 참조

### 워크스페이스 생성
```
POST /api/workspaces/create
Body: { name, description }
Response: { success, workspace }
```

### 워크스페이스 목록
```
GET /api/workspaces/list
Response: { success, workspaces }
```

### 워크스페이스 상세
```
GET /api/workspaces/[id]
Response: { success, workspace, userRole }
```

### 팀원 초대
```
POST /api/workspaces/invite
Body: { workspaceId, email, role }
Response: { success, invite }
```

### 초대 수락
```
PUT /api/workspaces/invite
Body: { token }
Response: { success, workspace }
```

---

## 🎉 완성!

워크스페이스 시스템이 구축되었습니다!

### 다음 단계:
1. ✅ 데이터베이스 설정
2. ✅ 워크스페이스 생성 테스트
3. ✅ 초대 시스템 테스트
4. ⏳ 프로젝트 관리 구현
5. ⏳ 미팅 저장 연동

---

**Mora** - 팀과 함께 성장하는 AI 미팅 워크스페이스 🏢✨

