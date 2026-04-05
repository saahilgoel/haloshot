"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HaloScoreReveal } from "@/components/halo/HaloScoreReveal";
import { useHaloScore } from "@/lib/hooks/useHaloScore";
import { cn } from "@/lib/utils";

export default function ScorePage() {
  const { analyzeFile, analyzePhoto, isAnalyzing, score, error, reset } =
    useHaloScore();
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
        // Error state handled by hook
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
    <div className="flex flex-col items-center py-8 md:py-16">
      <AnimatePresence mode="wait">
        {!photoPreview ? (
          /* Upload state */
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8 w-full max-w-lg"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                Your Halo Score
              </h1>
              <p className="text-white/50 text-lg max-w-md">
                Let&apos;s see what your face is telling the world.
              </p>
            </div>

            {/* Upload zone */}
            <motion.div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 md:p-14 cursor-pointer transition-all duration-300 w-full",
                isDragging
                  ? "border-amber-500/60 bg-amber-500/[0.06] scale-[1.02]"
                  : "border-white/10 bg-white/[0.02] hover:border-amber-500/30 hover:bg-white/[0.04]"
              )}
              whileHover={{ scale: 1.01 }}
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

              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Upload className="h-8 w-8 text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">
                    Drop your photo here
                  </p>
                  <p className="text-sm text-white/40 mt-1">
                    JPG, PNG, or WebP up to 10MB
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      inputRef.current?.click();
                    }}
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
                    Take Selfie
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* LinkedIn placeholder */}
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 w-full opacity-50">
              <LinkIcon className="h-4 w-4 text-white/30" />
              <span className="text-sm text-white/30">
                Paste LinkedIn URL &mdash; coming soon
              </span>
            </div>
          </motion.div>
        ) : score ? (
          /* Score reveal */
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 w-full max-w-lg"
          >
            <HaloScoreReveal
              photoUrl={photoPreview}
              result={score}
            />

            {/* Share + retry */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 9 }}
              className="flex gap-3 mt-4"
            >
              {score.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (score.id) {
                      window.open(`/score/${score.id}`, "_blank");
                    }
                  }}
                >
                  View Full Report
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Try Another Photo
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          /* Loading / error state */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden">
              <img
                src={photoPreview}
                alt="Your photo"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.div
                    className="absolute left-0 right-0 h-1"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(245,166,35,0.8), transparent)",
                      boxShadow: "0 0 20px rgba(245,166,35,0.5)",
                    }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              )}
            </div>

            {isAnalyzing && (
              <p className="text-white/50 text-sm flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                Analyzing your first impression...
              </p>
            )}

            {error && (
              <div className="text-center space-y-3">
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
