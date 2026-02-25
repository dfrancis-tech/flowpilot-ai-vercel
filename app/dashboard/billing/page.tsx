import { currentUser } from "@clerk/nextjs/server"
import { supabase } from "@/lib/supabase"
import { TopBar } from "@/components/dashboard/topbar"
import { BillingDashboard } from "@/components/dashboard/billing-dashboard"

export default async function BillingPage() {
  const user = await currentUser()
  if (!user) return null

  const { data: dbUser } = await supabase
    .from("users")
    .select("subscription_plan")
    .eq("clerk_id", user.id)
    .single()

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Billing" subtitle="Manage your subscription and plan" />
      <div className="flex-1 p-6 overflow-auto">
        <BillingDashboard currentPlan={dbUser?.subscription_plan || "free"} />
      </div>
    </div>
  )
}
