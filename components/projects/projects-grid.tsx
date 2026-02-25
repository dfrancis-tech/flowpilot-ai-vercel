"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plus, Calendar, FolderKanban, Lock } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types"
import { formatDate, getStatusColor } from "@/lib/utils"
import { CreateProjectModal } from "./create-project-modal"
import { cn } from "@/lib/utils"

interface ProjectsGridProps {
  projects: Project[]
  subscriptionPlan: string
  userId: string
}

export function ProjectsGrid({ projects, subscriptionPlan, userId }: ProjectsGridProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const canCreateProject = subscriptionPlan !== "free" || projects.length < 3

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
            {subscriptionPlan === "free" && ` · Free plan (${projects.length}/3)`}
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateProject}
          className="gap-2"
        >
          {canCreateProject ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          New Project
        </Button>
      </div>

      {!canCreateProject && (
        <div className="mb-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Free plan limit reached</p>
            <p className="text-xs text-muted-foreground">Upgrade to Pro for unlimited projects</p>
          </div>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/dashboard/billing">Upgrade to Pro</Link>
          </Button>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FolderKanban className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm">
            Create your first project and start organizing your work with AI-powered insights.
          </p>
          <Button variant="gradient" onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects.map((project, i) => {
              const tasks = project.tasks || []
              const completed = tasks.filter((t) => t.status === "completed").length
              const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Card className="group hover:shadow-xl hover:border-border transition-all duration-300 cursor-pointer h-full">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: project.color + "20" }}
                          >
                            <FolderKanban
                              className="w-5 h-5"
                              style={{ color: project.color || "#7c3aed" }}
                            />
                          </div>
                          <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{completed}/{tasks.length} tasks</span>
                          {project.deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(project.deadline)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={userId}
      />
    </>
  )
}
