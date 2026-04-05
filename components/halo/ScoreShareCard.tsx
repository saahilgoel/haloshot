"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { HaloScoreWidget } from "./HaloScoreWidget";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScoreShareCardProps {
  score: number;
  roastLine: string;
  expressionType?: string;
  professionalReadiness?: string;
  className?: string;
}

export function ScoreShareCard({
  score,
  roastLine,
  expressionType,
  professionalReadiness,
  className,
}: ScoreShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) return;

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Halo Score: ${score}`,
          text: `${roastLine}\n\nGet your Halo Score free at haloshot.com`,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share not supported, fall through
      }
    }

    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(
        `My Halo Score: ${score}/100\n\n"${roastLine}"\n\nGet your Halo Score free at haloshot.com`
      );
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* The card itself */}
      <div
        ref={cardRef}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0A0A0F] p-8"
        style={{
          boxShadow:
            score >= 70
              ? "0 0 40px rgba(245, 166, 35, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)"
              : "inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(108, 60, 224, 0.15), transparent 70%)",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center">
              <span className="text-xs font-bold text-white">H</span>
            </div>
            <span className="text-sm font-display font-semibold text-white/70">
              HaloShot
            </span>
          </div>

          {/* Score */}
          <HaloScoreWidget score={score} size="lg" animated={false} />

          {/* Meta tags */}
          {(expressionType || professionalReadiness) && (
            <div className="flex flex-wrap justify-center gap-2">
              {expressionType && (
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/50">
                  {expressionType}
                </span>
              )}
              {professionalReadiness && (
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-white/50">
                  {professionalReadiness}
                </span>
              )}
            </div>
          )}

          {/* Roast line */}
          <p className="text-center text-sm italic text-white/60 leading-relaxed px-2">
            &ldquo;{roastLine}&rdquo;
          </p>

          {/* Separator */}
          <div className="w-12 h-px bg-white/10" />

          {/* CTA */}
          <p className="text-xs text-white/30">
            Get your Halo Score free &rarr;{" "}
            <span className="text-violet-400/60">haloshot.com</span>
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
