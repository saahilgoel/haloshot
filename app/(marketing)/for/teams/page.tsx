"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, Zap, Palette, ShieldCheck, Settings } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const benefits = [
  {
    icon: Zap,
    title: "Onboard in minutes, not weeks",
    description: "New hire starts Monday? They'll have a professional headshot on the website by Monday afternoon. No photographer scheduling needed.",
  },
  {
    icon: Palette,
    title: "Consistent team aesthetic",
    description: "Every team member gets the same style, lighting, and feel. Your About page finally looks cohesive instead of a patchwork of phone selfies.",
  },
  {
    icon: Settings,
    title: "Admin dashboard",
    description: "Manage your team from one place. Invite members, set style guidelines, approve headshots, and download in bulk.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description: "AES-256 encryption, SOC 2 compliance, auto-deletion policies. Your team's data is handled with care.",
  },
];

const savings = [
  { team: "5 people", photographer: "$1,000-2,500", haloshot: "$39.95/mo", saved: "$960+" },
  { team: "20 people", photographer: "$4,000-10,000", haloshot: "$159.80/mo", saved: "$3,800+" },
  { team: "50 people", photographer: "$10,000-25,000", haloshot: "$399.50/mo", saved: "$9,600+" },
];

export default function TeamsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-violet-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-1.5 text-sm font-medium text-violet-300"
          >
            <Users className="h-4 w-4" />
            For Teams & Companies
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Team headshots in{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              minutes, not months
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Stop scheduling photographers for every new hire. Get consistent,
            professional headshots for your entire team with one tool.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/signup?plan=team"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-lime-400 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-lime-300"
            >
              Start Team Plan
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="mailto:sales@haloshot.ai"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-white transition-all hover:bg-white/10"
            >
              Talk to Sales
            </a>
          </motion.div>
        </div>
      </section>

      {/* Team visual placeholder */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/40 to-purple-600/30 border border-white/[0.06] flex items-center justify-center sm:h-24 sm:w-24"
            >
              <div className="h-10 w-10 rounded-full bg-white/20" />
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Consistent style across your entire team
        </p>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <b.icon className="mb-3 h-8 w-8 text-violet-400" />
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cost savings table */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-display text-2xl font-bold">
          How much you&apos;ll save
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Team Size</th>
                <th className="pb-3 text-center text-sm font-medium text-muted-foreground">Photographer</th>
                <th className="pb-3 text-center text-sm font-semibold text-violet-400">HaloShot</th>
                <th className="pb-3 text-right text-sm font-medium text-lime-400">You Save</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((row) => (
                <tr key={row.team} className="border-b border-white/5">
                  <td className="py-3 text-sm font-medium">{row.team}</td>
                  <td className="py-3 text-center text-sm text-muted-foreground line-through">{row.photographer}</td>
                  <td className="py-3 text-center text-sm font-semibold">{row.haloshot}</td>
                  <td className="py-3 text-right text-sm font-semibold text-lime-400">{row.saved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
