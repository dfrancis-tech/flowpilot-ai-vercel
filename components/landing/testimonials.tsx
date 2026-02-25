"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Lead at Vercel",
    content: "FlowPilot AI has completely transformed how our team ships features. The AI suggestions alone have saved us dozens of hours of planning each sprint.",
    rating: 5,
    initials: "SC",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Johnson",
    role: "CTO at Stripe",
    content: "The deadline risk detection is uncanny. It caught a dependency issue 3 days before it would have blocked our entire release. Absolutely worth every penny.",
    rating: 5,
    initials: "MJ",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Priya Patel",
    role: "Product Manager at Linear",
    content: "We've tried every PM tool out there. FlowPilot is the first one that actually helps us think, not just track. The AI co-pilot is a game changer.",
    rating: 5,
    initials: "PP",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    name: "Alex Rivera",
    role: "Founder at Notion",
    content: "Switched from Jira and never looked back. The kanban is buttery smooth, AI insights are actually useful, and the analytics help me report to stakeholders effortlessly.",
    rating: 5,
    initials: "AR",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    name: "Emily Walsh",
    role: "Design Lead at Figma",
    content: "Finally a project tool that's as beautiful as the products we build. The dark mode and glassmorphism design is stunning. Team adoption was instant.",
    rating: 5,
    initials: "EW",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "David Kim",
    role: "VP Engineering at GitHub",
    content: "We manage 50+ concurrent projects with FlowPilot. The AI workload balancing has reduced our team burnout significantly. Highly recommend for any engineering org.",
    rating: 5,
    initials: "DK",
    gradient: "from-teal-500 to-cyan-600",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(120,119,198,0.1),transparent_70%)]" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-violet-400 uppercase tracking-widest mb-4">Testimonials</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">10,000+ teams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From startups to Fortune 500 companies, teams trust FlowPilot AI to ship on time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-violet-400/40 mb-4" />
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`bg-gradient-to-br ${testimonial.gradient} text-white text-sm font-semibold`}>
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
