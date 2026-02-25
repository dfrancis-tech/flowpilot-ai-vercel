"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay,
  closestCorners, useDroppable,
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  Brain, AlertTriangle, Lightbulb, TrendingUp, Shield,
  RefreshCw, ChevronRight, Sparkles, Plus, X, Flag,
  Trash2, FolderPlus, ArrowRight, GripVertical, CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Task, TaskStatus, TaskPriority, AISuggestion, Project } from "@/types"

const generateId = () => Math.random().toString(36).substr(2, 9)

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_PROJECTS: Project[] = [
  {
    id: "demo-1",
    user_id: "demo",
    title: "Website Redesign",
    description: "Complete overhaul with modern design & AI integration",
    deadline: "2026-03-15",
    status: "active",
    color: "#7c3aed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo",
    title: "Mobile App Launch",
    description: "Q1 go-to-market preparation and App Store submission",
    deadline: "2026-04-01",
    status: "active",
    color: "#059669",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const SEED_TASKS: Record<string, Task[]> = {
  "demo-1": [
    { id: "t1", project_id: "demo-1", title: "Design homepage mockups", description: "High-fidelity Figma designs for the new homepage", status: "todo", priority: "high", deadline: "2026-02-28", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t2", project_id: "demo-1", title: "Set up analytics tracking", status: "todo", priority: "medium", deadline: "2026-03-05", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t3", project_id: "demo-1", title: "Write copy for About page", status: "todo", priority: "low", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t4", project_id: "demo-1", title: "Build navigation component", description: "Responsive nav with mobile drawer and animations", status: "in-progress", priority: "high", deadline: "2026-02-26", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t5", project_id: "demo-1", title: "Implement dark mode toggle", status: "in-progress", priority: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t6", project_id: "demo-1", title: "Project kickoff meeting", status: "completed", priority: "low", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t7", project_id: "demo-1", title: "Define design system tokens", description: "Colors, typography, spacing documented in Figma", status: "completed", priority: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
  "demo-2": [
    { id: "t8", project_id: "demo-2", title: "App Store submission", status: "todo", priority: "urgent", deadline: "2026-03-28", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t9", project_id: "demo-2", title: "Write App Store description", status: "todo", priority: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t10", project_id: "demo-2", title: "QA testing round 2", status: "in-progress", priority: "high", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t11", project_id: "demo-2", title: "Beta user feedback analysis", status: "completed", priority: "medium", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "t12", project_id: "demo-2", title: "Onboarding flow design", status: "completed", priority: "high", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ],
}

// ─── Config ──────────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "Todo", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  { id: "in-progress", label: "In Progress", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  { id: "completed", label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
]

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string }> = {
  urgent: { color: "text-red-500", bg: "bg-red-500/15 border-red-500/30" },
  high: { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30" },
  low: { color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
}

const AI_TYPE_CONFIG = {
  warning: { icon: AlertTriangle, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  risk: { icon: Shield, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  suggestion: { icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  insight: { icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
}

// ─── Demo Task Card ───────────────────────────────────────────────────────────

function DemoTaskCard({
  task, onDelete, isDragging,
}: { task: Task; onDelete: (id: string) => void; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  }

  const priority = PRIORITY_CONFIG[task.priority]

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={cn(
        "group border border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md hover:border-primary/20 transition-all duration-200",
        isDragging && "shadow-xl rotate-2 opacity-90 border-primary/40",
      )}>
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <button
              {...listeners}
              {...attributes}
              className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-snug mb-1.5">{task.title}</p>
              {task.description && (
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-2 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center justify-between gap-2">
                <Badge className={cn("text-[10px] px-1.5 py-0 h-4 border", priority.bg, priority.color)}>
                  <Flag className="w-2.5 h-2.5 mr-0.5" />
                  {task.priority}
                </Badge>
                {task.deadline && (
                  <span className="text-[10px] text-muted-foreground">{new Date(task.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/40 hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Demo Kanban Column ───────────────────────────────────────────────────────

function DemoColumn({
  column, tasks, onDelete, onAddTask,
}: {
  column: typeof COLUMNS[0]
  tasks: Task[]
  onDelete: (id: string) => void
  onAddTask: (title: string, status: TaskStatus) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAddTask(newTitle.trim(), column.id)
    setNewTitle("")
    setAdding(false)
    toast.success("Task added!")
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.label}</h3>
          <Badge className={cn("text-xs h-5 min-w-5 flex items-center justify-center", column.color)}>
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl p-3 min-h-[480px] transition-colors duration-200 space-y-2",
          isOver ? "bg-primary/5 border-2 border-primary/20 border-dashed" : "bg-muted/30 border border-border/30",
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DemoTaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
        </SortableContext>

        {adding ? (
          <div className="space-y-2 pt-1">
            <Input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title..."
              className="h-8 text-xs rounded-lg"
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") { setAdding(false); setNewTitle("") } }}
            />
            <div className="flex gap-1">
              <Button size="sm" className="h-7 text-xs flex-1 rounded-lg" onClick={handleAdd}>Add</Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 rounded-lg p-0" onClick={() => { setAdding(false); setNewTitle("") }}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)} className="mt-2 text-xs gap-1">
              <Plus className="h-3 w-3" /> Add task
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─── Demo AI Panel ────────────────────────────────────────────────────────────

function DemoAIPanel({ project, tasks }: { project: Project; tasks: Task[] }) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, tasks }),
      })
      const data = await res.json()
      setSuggestions(data.suggestions || [])
      setLoaded(true)
    } catch {
      toast.error("Could not fetch AI suggestions")
    } finally {
      setLoading(false)
    }
  }, [project, tasks])

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
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={fetchSuggestions} disabled={loading}>
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      <div className="h-px bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-transparent" />

      {!loaded && !loading && (
        <button
          onClick={fetchSuggestions}
          className="w-full rounded-xl border border-dashed border-violet-500/30 bg-violet-500/5 p-4 text-center hover:bg-violet-500/10 transition-colors"
        >
          <Sparkles className="w-6 h-6 text-violet-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-violet-300">Analyze this project</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Get AI-powered insights &amp; risk alerts</p>
        </button>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border/30 bg-muted/20 p-3 space-y-2 animate-pulse">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-2.5 bg-muted/70 rounded w-full" />
              <div className="h-2.5 bg-muted/50 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {suggestions.map((s, i) => {
            const cfg = AI_TYPE_CONFIG[s.type]
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}>
                <Card className={cn("border transition-all duration-200 hover:shadow-md cursor-pointer", cfg.bg)}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2.5">
                      <cfg.icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", cfg.color)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-xs font-semibold leading-tight">{s.title}</p>
                          <Badge className={cn("text-[9px] px-1 py-0 h-3.5 flex-shrink-0", s.priority === "high" ? "bg-red-500/20 text-red-400" : s.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400")}>
                            {s.priority}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{s.description}</p>
                        {s.action && (
                          <button className={cn("mt-2 text-[11px] font-medium flex items-center gap-1 hover:gap-2 transition-all", cfg.color)}>
                            {s.action} <ChevronRight className="w-3 h-3" />
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
        <p className="text-[10px] text-muted-foreground text-center pt-1 border-t border-border/50">
          Powered by FlowPilot AI · Live analysis
        </p>
      )}
    </div>
  )
}

// ─── Create Project Modal ─────────────────────────────────────────────────────

function CreateProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: Project) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const COLORS = ["#7c3aed", "#059669", "#2563eb", "#d97706", "#db2777", "#0891b2"]
  const [color, setColor] = useState(COLORS[0])

  const handleCreate = () => {
    if (!title.trim()) return
    const project: Project = {
      id: `demo-${generateId()}`,
      user_id: "demo",
      title: title.trim(),
      description: description.trim(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    onCreate(project)
    toast.success(`Project "${title}" created!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-4">
        <Card className="border border-border/50 shadow-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Project</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Project Name</label>
              <Input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q2 Marketing Campaign"
                className="rounded-xl"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief project overview..."
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Color</label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn("w-7 h-7 rounded-full transition-all", color === c && "ring-2 ring-white ring-offset-2 ring-offset-background scale-110")}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600"
                onClick={handleCreate}
                disabled={!title.trim()}
              >
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Main Demo Workspace ──────────────────────────────────────────────────────

export function DemoWorkspace() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [tasksByProject, setTasksByProject] = useState<Record<string, Task[]>>(SEED_TASKS)
  const [activeProjectId, setActiveProjectId] = useState("demo-1")
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const activeProject = projects.find((p) => p.id === activeProjectId)!
  const tasks = tasksByProject[activeProjectId] ?? []

  const getTasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return
    const taskId = active.id as string
    const newStatus = over.id as TaskStatus
    if (!["todo", "in-progress", "completed"].includes(newStatus)) return
    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    setTasksByProject((prev) => ({
      ...prev,
      [activeProjectId]: prev[activeProjectId].map((t) => t.id === taskId ? { ...t, status: newStatus } : t),
    }))

    if (newStatus === "completed") {
      toast.success("🎉 Task completed!")
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    } else {
      toast.success(`Moved to ${newStatus === "in-progress" ? "In Progress" : "Todo"}`)
    }
  }

  const handleAddTask = (title: string, status: TaskStatus) => {
    const newTask: Task = {
      id: generateId(),
      project_id: activeProjectId,
      title,
      status,
      priority: "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setTasksByProject((prev) => ({
      ...prev,
      [activeProjectId]: [...(prev[activeProjectId] ?? []), newTask],
    }))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasksByProject((prev) => ({
      ...prev,
      [activeProjectId]: prev[activeProjectId].filter((t) => t.id !== taskId),
    }))
    toast.success("Task removed")
  }

  const handleCreateProject = (project: Project) => {
    setProjects((prev) => [...prev, project])
    setTasksByProject((prev) => ({ ...prev, [project.id]: [] }))
    setActiveProjectId(project.id)
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                animate={{ opacity: 0, y: Math.random() * -400 - 100, x: (Math.random() - 0.5) * 600, scale: 0, rotate: Math.random() * 360 }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: ["#7c3aed", "#059669", "#2563eb", "#d97706", "#db2777"][Math.floor(Math.random() * 5)] }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Project Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveProjectId(p.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all border",
              activeProjectId === p.id
                ? "bg-card border-border/80 shadow-sm text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50",
            )}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            {p.title}
          </button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs rounded-xl text-muted-foreground hover:text-foreground"
          onClick={() => setShowCreateProject(true)}
        >
          <FolderPlus className="h-3.5 w-3.5" /> New Project
        </Button>
      </div>

      {/* Active project info */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeProject.color }} />
            {activeProject.title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">{activeProject.description}</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          {getTasksByStatus("completed").length}/{tasks.length} completed
        </div>
      </div>

      {/* Board + AI Panel */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Kanban Board */}
        <div className="flex-1 min-w-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COLUMNS.map((col) => (
                <DemoColumn
                  key={col.id}
                  column={col}
                  tasks={getTasksByStatus(col.id)}
                  onDelete={handleDeleteTask}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && <DemoTaskCard task={activeTask} onDelete={() => {}} isDragging />}
            </DragOverlay>
          </DndContext>
        </div>

        {/* AI Co-Pilot Sidebar */}
        <div className="w-72 flex-shrink-0 hidden lg:block">
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 sticky top-4">
            <ScrollArea className="max-h-[600px]">
              <DemoAIPanel project={activeProject} tasks={tasks} />
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 to-purple-950/30 p-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold">Ready to use FlowPilot for your real projects?</p>
          <p className="text-xs text-muted-foreground mt-0.5">Free forever plan · No credit card · Takes 30 seconds</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl gap-2 flex-shrink-0">
          <Link href="/sign-up">
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {showCreateProject && (
        <CreateProjectModal
          onClose={() => setShowCreateProject(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  )
}
