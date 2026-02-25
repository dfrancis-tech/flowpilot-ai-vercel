import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { supabase } from "@/lib/supabase"
import { seedUserData } from "@/lib/seed-data"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single()

  if (!dbUser) {
    await supabase.from("users").insert({
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      full_name: `${user.firstName} ${user.lastName}`,
      avatar_url: user.imageUrl,
      subscription_plan: "free",
    })
    await seedUserData(user.id)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
