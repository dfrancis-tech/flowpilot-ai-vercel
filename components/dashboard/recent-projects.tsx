"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Calendar, CheckSquare } from "lucide-react"
import type { Project } from "@/types"
import { formatDate, getStatusColor } from "@/lib/utils"

interface RecentProjectsProps {
  projects: Project[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent Projects</CardTitle>
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/dashboard/projects">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">No projects yet. Create your first project!</p>
            <Button variant="gradient" size="sm" className="mt-4" asChild>
              <Link href="/dashboard/projects">Create Project</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {projects.map((project, i) => {
              const tasks = project.tasks || []
              const completed = tasks.filter((t) => t.status === "completed").length
              const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors group"
                  >
                    <div
                      className="w-3 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color || "#7c3aed" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {project.title}
                        </p>
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">{project.description}</p>
                      <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-1.5 flex-1 max-w-32" />
                        <span className="text-xs text-muted-foreground">{progress}%</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckSquare className="w-3 h-3" />
                          {completed}/{tasks.length}
                        </div>
                        {project.deadline && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatDate(project.deadline)}
                          </div>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
