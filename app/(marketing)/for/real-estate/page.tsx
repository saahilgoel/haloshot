"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2, BadgeCheck, Repeat, DollarSign } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const useCases = [
  "MLS listing photos",
  "Business cards",
  "Yard signs",
  "Website about page",
  "Email signature",
  "Social media profiles",
  "Broker website",
  "Marketing flyers",
];

const benefits = [
  {
    icon: BadgeCheck,
    title: "Look trustworthy and competent",
    description: "In real estate, clients choose agents they trust. A professional headshot signals competence and reliability before you even speak.",
  },
  {
    icon: DollarSign,
    title: "Save $200-500 per agent",
    description: "Skip the expensive photographer. Get the same quality (or better) for $9.99/month. For a team of 10, that&apos;s $2,000+ saved.",
  },
  {
    icon: Repeat,
    title: "Update anytime, instantly",
    description: "New hairstyle? Lost weight? Changed offices? Generate a fresh headshot in 60 seconds instead of scheduling another photoshoot.",
  },
];

export default function RealEstatePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300"
          >
            <Building2 className="h-4 w-4" />
            For Real Estate Agents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            The agent headshot that{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              wins listings
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Your face is on every listing, every sign, every card. Make sure
            it&apos;s a headshot that builds trust and wins business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href="/signup"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-lime-400 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-lime-300"
            >
              Get Your Agent Headshot
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Where your headshot appears */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          One headshot, everywhere you need it
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {uc}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <b.icon className="mb-3 h-8 w-8 text-emerald-400" />
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Headshot styles */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          Styles designed for real estate
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Luxury Agent", "Friendly Neighbor", "Commercial Pro", "Team Lead"].map(
            (style, i) => (
              <motion.div
                key={style}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/20 border border-white/[0.06] flex flex-col items-center justify-center"
              >
                <div className="h-20 w-20 rounded-full bg-white/20" />
                <div className="mt-2 h-8 w-14 rounded-t-full bg-white/15" />
                <span className="mt-4 text-sm font-medium text-white/70">{style}</span>
              </motion.div>
            )
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
