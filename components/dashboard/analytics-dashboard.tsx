"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { format, subDays } from "date-fns"
import type { Task, Project } from "@/types"

interface AnalyticsDashboardProps {
  projects: Project[]
  tasks: Task[]
}

const COLORS = ["#7c3aed", "#2563eb", "#059669", "#dc2626", "#d97706"]

export function AnalyticsDashboard({ projects, tasks }: AnalyticsDashboardProps) {
  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100) : 0

  const priorityData = ["low", "medium", "high", "urgent"].map((p) => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    value: tasks.filter((t) => t.priority === p).length,
  }))

  const statusData = [
    { name: "Todo", value: tasks.filter((t) => t.status === "todo").length, fill: "#6b7280" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, fill: "#7c3aed" },
    { name: "Completed", value: tasks.filter((t) => t.status === "completed").length, fill: "#059669" },
  ]

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dateStr = format(date, "yyyy-MM-dd")
    return {
      name: format(date, "MMM d"),
      completed: tasks.filter((t) => t.status === "completed" && format(new Date(t.updated_at), "yyyy-MM-dd") === dateStr).length,
      created: tasks.filter((t) => format(new Date(t.created_at), "yyyy-MM-dd") === dateStr).length,
    }
  })

  const projectProgress = projects.map((p) => {
    const pts = p.tasks || []
    return {
      name: p.title.slice(0, 20) + (p.title.length > 20 ? "..." : ""),
      completed: pts.filter((t) => t.status === "completed").length,
      total: pts.length,
      progress: pts.length > 0 ? Math.round((pts.filter((t) => t.status === "completed").length / pts.length) * 100) : 0,
    }
  })

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: "12px",
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length, color: "text-violet-400" },
          { label: "Completion Rate", value: `${completionRate}%`, color: "text-green-400" },
          { label: "Active Projects", value: projects.filter((p) => p.status === "active").length, color: "text-blue-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">14-Day Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={last14Days}>
                  <defs>
                    <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={1} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="completed" stroke="#7c3aed" fill="url(#completedGrad)" strokeWidth={2} name="Completed" />
                  <Area type="monotone" dataKey="created" stroke="#2563eb" fill="none" strokeWidth={2} strokeDasharray="4 4" name="Created" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={projectProgress} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={100} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Progress"]} />
                  <Bar dataKey="progress" radius={[0, 6, 6, 0]}>
                    {projectProgress.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Priority Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                    {priorityData.map((_, i) => (
                      <Cell key={i} fill={["#059669", "#d97706", "#dc2626", "#7c3aed"][i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {priorityData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ["#059669", "#d97706", "#dc2626", "#7c3aed"][i] }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="font-medium ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Task Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {statusData.map((s) => (
                  <div key={s.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{s.name}</span>
                      <span className="font-medium">{s.value} tasks</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: tasks.length > 0 ? `${Math.round((s.value / tasks.length) * 100)}%` : "0%",
                          backgroundColor: s.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
