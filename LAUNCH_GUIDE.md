# 🚀 Mora 글로벌 런칭 가이드

Mora를 전 세계에 출시할 준비가 완료되었습니다!

---

## 🌍 1. 다국어 지원 (i18n)

### 지원 언어
- 🇺🇸 **English** (기본)
- 🇰🇷 **한국어**
- 🇯🇵 **日本語** (일본어)
- 🇪🇸 **Español** (스페인어)

### 번역 파일
```
messages/
├── en.json  # English
├── ko.json  # 한국어
├── ja.json  # 日本語
└── es.json  # Español
```

### 사용 방법
```typescript
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations()
  
  return (
    <h1>{t('landing.hero.title')}</h1>
  )
}
```

### Whisper 다국어 설정
```typescript
// 언어별 전사
const language = {
  'en': 'en',
  'ko': 'ko',
  'ja': 'ja',
  'es': 'es'
}

await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  language: language[userLocale]
})
```

---

## 💳 2. Stripe 결제 연동

### 요금제

| 플랜 | 가격 | 기능 |
|------|------|------|
| **Free** | $0 | 월 3회 미팅, 1 워크스페이스 |
| **Pro** | $29/월 | 무제한 미팅, 5 워크스페이스 |
| **Business** | $99/월 | 모든 기능 + API 액세스 |

### Stripe 설정

#### 1. Stripe 계정 생성
```bash
# https://stripe.com 에서 계정 생성
```

#### 2. API 키 발급
```bash
# Dashboard → Developers → API keys
```

#### 3. 환경 변수 설정
```env
# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (Stripe에서 생성)
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...

# Public (Next.js)
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=price_...
```

#### 4. Stripe 제품 생성

**Stripe Dashboard**:
1. Products → Create Product
2. **Pro Plan**:
   - Name: "Mora Pro"
   - Price: $29/month
   - Recurring: Monthly
   - Copy Price ID
3. **Business Plan**:
   - Name: "Mora Business"
   - Price: $99/month
   - Recurring: Monthly
   - Copy Price ID

#### 5. Webhook 설정

**로컬 테스트**:
```bash
# Stripe CLI 설치
brew install stripe/stripe-cli/stripe

# 로그인
stripe login

# Webhook 리스닝
npm run stripe:listen
```

**프로덕션**:
1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://mora.app/api/webhooks/stripe`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Webhook Secret 복사 → `STRIPE_WEBHOOK_SECRET`

---

## 📊 3. SEO 최적화

### 메타데이터 (완료)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "Mora - Your meeting memory, visualized",
  description: "AI-powered meeting workspace...",
  keywords: ["AI meeting", "transcription", ...],
  openGraph: {
    type: "website",
    url: "https://mora.app",
    title: "Mora - Your meeting memory, visualized",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@moraapp",
  },
}
```

### OG 이미지 생성

**크기**: 1200 x 630px

**디자인 요소**:
- Mora 로고
- "Your meeting memory — visualized"
- AI 시각화 스크린샷
- 그라디언트 배경 (Indigo → Violet)

**도구**: Figma, Canva, 또는 https://og-playground.vercel.app/

### Sitemap

```xml
<!-- public/sitemap.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://mora.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://mora.app/en"/>
    <xhtml:link rel="alternate" hreflang="ko" href="https://mora.app/ko"/>
    <xhtml:link rel="alternate" hreflang="ja" href="https://mora.app/ja"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://mora.app/es"/>
  </url>
  <url>
    <loc>https://mora.app/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://mora.app/dashboard</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### robots.txt (완료)

```
User-agent: *
Allow: /
Sitemap: https://mora.app/sitemap.xml
```

---

## 🎯 4. Product Hunt 런칭

### 준비물

#### 1. 제품 정보
```yaml
Name: Mora
Tagline: Your meeting memory — visualized
Description: |
  Mora is an AI-powered meeting workspace that listens to your conversations,
  transcribes them in real-time, generates intelligent summaries, and creates
  beautiful visual mind maps of your discussions.
  
  🎤 Real-time AI transcription (Whisper)
  🧠 Smart summarization (GPT-4)
  📊 Dynamic visualization (React Flow)
  👥 Team collaboration
  🌍 Multilingual support (EN, KO, JA, ES)

Website: https://mora.app
Twitter: @moraapp
Maker: Your Name (@yourhandle)
```

#### 2. 미디어 준비

**Screenshot 1**: 랜딩 페이지 (Hero)
**Screenshot 2**: 실시간 미팅 시각화
**Screenshot 3**: AI 요약 패널
**Screenshot 4**: 워크스페이스 대시보드
**Thumbnail**: 1270 x 760px (Product Hunt 표준)
**Video**: 30초 데모 (선택사항)

#### 3. 런칭 전략

**최적 시간**:
- **요일**: 화요일 ~ 목요일
- **시간**: 오전 12:01 AM PST (Product Hunt 리셋)
- **한국 시간**: 오후 4:01 PM KST

**첫 댓글 (준비)**:
```
Hi Product Hunt! 👋

I'm [Your Name], maker of Mora.

We built Mora because we were tired of losing important meeting insights.
Traditional note-taking is slow, and reviewing hour-long recordings is painful.

Mora solves this by:
- Transcribing meetings in real-time with AI
- Generating visual mind maps of discussions
- Extracting action items automatically
- Supporting teams with workspaces

We're offering a special Product Hunt deal:
🎁 50% off Pro plan for the first year (code: PRODUCTHUNT)

Try it free: https://mora.app

I'll be here all day to answer questions. AMA! 🚀
```

