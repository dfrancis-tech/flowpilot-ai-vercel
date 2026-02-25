"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain, AlertTriangle, Lightbulb, TrendingUp, Shield,
  RefreshCw, ChevronRight, Sparkles
} from "lucide-react"
import type { Project, Task, AISuggestion } from "@/types"
import { cn } from "@/lib/utils"

interface AICopilotProps {
  project: Project
  tasks: Task[]
}

const typeConfig = {
  warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  risk: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  suggestion: { icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  insight: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
}

export function AICopilot({ project, tasks }: AICopilotProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, tasks }),
      })
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setLoaded(true)
    } catch (error) {
      console.error("Failed to fetch AI suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">AI Co-Pilot</h3>
            <p className="text-xs text-muted-foreground">Smart insights</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={fetchSuggestions}
          disabled={loading}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      <div className="h-px bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-transparent" />

      {loading && !loaded && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && suggestions.length === 0 && loaded && (
        <div className="text-center py-8">
          <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">No suggestions at this time. Your project looks healthy! 🎉</p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {suggestions.map((suggestion, i) => {
            const config = typeConfig[suggestion.type]
            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className={cn("border transition-all duration-200 hover:shadow-md cursor-pointer", config.bg)}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex-shrink-0">
                        <config.icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-semibold leading-tight">{suggestion.title}</p>
                          <Badge className={cn(
                            "text-[9px] px-1 py-0 h-3.5 flex-shrink-0",
                            suggestion.priority === "high" ? "bg-red-500/20 text-red-400" :
                            suggestion.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-green-500/20 text-green-400"
                          )}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          {suggestion.description}
                        </p>
                        {suggestion.action && (
                          <button className={cn("mt-2 text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all", config.color)}>
                            {suggestion.action}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {loaded && suggestions.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground text-center">
            Powered by FlowPilot AI · Updated just now
          </p>
        </div>
      )}
    </div>
  )
}
