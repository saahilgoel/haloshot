"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CTABanner } from "@/components/marketing/CTABanner";

const categories = [
  "All",
  "Corporate",
  "LinkedIn",
  "Creative",
  "Casual",
  "Dating",
  "Real Estate",
  "Executive",
];

const examples = [
  { style: "Corporate", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-violet-500 to-indigo-600", label: "Marketing Manager" },
  { style: "LinkedIn", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-blue-500 to-cyan-600", label: "Software Engineer" },
  { style: "Creative", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-rose-500 to-pink-600", label: "Graphic Designer" },
  { style: "Casual", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-amber-500 to-orange-600", label: "Freelancer" },
  { style: "Dating", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-fuchsia-500 to-purple-600", label: "Profile Photo" },
  { style: "Real Estate", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-emerald-500 to-teal-600", label: "Listing Agent" },
  { style: "Executive", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-slate-600 to-zinc-700", label: "CEO" },
  { style: "Corporate", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-violet-600 to-purple-700", label: "Consultant" },
  { style: "LinkedIn", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-sky-500 to-blue-600", label: "Product Manager" },
  { style: "Creative", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-pink-500 to-red-600", label: "Photographer" },
  { style: "Casual", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-yellow-500 to-amber-600", label: "Content Creator" },
  { style: "Dating", beforeGradient: "from-gray-400 to-gray-500", afterGradient: "from-purple-500 to-violet-600", label: "Natural Look" },
];

export default function ExamplesPage() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? examples : examples.filter((e) => e.style === filter);

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden pb-8 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Example transformations
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Browse real before/after transformations across every style.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all",
                filter === cat
                  ? "bg-violet-600 text-white"
                  : "border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((ex, i) => (
              <motion.div
                key={`${ex.style}-${ex.label}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06]"
              >
                <div className="relative aspect-[3/4]">
                  {/* Before */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br transition-all duration-500 group-hover:opacity-0",
                      ex.beforeGradient
                    )}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-white/20" />
                      <div className="mt-2 h-8 w-12 rounded-t-full bg-white/15" />
                      <span className="mt-4 text-xs text-white/50">Selfie</span>
                    </div>
                  </div>

                  {/* After */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-all duration-500 group-hover:opacity-100",
                      ex.afterGradient
                    )}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="h-20 w-20 rounded-full bg-white/30 ring-2 ring-white/20" />
                      <div className="mt-2 h-10 w-16 rounded-t-full bg-white/20" />
                      <span className="mt-4 text-xs text-white/70">Headshot</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 z-10">
                    <Badge className="bg-black/50 text-white border-0 backdrop-blur-sm hover:bg-black/50 text-[11px]">
                      {ex.style}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="text-[11px] text-white/60">{ex.label}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <CTABanner />
    </>
  );
}
