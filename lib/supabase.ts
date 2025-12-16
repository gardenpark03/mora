import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  created_at: string
}

export type Workspace = {
  id: string
  name: string
  created_by: string
  created_at: string
}

export type Meeting = {
  id: string
  workspace_id: string
  title: string
  participants: string[]
  summary: string | null
  action_items: ActionItem[]
  visualization_data: any
  status: 'active' | 'completed'
  created_at: string
  updated_at: string
}

export type ActionItem = {
  id: string
  task: string
  owner: string
  deadline: string | null
  completed: boolean
}

