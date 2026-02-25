"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import type { TaskStatus, TaskPriority } from "@/types"

export async function createTask(data: {
  project_id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  deadline?: string
}) {
  const { error } = await supabase.from("tasks").insert({
    project_id: data.project_id,
    title: data.title,
    description: data.description || null,
    status: data.status,
    priority: data.priority,
    deadline: data.deadline || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/projects/${data.project_id}`)
}

export async function updateTask(id: string, projectId: string, data: Partial<{
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string
}>) {
  const { error } = await supabase
    .from("tasks")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function deleteTask(id: string, projectId: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/projects/${projectId}`)
}

export async function updateTaskStatus(id: string, projectId: string, status: TaskStatus) {
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/projects/${projectId}`)
}
