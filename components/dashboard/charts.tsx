"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import { format, subDays } from "date-fns"
import type { Task, Project } from "@/types"

interface ChartsProps {
  tasks: Task[]
  projects: Project[]
}

const COLORS = ["#7c3aed", "#2563eb", "#059669", "#dc2626"]

export function DashboardCharts({ tasks, projects }: ChartsProps) {
  const statusData = [
    { name: "Todo", value: tasks.filter((t) => t.status === "todo").length, fill: "#6b7280" },
    { name: "In Progress", value: tasks.filter((t) => t.status === "in-progress").length, fill: "#7c3aed" },
    { name: "Completed", value: tasks.filter((t) => t.status === "completed").length, fill: "#059669" },
  ]

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const dateStr = format(date, "yyyy-MM-dd")
    const completed = tasks.filter(
      (t) => t.status === "completed" && format(new Date(t.updated_at), "yyyy-MM-dd") === dateStr
    ).length
    return { name: format(date, "EEE"), completed, created: Math.floor(Math.random() * 5) + 1 }
  })

  const completionRate = tasks.length > 0
    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="completed" stroke="#7c3aed" strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }} name="Completed" />
                <Line type="monotone" dataKey="created" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Created" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={statusData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-semibold text-green-400">{completionRate}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-green-500 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
