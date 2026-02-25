"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { GripVertical, MoreHorizontal, Edit, Trash2, Calendar, AlertCircle } from "lucide-react"
import type { Task } from "@/types"
import { getPriorityColor, formatRelativeDate, isOverdue, isDueSoon, cn } from "@/lib/utils"
import { deleteTask } from "@/actions/tasks"
import { EditTaskModal } from "./edit-task-modal"

interface TaskCardProps {
  task: Task
  projectId: string
  onUpdated: (task: Task) => void
  onDeleted: (taskId: string) => void
  isDragging?: boolean
}

export function TaskCard({ task, projectId, onUpdated, onDeleted, isDragging }: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.4 : 1,
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id, projectId)
      onDeleted(task.id)
      toast.success("Task deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  const overdue = task.deadline && isOverdue(task.deadline) && task.status !== "completed"
  const dueSoon = task.deadline && isDueSoon(task.deadline) && task.status !== "completed"

  return (
    <>
      <div ref={setNodeRef} style={style}>
        <Card
          className={cn(
            "group cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-border",
            isDragging && "shadow-2xl border-primary/30 rotate-2",
            overdue && "border-red-500/30 bg-red-500/5",
            dueSoon && !overdue && "border-yellow-500/30"
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <div
                {...attributes}
                {...listeners}
                className="mt-0.5 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-grab active:cursor-grabbing transition-opacity flex-shrink-0"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <p className={cn(
                    "text-sm font-medium leading-snug",
                    task.status === "completed" && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 flex-shrink-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                        <Edit className="h-3.5 w-3.5 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2.5 gap-2">
                  <Badge className={cn("text-[10px] px-1.5 py-0 h-4", getPriorityColor(task.priority))}>
                    {task.priority}
                  </Badge>
                  {task.deadline && (
                    <div className={cn(
                      "flex items-center gap-1 text-[10px]",
                      overdue ? "text-red-400" : dueSoon ? "text-yellow-400" : "text-muted-foreground"
                    )}>
                      {overdue && <AlertCircle className="h-3 w-3" />}
                      <Calendar className="h-3 w-3" />
                      {formatRelativeDate(task.deadline)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditTaskModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={task}
        projectId={projectId}
        onUpdated={onUpdated}
      />
    </>
  )
}
