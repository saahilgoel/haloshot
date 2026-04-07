"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Image as ImageIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHaloScore } from "@/lib/hooks/useHaloScore";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function HeroScoreWidget() {
  const { analyzeFile, isAnalyzing, score, error, reset } = useHaloScore();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
      if (file.size > 10 * 1024 * 1024) return;
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
      try {
        await analyzeFile(file);
      } catch {
        // handled by hook
      }
    },
    [analyzeFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleReset = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
    reset();
  };

  return (
    <div className="relative flex flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-surface/80 backdrop-blur-sm overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-r from-violet-600/10 via-halo-500/15 to-violet-600/10 blur-2xl" />

      <AnimatePresence mode="wait">
        {!photoPreview ? (
          /* Upload state */
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full p-8 sm:p-10"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-10 cursor-pointer transition-all duration-300",
                isDragging
                  ? "border-halo-500/60 bg-halo-500/[0.06] scale-[1.02]"
                  : "border-white/10 hover:border-halo-500/30 hover:bg-white/[0.03]"
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-halo-500/10">
                <Upload className="h-7 w-7 text-halo-400" />
              </div>
              <p className="mt-4 text-base font-medium text-white">
                Drop your photo here
              </p>
              <p className="mt-1 text-sm text-white/40">
                Get your free Halo Score instantly
              </p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                >
                  <ImageIcon className="h-4 w-4" />
                  Choose Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.capture = "user";
                    input.onchange = (ev) => {
                      const target = ev.target as HTMLInputElement;
                      const file = target.files?.[0];
                      if (file) handleFile(file);
                    };
                    input.click();
                  }}
                >
                  <Camera className="h-4 w-4" />
                  Selfie
                </Button>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              No signup required. JPG, PNG, or WebP up to 10MB.
            </p>
          </motion.div>
        ) : score ? (
          /* Score reveal */
          <motion.div
            key="score"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full p-8 sm:p-10"
          >
            <div className="flex flex-col items-center">
              {/* Photo + score ring */}
              <div className="relative">
                <div className="absolute -inset-3 rounded-full bg-halo-500/20 blur-xl" />
                <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-halo-500/60">
                  <img src={photoPreview} alt="Your photo" className="h-full w-full object-cover" />
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-halo-500 text-lg font-bold text-gray-900 shadow-lg shadow-halo-500/30"
                >
                  {score.overall_score}
                </motion.div>
              </div>

              {/* Dimension breakdown */}
              <div className="mt-6 w-full space-y-2.5">
                {[
                  { label: "Warmth", value: score.warmth_score },
                  { label: "Competence", value: score.competence_score },
                  { label: "Trustworthiness", value: score.trustworthiness_score },
                ].map((dim, i) => (
                  <div key={dim.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{dim.label}</span>
                      <span className="font-mono text-sm font-medium">{dim.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.value}%` }}
                        transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-halo-500 to-halo-400"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-6 flex flex-col items-center gap-3 w-full"
              >
                <Link
                  href="/signup"
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-halo-500 text-sm font-semibold text-gray-900 transition-all hover:bg-halo-400"
                >
                  Want the glow-up? Get your AI headshots
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  onClick={handleReset}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  Try another photo
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Analyzing state */
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex w-full flex-col items-center p-8 sm:p-10"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/10">
              <img src={photoPreview} alt="Your photo" className="h-full w-full object-cover" />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/30">
                  <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(245,166,35,0.8), transparent)",
                      boxShadow: "0 0 15px rgba(245,166,35,0.5)",
                    }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              )}
            </div>

            {isAnalyzing && (
              <p className="mt-5 text-sm text-white/50 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-halo-400 animate-pulse" />
                Analyzing your first impression...
              </p>
            )}

            {error && (
              <div className="mt-5 text-center space-y-3">
                <p className="text-red-400 text-sm">{error}</p>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Try Again
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
