# 🔧 이메일 확인 문제 해결

## 🚨 문제
**"Email not confirmed"** 오류로 로그인이 안 됩니다.

---

## ✅ **해결 방법 (1분 완성!)**

### **Supabase에서 이메일 확인 비활성화**

#### 1단계: Supabase Dashboard 접속
```
https://supabase.com/dashboard/project/ruxitsjxbqbfhowrxhvx
```

#### 2단계: Authentication 메뉴
- 왼쪽 메뉴에서 **"Authentication"** 클릭
- **"Providers"** 탭 클릭

#### 3단계: Email 설정 변경
- **"Email"** 섹션 찾기
- **"Enable Email provider"** 확장 (이미 열려있을 수도 있음)
- 아래로 스크롤
- **"Confirm email"** 토글 찾기
- ✅ **토글을 OFF로 변경**
- 우측 하단의 **"Save"** 버튼 클릭

#### 4단계: 완료!
이제 로그인이 작동합니다!

---

## 🎯 **즉시 테스트**

### 1. 로그인 다시 시도
```
http://localhost:3000/ko/auth/login

이메일: garden9276@naver.com
비밀번호: (기존 비밀번호)

"로그인" 클릭!
```

### 2. 성공!
✅ 대시보드로 이동합니다!

---

## 🔄 **대안: 새 계정 만들기**

이메일 확인을 비활성화한 후:

```
http://localhost:3000/ko/auth/signup

새로운 계정으로 가입하면
즉시 로그인 됩니다!
```

---

## 📸 **스크린샷 가이드**

### Supabase 설정 경로:
```
Dashboard 
  → Project: ruxitsjxbqbfhowrxhvx
  → Authentication (왼쪽 메뉴)
  → Providers (상단 탭)
  → Email (첫 번째 섹션)
  → Confirm email (토글) → OFF
  → Save (우측 하단)
```

---

## 🎊 **완료 후**

이메일 확인을 비활성화하면:
- ✅ 회원가입 즉시 로그인 가능
- ✅ 이메일 확인 없이 로그인
- ✅ 개발이 훨씬 편해집니다

⚠️ **프로덕션 환경에서는 다시 활성화하세요!**

---

**1분이면 해결됩니다!** 🚀

Supabase Dashboard에서 "Confirm email" 토글만 OFF로 바꾸세요!

