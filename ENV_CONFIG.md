# 🔧 Mora 환경 변수 설정

아래 내용을 `.env.local` 파일에 복사하세요:

```env
# Supabase (제공받은 정보)
NEXT_PUBLIC_SUPABASE_URL=https://ruxitsjxbqbfhowrxhvx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1eGl0c2p4YnFiZmhvd3J4aHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MDU2NTYsImV4cCI6MjA3ODI4MTY1Nn0.32gvK8505ATHURrwKCdlB35DBx4JJIPXAPL8F3XOPWI

# Database (Supabase에서 가져오기)
# Supabase Dashboard → Settings → Database → Connection String → URI
DATABASE_URL="postgresql://postgres.ruxitsjxbqbfhowrxhvx:[YOUR_PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# OpenAI (선택사항 - 실제 AI 기능용)
# OPENAI_API_KEY=sk-proj-your-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 실행 명령어:

```bash
# 1. 환경 변수 파일 생성
touch .env.local
# 위 내용을 .env.local에 복사

# 2. Prisma 마이그레이션
npx prisma generate
npx prisma db push

# 3. 서버 재시작
npm run dev
```

---

**설정 완료 후 계속 진행하겠습니다!**

