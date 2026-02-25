import { currentUser } from "@clerk/nextjs/server"
import { TopBar } from "@/components/dashboard/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserProfile } from "@clerk/nextjs"

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) return null

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Settings" subtitle="Manage your account and preferences" />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-card border border-border shadow-sm rounded-2xl",
                headerTitle: "text-foreground",
                headerSubtitle: "text-muted-foreground",
                navbarButton: "text-muted-foreground hover:text-foreground",
                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl",
                formFieldInput: "bg-background border border-input text-foreground rounded-xl",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