---

## 📱 5. 소셜 미디어 런칭

### Twitter/X 전략

**계정 생성**: @moraapp

**런칭 스레드**:
```
🚀 Introducing Mora – Your meeting memory, visualized

An AI workspace that turns conversations into beautiful, actionable insights

Here's what makes it special 👇 [1/7]

---

🎤 Real-time Transcription

Mora uses OpenAI Whisper to transcribe your meetings as you speak.

Supports English, Korean, Japanese, and Spanish.

No more typing notes during calls. [2/7]

---

🧠 Smart Summaries

GPT-4 analyzes your conversation and generates:
• Key discussion points
• Action items with owners
• Decision tracking

All structured and ready to share. [3/7]

---

📊 Visual Mind Maps

The game-changer: Mora creates a live knowledge graph of your meeting.

Watch topics emerge and connect as you discuss.

Perfect for visual thinkers! [4/7]

---

👥 Team Collaboration

Create workspaces, invite teammates, organize by projects.

Everyone sees the same insights. No more "sorry, I missed that."

Built for async teams. [5/7]

---

🌍 Global from Day One

• 4 languages supported
• Multilingual transcription
• Localized UI

We believe great ideas happen everywhere. [6/7]

---

✨ Special Launch Offer

Try Mora free for 14 days
🎁 50% off with code LAUNCH50

Join us: https://mora.app

PS: We just launched on @ProductHunt! 
Your support means everything 🙏 [7/7]
```

### LinkedIn 포스트

```markdown
🚀 Excited to introduce Mora!

After months of building, we're launching an AI-powered meeting workspace that:

✅ Transcribes conversations in real-time
✅ Generates smart summaries with GPT-4
✅ Creates visual mind maps of discussions
✅ Helps teams collaborate better

Why we built this:
Remote work is here to stay, but meetings are still painful. We lose context, forget action items, and struggle to keep everyone aligned.

Mora solves this by making meeting intelligence visual, collaborative, and actionable.

🌍 Multilingual: EN | KO | JA | ES
👥 Team-ready: Workspaces, projects, permissions
🤖 AI-native: OpenAI Whisper + GPT-4

Try it free: https://mora.app

Special launch offer: 50% off Pro (code: LAUNCH50)

Also launching on Product Hunt today! 
Would love your support: [PH link]

#AI #Productivity #Startups #RemoteWork
```

---

## 📈 6. 분석 설정

### Google Analytics

```typescript
// app/layout.tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

### Plausible (GDPR 친화적 대안)

```html
<script defer data-domain="mora.app" 
  src="https://plausible.io/js/script.js">
</script>
```

---

## ✅ 런칭 체크리스트

### 기술

- [ ] 프로덕션 빌드 테스트 (`npm run build`)
- [ ] 모든 환경 변수 설정
- [ ] Stripe 테스트 결제 완료
- [ ] Webhook 엔드포인트 테스트
- [ ] 다국어 번역 검증
- [ ] 모바일 반응형 확인
- [ ] 로딩 속도 최적화 (<3초)
- [ ] SEO 메타태그 확인
- [ ] OG 이미지 업로드

### 마케팅

- [ ] Product Hunt 프로필 생성
- [ ] Twitter 계정 생성 (@moraapp)
- [ ] LinkedIn 회사 페이지
- [ ] OG 이미지 디자인 (1200x630)
- [ ] 스크린샷 5개 준비
- [ ] 데모 비디오 (30초)
- [ ] 런칭 포스트 작성
- [ ] 이메일 서명 업데이트

### 법률/정책

- [ ] 개인정보 처리방침
- [ ] 이용약관
- [ ] 쿠키 정책
- [ ] GDPR 준수 확인

### 지원

- [ ] FAQ 페이지
- [ ] 문의 이메일 (support@mora.app)
- [ ] Discord/Slack 커뮤니티
- [ ] 문서 사이트 (docs.mora.app)

---

## 🎁 7. 런칭 프로모션

### 할인 코드

```typescript
// Stripe Coupon 생성
const coupon = await stripe.coupons.create({
  id: 'PRODUCTHUNT',
  percent_off: 50,
  duration: 'once',
  max_redemptions: 100,
})

const coupon2 = await stripe.coupons.create({
  id: 'LAUNCH50',
  percent_off: 50,
  duration: 'repeating',
  duration_in_months: 12,
  max_redemptions: 500,
})
```

### 프로모션 배너

```tsx
<div className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white py-2 text-center text-sm">
  🎉 Launch Special: 50% off Pro plan for 1 year! 
  Use code <strong>LAUNCH50</strong>
</div>
```

---

## 📞 8. 런칭 후 모니터링

### Day 1
- Product Hunt 순위 확인 (hourly)
- 댓글에 즉시 응답
- 소셜 미디어 참여
- 서버 상태 모니터링
- 결제 오류 확인

### Week 1
- 가입 전환율 분석
- 사용자 피드백 수집
- 버그 수정
- 기능 우선순위 조정

### Month 1
- 사용자 리텐션 분석
- 업그레이드 전환율
- NPS 조사
- 로드맵 업데이트

---

## 🚀 런칭!

**준비가 완료되었습니다!**

```bash
# 최종 빌드
npm run build

# 배포
vercel --prod

# Product Hunt 제출
# https://www.producthunt.com/posts/new

# 소셜 미디어 포스팅
# Twitter, LinkedIn, Reddit (r/SideProject)

# 모니터링 시작
# Analytics, Stripe Dashboard, Error Tracking
```

---

**Mora** - The future of meetings starts today! 🌍✨

