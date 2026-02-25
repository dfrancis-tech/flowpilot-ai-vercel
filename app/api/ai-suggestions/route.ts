import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import type { Task, Project, AISuggestion } from "@/types"

function generateMockSuggestions(project: Project, tasks: Task[]): AISuggestion[] {
  const suggestions: AISuggestion[] = []
  const now = new Date()

  const overdueTasks = tasks.filter(
    (t) => t.deadline && new Date(t.deadline) < now && t.status !== "completed"
  )
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "completed")
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress")
  const todoTasks = tasks.filter((t) => t.status === "todo")

  if (overdueTasks.length > 0) {
    suggestions.push({
      id: "1",
      type: "warning",
      title: "Deadline Risk Detected",
      description: `${overdueTasks.length} task${overdueTasks.length > 1 ? "s are" : " is"} overdue: "${overdueTasks[0].title}"${overdueTasks.length > 1 ? ` and ${overdueTasks.length - 1} more` : ""}. Immediate attention required.`,
      action: "Review overdue tasks",
      priority: "high",
    })
  }

  if (urgentTasks.length > 2) {
    suggestions.push({
      id: "2",
      type: "risk",
      title: "High Workload Alert",
      description: `${urgentTasks.length} urgent tasks are queued. Consider redistributing work or adjusting priorities to prevent bottlenecks.`,
      action: "Rebalance workload",
      priority: "high",
    })
  }

  if (inProgressTasks.length > 4) {
    suggestions.push({
      id: "3",
      type: "suggestion",
      title: "Too Many Tasks In Progress",
      description: `${inProgressTasks.length} tasks are in progress simultaneously. Research shows limiting WIP to 3-4 tasks increases completion rate by 40%.`,
      action: "Apply WIP limits",
      priority: "medium",
    })
  }

  if (todoTasks.length > 0 && inProgressTasks.length < 2) {
    const bigTask = todoTasks.find((t) => t.title.length > 30)
    if (bigTask) {
      suggestions.push({
        id: "4",
        type: "suggestion",
        title: "Task Breakdown Recommended",
        description: `"${bigTask.title}" appears complex. Breaking it into 3-5 smaller subtasks can improve estimation accuracy and reduce delivery risk.`,
        action: "Break down task",
        priority: "medium",
      })
    }
  }

  if (project.deadline) {
    const daysLeft = Math.ceil((new Date(project.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const completionRate = tasks.length > 0 ? tasks.filter((t) => t.status === "completed").length / tasks.length : 0
    if (daysLeft < 7 && completionRate < 0.5) {
      suggestions.push({
        id: "5",
        type: "risk",
        title: "Project Deadline Risk",
        description: `Only ${daysLeft} days left but ${Math.round(completionRate * 100)}% complete. At the current pace, the deadline may be missed. Consider scope reduction or resource addition.`,
        action: "Review project scope",
        priority: "high",
      })
    }
  }

  suggestions.push({
    id: "6",
    type: "insight",
    title: "Productivity Insight",
    description: "Based on your task patterns, Monday and Tuesday show peak productivity. Consider scheduling complex tasks at the start of the week for optimal output.",
    priority: "low",
  })

  if (todoTasks.length === 0 && inProgressTasks.length === 0) {
    suggestions.push({
      id: "7",
      type: "insight",
      title: "Excellent Progress! 🎉",
      description: "All tasks are completed. Consider planning the next sprint or reviewing the project retrospective to capture learnings.",
      action: "Plan next sprint",
      priority: "low",
    })
  }

  return suggestions.slice(0, 5)
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { project, tasks } = await req.json()

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "mock") {
      const { default: OpenAI } = await import("openai")
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

      const prompt = `You are an AI project management assistant. Analyze this project and provide actionable suggestions.

Project: ${project.title}
Description: ${project.description}
Deadline: ${project.deadline || "Not set"}
Status: ${project.status}

Tasks Summary:
- Total: ${tasks.length}
- Todo: ${tasks.filter((t: Task) => t.status === "todo").length}
- In Progress: ${tasks.filter((t: Task) => t.status === "in-progress").length}
- Completed: ${tasks.filter((t: Task) => t.status === "completed").length}
- Overdue: ${tasks.filter((t: Task) => t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed").length}

Provide 3-5 specific, actionable suggestions in JSON array format:
[{"id": "1", "type": "warning|suggestion|insight|risk", "title": "...", "description": "...", "action": "...", "priority": "low|medium|high"}]`

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 800,
      })

      const content = response.choices[0]?.message?.content || "[]"
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0])
        return NextResponse.json({ suggestions })
      }
    }

    const suggestions = generateMockSuggestions(project, tasks)
    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error("AI suggestions error:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
