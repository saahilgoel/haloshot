"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTABanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/60 via-violet-800/40 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Ready to transform{" "}
          <span className="bg-gradient-to-r from-lime-300 to-lime-400 bg-clip-text text-transparent">
            your image
          </span>
          ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
        >
          Join 10,000+ professionals who upgraded their online presence. Start
          free, no credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/signup"
            className="group inline-flex h-13 items-center gap-2 rounded-xl bg-lime-400 px-10 py-3 text-base font-semibold text-gray-900 transition-all hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/25"
          >
            Get Your Headshot Free
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
          3 free headshots included. Upgrade anytime.
        </motion.p>
      </div>
    </section>
  );
}
