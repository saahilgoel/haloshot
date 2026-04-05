"use client";

import { motion } from "framer-motion";
import { HaloScoreWidget } from "./HaloScoreWidget";
import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlowUpDeltaProps {
  beforeScore: number;
  afterScore: number;
  animated?: boolean;
  className?: string;
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-amber-400";
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

export function GlowUpDelta({
  beforeScore,
  afterScore,
  animated = true,
  className,
}: GlowUpDeltaProps) {
  const delta = afterScore - beforeScore;
  const isHugeDelta = delta >= 50;

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {/* Before / After row */}
      <div className="flex items-center gap-6 md:gap-10">
        {/* Before */}
        <motion.div
          initial={animated ? { opacity: 0, x: -30 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-white/40">
            Before
          </span>
          <HaloScoreWidget
            score={beforeScore}
            size="sm"
            animated={animated}
          />
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={animated ? { opacity: 0, scale: 0 } : undefined}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center"
        >
          <ArrowRight className="h-6 w-6 text-white/30" />
        </motion.div>

        {/* After */}
        <motion.div
          initial={animated ? { opacity: 0, x: 30 } : undefined}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-white/40">
            After
          </span>
          <HaloScoreWidget
            score={afterScore}
            size="sm"
            animated={animated}
          />
        </motion.div>
      </div>

      {/* Delta badge */}
      {delta !== 0 && (
        <motion.div
          initial={animated ? { opacity: 0, scale: 0.5, y: 20 } : undefined}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "relative flex items-center gap-2 rounded-full px-5 py-2.5",
            delta > 0
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : "bg-red-500/10 border border-red-500/20"
          )}
          style={
            isHugeDelta
              ? {
                  boxShadow:
                    "0 0 30px rgba(245, 166, 35, 0.3), 0 0 60px rgba(245, 166, 35, 0.15)",
                }
              : undefined
          }
        >
          <TrendingUp
            className={cn(
              "h-5 w-5",
              delta > 0 ? "text-emerald-400" : "text-red-400 rotate-180"
            )}
          />
          <span
            className={cn(
              "text-2xl font-display font-bold tabular-nums",
              delta > 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
          <span className="text-sm text-white/50">points</span>

          {/* Confetti-like particle effect for huge deltas */}
          {isHugeDelta && (
            <>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-amber-400"
                  initial={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                  }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i * Math.PI * 2) / 8) * 60,
                    y: Math.sin((i * Math.PI * 2) / 8) * 60,
                    scale: 0,
                  }}
                  transition={{
                    duration: 1,
                    delay: 1 + i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
