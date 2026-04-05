"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const plans = [
  {
    name: "The Reality Check",
    description: "Find out where you stand. It might sting.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Face the truth",
    ctaHref: "/score",
    highlighted: false,
    features: [
      { text: "3 AI headshots", included: true },
      { text: "1 Halo Score analysis", included: true },
      { text: "Warmth + Competence breakdown", included: true },
      { text: "Standard quality (1024px)", included: true },
      { text: "Watermark removed", included: false },
      { text: "Commercial license", included: false },
      { text: "Unlimited Halo Scores", included: false },
    ],
  },
  {
    name: "The Glow-Up",
    description: "For people ready to stop being overlooked.",
    monthlyPrice: 9.99,
    annualPrice: 6.66,
    cta: "Start glowing",
    ctaHref: "/signup?plan=pro",
    highlighted: true,
    features: [
      { text: "100 AI headshots / month", included: true },
      { text: "Unlimited Halo Scores", included: true },
      { text: "All style presets", included: true },
      { text: "HD quality (2048px)", included: true },
      { text: "No watermark", included: true },
      { text: "Commercial license", included: true },
      { text: "Background removal", included: true },
    ],
  },
  {
    name: "The Team Glow-Up",
    description: "Your team&apos;s photos are a branding problem. Fix it.",
    monthlyPrice: 7.99,
    annualPrice: 5.33,
    cta: "Glow up the team",
    ctaHref: "/signup?plan=team",
    highlighted: false,
    perPerson: true,
    features: [
      { text: "Unlimited headshots per person", included: true },
      { text: "Unlimited Halo Scores", included: true },
      { text: "All style presets + custom brand styles", included: true },
      { text: "HD quality (2048px)", included: true },
      { text: "Team admin dashboard", included: true },
      { text: "Consistent team aesthetic", included: true },
      { text: "Batch processing + API", included: true },
    ],
  },
];

export function PricingTable() {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      {/* Toggle */}
      <div className="mb-12 flex items-center justify-center gap-4">
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            !annual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <Switch checked={annual} onCheckedChange={setAnnual} />
        <span
          className={cn(
            "text-sm font-medium transition-colors",
            annual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Annual
        </span>
        <AnimatePresence>
          {annual && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Badge className="bg-lime-400/20 text-lime-300 border-lime-400/30 hover:bg-lime-400/20">
                Save 33%
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6 sm:p-8",
              plan.highlighted
                ? "border-halo-500/50 bg-gradient-to-b from-halo-500/10 to-transparent shadow-lg shadow-halo-500/10"
                : "border-white/10 bg-white/[0.02]"
            )}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-halo-500 text-gray-900 border-0 hover:bg-halo-500 gap-1 font-semibold">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-display text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  ${annual ? plan.annualPrice.toFixed(2) : plan.monthlyPrice.toFixed(2)}
                </span>
                {plan.monthlyPrice > 0 && (
                  <span className="text-sm text-muted-foreground">
                    /{plan.perPerson ? "person/mo" : "mo"}
                  </span>
                )}
              </div>
              {annual && plan.monthlyPrice > 0 && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Billed annually (${(plan.annualPrice * 12).toFixed(0)}/yr
                  {plan.perPerson ? " per person" : ""})
                </p>
              )}
            </div>

            <Link
              href={plan.ctaHref}
              className={cn(
                "mb-6 flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                plan.highlighted
                  ? "bg-halo-500 text-gray-900 hover:bg-halo-400 hover:shadow-lg hover:shadow-halo-500/25"
                  : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
              )}
            >
              {plan.cta}
            </Link>

            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-start gap-3 text-sm">
                  {feature.included ? (
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-white/20" />
                  )}
                  <span
                    className={cn(
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
