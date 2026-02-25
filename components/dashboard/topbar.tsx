"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Moon, Sun, Search, Bell, Command } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <header className="h-16 border-b border-border/50 flex items-center px-6 gap-4 bg-background/60 backdrop-blur-sm">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="hidden md:flex items-center gap-2 bg-muted/50 border border-border/50 rounded-xl px-3 py-2 min-w-[200px]">
        <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <input
          placeholder="Search..."
          className="bg-transparent text-sm outline-none flex-1 text-muted-foreground placeholder:text-muted-foreground/60"
        />
        <kbd className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative rounded-xl">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </Button>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </header>
  )
}
