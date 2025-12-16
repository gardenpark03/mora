# Mora - Project Overview

## 📋 Executive Summary

**Mora** is an AI-powered meeting workspace that transforms conversations into structured, visual summaries in real-time. This MVP demonstrates the core user experience with mock data and provides clear integration points for future AI capabilities.

## ✨ What's Built

### Pages & Routes

#### 1. Landing Page (`/`)
- **Purpose**: Marketing page to introduce Mora
- **Features**:
  - Hero section with gradient branding
  - Value proposition and tagline
  - Feature cards (Visualization, Action Items, Collaboration)
  - Social proof section
  - Footer with navigation
- **File**: `app/page.tsx`

#### 2. Dashboard (`/dashboard`)
- **Purpose**: Central hub for workspace and meeting management
- **Features**:
  - Workspace cards with member counts
  - Create workspace dialog
  - Recent meetings grid
  - Create meeting dialog
  - Meeting cards with status, participants, and action item counts
- **File**: `app/dashboard/page.tsx`

#### 3. Meeting Room (`/meeting/[id]`)
- **Purpose**: Interactive meeting space with live visualization
- **Features**:
  - Real-time status indicator (Live/Recording/Completed)
  - Start/Stop recording controls
  - **Visualization Board**: React Flow graph with animated nodes
  - **Live Transcript**: Scrollable conversation feed
  - **AI Summary**: Tab panel with meeting summary
  - **Action Items**: Tab panel with task list
  - Simulated real-time updates (3-second intervals)
- **File**: `app/meeting/[id]/page.tsx`
- **Demo URL**: `/meeting/demo` triggers live simulation

### Components

#### UI Components (shadcn/ui)
Located in `components/ui/`:
- `button.tsx` - Styled button with gradient variant
- `card.tsx` - Container component for content
- `tabs.tsx` - Tabbed interface
- `avatar.tsx` - User avatar display
- `dialog.tsx` - Modal dialogs

#### Custom Components
Located in `components/`:
- **Navbar** - Top navigation with logo and user menu
- **MeetingCard** - Preview card for meetings with metadata
- **WorkspaceList** - Grid of workspace cards with creation dialog
- **VisualizationBoard** - React Flow graph renderer
- **SummaryPanel** - AI summary display with live indicator
- **ActionItemPanel** - Task list with owner/deadline
- **TranscriptPanel** - Live conversation transcript

### API Routes (Stubs)

All routes return mock data and include commented integration code:

#### `POST /api/transcribe`
- **Purpose**: Convert audio to text via Whisper
- **Integration**: OpenAI Whisper API
- **Mock Response**: Sample transcription object

#### `POST /api/summarize`
- **Purpose**: Generate meeting summaries via GPT
- **Integration**: OpenAI GPT-4 API
- **Mock Response**: Summary with key topics

#### `POST /api/action-items`
- **Purpose**: Extract tasks from transcript
- **Integration**: OpenAI GPT-4 with structured output
- **Mock Response**: Array of action items

#### `POST /api/visualize`
- **Purpose**: Convert topics to graph nodes
- **Integration**: OpenAI GPT-4 for relationship analysis
- **Mock Response**: Nodes and edges for React Flow

### Libraries & Configuration

#### Core Dependencies
```json
{
  "next": "14.1.0",
  "react": "^18.2.0",
  "typescript": "^5",
  "@supabase/supabase-js": "^2.39.7",
  "reactflow": "^11.10.4",
  "tailwindcss": "^3.3.0"
}
```

#### Configuration Files
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - TailwindCSS with custom colors
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `postcss.config.js` - PostCSS setup
- `.eslintrc.json` - ESLint configuration

### Mock Data System

Located in `lib/mockData.ts`:

1. **Mock Meetings**: 2 sample meetings with full data
2. **Mock Transcript**: Sample conversation array
3. **Real-time Generator**: Function that yields transcript entries
4. **Visualization Data**: Pre-configured nodes and edges

The meeting room uses this system to simulate:
- Gradual transcript accumulation
- Growing visualization graph
- Evolving AI summary
- Dynamic action item addition

## 🎨 Design System

