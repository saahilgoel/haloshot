"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-violet-800/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-halo-500/15 via-transparent to-transparent" />

      {/* Halo glow ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[300px] w-[300px] rounded-full bg-halo-500/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Your photo is making impressions right now.{" "}
          <span className="bg-gradient-to-r from-halo-300 to-halo-400 bg-clip-text text-transparent">
            Make them count.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
        >
          Score your current photo. See what others see. Then decide if you want the glow-up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/score"
            className="group inline-flex h-13 items-center gap-2 rounded-xl bg-halo-500 px-10 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-halo-400 hover:shadow-lg hover:shadow-halo-500/25"
          >
            Score your photo free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          No signup required. Takes 10 seconds.
        </motion.p>
      </div>
    </section>
  );
}
