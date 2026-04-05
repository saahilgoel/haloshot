"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const transformations = [
  {
    style: "Corporate",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-violet-500 to-indigo-600",
  },
  {
    style: "LinkedIn",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-blue-500 to-cyan-600",
  },
  {
    style: "Creative",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-rose-500 to-pink-600",
  },
  {
    style: "Casual",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-amber-500 to-orange-600",
  },
  {
    style: "Executive",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-emerald-500 to-teal-600",
  },
  {
    style: "Dating",
    beforeGradient: "from-gray-400 to-gray-500",
    afterGradient: "from-fuchsia-500 to-purple-600",
  },
];

export function BeforeAfter() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {transformations.map((t, i) => (
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
                <span className="mt-4 text-xs font-medium text-white/60">
                  Selfie
                </span>
              </div>
            </div>

            {/* After side */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-500 group-hover:opacity-100",
                t.afterGradient
              )}
            >
              <div className="flex h-full flex-col items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-white/30 ring-2 ring-white/20" />
                <div className="mt-2 h-8 w-14 rounded-t-full bg-white/20" />
                <span className="mt-4 text-xs font-medium text-white/80">
                  AI Headshot
                </span>
              </div>
            </div>

            {/* Style badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm hover:bg-black/50 text-[11px]">
                {t.style}
              </Badge>
            </div>

            {/* Hover hint */}
            <div className="absolute left-3 top-3 z-10 rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium text-white/70 backdrop-blur-sm opacity-100 transition-opacity group-hover:opacity-0">
              Hover to reveal
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
