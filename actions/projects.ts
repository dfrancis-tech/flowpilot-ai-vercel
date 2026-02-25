"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

export async function createProject(data: {
  title: string
  description: string
  deadline: string
  status: string
  color: string
  user_id: string
}) {
  const { error } = await supabase.from("projects").insert({
    title: data.title,
    description: data.description,
    deadline: data.deadline || null,
    status: data.status,
    color: data.color,
    user_id: data.user_id,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/projects")
}

export async function updateProject(id: string, data: Partial<{
  title: string
  description: string
  deadline: string
  status: string
  color: string
}>) {
  const { error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/projects")
  revalidatePath(`/dashboard/projects/${id}`)
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/dashboard/projects")
}
