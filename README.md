# Mora

**Your meeting memory — visualized**

AI that listens, summarizes, and draws your meeting in real time.

[![Product Hunt](https://img.shields.io/badge/Product%20Hunt-Launch-orange?style=for-the-badge&logo=producthunt)](https://www.producthunt.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

Mora is a **global-ready AI-powered meeting workspace** that transforms conversations into structured, visual summaries in real-time. Built for teams worldwide with multilingual support and enterprise-grade features.

### ✨ Key Features

#### 🤖 AI-Powered Processing
- **Real-time Transcription** - OpenAI Whisper with 4 language support
- **Smart Summarization** - GPT-4 Turbo for intelligent insights
- **Visual Knowledge Graphs** - React Flow dynamic visualization
- **Action Item Extraction** - Automatic task identification

#### 🌍 Global-Ready
- **4 Languages** - English, Korean, Japanese, Spanish
- **Multilingual UI** - Complete translations with next-intl
- **Multi-language Transcription** - Whisper supports 50+ languages
- **Localized Content** - Currency, dates, and formats

#### 🏢 Team Collaboration
- **Workspaces** - Organize by teams and departments
- **Role-based Access** - Admin, Member, Viewer permissions
- **Project Management** - Group meetings by projects
- **Team Invites** - Email-based invitation system

#### 💳 Monetization
- **Stripe Integration** - Secure payment processing
- **3 Pricing Tiers** - Free, Pro ($29/mo), Business ($99/mo)
- **Subscription Management** - Automated billing and upgrades
- **14-day Free Trial** - Try Pro features risk-free

#### 📊 Production-Ready
- **SEO Optimized** - OpenGraph, Twitter Cards, Sitemap
- **PWA Support** - Installable web app
- **Analytics Ready** - Google Analytics & Plausible
- **Error Tracking** - Sentry integration support

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (or Supabase)
- OpenAI API key
- Stripe account (for payments)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/mora.git
cd mora

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Configure environment variables
cp .env.example .env

# Run development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mora"

# Supabase (Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 Features

### AI Meeting Assistant

**Live Mode** - Real AI processing
1. Start meeting → Click "Start Recording"
2. Speak naturally → Whisper transcribes (5s chunks)
3. GPT-4 analyzes → Generates summaries & action items
4. Visualize → Dynamic knowledge graph

**Demo Mode** - Simulated experience
- Pre-recorded meeting scenarios
- Full UI/UX demonstration
- No API costs

### Team Workspace

**Organization**
- Create workspaces for teams
- Invite members via email
- Assign roles (Admin/Member/Viewer)
- Manage projects and meetings

**Collaboration**
- Shared meeting access
- Real-time visualization
- Team action items
- Meeting history

### Pricing Plans

| Feature | Free | Pro | Business |
|---------|------|-----|----------|
| **Meetings/mo** | 3 | Unlimited | Unlimited |
| **Workspaces** | 1 | 5 | Unlimited |
| **AI Transcription** | Basic | Advanced | Advanced |
| **Visualization** | Simple | Full | Full |
| **Support** | Community | Priority | Dedicated |
| **Export** | - | ✓ | ✓ |
| **Analytics** | - | - | ✓ |
| **SSO** | - | - | ✓ |
| **API Access** | - | - | ✓ |
| **Price** | $0 | $29/mo | $99/mo |

---

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 **English** (en)
- 🇰🇷 **한국어** (ko)
- 🇯🇵 **日本語** (ja)
- 🇪🇸 **Español** (es)

### Adding New Languages

1. Create translation file: `messages/{locale}.json`
2. Copy structure from `messages/en.json`
3. Translate all keys
4. Add locale to `i18n.ts`

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion

**AI & Processing**
- OpenAI Whisper (Speech-to-Text)
- OpenAI GPT-4 Turbo (Summarization)
- React Flow (Visualization)

**Backend**
- PostgreSQL (Database)
- Prisma ORM
- Supabase Auth
- Stripe (Payments)

**Deployment**
- Vercel (Hosting)
- Supabase (Database)
- Stripe (Billing)

### Project Structure

```
mora/
├── app/                      # Next.js 14 app directory
│   ├── api/                 # API routes
│   │   ├── transcribe/      # Whisper integration
│   │   ├── summarize/       # GPT-4 integration
│   │   ├── stripe/          # Payment processing
│   │   ├── webhooks/        # Stripe webhooks
│   │   └── workspaces/      # Workspace management
│   ├── dashboard/           # User dashboard
│   ├── meeting/[id]/        # Meeting room
│   ├── pricing/             # Pricing page
│   └── workspaces/[id]/     # Workspace pages
├── components/              # React components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
│   ├── stripe.ts           # Stripe client
│   ├── prisma.ts           # Database client
│   └── workspace.ts        # Business logic
├── messages/               # i18n translations
├── prisma/                 # Database schema
└── public/                 # Static assets
```

---

## 📖 Documentation

### Getting Started
- [Quick Start](QUICKSTART.md) - 2-minute setup
- [Environment Setup](ENV_SETUP.md) - Configuration guide
- [Workspace Setup](WORKSPACE_SETUP_KR.md) - Database setup

### Features
- [AI Integration](AI_INTEGRATION_KR.md) - Whisper & GPT-4
- [Workspace System](WORKSPACE_GUIDE_KR.md) - Team collaboration
- [Real-time Visualization](REALTIME_GUIDE_KR.md) - Architecture

### Launch
- [Launch Guide](LAUNCH_GUIDE.md) - Go-to-market strategy
- [Global Launch](GLOBAL_LAUNCH_COMPLETE.md) - Internationalization

---

## 🔐 Security

- **Authentication** - Supabase Auth (Email + OAuth)
- **Authorization** - Role-based access control
- **Encryption** - TLS/SSL for all communications
- **Payment Security** - PCI-compliant via Stripe
- **Data Privacy** - GDPR compliant

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Database tools
npm run db:studio    # Prisma Studio GUI
npm run db:push      # Apply schema changes

# Stripe CLI
npm run stripe:listen    # Test webhooks locally
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically on push

```bash
vercel --prod
```

### Manual Deployment

```bash
# Build
npm run build

# Start
npm start
```

---

## 📊 Analytics

### Google Analytics

Add to environment:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Plausible (GDPR-friendly)

```html
<script defer data-domain="mora.app" 
  src="https://plausible.io/js/script.js">
</script>
```

---

## 🎯 Roadmap

### v1.0 (Current) ✅
- ✅ AI transcription & summarization
- ✅ Real-time visualization
- ✅ Team workspaces
- ✅ Multi-language support
- ✅ Stripe integration
- ✅ SEO optimization

### v1.1 (Next)
- [ ] Real-time collaboration (Socket.io)
- [ ] Rich text editor (TipTap)
- [ ] Meeting templates
- [ ] Calendar integration

### v1.2 (Future)
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Custom AI models
- [ ] Advanced analytics

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- [OpenAI](https://openai.com) - Whisper & GPT-4 APIs
- [Vercel](https://vercel.com) - Hosting platform
- [Stripe](https://stripe.com) - Payment processing
- [Supabase](https://supabase.com) - Database & Auth
- [shadcn/ui](https://ui.shadcn.com) - UI components

---

## 📞 Support

- **Website**: https://mora.app
- **Email**: support@mora.app
- **Twitter**: [@moraapp](https://twitter.com/moraapp)
- **Discord**: [Join our community](https://discord.gg/mora)

---

## 🎉 Launch Status

🚀 **Ready for Product Hunt launch!**

- ✅ 4-language support
- ✅ Stripe payments
- ✅ SEO optimized
- ✅ Production-ready
- ✅ Documented

---

**Mora** - The future of meetings, available globally 🌍✨

*Made with ❤️ using Next.js, OpenAI, Stripe, and React*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mora)
