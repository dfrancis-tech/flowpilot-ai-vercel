import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { TopBar } from "@/components/dashboard/topbar"
import { DashboardStats } from "@/components/dashboard/stats"
import { DashboardCharts } from "@/components/dashboard/charts"
import { RecentProjects } from "@/components/dashboard/recent-projects"

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) return null

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(*)")
    .eq("user_id", user.id)

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .in("project_id", projects?.map((p) => p.id) || [])

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const completedThisWeek = tasks?.filter(
    (t) => t.status === "completed" && new Date(t.updated_at) >= weekAgo
  ).length || 0

  const overdueTasks = tasks?.filter(
    (t) => t.deadline && new Date(t.deadline) < now && t.status !== "completed"
  ).length || 0

  const activeProjects = projects?.filter((p) => p.status === "active").length || 0
  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter((t) => t.status === "completed").length || 0
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const stats = {
    active_projects: activeProjects,
    tasks_completed_this_week: completedThisWeek,
    overdue_tasks: overdueTasks,
    productivity_score: productivityScore,
    total_tasks: totalTasks,
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title={`Welcome back, ${user.firstName}! 👋`}
        subtitle="Here's what's happening with your projects today."
      />
      <div className="flex-1 p-6 space-y-6 overflow-auto">
        <DashboardStats stats={stats} />
        <DashboardCharts tasks={tasks || []} projects={projects || []} />
        <RecentProjects projects={projects?.slice(0, 3) || []} />
      </div>
    </div>
  )
}
