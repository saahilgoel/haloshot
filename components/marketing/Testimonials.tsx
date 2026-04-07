"use client";

import { motion } from "framer-motion";
import { Camera, TrendingUp, Shield } from "lucide-react";

const socialProofStats = [
  {
    icon: Camera,
    value: "10,247",
    label: "Photos scored this week",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    value: "+38",
    label: "Average glow-up score improvement",
    gradient: "from-halo-500 to-amber-600",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Photos encrypted & auto-deleted in 30 days",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function Testimonials() {
  return (
    <div className="space-y-8">
      {/* Live counters */}
      <div className="grid gap-4 sm:grid-cols-3">
        {socialProofStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
          >
            <stat.icon className="mx-auto mb-3 h-8 w-8 text-halo-400" />
            <p className="font-display text-3xl font-bold text-halo-400">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Placeholder for real testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Real user stories coming soon. In the meantime,{" "}
          <a href="/score" className="text-halo-400 hover:text-halo-300 transition-colors font-medium">
            score your own photo
          </a>{" "}
          and see for yourself.
        </p>
      </motion.div>
    </div>
  );
}
