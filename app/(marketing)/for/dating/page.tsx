"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Camera, Shield } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const benefits = [
  {
    icon: Camera,
    title: "No awkward photoshoots",
    description: "Just upload a few selfies from your phone. No need to hire a photographer or ask a friend for an uncomfortable favor.",
  },
  {
    icon: Sparkles,
    title: "Natural, not fake",
    description: "Our AI enhances your photos while keeping them authentic. You'll look like the best version of yourself, not someone else entirely.",
  },
  {
    icon: Heart,
    title: "3x more matches",
    description: "High-quality photos are the #1 factor in getting matches. A clear, well-lit headshot dramatically outperforms blurry selfies and group crops.",
  },
  {
    icon: Shield,
    title: "Your privacy matters",
    description: "Photos are encrypted and auto-deleted in 30 days. We never share your data or use it for training. What happens in HaloShot stays in HaloShot.",
  },
];

export default function DatingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-rose-600/15 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-1.5 text-sm font-medium text-rose-300"
          >
            <Heart className="h-4 w-4" />
            Dating Profile Photos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            First impressions that{" "}
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              get more matches
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Your dating profile photo is your first impression. Make it count
            with a natural, flattering headshot that shows the real you — just
            better lit.
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
              Upgrade Your Dating Profile
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dating-style examples */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {["Natural Smile", "Outdoor", "Warm & Inviting", "Confident"].map(
            (style, i) => (
              <motion.div
                key={style}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-rose-600/30 to-pink-600/20 border border-white/[0.06] flex flex-col items-center justify-center"
              >
                <div className="h-20 w-20 rounded-full bg-white/20" />
                <div className="mt-2 h-8 w-14 rounded-t-full bg-white/15" />
                <span className="mt-4 text-sm font-medium text-white/70">{style}</span>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-display text-2xl font-bold sm:text-3xl">
          Why HaloShot for your dating profile
        </h2>
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
              <b.icon className="mb-3 h-8 w-8 text-rose-400" />
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social proof stat */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-10"
        >
          <p className="font-display text-5xl font-bold text-rose-400">3x</p>
          <p className="mt-2 text-lg font-medium">More matches on average</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on user-reported data from HaloShot users on Hinge, Bumble,
            and Tinder
          </p>
        </motion.div>
      </section>

      <CTABanner />
    </>
  );
}
