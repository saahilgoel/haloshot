"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const transformations = [
  {
    style: "Corporate",
    name: "Software Engineer, 28",
    beforeScore: 34,
    afterScore: 87,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-violet-500 to-indigo-600",
    beforeEmoji: "👨‍💻",
    afterEmoji: "👔",
  },
  {
    style: "LinkedIn",
    name: "Marketing Director, 35",
    beforeScore: 41,
    afterScore: 89,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-blue-500 to-cyan-600",
    beforeEmoji: "👩",
    afterEmoji: "💼",
  },
  {
    style: "Creative",
    name: "Designer, 26",
    beforeScore: 52,
    afterScore: 91,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-rose-500 to-pink-600",
    beforeEmoji: "🧑‍🎨",
    afterEmoji: "✨",
  },
  {
    style: "Executive",
    name: "VP of Sales, 42",
    beforeScore: 38,
    afterScore: 93,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-emerald-500 to-teal-600",
    beforeEmoji: "👨‍💼",
    afterEmoji: "🏆",
  },
  {
    style: "Founder",
    name: "Startup CEO, 31",
    beforeScore: 45,
    afterScore: 88,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-amber-500 to-orange-600",
    beforeEmoji: "🧑‍💻",
    afterEmoji: "🚀",
  },
  {
    style: "Dating",
    name: "Product Manager, 29",
    beforeScore: 29,
    afterScore: 78,
    beforeGradient: "from-slate-500 to-gray-600",
    afterGradient: "from-fuchsia-500 to-purple-600",
    beforeEmoji: "👩‍🦱",
    afterEmoji: "💜",
  },
];

export function BeforeAfter() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {transformations.map((t, i) => {
          const delta = t.afterScore - t.beforeScore;
          return (
            <motion.div
              key={t.style}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06]"
            >
              <div className="relative aspect-[4/3]">
                {/* Before side */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-all duration-500 group-hover:opacity-0",
                    t.beforeGradient
                  )}
                >
                  <div className="flex h-full flex-col items-center justify-center">
                    {/* Silhouette placeholder */}
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/10">
                        <span className="text-3xl opacity-60">{t.beforeEmoji}</span>
                      </div>
                    </div>
                    {/* Before score */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-mono text-2xl font-bold text-white/70">{t.beforeScore}</span>
                      <span className="text-xs text-white/40">Halo Score</span>
                    </div>
                    {/* Name tag */}
                    <span className="mt-2 text-[11px] text-white/30">{t.name}</span>
                  </div>
                </div>

                {/* After side */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-500 group-hover:opacity-100",
                    t.afterGradient
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-halo-500/20 to-transparent" />
                  <div className="flex h-full flex-col items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-3 rounded-full bg-halo-500/30 blur-md" />
                      <div className="relative h-20 w-20 rounded-full bg-white/20 ring-2 ring-halo-400/40 flex items-center justify-center border-2 border-white/20">
                        <span className="text-3xl">{t.afterEmoji}</span>
                      </div>
                    </div>
                    {/* After score */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="font-mono text-2xl font-bold text-white">{t.afterScore}</span>
                      <span className="text-xs text-white/70">Halo Score</span>
                    </div>
                    <span className="mt-2 text-[11px] text-white/50">{t.name}</span>
                  </div>
                </div>

                {/* Delta badge - shows on hover */}
                <div className="absolute right-3 top-3 z-10 rounded-lg bg-lime-400/90 px-2.5 py-1 text-xs font-bold text-gray-900 opacity-0 transition-opacity group-hover:opacity-100">
                  +{delta} glow-up
                </div>

                {/* Style badge */}
                <div className="absolute bottom-3 left-3 z-10 rounded-md bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  {t.style}
                </div>

                {/* Hover hint */}
                <div className="absolute left-3 top-3 z-10 rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm opacity-100 transition-opacity group-hover:opacity-0">
                  Hover to glow up
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Simulated examples showing typical score improvements. Scores vary based on photo quality, lighting, and composition.
      </p>
    </div>
  );
}
