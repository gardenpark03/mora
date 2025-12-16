# Mora - Setup Guide

Welcome to Mora! Follow these steps to get your development environment up and running.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- (Optional) Supabase account for authentication
- (Optional) OpenAI API key for AI features

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React and React DOM
- TailwindCSS
- shadcn/ui components
- React Flow (for visualizations)
- Supabase client
- TypeScript

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` with your credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The app will run without these credentials, but authentication and AI features won't work.

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Testing the MVP

### Without Authentication

1. Visit the landing page at `/`
2. Click "Get Started" to go to `/dashboard`
3. Click "Create Meeting" and select "Start Meeting"
4. Visit `/meeting/demo` for a live demo with simulated real-time updates

### Features to Test

✅ **Landing Page** (`/`)
- Hero section with branding
- Features showcase
- Call-to-action buttons

✅ **Dashboard** (`/dashboard`)
- Workspace management
- Meeting list with cards
- Create new meeting dialog

✅ **Meeting Room** (`/meeting/[id]`)
- Live transcription simulation
- Real-time visualization board
- AI summary panel
- Action items panel
- Start/stop recording

## Project Structure

```
mora/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── transcribe/    # Whisper integration stub
│   │   ├── summarize/     # GPT summarization stub
│   │   ├── action-items/  # Action item extraction
│   │   └── visualize/     # Graph generation
│   ├── dashboard/         # Dashboard page
│   ├── meeting/[id]/      # Dynamic meeting room
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── Navbar.tsx
│   ├── MeetingCard.tsx
│   ├── WorkspaceList.tsx
│   ├── VisualizationBoard.tsx
│   ├── SummaryPanel.tsx
│   ├── ActionItemPanel.tsx
│   └── TranscriptPanel.tsx
├── lib/                   # Utilities
│   ├── utils.ts          # Helper functions
│   ├── supabase.ts       # Supabase client
│   └── mockData.ts       # Mock data for demo
├── public/               # Static assets
└── ...config files
```

## Adding Supabase (Optional)

### 1. Create a Supabase Project

Visit [supabase.com](https://supabase.com) and create a new project.

### 2. Run Database Migrations

Execute these SQL commands in your Supabase SQL Editor:

```sql
-- Create workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id),
  title TEXT NOT NULL,
  participants TEXT[],
  summary TEXT,
  action_items JSONB DEFAULT '[]',
  visualization_data JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Users can view their workspaces" 
  ON workspaces FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view meetings in their workspaces" 
  ON meetings FOR SELECT 
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE created_by = auth.uid()
  ));
```

### 3. Enable Authentication

In Supabase dashboard:
1. Go to Authentication → Providers
2. Enable Email/Password
3. (Optional) Enable OAuth providers (Google, GitHub, etc.)

### 4. Update Environment Variables

Add your Supabase credentials to `.env.local`

## Adding OpenAI Integration (Optional)

### 1. Get API Key

Visit [platform.openai.com](https://platform.openai.com/api-keys) and create an API key.

### 2. Install OpenAI SDK

```bash
npm install openai
```

### 3. Update API Routes

Uncomment the OpenAI integration code in:
- `app/api/transcribe/route.ts`
- `app/api/summarize/route.ts`
- `app/api/action-items/route.ts`

## Common Issues

### Port Already in Use

```bash
# Kill the process on port 3000
npx kill-port 3000

# Or run on a different port
npm run dev -- -p 3001
```

### Module Not Found Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Command Palette (Cmd+Shift+P) → TypeScript: Restart TS Server
```

## Development Tips

### Hot Reload

Next.js supports hot module replacement. Changes to components will reflect immediately.

### Debugging

Use React Developer Tools browser extension for component debugging.

### Code Quality

```bash
# Run linter
npm run lint

# Build for production (checks for errors)
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app works on any Node.js hosting platform:
- Netlify
- Railway
- Render
- AWS Amplify

## Next Steps

1. ✅ Test all pages and features
2. 🔄 Integrate Supabase authentication
3. 🔄 Connect OpenAI APIs
4. 🔄 Add real audio capture
5. 🔄 Implement real-time collaboration

## Need Help?

- Check the [README.md](README.md) for feature documentation
- Review component code for implementation details
- Open an issue for bugs or questions

---

Happy coding! 🚀

