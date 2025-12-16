# 🚀 Mora 빠른 설정 가이드

## ✅ **현재 상태**
- 앱 실행 중: http://localhost:3000
- Supabase 연결: 설정 완료

---

## 🔧 **로그인 활성화 (2분)**

### 1. Supabase 이메일 확인 비활성화

**개발 중에는 이메일 확인을 비활성화하세요:**

```
1. https://supabase.com/dashboard 접속
2. 프로젝트: ruxitsjxbqbfhowrxhvx 선택
3. Authentication → Providers → Email 클릭
4. "Confirm email" 토글을 OFF로 변경
5. Save 클릭
```

### 2. 테스트 계정 생성

**회원가입 먼저 하세요:**

```
1. http://localhost:3000/ko/auth/signup 접속
2. 정보 입력:
   - 이름: 테스트
   - 이메일: test@mora.app
   - 비밀번호: test1234
   - 비밀번호 확인: test1234
3. "회원가입" 클릭
4. ✅ 자동 로그인 → 대시보드로 이동
```

### 3. 로그인 테스트

**이제 로그인이 작동합니다:**

```
1. 로그아웃 (우상단 아바타 → 로그아웃)
2. http://localhost:3000/ko/auth/login 접속
3. test@mora.app / test1234 입력
4. "로그인" 클릭
5. ✅ 대시보드로 이동
```

---

## 📊 **Supabase Users 확인**

```
1. https://supabase.com/dashboard
2. Authentication → Users
3. 생성된 사용자 확인
```

---

## 🎯 **현재 사용 가능한 기능**

### ✅ **완전 작동**
- 🏠 홈페이지 (모든 언어)
- 🔐 회원가입/로그인
- 📊 대시보드
- 💳 요금제 페이지
- 🎤 AI 미팅 데모

### ⏳ **데이터베이스 연결 필요**
- 워크스페이스 생성/관리
- 프로젝트 생성
- 미팅 저장

**데이터베이스는 나중에 연결하고, 우선 Supabase Auth만으로 충분히 테스트 가능합니다!**

---

## 🎊 **빠른 테스트 순서**

```
1. 회원가입 (http://localhost:3000/ko/auth/signup)
   ↓
2. 자동 로그인 → 대시보드
   ↓
3. AI 미팅 데모 (http://localhost:3000/ko/meeting/demo)
   ↓
4. "데모 모드" 클릭 → 실시간 시각화 확인!
```

---

**Mora가 작동합니다!** 🎉

우선 **회원가입**부터 해보세요!

