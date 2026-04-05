"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Image as ImageIcon,
  Trophy,
  TrendingUp,
  ArrowRight,
  Camera,
  BarChart3,
  Vote,
  Users,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// TODO: replace with real data from auth + database
const mockUser = { name: "Saahil" };

const mockHaloScore: number | null = 84;
const mockBestScore = 91;
const mockAvgGlowUp = 12;

const mockStats = {
  totalHeadshots: 24,
  bestHaloScore: mockBestScore,
  avgGlowUp: mockAvgGlowUp,
};

const mockRecentHeadshots: Array<{
  id: string;
  url: string;
  preset: string;
  haloScore?: number;
  date: string;
}> = [];

const mockActivePolls: Array<{
  id: string;
  photoAUrl: string;
  photoBUrl: string;
  totalVotes: number;
  leadingPhoto: "A" | "B";
  leadPct: number;
}> = [];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const stagger = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function DashboardPage() {
  const hasHeadshots = mockRecentHeadshots.length > 0;
  const hasScore = mockHaloScore !== null;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          {getGreeting()}, {mockUser.name}
        </h1>
        <p className="mt-1 text-white/40">
          Your first impression at a glance.
        </p>
      </motion.div>

      {/* Halo Score Hero */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={stagger}>
        {hasScore ? (
          <Card className="relative overflow-hidden border-halo/20">
            {/* Ambient glow */}
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-halo/8 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

            <CardContent className="relative flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                {/* Score ring */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-halo/20 blur-xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-halo/40 bg-black/40">
                    <div className="text-center">
                      <span className="font-display text-4xl font-black text-halo">
                        {mockHaloScore}
                      </span>
                    </div>
                  </div>
                  <span className="mt-1 block text-center text-[10px] font-bold uppercase tracking-widest text-halo/60">
                    Halo Score
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-white">
                    {mockHaloScore >= 80
                      ? "Strong first impression."
                      : mockHaloScore >= 60
                        ? "Room to improve."
                        : "Your photo is underselling you."}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {mockHaloScore >= 80
                      ? "You're making an above-average first impression. The halo effect is working for you."
                      : "Most people underestimate how much their photo matters. Let's fix that."}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="shrink-0 gap-2 border-halo/20 text-halo hover:bg-halo/10 hover:text-halo"
              >
                <RefreshCw className="h-4 w-4" />
                Re-score
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-transparent">
            <CardContent className="flex flex-col items-center p-8 text-center sm:flex-row sm:text-left sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-white">
                  You haven&apos;t been scored yet.
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  Brave? Or avoidant? Your photo is making a first impression
                  right now, whether you like it or not.
                </p>
              </div>
              <Button
                asChild
                className="mt-4 shrink-0 bg-violet-600 font-semibold hover:bg-violet-500 sm:mt-0"
              >
                <Link href="/score/public">
                  <Sparkles className="h-4 w-4" />
                  Get your Halo Score
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Headshots",
            value: mockStats.totalHeadshots,
            icon: ImageIcon,
            color: "text-violet-400",
          },
          {
            label: "Best Halo Score",
            value: mockStats.bestHaloScore,
            icon: Trophy,
            color: "text-halo",
          },
          {
            label: "Avg Glow-Up",
            value: `+${mockStats.avgGlowUp}`,
            icon: TrendingUp,
            color: "text-lime",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i + 1}
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <Card className="border-white/5 bg-white/[0.02]">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/40">{stat.label}</p>
                    <p className="font-display text-xl font-bold text-white">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Glow-Up CTA */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={stagger}>
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900">
          {/* Golden glow accent */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-halo/15 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-halo/10 blur-2xl" />

          <CardContent className="relative flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-white">
                Quick Glow-Up
              </h2>
              <p className="text-sm text-violet-200">
                Generate a headshot that scores higher than your current one. 60
                seconds. Science-backed.
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 bg-lime font-semibold text-black hover:bg-lime-300"
            >
              <Link href="/generate">
                <Sparkles className="h-4 w-4" />
                Glow Up Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Polls */}
      {mockActivePolls.length > 0 && (
        <motion.div custom={5} initial="hidden" animate="visible" variants={stagger}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white">
              Active Polls
            </h2>
            <Link
              href="/pick/new"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Create new
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {mockActivePolls.map((poll) => (
              <Card
                key={poll.id}
                className="overflow-hidden border-white/5 bg-white/[0.02]"
              >
                <CardContent className="p-4">
                  <div className="mb-3 flex gap-2">
                    <div className="relative h-16 w-12 overflow-hidden rounded-lg">
                      <img
                        src={poll.photoAUrl}
                        alt="Photo A"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="relative h-16 w-12 overflow-hidden rounded-lg">
                      <img
                        src={poll.photoBUrl}
                        alt="Photo B"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-sm text-white/50">
                        {poll.totalVotes} votes
                      </span>
                    </div>
                    <Badge className="bg-violet-500/10 text-violet-400">
                      Photo {poll.leadingPhoto} leads {poll.leadPct}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Help Me Pick CTA (when no active polls) */}
      {mockActivePolls.length === 0 && hasHeadshots && (
        <motion.div custom={5} initial="hidden" animate="visible" variants={stagger}>
          <Card className="border-dashed border-white/10 bg-white/[0.01]">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                <Vote className="h-6 w-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">
                  Can&apos;t decide which photo to use?
                </p>
                <p className="text-sm text-white/40">
                  Let your friends vote. Create a &ldquo;Help Me Pick&rdquo;
                  poll.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="shrink-0 gap-1.5 border-violet-500/30 text-violet-400 hover:bg-violet-500/10"
              >
                <Link href="/pick/new">
                  <Vote className="h-4 w-4" />
                  Create Poll
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent headshots */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Recent Headshots
          </h2>
          {hasHeadshots && (
            <Link
              href="/gallery"
              className="text-sm text-white/40 hover:text-white"
            >
              View all
            </Link>
          )}
        </div>

        {hasHeadshots ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {mockRecentHeadshots.slice(0, 8).map((headshot, i) => (
              <motion.div
                key={headshot.id}
                custom={i + 6}
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                <Card className="group overflow-hidden border-white/5 bg-white/[0.02]">
                  <div className="relative aspect-[3/4] bg-secondary">
                    <img
                      src={headshot.url}
                      alt="Headshot"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Halo Score badge */}
                    {headshot.haloScore && (
                      <div
                        className={cn(
                          "absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-bold backdrop-blur-sm",
                          headshot.haloScore >= 80
                            ? "bg-halo/20 text-halo shadow-[0_0_12px_rgba(245,166,35,0.3)]"
                            : headshot.haloScore >= 60
                              ? "bg-violet-500/20 text-violet-300"
                              : "bg-white/10 text-white/50"
                        )}
                      >
                        {headshot.haloScore}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex w-full items-center justify-between p-3">
                        <span className="rounded-full bg-violet-500/80 px-2 py-0.5 text-xs font-medium text-white">
                          {headshot.preset}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div custom={6} initial="hidden" animate="visible" variants={stagger}>
            <Card className="flex flex-col items-center justify-center border-dashed border-white/10 p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                <Camera className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">
                Your gallery is empty.
              </h3>
              <p className="mb-6 max-w-sm text-sm text-white/40">
                Your first impression shouldn&apos;t be.
              </p>
              <Button
                asChild
                className="bg-violet-600 hover:bg-violet-500"
              >
                <Link href="/generate">
                  <Sparkles className="h-4 w-4" />
                  Generate your first headshot
                </Link>
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
