"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"
import { PLANS } from "@/lib/stripe"
import { cn } from "@/lib/utils"

const planDetails = [
  {
    key: "free",
    popular: false,
    features: ["3 projects", "Basic AI suggestions", "Kanban boards", "5GB storage", "Community support"],
    cta: "Get Started Free",
    href: "/sign-up",
  },
  {
    key: "pro",
    popular: true,
    features: ["Unlimited projects", "Advanced AI Co-Pilot", "Analytics dashboard", "Priority support", "50GB storage", "Custom workflows"],
    cta: "Start Pro Trial",
    href: "/sign-up?plan=pro",
  },
  {
    key: "team",
    popular: false,
    features: ["Everything in Pro", "Team collaboration", "Admin controls", "Audit logs", "200GB storage", "SSO & advanced security", "Dedicated support"],
    cta: "Start Team Trial",
    href: "/sign-up?plan=team",
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
          <div className="inline-flex items-center gap-3 bg-muted rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", !annual ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", annual ? "bg-background shadow-sm" : "text-muted-foreground")}
            >
              Annual
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Save 20%</Badge>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planDetails.map((plan, i) => {
            const planData = PLANS[plan.key as keyof typeof PLANS]
            const price = annual ? Math.floor(planData.price * 0.8) : planData.price
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className={cn(
                  "relative h-full transition-all duration-300",
                  plan.popular
                    ? "border-violet-500/50 shadow-2xl shadow-violet-500/10 scale-[1.02]"
                    : "hover:border-border hover:shadow-lg"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0 px-4 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="p-6 pb-4">
                    <div className="mb-2">
                      <h3 className="text-lg font-bold">{planData.name}</h3>
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold">${price}</span>
                      <span className="text-muted-foreground mb-1">/month</span>
                    </div>
                    {annual && planData.price > 0 && (
                      <p className="text-xs text-muted-foreground line-through">${planData.price}/mo</p>
                    )}
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button
                      variant={plan.popular ? "gradient" : "outline"}
                      className="w-full mb-6"
                      asChild
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <div className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                            plan.popular ? "bg-violet-500/20" : "bg-muted"
                          )}>
                            <Check className={cn("w-3 h-3", plan.popular ? "text-violet-400" : "text-muted-foreground")} />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
