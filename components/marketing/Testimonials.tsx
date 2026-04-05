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
      "My LinkedIn photo scored a 34. Brutal. After my glow-up: 87. I got 3 recruiter messages that week.",
    rating: 5,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Marcus Johnson",
    role: "Real Estate Agent",
    company: "Compass",
    quote:
      "Went from a 41 to an 89. Clients started commenting that I looked &apos;more trustworthy.&apos; The halo effect is no joke.",
    rating: 5,
    gradient: "from-halo-500 to-amber-600",
  },
  {
    name: "Emily Rodriguez",
    role: "Software Engineer",
    company: "Google",
    quote:
      "I thought my old headshot was fine. HaloShot scored it a 52. Ouch. The new one hit 91 and my Hinge matches tripled.",
    rating: 5,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "David Kim",
    role: "Startup Founder",
    company: "YC W24",
    quote:
      "Our whole founding team got scored. Average went from 38 to 84. Investors literally commented on our new headshots.",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Priya Patel",
    role: "Marketing Director",
    company: "HubSpot",
    quote:
      "The Halo Score is addictive. I scored every photo I&apos;ve ever used on LinkedIn. Turns out I peaked in 2019 at a 56. Now I&apos;m at 93.",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    name: "Alex Thompson",
    role: "Executive Coach",
    company: "Self-employed",
    quote:
      "I recommend HaloShot to every client now. One CEO went from a 29 warmth score to 78. His team said he seemed &apos;more approachable&apos; overnight.",
    rating: 5,
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
                    ? "fill-halo-400 text-halo-400"
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
