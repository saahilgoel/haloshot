"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Stripe",
    quote:
      "I needed a LinkedIn photo fast before a conference. HaloShot gave me something better than the $400 studio shoot I did last year.",
    rating: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Johnson",
    role: "Real Estate Agent",
    company: "Compass",
    quote:
      "My team of 12 agents all got professional headshots in one afternoon. Used to take weeks to schedule a photographer for everyone.",
    rating: 5,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Software Engineer",
    company: "Google",
    quote:
      "Finally a headshot that actually looks like me and not some AI fever dream. The likeness is genuinely impressive.",
    rating: 5,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    company: "YC W24",
    quote:
      "We put our whole founding team's headshots on the website using HaloShot. Consistent style, professional look, zero hassle.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Priya Patel",
    role: "Marketing Director",
    company: "HubSpot",
    quote:
      "The quality jump from v1 to their latest model is insane. I've tried every AI headshot tool and HaloShot is in a different league.",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Alex Thompson",
    role: "Executive Coach",
    company: "Self-employed",
    quote:
      "My clients always ask where I got my headshot. When I tell them it&apos;s AI they never believe me. That's the highest compliment.",
    rating: 4,
    gradient: "from-fuchsia-500 to-purple-600",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
        >
          <div className="mb-4 flex items-center gap-1">
            {[...Array(5)].map((_, j) => (
              <Star
                key={j}
                className={cn(
                  "h-4 w-4",
                  j < t.rating
                    ? "fill-lime-400 text-lime-400"
                    : "fill-white/10 text-white/10"
                )}
              />
            ))}
          </div>

          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            &ldquo;{t.quote}&rdquo;
          </p>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 shrink-0 rounded-full bg-gradient-to-br",
                t.gradient
              )}
            />
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.role} at {t.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
