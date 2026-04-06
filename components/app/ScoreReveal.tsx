"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { HaloBurst } from "./HaloBurst";

interface ScoreRevealProps {
  score: number;
  bestScore?: number;
  presetName?: string;
}

function getTier(score: number) {
  if (score >= 95) return { label: "Legendary", color: "text-amber-300", bg: "bg-amber-500/20 border-amber-500/30", emoji: "" };
  if (score >= 85) return { label: "Fire", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", emoji: "" };
  if (score >= 70) return { label: "Hot", color: "text-violet-400", bg: "bg-violet-500/20 border-violet-500/30", emoji: "" };
  if (score >= 50) return { label: "Decent", color: "text-blue-400", bg: "bg-blue-500/20 border-blue-500/30", emoji: "" };
  return { label: "Needs Work", color: "text-white/40", bg: "bg-white/5 border-white/10", emoji: "" };
}

export function ScoreReveal({ score, bestScore, presetName }: ScoreRevealProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    if (score <= 0) return;

    startTime.current = performance.now();
    const duration = 1800; // ms for counter to reach final score
    const burstAt = 0.85; // trigger burst at 85% of animation

    let hasBurst = false;

    function tick() {
      const elapsed = performance.now() - startTime.current;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);

      setDisplayScore(current);

      if (progress >= burstAt && !hasBurst && score >= 70) {
        hasBurst = true;
        setBurstActive(true);
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setRevealed(true);
      }
    }

    // Small delay before starting the count
    const timer = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const tier = getTier(score);
  const isNewBest = bestScore != null && score > bestScore;
  const delta = bestScore != null ? score - bestScore : null;

  return (
    <div className="relative flex flex-col items-center py-6">
      {/* Halo Burst canvas — behind everything */}
      <HaloBurst active={burstActive} score={score} />

      {/* Score ring */}
      <div className="relative z-20">
        <div
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] transition-all duration-1000",
            revealed && score >= 85
              ? "border-amber-400/60 shadow-[0_0_40px_rgba(245,166,35,0.3)]"
              : revealed && score >= 70
              ? "border-violet-400/50 shadow-[0_0_30px_rgba(139,92,246,0.2)]"
              : "border-white/20"
          )}
        >
          {/* Animated glow background */}
          {revealed && score >= 70 && (
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl transition-opacity duration-1000",
              score >= 85 ? "bg-amber-500/20" : "bg-violet-500/15"
            )} />
          )}

          <span
            className={cn(
              "relative font-display text-5xl font-black tabular-nums transition-all duration-500",
              revealed && score >= 85
                ? "text-amber-300"
                : revealed && score >= 70
                ? "text-violet-300"
                : "text-white"
            )}
          >
            {displayScore}
          </span>
        </div>

        {/* Label */}
        <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Halo Score
        </p>
      </div>

      {/* Tier badge — fades in after reveal */}
      <div
        className={cn(
          "mt-4 z-20 rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-700",
          tier.bg, tier.color,
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}
      >
        {tier.label}
      </div>

      {/* Beat your best */}
      {revealed && delta !== null && (
        <p
          className={cn(
            "mt-3 text-sm font-medium transition-all duration-700 delay-300 z-20",
            revealed ? "opacity-100" : "opacity-0",
            isNewBest ? "text-emerald-400" : delta >= 0 ? "text-white/50" : "text-white/30"
          )}
        >
          {isNewBest
            ? `New personal best! +${delta} points`
            : delta >= 0
            ? `${delta === 0 ? "Matched" : `+${delta} from`} your best (${bestScore})`
            : `${delta} from your best (${bestScore})`
          }
        </p>
      )}

      {/* Preset context */}
      {revealed && presetName && (
        <p className="mt-1 text-xs text-white/20 z-20">
          {presetName} style
        </p>
      )}
    </div>
  );
}
