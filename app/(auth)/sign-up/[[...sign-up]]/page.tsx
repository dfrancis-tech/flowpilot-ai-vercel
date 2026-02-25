import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Zap } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950/50 via-gray-950 to-purple-950/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">FlowPilot AI</span>
          </Link>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white border border-gray-200 shadow-2xl rounded-2xl",
              headerTitle: "text-gray-900 font-bold",
              headerSubtitle: "text-gray-500",
              socialButtonsBlockButton: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl",
              formFieldLabel: "text-gray-700",
              formFieldInput: "bg-white border border-gray-300 text-gray-900 rounded-xl placeholder:text-gray-400",
              formButtonPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl text-white",
              footerActionLink: "text-violet-600 hover:text-violet-700",
              footerActionText: "text-gray-500",
              identityPreviewText: "text-gray-700",
              formFieldSuccessText: "text-green-600",
              formFieldErrorText: "text-red-600",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-400",
            },
          }}
        />
      </div>
    </div>
  )
}
