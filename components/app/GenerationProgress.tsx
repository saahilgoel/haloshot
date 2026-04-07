"use client";

import { useEffect, useState } from "react";
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
  // Use real image count for progress when available, fake time-based otherwise
  const imageProgress = completedCount > 0 ? (completedCount / numImages) * 100 : 0;
  const timeProgress = Math.min((elapsed / totalDuration) * 100, 95);
  const progress = status === "completed" ? 100 : Math.max(imageProgress, timeProgress);

  if (status === "completed") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div>
          <CheckCircle className="h-16 w-16 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Your headshots are ready!</h3>
          <p className="text-white/50 mt-1">{numImages} headshots generated with {presetName}</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center animate-in fade-in duration-300">
        <XCircle className="h-16 w-16 text-red-400" />
        <div>
          <h3 className="text-xl font-display font-bold text-white">Generation failed</h3>
          <p className="text-white/50 mt-1">Something went wrong. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Main animation */}
      <div className="flex flex-col items-center gap-6">
        <div className="relative animate-spin" style={{ animationDuration: "3s" }}>
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div className="absolute inset-0 rounded-3xl bg-violet-500/30 blur-xl animate-pulse" />
        </div>

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
          <div
            key={step.key}
            className={cn(
              "animate-in fade-in slide-in-from-left-2 duration-300",
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
          </div>
        ))}
      </div>

      {/* Rotating tips */}
      <div
        key={tipIndex}
        className="text-center text-xs text-white/30 italic animate-in fade-in duration-300"
      >
        {tips[tipIndex]}
      </div>
    </div>
  );
}
