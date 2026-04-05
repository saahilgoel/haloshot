"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VotePhoto {
  id: string;
  url: string;
  label: string;
}

interface VotePageProps {
  creatorName: string;
  photoA: VotePhoto;
  photoB: VotePhoto;
  initialVotes?: { a: number; b: number };
  onVote?: (photoId: string) => void;
}

function ConfettiParticle({ delay, color, x, rotation }: { delay: number; color: string; x: number; rotation: number }) {

  return (
    <motion.div
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [0, -80, 300],
        x: [0, x * 0.5, x],
        opacity: [1, 1, 0],
        rotate: rotation,
        scale: [1, 1.2, 0.5],
      }}
      transition={{ duration: 1.8, delay, ease: "easeOut" }}
      className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-sm"
      style={{ backgroundColor: color }}
    />
  );
}

export function VotePage({
  creatorName,
  photoA,
  photoB,
  initialVotes = { a: 0, b: 0 },
  onVote,
}: VotePageProps) {
  const [voted, setVoted] = useState<string | null>(null);
  const [votes, setVotes] = useState(initialVotes);
  const [showConfetti, setShowConfetti] = useState(false);

  const confettiPieces = useMemo(() => {
    const colors = ["#6C3CE0", "#C5F536", "#F5A623", "#fff"];
    return Array.from({ length: 40 }).map((_, i) => ({
      color: colors[Math.floor(Math.random() * colors.length)],
      x: Math.random() * 200 - 100,
      rotation: Math.random() * 720 - 360,
    }));
  }, []);

  const total = votes.a + votes.b;
  const pctA = total > 0 ? Math.round((votes.a / total) * 100) : 50;
  const pctB = total > 0 ? Math.round((votes.b / total) * 100) : 50;
  const isDecisive = pctA > 70 || pctB > 70;

  const handleVote = (photoId: string) => {
    if (voted) return;
    setVoted(photoId);
    setVotes((prev) => ({
      a: photoId === photoA.id ? prev.a + 1 : prev.a,
      b: photoId === photoB.id ? prev.b + 1 : prev.b,
    }));
    onVote?.(photoId);
  };

  useEffect(() => {
    if (voted && isDecisive) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [voted, isDecisive]);

  return (
    <div className="relative min-h-dvh bg-[#0a0a14] px-4 py-8 sm:py-16">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
            {confettiPieces.map((piece, i) => (
              <ConfettiParticle key={i} delay={i * 0.04} color={piece.color} x={piece.x} rotation={piece.rotation} />
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center sm:mb-12"
        >
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-violet-400">
            HaloShot
          </p>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Help {creatorName} pick their best first impression
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {voted ? "Results are in." : "Tap the photo that makes a better first impression."}
          </p>
        </motion.div>

        {/* Photo cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          {[
            { photo: photoA, pct: pctA, voteKey: "a" as const },
            { photo: photoB, pct: pctB, voteKey: "b" as const },
          ].map(({ photo, pct, voteKey }, idx) => {
            const isChosen = voted === photo.id;
            const isOther = voted !== null && !isChosen;

            return (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
              >
                <button
                  onClick={() => handleVote(photo.id)}
                  disabled={!!voted}
                  className="group relative w-full text-left"
                >
                  <Card
                    className={cn(
                      "relative overflow-hidden border-2 transition-all duration-300",
                      !voted && "border-white/10 hover:border-violet-500/60",
                      isChosen && "border-violet-500 shadow-[0_0_30px_rgba(108,60,224,0.3)]",
                      isOther && "border-white/5 opacity-75"
                    )}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                      <img
                        src={photo.url}
                        alt={photo.label}
                        className={cn(
                          "h-full w-full object-cover transition-transform duration-500",
                          !voted && "group-hover:scale-[1.03]"
                        )}
                      />

                      {/* Hover glow */}
                      {!voted && (
                        <div className="absolute inset-0 bg-violet-500/0 transition-colors duration-300 group-hover:bg-violet-500/10" />
                      )}

                      {/* Vote result overlay */}
                      <AnimatePresence>
                        {voted && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6"
                          >
                            {/* Percentage */}
                            <motion.span
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                              className="mb-3 font-display text-5xl font-black text-white"
                            >
                              {pct}%
                            </motion.span>

                            {/* Progress bar */}
                            <div className="mb-3 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                className={cn(
                                  "h-full rounded-full",
                                  isChosen ? "bg-violet-500" : "bg-white/30"
                                )}
                              />
                            </div>

                            <p className="text-xs text-white/50">
                              {votes[voteKey]} {votes[voteKey] === 1 ? "vote" : "votes"}
                            </p>

                            {/* Checkmark on chosen */}
                            {isChosen && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 shadow-lg"
                              >
                                <Check className="h-5 w-5 text-white" />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Label */}
                    <div className="bg-white/[0.03] px-4 py-3">
                      <span className="text-sm font-medium text-white/60">
                        {photo.label}
                      </span>
                    </div>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Post-vote message */}
        <AnimatePresence>
          {voted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-10 text-center"
            >
              <p className="mb-6 text-sm text-white/50">
                Thanks for voting. {total + 1} people have weighed in.
              </p>

              {/* CTA */}
              <Card className="mx-auto max-w-md border-violet-500/20 bg-gradient-to-br from-violet-950/50 to-violet-900/20 p-6">
                <p className="mb-1 font-display text-lg font-bold text-white">
                  Think you can do better?
                </p>
                <p className="mb-4 text-sm text-white/50">
                  Get your Halo Score free. Find out what your photo is really
                  saying about you.
                </p>
                <Button
                  asChild
                  className="w-full bg-violet-600 font-semibold hover:bg-violet-500"
                >
                  <a href="https://haloshot.com" target="_blank" rel="noopener">
                    Get your Halo Score free
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
