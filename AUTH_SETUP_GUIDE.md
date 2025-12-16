# 🔐 Mora 인증 시스템 설정 가이드

실제 회원가입/로그인 기능을 사용하기 위한 설정 가이드입니다.

---

## 📋 필수 사항

### 1. Supabase 프로젝트 생성 (무료)

#### Step 1: Supabase 계정 생성
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인

#### Step 2: 새 프로젝트 생성
1. "New Project" 클릭
2. **Organization**: Personal 선택
3. **Name**: mora-dev (원하는 이름)
4. **Database Password**: 강력한 비밀번호 입력 (저장해두세요!)
5. **Region**: Northeast Asia (Seoul) 선택
6. "Create new project" 클릭 (2-3분 소요)

#### Step 3: API 키 복사
1. 프로젝트 생성 완료 후
2. **Settings** → **API** 클릭
3. 다음 값들을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🔧 환경 변수 설정

### `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database (Supabase에서 제공)
# Settings → Database → Connection String → URI 복사
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true"

# OpenAI (선택사항 - 나중에 설정 가능)
OPENAI_API_KEY=sk-proj-your-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 중요!

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon public key
- `DATABASE_URL`: Supabase Database Connection String

---

## 🗄️ 데이터베이스 설정

### Prisma 마이그레이션

환경 변수 설정 후, 데이터베이스 스키마를 적용하세요:

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push

# (선택) Prisma Studio로 데이터 확인
npx prisma studio
```

---

## ✅ 테스트

### 1. 회원가입
```
1. http://localhost:3000/ko/auth/signup 접속
2. 이름, 이메일, 비밀번호 입력
3. "회원가입" 클릭
4. 성공 시 자동으로 대시보드로 이동
```

### 2. 로그인
```
1. http://localhost:3000/ko/auth/login 접속
2. 이메일, 비밀번호 입력
3. "로그인" 클릭
4. 성공 시 대시보드로 이동
```

### 3. 사용자 확인
```bash
# Prisma Studio 실행
npx prisma studio

# User 테이블 확인
# - Supabase Auth ID와 동일한 ID
# - 이메일, 이름 저장됨
```

---

## 🔒 Supabase Auth 설정 (추가)

### Email 템플릿 커스터마이징

1. Supabase Dashboard
2. **Authentication** → **Email Templates**
3. **Confirm signup** 템플릿 수정

```html
<h2>Mora에 오신 것을 환영합니다!</h2>
<p>아래 링크를 클릭하여 이메일을 확인하세요:</p>
<p><a href="{{ .ConfirmationURL }}">이메일 확인</a></p>
```

### 이메일 확인 비활성화 (개발용)

개발 중에는 이메일 확인을 비활성화할 수 있습니다:

1. Supabase Dashboard
2. **Authentication** → **Providers** → **Email**
3. **Confirm email** 토글 OFF

⚠️ 프로덕션에서는 반드시 ON으로 설정하세요!

---

## 🎯 다음 단계

인증 시스템 설정이 완료되면:

1. ✅ 회원가입/로그인 테스트
2. ✅ 워크스페이스 생성 (실제 DB에 저장)
3. ✅ 미팅 생성 및 저장
4. ✅ 팀원 초대 기능 사용

---

## 🐛 문제 해결

### "Invalid API key"
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- Supabase API 키가 정확한지 확인
- 서버 재시작: `npm run dev`

### "Database connection failed"
- DATABASE_URL이 올바른지 확인
- Supabase 프로젝트가 활성 상태인지 확인
- 비밀번호에 특수문자가 있다면 URL 인코딩

### "User already registered"
- 이미 등록된 이메일
- 로그인 페이지로 이동하여 로그인

---

## 📚 참고 자료

- [Supabase 문서](https://supabase.com/docs)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)

---

**설정이 완료되면 Mora의 모든 기능을 사용할 수 있습니다!** 🎉

