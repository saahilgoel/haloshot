"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Briefcase, TrendingUp, Eye, UserCheck } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";
import { Testimonials } from "@/components/marketing/Testimonials";

const stats = [
  { icon: Eye, value: "14x", label: "More profile views with a professional photo" },
  { icon: TrendingUp, value: "36%", label: "Higher response rate from recruiters" },
  { icon: UserCheck, value: "71%", label: "Of hiring managers check LinkedIn photos" },
];

export default function LinkedInPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-blue-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm font-medium text-blue-300"
            >
              <Briefcase className="h-4 w-4" />
              LinkedIn Headshots
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              The LinkedIn headshot that{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                gets you noticed
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              Profiles with professional headshots get 14x more views. Stop
              losing opportunities because of a blurry selfie or an outdated
              photo from 5 years ago.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-lime-400 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-lime-300"
              >
                Get Your LinkedIn Headshot
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/examples"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-white transition-all hover:bg-white/10"
              >
                See Examples
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center"
            >
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-blue-400" />
              <p className="font-display text-3xl font-bold text-blue-400">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LinkedIn examples placeholder */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold sm:text-3xl">
          LinkedIn-ready headshots in every style
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Professional", "Approachable", "Executive", "Creative"].map(
            (style, i) => (
              <motion.div
                key={style}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-blue-600/30 to-cyan-600/20 border border-white/[0.06] flex flex-col items-center justify-center"
              >
                <div className="h-20 w-20 rounded-full bg-white/20" />
                <div className="mt-2 h-8 w-14 rounded-t-full bg-white/15" />
                <span className="mt-4 text-sm font-medium text-white/70">{style}</span>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Tips section */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          What makes a great LinkedIn headshot
        </h2>
        <div className="space-y-4">
          {[
            "Face takes up 60% of the frame, with a clean background",
            "Friendly expression with a slight smile (approachable but professional)",
            "Good lighting on your face, no harsh shadows",
            "Dressed appropriately for your industry",
            "High resolution (at least 400x400px, ideally 800x800px)",
          ].map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          HaloShot automatically optimizes for all of these. Just upload a selfie.
        </p>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          What LinkedIn users say
        </h2>
        <Testimonials />
      </section>

      <CTABanner />
    </>
  );
}
