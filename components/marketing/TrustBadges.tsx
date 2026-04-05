"use client";

import { motion } from "framer-motion";
import { Users, Star, ShieldCheck, Clock } from "lucide-react";

const badges = [
  {
    icon: Users,
    label: "10,000+",
    sublabel: "Professionals trust HaloShot",
  },
  {
    icon: Star,
    label: "4.9 / 5",
    sublabel: "Average user rating",
  },
  {
    icon: ShieldCheck,
    label: "Encrypted",
    sublabel: "Your data is secure (AES-256)",
  },
  {
    icon: Clock,
    label: "30 days",
    sublabel: "Photos auto-deleted",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {badges.map((b, i) => (
        <motion.div
          key={b.label}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center"
        >
          <b.icon className="h-6 w-6 text-lime-400" />
          <p className="font-display text-lg font-bold">{b.label}</p>
          <p className="text-xs text-muted-foreground">{b.sublabel}</p>
        </motion.div>
      ))}
    </div>
  );
}
