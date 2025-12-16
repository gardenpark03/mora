# 🚀 Mora - Quick Start Guide

Get up and running in 2 minutes!

## Step 1: Install Dependencies

```bash
cd /Users/garden/Desktop/mora
npm install
```

This will install all required packages (Next.js, React, TailwindCSS, etc.)

## Step 2: Run the Development Server

```bash
npm run dev
```

The app will start at **http://localhost:3000**

## Step 3: Explore the App

### Landing Page
Visit **http://localhost:3000**
- See the hero section and features
- Click "Get Started"

### Dashboard
Visit **http://localhost:3000/dashboard**
- View workspaces and meetings
- Click "Create Meeting"

### Live Demo Meeting
Visit **http://localhost:3000/meeting/demo**
- This is the highlight! 🌟
- Click "Start Recording"
- Watch the real-time simulation:
  - Transcript appears every 3 seconds
  - Visualization nodes grow
  - AI summary updates
  - Action items are tracked
- Click "End Meeting" when done

## 🎬 What to Expect

The MVP includes:
- ✅ Beautiful landing page
- ✅ Dashboard with meeting management
- ✅ Real-time meeting visualization (simulated)
- ✅ Live transcript (mock data)
- ✅ AI summary panel (mock)
- ✅ Action item tracking (mock)

## 🔧 Optional: Environment Variables

For Supabase and OpenAI integration (not required for MVP):

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=your_key
```

## 📖 Learn More

- **SETUP.md** - Detailed setup instructions
- **README.md** - Feature documentation
- **PROJECT_OVERVIEW.md** - Architecture deep dive

## 🎯 Demo Flow

1. Start at **/** (landing page)
2. Click "Get Started" → **/dashboard**
3. Click "Create Meeting" → **/meeting/demo**
4. Click "Start Recording" → Watch the magic! ✨
5. See transcript, visualization, and summary update live
6. Click "End Meeting" → Back to dashboard

## 🐛 Troubleshooting

**Port already in use?**
```bash
npx kill-port 3000
```

**Module errors?**
```bash
rm -rf node_modules
npm install
```

**TypeScript errors?**
```bash
npm run build
```

---

Enjoy exploring Mora! 🎉

