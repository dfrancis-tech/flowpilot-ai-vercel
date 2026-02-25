import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: ["3 projects", "Basic AI suggestions", "5GB storage", "Community support"],
    limits: { projects: 3, aiSuggestions: true, analytics: false, collaboration: false },
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: ["Unlimited projects", "Advanced AI", "Analytics", "Priority support", "50GB storage"],
    limits: { projects: Infinity, aiSuggestions: true, analytics: true, collaboration: false },
  },
  team: {
    name: "Team",
    price: 49,
    priceId: process.env.STRIPE_TEAM_PRICE_ID,
    features: ["Everything in Pro", "Team collaboration", "Admin controls", "Audit logs", "200GB storage"],
    limits: { projects: Infinity, aiSuggestions: true, analytics: true, collaboration: true },
  },
}
