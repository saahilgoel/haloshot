"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HaloScoreWidget } from "./HaloScoreWidget";
import { HaloBreakdown } from "./HaloBreakdown";
import { RoastLine } from "./RoastLine";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import type { HaloScoreResult } from "@/lib/ai/halo-score";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Phase = "scanning" | "revealing" | "breakdown" | "roast" | "complete";

interface HaloScoreRevealProps {
  photoUrl: string;
  result: HaloScoreResult;
  onGlowUp?: () => void;
  className?: string;
}

export function HaloScoreReveal({
  photoUrl,
  result,
  onGlowUp,
  className,
}: HaloScoreRevealProps) {
  const [phase, setPhase] = useState<Phase>("scanning");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("revealing"), 2400),
      setTimeout(() => setPhase("breakdown"), 4800),
      setTimeout(() => setPhase("roast"), 6600),
      setTimeout(() => setPhase("complete"), 8400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const phaseIndex = ["scanning", "revealing", "breakdown", "roast", "complete"].indexOf(phase);

  return (
    <div className={cn("flex flex-col items-center gap-8", className)}>
      {/* Photo with scanning overlay */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden">
        <img
          src={photoUrl}
          alt="Your photo"
          className="w-full h-full object-cover"
        />

        {/* Scanning animation */}
        <AnimatePresence>
          {phase === "scanning" && (
            <motion.div
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30" />

              {/* Scanning line */}
              <motion.div
                className="absolute left-0 right-0 h-1"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(245,166,35,0.8), transparent)",
                  boxShadow: "0 0 20px rgba(245,166,35,0.5)",
                }}
                animate={{
                  top: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(245,166,35,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.3) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Score overlay after scan */}
        {phaseIndex >= 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          />
        )}
      </div>

      {/* Scanning text */}
      <AnimatePresence mode="wait">
        {phase === "scanning" && (
          <motion.p
            key="scanning-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white/50 text-sm font-medium tracking-wide"
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              Analyzing your first impression...
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* Score reveal */}
      {phaseIndex >= 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <HaloScoreWidget
            score={result.overall_score}
            size="lg"
            animated={true}
          />
        </motion.div>
      )}

      {/* Analysis text */}
      {phaseIndex >= 1 && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="max-w-md text-center text-sm text-white/60 leading-relaxed"
        >
          {result.analysis_text}
        </motion.p>
      )}

      {/* Breakdown */}
      {phaseIndex >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <HaloBreakdown
            warmth={result.warmth_score}
            competence={result.competence_score}
            trustworthiness={result.trustworthiness_score}
            approachability={result.approachability_score}
            dominance={result.dominance_score}
            animated={true}
            delay={0.2}
          />
        </motion.div>
      )}

      {/* Roast line */}
      {phaseIndex >= 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md"
        >
          <RoastLine text={result.roast_line} animated={true} delay={0.3} />
        </motion.div>
      )}

      {/* CTA */}
      {phase === "complete" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          {onGlowUp ? (
            <Button
              onClick={onGlowUp}
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-8 h-12 text-base shadow-[0_0_20px_rgba(108,60,224,0.3)]"
            >
              <Sparkles className="h-5 w-5" />
              Ready for a glow-up?
            </Button>
          ) : (
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-8 h-12 text-base shadow-[0_0_20px_rgba(108,60,224,0.3)]"
            >
              <Link href="/generate">
                <Sparkles className="h-5 w-5" />
                Ready for a glow-up?
              </Link>
            </Button>
          )}
          <p className="text-xs text-white/30">
            AI-generated headshots that boost your score
          </p>
        </motion.div>
      )}
    </div>
  );
}
