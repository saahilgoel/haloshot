"use client";

import { motion } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions, feedback, or partnership inquiries. We read everything.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 grid gap-6 sm:grid-cols-2"
        >
          <a
            href="mailto:hello@haloshot.com"
            className="group flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center transition-colors hover:border-white/10 hover:bg-white/[0.04]"
          >
            <Mail className="mb-4 h-8 w-8 text-halo-400" />
            <h2 className="font-display text-lg font-bold">Email us</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              hello@haloshot.com
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              We respond within 24 hours
            </p>
          </a>

          <a
            href="mailto:sales@haloshot.com"
            className="group flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center transition-colors hover:border-white/10 hover:bg-white/[0.04]"
          >
            <MessageSquare className="mb-4 h-8 w-8 text-violet-400" />
            <h2 className="font-display text-lg font-bold">Enterprise / Teams</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              sales@haloshot.com
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Custom plans for 50+ people
            </p>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 flex justify-center gap-6"
        >
          {[
            { label: "Twitter", href: "https://twitter.com/haloshot" },
            { label: "LinkedIn", href: "https://linkedin.com/company/haloshot" },
            { label: "Instagram", href: "https://instagram.com/haloshot" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
