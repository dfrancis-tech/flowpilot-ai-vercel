import { DemoWorkspace } from "@/components/demo/demo-workspace"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Sparkles, Info } from "lucide-react"

export const metadata = {
  title: "Live Demo — FlowPilot AI",
  description: "Try FlowPilot AI — drag tasks, create projects, and get AI insights. No signup required.",
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-14 px-4 gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground h-8 rounded-xl">
              <Link href="/">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm">FlowPilot AI</span>
            </div>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs hidden sm:flex">
              Live Demo
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Demo data resets on page refresh</span>
            </div>
            <Button asChild size="sm" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl h-8 text-xs gap-1.5">
              <Link href="/sign-up">
                <Sparkles className="h-3.5 w-3.5" /> Sign up free
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="container px-4 pt-8 pb-4">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold mb-1">
            Interactive Demo Workspace
          </h1>
          <p className="text-sm text-muted-foreground">
            Drag tasks between columns, create new projects, and click{" "}
            <span className="text-violet-400 font-medium">"Analyze this project"</span> to see AI-powered insights in action.
          </p>
        </div>
      </div>

      {/* Demo Workspace */}
      <div className="container px-4 pb-12">
        <DemoWorkspace />
      </div>
    </div>
  )
}
