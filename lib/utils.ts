import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isAfter, isBefore, addDays } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return "Due today"
  if (diffDays === 1) return "Due tomorrow"
  if (diffDays <= 7) return `Due in ${diffDays}d`
  return formatDate(date)
}

export function isOverdue(deadline: string | Date): boolean {
  return isBefore(new Date(deadline), new Date())
}

export function isDueSoon(deadline: string | Date, days = 3): boolean {
  const d = new Date(deadline)
  return isAfter(d, new Date()) && isBefore(d, addDays(new Date(), days))
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return "text-green-500"
  if (percentage >= 50) return "text-yellow-500"
  return "text-red-500"
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "urgent": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "low": return "bg-green-500/20 text-green-400 border-green-500/30"
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "completed": return "bg-green-500/20 text-green-400"
    case "in-progress": return "bg-blue-500/20 text-blue-400"
    case "todo": return "bg-gray-500/20 text-gray-400"
    case "active": return "bg-violet-500/20 text-violet-400"
    case "on-hold": return "bg-yellow-500/20 text-yellow-400"
    case "archived": return "bg-gray-500/20 text-gray-400"
    default: return "bg-gray-500/20 text-gray-400"
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}
