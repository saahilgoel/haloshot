"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Camera, Shield } from "lucide-react";
import { CTABanner } from "@/components/marketing/CTABanner";

const benefits = [
  {
    icon: Camera,
    title: "No awkward photoshoots",
    description: "Upload a selfie. Get scored. Get a photo that makes people stop scrolling. No photographer, no ring light, no asking your roommate for a favor.",
  },
  {
    icon: Sparkles,
    title: "Warm, not fake",
    description: "Our AI optimizes your warmth score \u2014 the dimension that triggers attraction and approach behavior. You look like you. Just the version of you with better lighting and a higher halo.",
  },
  {
    icon: Heart,
    title: "3x more matches. Measured.",
    description: "Users who replaced their main photo with a HaloShot report 3x more matches on average. Because algorithms surface better photos. And humans swipe on them.",
  },
  {
    icon: Shield,
    title: "Your photos stay yours",
    description: "AES-256 encrypted. Auto-deleted in 30 days. We never share, sell, or train on your data. Your dating photos are between you and your matches.",
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
            The photo that makes them swipe right{" "}
            <span className="bg-gradient-to-r from-rose-400 to-halo-400 bg-clip-text text-transparent">
              AND message first.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Dating apps are a first-impression machine. Your photo gets judged in
            under a second. A high warmth score means more right swipes. A high
            overall Halo Score means they actually send the first message.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href="/score"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-halo-500 px-8 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400"
            >
              Score your dating photo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dating-style examples */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { style: "Natural Warmth", score: 92, warmth: 95 },
            { style: "Outdoor Glow", score: 88, warmth: 91 },
            { style: "Confident Calm", score: 85, warmth: 82 },
            { style: "Approachable", score: 90, warmth: 94 },
          ].map((item, i) => (
              <motion.div
                key={item.style}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-rose-600/30 to-pink-600/20 border border-white/[0.06] flex flex-col items-center justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-halo-500/20 blur-md" />
                  <div className="relative h-20 w-20 rounded-full bg-white/20" />
                </div>
                <div className="mt-2 h-8 w-14 rounded-t-full bg-white/15" />
                <span className="mt-4 text-sm font-medium text-white/70">{item.style}</span>
                <span className="mt-1 font-mono text-lg font-bold text-halo-400">{item.score}</span>
                <span className="text-xs text-rose-300/70">Warmth: {item.warmth}</span>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center font-display text-2xl font-bold sm:text-3xl">
          Why your current photo isn&apos;t working
        </h2>
        <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-foreground">
          It&apos;s not you. It&apos;s the lighting, the angle, and the 47 perception signals your phone camera doesn&apos;t optimize for.
        </p>
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
          className="rounded-2xl border border-halo-500/20 bg-halo-500/5 p-10"
        >
          <p className="font-display text-5xl font-bold text-halo-400">3x</p>
          <p className="mt-2 text-lg font-medium">More matches on average</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on user-reported data from HaloShot users on Hinge, Bumble,
            and Tinder. Higher warmth scores correlated with more first messages.
          </p>
        </motion.div>
      </section>

      <CTABanner />
    </>
  );
}
