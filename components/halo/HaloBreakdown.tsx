"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Dimension {
  label: string;
  key: string;
  score: number;
  icon: string;
}

interface HaloBreakdownProps {
  warmth: number;
  competence: number;
  trustworthiness: number;
  approachability: number;
  dominance: number;
  animated?: boolean;
  delay?: number;
  className?: string;
}

function getBarColor(score: number) {
  if (score >= 90) return "bg-amber-400";
  if (score >= 70) return "bg-emerald-400";
  if (score >= 40) return "bg-yellow-400";
  return "bg-red-400";
}

function getBarGlow(score: number) {
  if (score >= 90) return "shadow-[0_0_12px_rgba(245,166,35,0.4)]";
  if (score >= 70) return "shadow-[0_0_12px_rgba(52,211,153,0.3)]";
  if (score >= 40) return "shadow-[0_0_12px_rgba(251,191,36,0.3)]";
  return "shadow-[0_0_12px_rgba(248,113,113,0.3)]";
}

export function HaloBreakdown({
  warmth,
  competence,
  trustworthiness,
  approachability,
  dominance,
  animated = true,
  delay = 0,
  className,
}: HaloBreakdownProps) {
  const dimensions: Dimension[] = [
    { label: "Warmth", key: "warmth", score: warmth, icon: "sun" },
    { label: "Competence", key: "competence", score: competence, icon: "brain" },
    { label: "Trust", key: "trustworthiness", score: trustworthiness, icon: "shield" },
    { label: "Approachability", key: "approachability", score: approachability, icon: "hand" },
    { label: "Dominance", key: "dominance", score: dominance, icon: "crown" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {dimensions.map((dim, i) => (
        <motion.div
          key={dim.key}
          initial={animated ? { opacity: 0, x: -20 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">
              {dim.label}
            </span>
            <span
              className={cn(
                "text-sm font-mono font-bold tabular-nums",
                dim.score >= 90
                  ? "text-amber-400"
                  : dim.score >= 70
                  ? "text-emerald-400"
                  : dim.score >= 40
                  ? "text-yellow-400"
                  : "text-red-400"
              )}
            >
              {dim.score}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                getBarColor(dim.score),
                getBarGlow(dim.score)
              )}
              initial={animated ? { width: 0 } : { width: `${dim.score}%` }}
              animate={{ width: `${dim.score}%` }}
              transition={{
                duration: 1,
                delay: delay + i * 0.15 + 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
