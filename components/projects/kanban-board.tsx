"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay,
  closestCorners
} from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KanbanColumn } from "./kanban-column"
import { TaskCard } from "./task-card"
import { CreateTaskModal } from "./create-task-modal"
import { updateTaskStatus } from "@/actions/tasks"
import type { Project, Task, TaskStatus } from "@/types"

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "Todo", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  { id: "in-progress", label: "In Progress", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" },
  { id: "completed", label: "Completed", color: "bg-green-500/20 text-green-400 border-green-500/30" },
]

interface KanbanBoardProps {
  project: Project
  initialTasks: Task[]
}

export function KanbanBoard({ project, initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const router = useRouter()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status)

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    if (!["todo", "in-progress", "completed"].includes(newStatus)) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    const wasCompleted = newStatus === "completed"
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t))

    try {
      await updateTaskStatus(taskId, project.id, newStatus)
      if (wasCompleted) {
        toast.success("🎉 Task completed!", { description: `"${task.title}" marked as done.` })
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      router.refresh()
    } catch {
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: task.status } : t))
      toast.error("Failed to update task status")
    }
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask])
    setCreateModalStatus(null)
    router.refresh()
  }

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => t.id === updatedTask.id ? updatedTask : t))
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                animate={{
                  opacity: 0,
                  y: Math.random() * -400 - 100,
                  x: (Math.random() - 0.5) * 600,
                  scale: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, delay: Math.random() * 0.5 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: ["#7c3aed", "#059669", "#2563eb", "#d97706", "#db2777"][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-h-[600px]">
          {COLUMNS.map((col) => {
            const colTasks = getTasksByStatus(col.id)
            return (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={colTasks}
                onAddTask={() => setCreateModalStatus(col.id)}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                projectId={project.id}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 opacity-90">
              <TaskCard
                task={activeTask}
                projectId={project.id}
                onUpdated={() => {}}
                onDeleted={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {createModalStatus && (
        <CreateTaskModal
          open={!!createModalStatus}
          onClose={() => setCreateModalStatus(null)}
          projectId={project.id}
          defaultStatus={createModalStatus}
          onCreated={handleTaskCreated}
        />
      )}
    </>
  )
}
