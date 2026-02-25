import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { TopBar } from "@/components/dashboard/topbar"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default async function ProjectsPage() {
  const user = await currentUser()
  if (!user) return null

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: dbUser } = await supabase
    .from("users")
    .select("subscription_plan")
    .eq("clerk_id", user.id)
    .single()

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Projects" subtitle="Manage and track all your projects" />
      <div className="flex-1 p-6 overflow-auto">
        <ProjectsGrid
          projects={projects || []}
          subscriptionPlan={dbUser?.subscription_plan || "free"}
          userId={user.id}
        />
      </div>
    </div>
  )
}
