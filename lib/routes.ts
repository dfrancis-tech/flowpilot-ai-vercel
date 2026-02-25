export const ROUTES = {
  home: "/",
  demo: "/demo",

  signIn: "/sign-in",
  signUp: "/sign-up",

  dashboard: "/dashboard",
  analytics: "/dashboard/analytics",
  projects: "/dashboard/projects",
  project: (id: string) => `/dashboard/projects/${id}`,
  billing: "/dashboard/billing",
  settings: "/dashboard/settings",
} as const

export type AppRoute = typeof ROUTES[keyof typeof ROUTES]
