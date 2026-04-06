"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface GenerationProgressProps {
  status: "queued" | "processing" | "completed" | "failed" | "canceled";
  presetName: string;
  numImages: number;
  modelName?: "studio" | "fast" | "quick";
  completedCount?: number;
}

const steps = [
  { key: "analyzing", label: "Analyzing your photos", duration: 5 },
  { key: "composing", label: "Composing the perfect shot", duration: 15 },
  { key: "generating", label: "Generating headshots", duration: 40 },
  { key: "enhancing", label: "Enhancing details", duration: 15 },
  { key: "scoring", label: "Quality check & scoring", duration: 10 },
  { key: "finalizing", label: "Finalizing your headshots", duration: 5 },
];

const tips = [
  "Pro tip: Upload 3-5 photos for the most accurate results",
  "Your headshots are optimized for identity preservation",
  "High-res versions available for Pro subscribers",
  "Each image is scored for facial similarity",
  "Try different styles to find your perfect look",
];

export function GenerationProgress({ status, presetName, numImages, modelName = "studio", completedCount = 0 }: GenerationProgressProps) {
  const [elapsed, setElapsed] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (status === "processing" || status === "queued") {
      const timer = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(i => (i + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate which step we're on based on elapsed time
  let accumulated = 0;
  let currentStepIndex = 0;
  for (let i = 0; i < steps.length; i++) {
    accumulated += steps[i].duration;
    if (elapsed < accumulated) {
      currentStepIndex = i;
      break;
    }
    if (i === steps.length - 1) currentStepIndex = steps.length - 1;
  }

  const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
  const progress = status === "completed" ? 100 : Math.min((elapsed / totalDuration) * 100, 95);

  if (status === "completed") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        >
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </motion.div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Your headshots are ready!</h3>
          <p className="text-white/50 mt-1">{numImages} headshots generated with {presetName}</p>
        </div>
      </motion.div>
    );
  }

  if (status === "failed") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <XCircle className="h-16 w-16 text-red-400" />
        <div>
          <h3 className="text-xl font-display font-bold text-white">Generation failed</h3>
          <p className="text-white/50 mt-1">Something went wrong. Please try again.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Main animation */}
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl bg-violet-500/30 blur-xl"
          />
        </motion.div>

        <div className="text-center">
          <h3 className="text-lg font-display font-bold text-white">
            Creating your {presetName} headshots
          </h3>
          <p className="text-sm text-violet-400 mt-1 font-medium">
            Generating with {modelName === "studio" ? "Studio Quality" : modelName === "fast" ? "Fast Mode" : "Flux"}
          </p>
          <p className="text-sm text-white/40 mt-0.5">
            {completedCount > 0
              ? `${completedCount} of ${numImages} headshots ready`
              : `Generating ${numImages} variations`}
            {" \u2014 "}
            {modelName === "studio"
              ? "Usually takes 2-5 minutes for all shots"
              : modelName === "fast"
              ? "Usually takes 1-2 minutes"
              : "Usually takes 30-90 seconds"}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-white/40">
          <span>{Math.round(progress)}%</span>
          <span>{elapsed}s elapsed</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
              index < currentStepIndex
                ? "text-emerald-400"
                : index === currentStepIndex
                ? "text-white bg-white/5"
                : "text-white/20"
            )}
          >
            {index < currentStepIndex ? (
              <CheckCircle className="h-4 w-4 shrink-0" />
            ) : index === currentStepIndex ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-full border border-current" />
            )}
            {step.label}
          </motion.div>
        ))}
      </div>

      {/* Rotating tips */}
      <motion.div
        key={tipIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-center text-xs text-white/30 italic"
      >
        {tips[tipIndex]}
      </motion.div>
    </div>
  );
}
