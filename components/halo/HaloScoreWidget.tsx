"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HaloScoreWidgetProps {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

const SIZES = {
  sm: { outer: 96, stroke: 4, fontSize: "text-2xl", labelSize: "text-[10px]" },
  md: { outer: 160, stroke: 6, fontSize: "text-5xl", labelSize: "text-xs" },
  lg: { outer: 224, stroke: 8, fontSize: "text-7xl", labelSize: "text-sm" },
} as const;

function getScoreColor(score: number) {
  if (score >= 90) return { ring: "#F5A623", glow: "rgba(245, 166, 35, 0.6)", label: "Legendary" };
  if (score >= 70) return { ring: "#34D399", glow: "rgba(52, 211, 153, 0.4)", label: "Strong" };
  if (score >= 40) return { ring: "#FBBF24", glow: "rgba(251, 191, 36, 0.4)", label: "Average" };
  return { ring: "#F87171", glow: "rgba(248, 113, 113, 0.4)", label: "Needs Work" };
}

export function HaloScoreWidget({
  score,
  size = "md",
  animated = true,
  className,
}: HaloScoreWidgetProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const animationRef = useRef<number | null>(null);
  const { outer, stroke, fontSize, labelSize } = SIZES[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreColors = getScoreColor(displayScore);
  const progress = (displayScore / 100) * circumference;
  const glowIntensity = Math.max(10, (displayScore / 100) * 40);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const startTime = performance.now();
    const duration = 2000;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(eased * score));

      if (t < 1) {
        animationRef.current = requestAnimationFrame(tick);
      }
    }

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [score, animated]);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: outer, height: outer }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: `0 0 ${glowIntensity}px ${scoreColors.glow}, 0 0 ${glowIntensity * 2}px ${scoreColors.glow}`,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* SVG ring */}
      <svg
        width={outer}
        height={outer}
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={scoreColors.ring}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: animated ? 2 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        <span
          className={cn(
            "font-display font-bold tabular-nums leading-none",
            fontSize
          )}
          style={{ color: scoreColors.ring }}
        >
          {displayScore}
        </span>
        <span
          className={cn(
            "mt-1 font-medium uppercase tracking-widest text-white/50",
            labelSize
          )}
        >
          {scoreColors.label}
        </span>
      </div>
    </div>
  );
}
