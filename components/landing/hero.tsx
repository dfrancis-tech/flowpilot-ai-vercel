"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Play, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-background to-purple-950/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            AI-Powered Project Management
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
        >
          Your Intelligent
          <br />
          <span className="gradient-text">Project Co-Pilot</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          FlowPilot AI predicts risks, suggests optimizations, and keeps your team
          on track — before problems happen. Ship faster with intelligence built in.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button variant="gradient" size="xl" asChild className="group">
            <Link href="/sign-up">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className="gap-2 group" asChild>
            <Link href="/demo">
              <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-16"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2">4.9/5 from 2,000+ teams</span>
          </div>
          <span className="hidden sm:block">·</span>
          <span className="hidden sm:block">No credit card required</span>
          <span className="hidden sm:block">·</span>
          <span className="hidden sm:block">Free forever plan</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-violet-500/10">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-card/80 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 mx-4 h-6 rounded-lg bg-muted/50" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Todo", "In Progress", "Completed"].map((col, i) => (
                  <div key={col} className="rounded-xl bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-3">{col}</div>
                    {[...Array(i === 1 ? 3 : i === 0 ? 4 : 2)].map((_, j) => (
                      <div
                        key={j}
                        className="mb-2 p-2.5 rounded-lg bg-background/60 border border-border/50 text-left"
                      >
                        <div className="h-2 bg-muted rounded w-3/4 mb-1.5" />
                        <div className="h-1.5 bg-muted/60 rounded w-1/2" />
                        <div className="flex gap-1 mt-2">
                          <div className={`h-1.5 w-8 rounded-full ${["bg-red-500/50", "bg-violet-500/50", "bg-green-500/50"][i]}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
