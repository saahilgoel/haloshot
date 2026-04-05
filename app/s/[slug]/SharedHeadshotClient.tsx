"use client";

import { motion } from "framer-motion";
import { ExternalLink, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SharedHeadshotPageProps {
  imageUrl: string;
  haloScore?: number;
  presetName?: string;
  creatorName: string;
}

export function SharedHeadshotPage({
  imageUrl,
  haloScore,
  presetName,
  creatorName,
}: SharedHeadshotPageProps) {
  const scoreColor =
    haloScore && haloScore >= 80
      ? "text-halo"
      : haloScore && haloScore >= 60
        ? "text-violet-400"
        : "text-white/60";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0a0a14] px-4 py-8">
      {/* Brand header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="mb-3 flex items-center justify-center gap-2">
          <Star className="h-5 w-5 text-halo" />
          <span className="font-display text-sm font-bold uppercase tracking-widest text-white/60">
            HaloShot
          </span>
        </div>
      </motion.div>

      {/* Headshot card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        {/* Ambient glow */}
        {haloScore && haloScore >= 75 && (
          <div className="absolute -inset-4 rounded-3xl bg-halo/10 blur-3xl" />
        )}

        <Card className="relative overflow-hidden border-2 border-white/10">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={imageUrl}
              alt={`${creatorName}'s headshot`}
              className="h-full w-full object-cover"
            />

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
              <div className="flex items-end justify-between">
                <div>
                  {presetName && (
                    <Badge
                      variant="secondary"
                      className="mb-2 bg-white/10 text-white/60 backdrop-blur-sm"
                    >
                      {presetName}
                    </Badge>
                  )}
                  <p className="text-sm text-white/50">by {creatorName}</p>
                </div>

                {/* Halo Score */}
                {haloScore && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-halo/40 bg-black/60 backdrop-blur-sm">
                      {/* Glow ring */}
                      <div className="absolute inset-0 rounded-full bg-halo/20 blur-md" />
                      <span
                        className={`relative font-display text-2xl font-black ${scoreColor}`}
                      >
                        {haloScore}
                      </span>
                    </div>
                    <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-halo/60">
                      Halo Score
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 w-full max-w-sm text-center"
      >
        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-950/40 to-transparent p-6">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-violet-400" />
          <h2 className="mb-1 font-display text-lg font-bold text-white">
            Get yours free
          </h2>
          <p className="mb-4 text-sm text-white/40">
            AI headshots that exploit the halo effect. Score your photo. Get a
            glow-up in 60 seconds.
          </p>
          <Button
            asChild
            className="w-full bg-violet-600 font-semibold hover:bg-violet-500"
          >
            <a href="https://haloshot.com" target="_blank" rel="noopener">
              Get your Halo Score
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </a>
          </Button>
        </Card>

        <p className="mt-4 text-xs text-white/20">
          Powered by HaloShot &mdash; The science of first impressions, perfected.
        </p>
      </motion.div>
    </div>
  );
}
