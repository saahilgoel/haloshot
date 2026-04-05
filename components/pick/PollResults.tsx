"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Share2, Trophy, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PollPhoto {
  id: string;
  url: string;
  label: string;
  haloScore?: number;
}

interface PollResultsProps {
  photoA: PollPhoto;
  photoB: PollPhoto;
  votesA: number;
  votesB: number;
  onShare?: () => void;
}

export function PollResults({
  photoA,
  photoB,
  votesA,
  votesB,
  onShare,
}: PollResultsProps) {
  const [animated, setAnimated] = useState(false);
  const total = votesA + votesB;
  const pctA = total > 0 ? Math.round((votesA / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((votesB / total) * 100) : 50;
  const margin = Math.abs(pctA - pctB);
  const winner = pctA > pctB ? "A" : pctA < pctB ? "B" : null;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderPhotoCard = (
    photo: PollPhoto,
    pct: number,
    votes: number,
    label: "A" | "B",
    isWinner: boolean,
    idx: number
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.15, duration: 0.5 }}
      className="relative"
    >
      <Card
        className={cn(
          "overflow-hidden border-2 transition-all",
          isWinner
            ? "border-halo/50 shadow-[0_0_40px_rgba(245,166,35,0.15)]"
            : "border-white/10"
        )}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={photo.url}
            alt={photo.label}
            className="h-full w-full object-cover"
          />

          {/* Winner badge */}
          {isWinner && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute left-3 top-3"
            >
              <Badge className="gap-1 bg-halo px-2.5 py-1 text-xs font-bold text-black">
                <Trophy className="h-3 w-3" />
                Winner
              </Badge>
            </motion.div>
          )}

          {/* Halo Score overlay */}
          {photo.haloScore && (
            <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
              <span className="text-xs font-bold text-halo">
                {photo.haloScore}
              </span>
              <span className="ml-1 text-[10px] text-white/40">Halo</span>
            </div>
          )}

          {/* Percentage overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-end justify-between"
            >
              <div>
                <span className="font-display text-4xl font-black text-white">
                  {animated ? pct : 0}%
                </span>
                <p className="mt-0.5 text-xs text-white/50">
                  {votes} {votes === 1 ? "vote" : "votes"}
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-sm">
                Photo {label}
              </span>
            </motion.div>

            {/* Progress bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full",
                  isWinner
                    ? "bg-gradient-to-r from-halo to-halo-300"
                    : "bg-violet-500/60"
                )}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10">
            <Users className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {total} {total === 1 ? "vote" : "votes"} total
            </p>
            {winner && (
              <p className="text-xs text-white/50">
                Photo {winner} is winning by {margin}%
              </p>
            )}
            {!winner && total > 0 && (
              <p className="text-xs text-white/50">It&apos;s a tie</p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="gap-1.5 border-white/10 text-white/60 hover:text-white"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share results
        </Button>
      </motion.div>

      {/* Photo cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {renderPhotoCard(photoA, pctA, votesA, "A", winner === "A", 0)}
        {renderPhotoCard(photoB, pctB, votesB, "B", winner === "B", 1)}
      </div>

      {/* Insight card */}
      {total >= 5 && margin > 20 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="border-lime/20 bg-lime/5 p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
              <div>
                <p className="text-sm font-medium text-white">
                  Clear winner detected
                </p>
                <p className="mt-0.5 text-xs text-white/50">
                  Photo {winner} is the stronger first impression with a{" "}
                  {margin}% lead. The crowd has spoken.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
