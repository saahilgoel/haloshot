"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroScoreWidget } from "./HeroScoreWidget";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-12 sm:pt-20 lg:pt-28">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[500px] rounded-full bg-halo-500/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-halo-400/30 bg-halo-400/10 px-4 py-1.5 text-sm font-medium text-halo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-halo-400 animate-pulse" />
                Powered by the halo effect
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your photo is making a first impression{" "}
              <span className="bg-gradient-to-r from-violet-400 via-halo-400 to-halo-300 bg-clip-text text-transparent">
                without you.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              AI headshots that exploit the halo effect. 60 seconds. $9.99/month.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link
                href="/score"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-halo-500 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400 hover:shadow-lg hover:shadow-halo-500/25"
              >
                Score your current photo free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/science"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-white transition-all hover:bg-white/10"
              >
                The science behind it
              </Link>
            </motion.div>

            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
            >
              {[
                { value: "100ms", label: "First impression" },
                { value: "21x", label: "More profile views" },
                { value: "89%", label: "Hiring managers care" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-xl font-bold text-halo-400">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Interactive Score Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <HeroScoreWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
