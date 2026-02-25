"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Users, Sparkles } from "lucide-react"
import { PLANS } from "@/lib/stripe"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface BillingDashboardProps {
  currentPlan: string
}

const planIcons = { free: Sparkles, pro: Zap, team: Users }
const planColors = {
  free: "from-gray-500 to-gray-600",
  pro: "from-violet-500 to-purple-600",
  team: "from-blue-500 to-cyan-600",
}

export function BillingDashboard({ currentPlan }: BillingDashboardProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    if (plan === currentPlan) return
    setLoading(plan)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success(`Redirecting to Stripe checkout for ${PLANS[plan as keyof typeof PLANS].name} plan...`)
    setLoading(null)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/5 border border-violet-500/20">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Crown className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="text-xl font-bold capitalize">{PLANS[currentPlan as keyof typeof PLANS]?.name || "Free"}</p>
        </div>
        <Badge className="ml-auto bg-violet-500/20 text-violet-400 border-violet-500/30">Active</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(PLANS).map(([key, plan], i) => {
          const Icon = planIcons[key as keyof typeof planIcons]
          const isCurrent = key === currentPlan
          const isPopular = key === "pro"
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={cn(
                "relative h-full transition-all duration-300",
                isCurrent ? "border-violet-500/50 shadow-lg shadow-violet-500/10" : "hover:shadow-md",
                isPopular && !isCurrent && "border-violet-500/30"
              )}>
                {isCurrent && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 text-xs">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader className="p-5 pb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${planColors[key as keyof typeof planColors]} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isCurrent ? "outline" : "gradient"}
                    className="w-full"
                    disabled={isCurrent || loading === key}
                    onClick={() => handleUpgrade(key)}
                  >
                    {loading === key ? "Loading..." : isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">Billing History</h3>
          <div className="text-sm text-muted-foreground text-center py-6">
            No billing history yet.{" "}
            {currentPlan === "free" && "Upgrade to a paid plan to see invoices here."}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