### Color Palette
- **Primary**: Indigo 600 (#4F46E5)
- **Secondary**: Violet 500 (#8B5CF6)
- **Gradient**: `from-indigo-600 to-violet-500`
- **Background**: White to Gray 50
- **Text**: Gray 900 (foreground), Gray 600 (muted)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, 2xl-7xl sizes
- **Body**: Regular, sm-base sizes
- **Muted**: text-muted-foreground class

### Spacing & Layout
- **Container**: max-w-7xl mx-auto
- **Padding**: Consistent 4-8 units
- **Grid**: Responsive 1-3 columns
- **Gaps**: 4-8 units between elements

### Component Patterns
- Cards with hover effects (shadow-lg on hover)
- Gradient buttons with hover states
- Status badges (colored backgrounds)
- Icon + text combinations
- Rounded corners (lg, xl, 2xl)

## 🔄 Real-time Simulation

The `/meeting/demo` route demonstrates how real-time features will work:

### Simulation Flow
1. User clicks "Start Meeting"
2. `isLive` state activates
3. Timer interval (3s) begins
4. Each tick:
   - Adds transcript entry
   - Creates new visualization node
   - Connects nodes with animated edge
   - Updates AI summary text
5. User clicks "End Meeting"
6. Timer stops, meeting marked complete
7. Redirect to dashboard

### Implementation Details
```typescript
useEffect(() => {
  if (!isLive) return
  
  const interval = setInterval(() => {
    const nextEntry = transcriptGenerator()
    if (nextEntry) {
      // Add to transcript
      setTranscript(prev => [...prev, nextEntry])
      
      // Update visualization
      setMeeting(prev => ({
        ...prev,
        visualization_data: {
          nodes: [...prev.nodes, newNode],
          edges: [...prev.edges, newEdge]
        }
      }))
    }
  }, 3000)
  
  return () => clearInterval(interval)
}, [isLive])
```

## 🔌 Integration Points

### Supabase Setup
1. Create tables (see SETUP.md for SQL)
2. Enable authentication providers
3. Configure Row Level Security
4. Update environment variables
5. Replace mock data with database queries

### OpenAI Setup
1. Get API key from OpenAI
2. Install `openai` package
3. Uncomment API route code
4. Test transcription endpoint
5. Test summarization endpoint
6. Implement error handling

### Real-time Audio
1. Use Web Audio API or MediaRecorder
2. Chunk audio data
3. Send to `/api/transcribe`
4. Stream results back
5. Update transcript in real-time

### Collaboration (Future)
1. Install Socket.io
2. Create WebSocket server
3. Broadcast transcript updates
4. Sync visualization changes
5. Show live participant cursors

## 📊 Data Flow

### Meeting Creation
```
User Input → Dashboard Dialog → Router.push → Meeting Room
```

### Live Meeting
```
Audio Input → Whisper API → Transcript
Transcript → GPT API → Summary + Action Items + Topics
Topics → Visualization API → Graph Nodes
All Updates → UI Components (React State)
```

### Meeting Storage
```
Meeting Data → Supabase API → PostgreSQL
Later Retrieval → Dashboard → Meeting Cards
```

## 🧪 Testing Checklist

### Manual Testing
- [ ] Landing page loads with all sections
- [ ] Dashboard shows workspaces and meetings
- [ ] Create workspace dialog works
- [ ] Create meeting dialog works
- [ ] Meeting room loads with visualization
- [ ] Demo meeting shows real-time updates
- [ ] Transcript accumulates correctly
- [ ] Visualization nodes appear and connect
- [ ] Summary updates during meeting
- [ ] End meeting saves and redirects
- [ ] Navbar navigation works
- [ ] Responsive design (mobile, tablet, desktop)

### Code Quality
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] All imports resolve
- [ ] Components render without errors
- [ ] Build succeeds (`npm run build`)

## 📦 Deployment Checklist

### Pre-deployment
1. Set environment variables in hosting platform
2. Test build locally (`npm run build`)
3. Verify all routes work
4. Check for console errors
5. Test on different browsers

### Post-deployment
1. Verify landing page loads
2. Test navigation flow
3. Check API routes respond
4. Monitor error logs
5. Test demo meeting

## 🎯 Next Steps for Production

### Phase 1: Core Functionality
1. Implement Supabase authentication
2. Add user profile management
3. Store meetings in database
4. Add workspace CRUD operations
5. Implement meeting history

### Phase 2: AI Integration
1. Integrate OpenAI Whisper
2. Connect GPT-4 for summaries
3. Build action item extraction
4. Create visualization algorithm
5. Add real-time audio capture

### Phase 3: Collaboration
1. Add Socket.io for real-time sync
2. Implement live participant list
3. Add chat functionality
4. Enable shared note-taking
5. Build notification system

### Phase 4: Enhancement
1. Export meetings (PDF, Markdown)
2. Calendar integration (Google, Outlook)
3. Email summaries
4. Team analytics dashboard
5. Mobile app (React Native)

## 💡 Key Architectural Decisions

### Why Next.js 14 App Router?
- Server components for better performance
- Built-in API routes
- File-based routing
- Excellent TypeScript support

### Why React Flow?
- Built for graph visualizations
- Handles large node counts
- Customizable styling
- Animation support

### Why shadcn/ui?
- Copy-paste components (no package bloat)
- Full customization control
- TailwindCSS integration
- Accessible by default

### Why Supabase?
- PostgreSQL (relational data)
- Built-in authentication
- Real-time subscriptions
- Edge functions support

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Flow Docs](https://reactflow.dev)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

---

This MVP provides a solid foundation for building a production-ready AI meeting platform. All core UX patterns are in place, and integration points are clearly marked for future development.

