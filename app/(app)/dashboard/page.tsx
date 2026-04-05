"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Crown,
  ArrowRight,
  Download,
  Camera,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// TODO: replace with real data from auth + database
const mockUser = { name: "Saahil" };
const mockStats = {
  totalHeadshots: 24,
  thisMonth: 8,
  favorites: 5,
  plan: "Pro",
};
const mockRecentHeadshots: Array<{
  id: string;
  url: string;
  preset: string;
  date: string;
}> = [
  // Empty for now -- will be populated from Supabase
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const stats = [
  {
    label: "Total Headshots",
    value: mockStats.totalHeadshots,
    icon: ImageIcon,
    color: "text-violet-400",
  },
  {
    label: "This Month",
    value: mockStats.thisMonth,
    icon: Camera,
    color: "text-lime-400",
  },
  {
    label: "Favorites",
    value: mockStats.favorites,
    icon: Heart,
    color: "text-pink-400",
  },
  {
    label: "Subscription",
    value: mockStats.plan,
    icon: Crown,
    color: "text-amber-400",
  },
];

export default function DashboardPage() {
  const hasHeadshots = mockRecentHeadshots.length > 0;

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
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening with your headshots.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Generate CTA */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-white">
                Quick Generate
              </h2>
              <p className="text-sm text-violet-200">
                Create a new professional headshot in under 60 seconds.
              </p>
            </div>
            <Button
              asChild
              className="shrink-0 bg-lime-400 font-semibold text-black hover:bg-lime-300"
            >
              <Link href="/generate">
                <Sparkles className="h-4 w-4" />
                Generate Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent headshots or empty state */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Recent Headshots
          </h2>
          {hasHeadshots && (
            <Link
              href="/gallery"
              className="text-sm text-muted-foreground hover:text-foreground"
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
                custom={i + 5}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Card className="group overflow-hidden">
                  <div className="relative aspect-[3/4] bg-secondary">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={headshot.url}
                      alt="Headshot"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex w-full items-center justify-between p-3">
                        <span className="rounded-full bg-violet-500/80 px-2 py-0.5 text-xs font-medium text-white">
                          {headshot.preset}
                        </span>
                        <button className="rounded-full bg-white/20 p-1.5 backdrop-blur-sm hover:bg-white/30">
                          <Download className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10">
                <Camera className="h-8 w-8 text-violet-400" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold">
                No headshots yet
              </h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Upload a few selfies and let our AI create stunning professional
                headshots for you.
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
