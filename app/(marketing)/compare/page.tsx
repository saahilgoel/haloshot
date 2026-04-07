"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { CTABanner } from "@/components/marketing/CTABanner";

const competitors = [
  {
    name: "HeadshotPro",
    slug: "headshotpro",
    price: "$29 one-time",
    turnaround: "2 hours",
    tagline: "Great for bulk team headshots. No scoring.",
    gradient: "from-blue-600/30 to-cyan-600/20",
  },
  {
    name: "Aragon AI",
    slug: "aragon",
    price: "$35-39",
    turnaround: "90 min",
    tagline: "Strong realism. No perception scoring.",
    gradient: "from-purple-600/30 to-violet-600/20",
  },
  {
    name: "BetterPic",
    slug: "betterpic",
    price: "$25+",
    turnaround: "1-2 hours",
    tagline: "Good value. No science-backed scoring.",
    gradient: "from-emerald-600/30 to-teal-600/20",
  },
];

export default function ComparePage() {
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
            How HaloShot compares
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            We&apos;re not the cheapest. We&apos;re the only ones who tell you your score.
          </motion.p>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <ComparisonTable />
      </section>

      {/* Competitor cards */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          Detailed comparisons
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {competitors.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/compare/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className={`mb-4 h-2 w-12 rounded-full bg-gradient-to-r ${c.gradient}`} />
                <h3 className="font-display text-lg font-bold group-hover:text-violet-400 transition-colors">
                  HaloShot vs {c.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.price} &middot; {c.turnaround}
                </p>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">
                  {c.tagline}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-halo-400 group-hover:text-halo-300 transition-colors">
                  Read comparison
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
