# 🚀 워크스페이스 시스템 빠른 설정

## 📋 필수 사항

### 1. PostgreSQL 설치

#### macOS (Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Docker
```bash
docker run --name mora-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mora \
  -p 5432:5432 \
  -d postgres:15
```

#### Supabase (권장)
1. https://supabase.com 접속
2. 새 프로젝트 생성
3. Database URL 복사

---

## ⚙️ 설정 단계

### 1단계: 환경 변수 설정

`.env` 파일 생성:

```bash
cp .env.example .env
```

편집:

```env
# PostgreSQL 연결
DATABASE_URL="postgresql://postgres:password@localhost:5432/mora?schema=public"

# Supabase (또는 다른 Auth 제공자)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2단계: 패키지 설치

```bash
npm install
```

새 패키지:
- `@prisma/client` - Prisma ORM 클라이언트
- `prisma` - Prisma CLI

### 3단계: 데이터베이스 초기화

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push

# ✅ 성공 메시지 확인:
# "Your database is now in sync with your Prisma schema."
```

### 4단계: 데이터 확인 (선택)

Prisma Studio 실행:

```bash
npx prisma studio
```

브라우저에서 http://localhost:5555 열림

---

## 🧪 테스트

### 1. 개발 서버 시작

```bash
npm run dev
```

### 2. 워크스페이스 생성 테스트

1. http://localhost:3000/dashboard 접속
2. 네비게이션 바에서 워크스페이스 셀렉터 찾기
3. "+" 버튼 클릭
4. "테스트 팀" 입력
5. "워크스페이스 만들기" 클릭

✅ 성공 시: 워크스페이스 페이지로 이동

### 3. 팀원 초대 테스트

1. 워크스페이스 페이지에서 "팀원 초대" 클릭
2. 이메일 입력
3. "초대 보내기" 클릭
4. 초대 링크 복사

✅ 성공 시: 알림에 초대 링크 표시

### 4. 초대 수락 테스트

1. 복사한 초대 링크 접속
2. 로그인 (필요시)
3. 자동으로 워크스페이스 추가

✅ 성공 시: 워크스페이스 페이지로 이동

---

## 🐛 문제 해결

### "Cannot connect to database"

**원인**: PostgreSQL이 실행되지 않음

**해결**:
```bash
# macOS
brew services start postgresql@15

# Docker
docker start mora-postgres

# Supabase
# 프로젝트가 일시중지되었는지 확인
```

### "Invalid DATABASE_URL"

**원인**: 잘못된 연결 문자열

**확인**:
```env
# 형식
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# 예시
DATABASE_URL="postgresql://postgres:mysecret@localhost:5432/mora?schema=public"
```

### "Prisma Client not found"

**해결**:
```bash
npx prisma generate
```

### "Migration failed"

**해결**:
```bash
# 기존 데이터베이스 초기화
npx prisma migrate reset

# 다시 push
npx prisma db push
```

### "NEXT_PUBLIC_SUPABASE_URL is not defined"

**확인**:
1. `.env` 파일 존재 여부
2. 환경 변수 이름 정확한지 확인
3. 서버 재시작

```bash
# 서버 재시작
npm run dev
```

---

## 📊 데이터베이스 구조 확인

### Prisma Studio로 확인

```bash
npx prisma studio
```

다음 테이블이 생성되어야 함:
- ✅ User
- ✅ Workspace
- ✅ Membership
- ✅ Project
- ✅ Meeting
- ✅ Invite

### SQL로 확인

```bash
# PostgreSQL 접속
psql -U postgres -d mora

# 테이블 목록
\dt

# Workspace 테이블 구조
\d "Workspace"

# 종료
\q
```

---

## 🔄 스키마 변경 시

스키마를 수정했을 때:

```bash
# 1. schema.prisma 파일 수정

# 2. Prisma 클라이언트 재생성
npx prisma generate

# 3. 데이터베이스 업데이트
npx prisma db push

# 4. 서버 재시작
```

---

## 💾 백업 및 복원

### 데이터베이스 백업

```bash
# PostgreSQL 백업
pg_dump -U postgres -d mora > mora_backup.sql

# Docker에서 백업
docker exec mora-postgres pg_dump -U postgres mora > mora_backup.sql
```

### 데이터베이스 복원

```bash
# PostgreSQL 복원
psql -U postgres -d mora < mora_backup.sql

# Docker에서 복원
docker exec -i mora-postgres psql -U postgres mora < mora_backup.sql
```

---

## 🚀 프로덕션 배포

### Vercel + Supabase (권장)

1. **Supabase 프로젝트 생성**
   - https://supabase.com
   - 새 프로젝트 생성
   - Database URL 복사

2. **Vercel 배포**
   ```bash
   npm run build
   vercel deploy
   ```

3. **환경 변수 설정**
   - Vercel 대시보드
   - Settings → Environment Variables
   - 모든 환경 변수 추가

4. **재배포**
   ```bash
   vercel --prod
   ```

### Railway (대안)

1. https://railway.app 접속
2. "New Project" → "Deploy from GitHub"
3. 저장소 선택
4. PostgreSQL 플러그인 추가
5. 환경 변수 자동 설정
6. 배포 완료

---

## 📈 성능 최적화

### Connection Pooling

프로덕션에서 Prisma Accelerate 사용:

```bash
npm install @prisma/extension-accelerate
```

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
```

### 인덱스 추가

자주 조회하는 필드에 인덱스:

```prisma
model Workspace {
  slug String @unique @db.VarChar(255) // 인덱스 자동 생성
  
  @@index([name]) // 검색용 인덱스
}
```

---

## 🎉 완료!

워크스페이스 시스템이 설정되었습니다!

### 체크리스트

- [ ] PostgreSQL 설치 및 실행
- [ ] `.env` 파일 설정
- [ ] `npm install` 실행
- [ ] `npx prisma db push` 성공
- [ ] 워크스페이스 생성 테스트
- [ ] 초대 시스템 테스트

### 다음 단계

1. [WORKSPACE_GUIDE_KR.md](WORKSPACE_GUIDE_KR.md) - 상세 가이드
2. 프로젝트 관리 기능 추가
3. 미팅-워크스페이스 연동
4. 실시간 협업 기능

---

**Mora** - 팀을 위한 AI 미팅 플랫폼 🏢✨

