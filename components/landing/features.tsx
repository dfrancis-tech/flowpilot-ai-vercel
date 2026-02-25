"use client"

import { motion } from "framer-motion"
import { Brain, BarChart3, Shield, Zap, Users, Bell, GitBranch, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Brain,
    title: "AI Co-Pilot",
    description: "Get smart suggestions, deadline risk warnings, and workload balancing powered by GPT-4.",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Visualize productivity trends, completion rates, and team performance with beautiful charts.",
    gradient: "from-blue-500 to-cyan-600",
    glow: "shadow-blue-500/20",
  },
  {
    icon: Zap,
    title: "Kanban Boards",
    description: "Drag-and-drop task management with real-time updates and smooth animations.",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
  },
  {
    icon: Shield,
    title: "Risk Detection",
    description: "AI proactively identifies at-risk tasks and suggests corrective actions before deadlines slip.",
    gradient: "from-red-500 to-rose-600",
    glow: "shadow-red-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tasks, set roles, and collaborate in real-time with your entire team.",
    gradient: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/20",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Intelligent notifications that learn your patterns and remind you at the right moment.",
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/20",
  },
  {
    icon: GitBranch,
    title: "Sprint Planning",
    description: "AI-generated sprint plans based on your team capacity and project priorities.",
    gradient: "from-teal-500 to-cyan-600",
    glow: "shadow-teal-500/20",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Set OKRs and track progress with visual milestones and automated reporting.",
    gradient: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/20",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1),transparent_70%)]" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            FlowPilot AI combines powerful project management with cutting-edge AI to keep
            your team aligned and productive.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group h-full hover:border-border hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
