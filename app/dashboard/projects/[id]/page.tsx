import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { TopBar } from "@/components/dashboard/topbar"
import { KanbanBoard } from "@/components/projects/kanban-board"
import { AICopilot } from "@/components/projects/ai-copilot"
import type { Project, Task } from "@/types"

interface ProjectPageProps {
  params: { id: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await currentUser()
  if (!user) return null

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (!project) notFound()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title={project.title}
        subtitle={project.description}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <KanbanBoard project={project} initialTasks={tasks || []} />
        </div>
        <div className="w-80 border-l border-border/50 overflow-auto p-4 bg-card/20">
          <AICopilot project={project} tasks={tasks || []} />
        </div>
      </div>
    </div>
  )
}
