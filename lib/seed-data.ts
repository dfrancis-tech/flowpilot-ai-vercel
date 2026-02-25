import { supabase } from "./supabase"

export const SEED_PROJECTS = [
  {
    title: "FlowPilot Website Redesign",
    description: "Complete overhaul of the marketing website with new design system, improved performance, and SEO optimization.",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    color: "#7c3aed",
  },
  {
    title: "Mobile App v2.0",
    description: "Next major version of the mobile app featuring AI-powered task suggestions, offline mode, and redesigned UX.",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    color: "#2563eb",
  },
  {
    title: "API Integration Platform",
    description: "Build a robust API integration platform supporting 50+ third-party services including Slack, GitHub, and Jira.",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "on-hold",
    color: "#059669",
  },
]

export const SEED_TASKS = (projectId: string) => [
  {
    project_id: projectId,
    title: "Design system audit and planning",
    description: "Review existing design tokens, components, and patterns. Create improvement roadmap.",
    status: "completed",
    priority: "high",
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    project_id: projectId,
    title: "Implement new navigation component",
    description: "Build responsive navbar with glass morphism effect, mobile drawer, and smooth animations.",
    status: "in-progress",
    priority: "high",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    project_id: projectId,
    title: "Hero section animation",
    description: "Create impressive hero with particle effects, animated gradient, and staggered text animations.",
    status: "in-progress",
    priority: "medium",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    project_id: projectId,
    title: "SEO optimization and meta tags",
    description: "Implement structured data, og:images, meta descriptions for all pages.",
    status: "todo",
    priority: "medium",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    project_id: projectId,
    title: "Performance optimization",
    description: "Achieve 95+ Lighthouse score. Optimize images, implement lazy loading, reduce bundle size.",
    status: "todo",
    priority: "urgent",
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    project_id: projectId,
    title: "Write comprehensive tests",
    description: "Unit tests, integration tests, and E2E tests for critical user flows.",
    status: "todo",
    priority: "low",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function seedUserData(userId: string) {
  const { data: existingProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (existingProjects && existingProjects.length > 0) return

  for (const project of SEED_PROJECTS) {
    const { data: createdProject } = await supabase
      .from("projects")
      .insert({ ...project, user_id: userId })
      .select()
      .single()

    if (createdProject) {
      const tasks = SEED_TASKS(createdProject.id)
      await supabase.from("tasks").insert(tasks)
    }
  }
}
