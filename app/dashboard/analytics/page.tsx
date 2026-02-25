import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { TopBar } from "@/components/dashboard/topbar"
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default async function AnalyticsPage() {
  const user = await currentUser()
  if (!user) return null

  const { data: projects } = await supabase
    .from("projects")
    .select("*, tasks(*)")
    .eq("user_id", user.id)

  const allTasks = projects?.flatMap((p) => p.tasks || []) || []

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Analytics" subtitle="Detailed insights into your productivity" />
      <div className="flex-1 p-6 overflow-auto">
        <AnalyticsDashboard projects={projects || []} tasks={allTasks} />
      </div>
    </div>
  )
}
