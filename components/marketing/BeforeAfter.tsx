"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const transformations = [
  {
    style: "Corporate",
    beforeScore: 34,
    afterScore: 87,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-violet-500 to-indigo-600",
  },
  {
    style: "LinkedIn",
    beforeScore: 41,
    afterScore: 89,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-blue-500 to-cyan-600",
  },
  {
    style: "Creative",
    beforeScore: 52,
    afterScore: 91,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-rose-500 to-pink-600",
  },
  {
    style: "Casual",
    beforeScore: 38,
    afterScore: 82,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-amber-500 to-orange-600",
  },
  {
    style: "Executive",
    beforeScore: 45,
    afterScore: 93,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-emerald-500 to-teal-600",
  },
  {
    style: "Dating",
    beforeScore: 29,
    afterScore: 78,
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-fuchsia-500 to-purple-600",
  },
];

export function BeforeAfter() {
  return (
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
                  <div className="h-16 w-16 rounded-full bg-white/20" />
                  <div className="mt-2 h-6 w-10 rounded-t-full bg-white/15" />
                  {/* Before score */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-white/70">{t.beforeScore}</span>
                    <span className="text-xs text-white/40">Halo Score</span>
                  </div>
                </div>
              </div>

              {/* After side */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-500 group-hover:opacity-100",
                  t.afterGradient
                )}
              >
                {/* Golden glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-halo-500/20 to-transparent" />
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-halo-500/30 blur-md" />
                    <div className="relative h-16 w-16 rounded-full bg-white/30 ring-2 ring-halo-400/40" />
                  </div>
                  <div className="mt-2 h-8 w-14 rounded-t-full bg-white/20" />
                  {/* After score */}
                  <div className="mt-4 flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-white">{t.afterScore}</span>
                    <span className="text-xs text-white/70">Halo Score</span>
                  </div>
                </div>
              </div>

              {/* Delta badge - always visible */}
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
  );
}
