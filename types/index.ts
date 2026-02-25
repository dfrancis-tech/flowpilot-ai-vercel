export type SubscriptionPlan = "free" | "pro" | "team"

export interface User {
  id: string
  clerk_id: string
  email: string
  full_name: string
  avatar_url?: string
  subscription_plan: SubscriptionPlan
  created_at: string
  updated_at: string
}

export type ProjectStatus = "active" | "on-hold" | "completed" | "archived"

export interface Project {
  id: string
  user_id: string
  title: string
  description: string
  deadline: string
  status: ProjectStatus
  color?: string
  created_at: string
  updated_at: string
  tasks?: Task[]
  task_count?: number
  completed_task_count?: number
}

export type TaskStatus = "todo" | "in-progress" | "completed"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
  assignee?: string
  created_at: string
  updated_at: string
}

export interface AISuggestion {
  id: string
  type: "warning" | "suggestion" | "insight" | "risk"
  title: string
  description: string
  action?: string
  priority: "low" | "medium" | "high"
}

export interface DashboardStats {
  active_projects: number
  tasks_completed_this_week: number
  overdue_tasks: number
  productivity_score: number
  total_tasks: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}
