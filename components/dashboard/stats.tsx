"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FolderKanban, CheckCircle2, AlertTriangle, Zap } from "lucide-react"
import type { DashboardStats } from "@/types"
import { cn, getProgressColor } from "@/lib/utils"

interface StatsProps {
  stats: DashboardStats
}

export function DashboardStats({ stats }: StatsProps) {
  const cards = [
    {
      title: "AI Productivity Score",
      value: `${stats.productivity_score}%`,
      subtitle: "Based on task completion rate",
      icon: Zap,
      gradient: "from-violet-500 to-purple-600",
      glow: "shadow-violet-500/20",
      progress: stats.productivity_score,
      color: getProgressColor(stats.productivity_score),
    },
    {
      title: "Active Projects",
      value: stats.active_projects,
      subtitle: "Currently in progress",
      icon: FolderKanban,
      gradient: "from-blue-500 to-cyan-600",
      glow: "shadow-blue-500/20",
    },
    {
      title: "Tasks Completed",
      value: stats.tasks_completed_this_week,
      subtitle: "This week",
      icon: CheckCircle2,
      gradient: "from-green-500 to-emerald-600",
      glow: "shadow-green-500/20",
    },
    {
      title: "Overdue Tasks",
      value: stats.overdue_tasks,
      subtitle: stats.overdue_tasks > 0 ? "Needs attention!" : "You're on track!",
      icon: AlertTriangle,
      gradient: stats.overdue_tasks > 0 ? "from-red-500 to-rose-600" : "from-green-500 to-emerald-600",
      glow: stats.overdue_tasks > 0 ? "shadow-red-500/20" : "shadow-green-500/20",
      urgent: stats.overdue_tasks > 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
            card.urgent && "border-red-500/30"
          )}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">{card.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                  card.gradient, card.glow
                )}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              {card.progress !== undefined && (
                <Progress value={card.progress} className="h-1.5 mb-2" />
              )}
              <p className={cn("text-xs", card.urgent ? "text-red-400" : "text-muted-foreground")}>
                {card.subtitle}
              </p>
            </CardContent>
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-5 pointer-events-none",
              card.gradient
            )} />
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
