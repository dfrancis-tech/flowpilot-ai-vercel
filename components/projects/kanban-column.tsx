"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { TaskCard } from "./task-card"
import type { Task, TaskStatus } from "@/types"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  column: { id: TaskStatus; label: string; color: string }
  tasks: Task[]
  onAddTask: () => void
  onTaskUpdated: (task: Task) => void
  onTaskDeleted: (taskId: string) => void
  projectId: string
}

export function KanbanColumn({
  column, tasks, onAddTask, onTaskUpdated, onTaskDeleted, projectId
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.label}</h3>
          <Badge className={cn("text-xs h-5 min-w-5 flex items-center justify-center", column.color)}>
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl p-3 min-h-[500px] transition-colors duration-200 space-y-2",
          isOver ? "bg-primary/5 border-2 border-primary/20 border-dashed" : "bg-muted/30 border border-border/30"
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              onUpdated={onTaskUpdated}
              onDeleted={onTaskDeleted}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-xs text-muted-foreground">Drop tasks here</p>
            <Button variant="ghost" size="sm" onClick={onAddTask} className="mt-2 text-xs gap-1">
              <Plus className="h-3 w-3" /> Add task
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
