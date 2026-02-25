import { currentUser } from "@clerk/nextjs/server"
import { TopBar } from "@/components/dashboard/topbar"
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
            routing="hash"
            appearance={{
              variables: {
                colorBackground: "#ffffff",
                colorText: "#111827",
                colorTextSecondary: "#6b7280",
                colorInputBackground: "#ffffff",
                colorInputText: "#111827",
                colorPrimary: "#7c3aed",
                colorDanger: "#dc2626",
                colorSuccess: "#059669",
                colorNeutral: "#6b7280",
                borderRadius: "0.75rem",
              },
              elements: {
                rootBox: "w-full",
                card: "shadow-sm rounded-2xl border border-gray-200",
                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700",
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
