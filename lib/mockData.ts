import { Meeting, ActionItem } from './supabase'

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    workspace_id: '1',
    title: 'Q4 Product Roadmap',
    participants: ['Alice', 'Bob', 'Charlie'],
    summary: 'Discussed the Q4 product roadmap focusing on new features and user feedback integration.',
    action_items: [
      {
        id: '1',
        task: 'Create design mockups for new dashboard',
        owner: 'Alice',
        deadline: '2025-10-20',
        completed: false,
      },
      {
        id: '2',
        task: 'Review user feedback from beta testing',
        owner: 'Bob',
        deadline: '2025-10-15',
        completed: false,
      },
    ],
    visualization_data: {
      nodes: [
        { id: '1', type: 'topic', data: { label: 'Q4 Goals' }, position: { x: 250, y: 0 } },
        { id: '2', type: 'topic', data: { label: 'New Features' }, position: { x: 100, y: 100 } },
        { id: '3', type: 'topic', data: { label: 'User Feedback' }, position: { x: 400, y: 100 } },
        { id: '4', type: 'topic', data: { label: 'Design System' }, position: { x: 50, y: 200 } },
        { id: '5', type: 'topic', data: { label: 'Analytics' }, position: { x: 200, y: 200 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
        { id: 'e1-3', source: '1', target: '3', animated: true },
        { id: 'e2-4', source: '2', target: '4' },
        { id: 'e2-5', source: '2', target: '5' },
      ],
    },
    status: 'completed',
    created_at: new Date('2025-10-08').toISOString(),
    updated_at: new Date('2025-10-08').toISOString(),
  },
  {
    id: '2',
    workspace_id: '1',
    title: 'Weekly Standup',
    participants: ['Alice', 'David'],
    summary: 'Quick sync on current sprint progress and blockers.',
    action_items: [
      {
        id: '3',
        task: 'Fix authentication bug',
        owner: 'David',
        deadline: '2025-10-12',
        completed: true,
      },
    ],
    visualization_data: {
      nodes: [
        { id: '1', type: 'topic', data: { label: 'Sprint Progress' }, position: { x: 250, y: 0 } },
        { id: '2', type: 'topic', data: { label: 'Blockers' }, position: { x: 250, y: 100 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', animated: true },
      ],
    },
    status: 'completed',
    created_at: new Date('2025-10-05').toISOString(),
    updated_at: new Date('2025-10-05').toISOString(),
  },
]

export const mockTranscript = [
  { speaker: 'Alice', text: 'Hi everyone, thanks for joining today. Let\'s talk about our Q4 roadmap.', timestamp: '0:00' },
  { speaker: 'Bob', text: 'Great! I think we should focus on user feedback from the beta.', timestamp: '0:15' },
  { speaker: 'Charlie', text: 'Agreed. The analytics feature has been requested multiple times.', timestamp: '0:30' },
  { speaker: 'Alice', text: 'Perfect. Let\'s prioritize that along with the new dashboard design.', timestamp: '0:45' },
]

export function generateRealtimeTranscript() {
  const transcripts = [
    { speaker: 'Alice', text: 'Let\'s start by reviewing our current progress.' },
    { speaker: 'Bob', text: 'We\'ve completed about 80% of the backend work.' },
    { speaker: 'Charlie', text: 'The frontend is coming along nicely too.' },
    { speaker: 'Alice', text: 'What are the main blockers we\'re facing?' },
    { speaker: 'Bob', text: 'We need to finalize the API integration.' },
    { speaker: 'Charlie', text: 'And we should test the mobile responsiveness.' },
    { speaker: 'Alice', text: 'Sounds good. Let\'s create action items for these.' },
  ]
  
  let index = 0
  return () => {
    if (index >= transcripts.length) return null
    return { ...transcripts[index++], timestamp: new Date().toISOString() }
  }
}

