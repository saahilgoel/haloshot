"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Rocket, TrendingUp, Eye, Users } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const stats = [
  { icon: Eye, value: "100ms", label: "Investors form a first impression of your team" },
  { icon: TrendingUp, value: "71%", label: "Of investors say founder credibility matters more than the idea" },
  { icon: Users, value: "+46", label: "Average team Halo Score glow-up" },
];

export default function FoundersPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300"
            >
              <Rocket className="h-4 w-4" />
              Founder Headshots
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Your headshot is in your pitch deck.{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-halo-400 bg-clip-text text-transparent">
                Investors notice.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground"
            >
              VCs meet 100 founders a week. Your team slide gets 3 seconds.
              A high Halo Score signals competence and trustworthiness before you
              say a word. A low one signals the opposite.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                href="/score"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-halo-500 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400"
              >
                Score your team&apos;s photos
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/examples"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-white transition-all hover:bg-white/10"
              >
                See glow-ups
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
              <stat.icon className="mx-auto mb-3 h-8 w-8 text-halo-400" />
              <p className="font-display text-3xl font-bold text-halo-400">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founder-specific styles */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center font-display text-2xl font-bold sm:text-3xl">
          Founder-optimized. Investor-approved.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground">
          Each style is tuned for the perception investors look for: competence, warmth, and trustworthiness.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { style: "CEO / Visionary", score: 92 },
            { style: "Technical Co-founder", score: 88 },
            { style: "Approachable Leader", score: 90 },
            { style: "Board-ready", score: 94 },
          ].map((item, i) => (
            <motion.div
              key={item.style}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-white/[0.06] flex flex-col items-center justify-center"
            >
              <div className="h-20 w-20 rounded-full bg-white/20" />
              <div className="mt-2 h-8 w-14 rounded-t-full bg-white/15" />
              <span className="mt-4 text-sm font-medium text-white/70">{item.style}</span>
              <span className="mt-1 font-mono text-lg font-bold text-halo-400">{item.score}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The pitch */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          What your pitch deck team slide is really saying
        </h2>
        <div className="space-y-4">
          {[
            "Mismatched headshots say: \u201CWe met last week.\u201D",
            "Selfies on the team slide say: \u201CWe don\u2019t take details seriously.\u201D",
            "No photos at all say: \u201CWe\u2019re hiding something.\u201D",
            "Stock-quality headshots say: \u201CWe\u2019re not real people.\u201D",
            "A consistent, high-scoring team page says: \u201CWe\u2019re credible, cohesive, and ready.\u201D",
          ].map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 4 ? "bg-halo-500/20 text-halo-400" : "bg-red-500/20 text-red-400"}`}>
                {i === 4 ? "\u2713" : "\u2717"}
              </span>
              <span className="text-sm text-muted-foreground">{tip}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team glow-up CTA */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center sm:p-12"
        >
          <h3 className="font-display text-2xl font-bold">Team glow-up in one afternoon.</h3>
          <p className="mt-3 text-muted-foreground">
            Get your whole founding team scored and upgraded. Consistent style, consistent quality,
            consistent first impression. Investors will notice.
          </p>
          <Link
            href="/signup?plan=team"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-halo-500 px-8 text-sm font-semibold text-gray-900 transition-all hover:bg-halo-400"
          >
            <Users className="h-4 w-4" />
            Get the team glow-up
          </Link>
        </motion.div>
      </section>

      <CTABanner />
    </>
  );
}
