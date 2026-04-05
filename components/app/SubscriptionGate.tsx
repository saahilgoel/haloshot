"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SUBSCRIPTION_TIERS } from "@/lib/utils/constants";

interface SubscriptionGateProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: "generation_limit" | "premium_preset" | "download_4k" | "no_watermark" | "editor";
  blurredImageUrl?: string;
}

const triggerMessages: Record<string, { title: string; subtitle: string }> = {
  generation_limit: {
    title: "You've used all 3 free headshots",
    subtitle: "Upgrade to Pro for unlimited AI headshots",
  },
  premium_preset: {
    title: "This style requires Pro",
    subtitle: "Unlock all 8 professional styles with Pro",
  },
  download_4k: {
    title: "4K downloads are a Pro feature",
    subtitle: "Upgrade for crystal-clear, print-ready headshots",
  },
  no_watermark: {
    title: "Remove watermarks with Pro",
    subtitle: "Get clean, professional headshots without branding",
  },
  editor: {
    title: "The editor is a Pro feature",
    subtitle: "Swap backgrounds, change outfits, and more",
  },
};

export function SubscriptionGate({ isOpen, onClose, trigger = "generation_limit", blurredImageUrl }: SubscriptionGateProps) {
  const message = triggerMessages[trigger];
  const pro = SUBSCRIPTION_TIERS.pro;

  const handleCheckout = async (plan: "monthly" | "annual") => {
    const priceId = plan === "monthly"
      ? process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
      : process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID;

    // For now, redirect to pricing page
    // In production, this would call /api/stripe/checkout
    window.location.href = "/pricing";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#1a1025] to-[#0d0a12] border border-white/10 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 z-10"
            >
              <X className="h-4 w-4 text-white" />
            </button>

            {/* Blurred image preview */}
            {blurredImageUrl && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={blurredImageUrl}
                  alt=""
                  className="w-full h-full object-cover blur-xl scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1025]" />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
                  <Crown className="h-7 w-7 text-white" />
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-display font-bold text-white mb-2">
                  {message.title}
                </h2>
                <p className="text-white/50 text-sm">
                  {message.subtitle}
                </p>
              </div>

              {/* Social proof */}
              <p className="text-center text-xs text-white/30 mb-6">
                12,847 professionals upgraded this month
              </p>

              {/* Price cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Monthly */}
                <button
                  onClick={() => handleCheckout("monthly")}
                  className="rounded-2xl border border-white/10 p-4 text-left hover:border-violet-500/50 transition-all"
                >
                  <p className="text-sm text-white/50">Monthly</p>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    ${pro.priceMonthly}
                    <span className="text-sm font-normal text-white/40">/mo</span>
                  </p>
                </button>

                {/* Annual */}
                <button
                  onClick={() => handleCheckout("annual")}
                  className="rounded-2xl border-2 border-violet-500 bg-violet-500/10 p-4 text-left relative"
                >
                  <Badge className="absolute -top-2.5 right-3 bg-lime-400 text-black text-[10px] border-0">
                    SAVE 33%
                  </Badge>
                  <p className="text-sm text-violet-300">Annual</p>
                  <p className="text-2xl font-display font-bold text-white mt-1">
                    $6.67
                    <span className="text-sm font-normal text-white/40">/mo</span>
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">${pro.priceAnnual}/year</p>
                </button>
              </div>

              {/* Features */}
              <div className="space-y-2.5 mb-6">
                {pro.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Check className="h-4 w-4 text-violet-400 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() => handleCheckout("annual")}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-base font-semibold"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start 7-Day Free Trial
              </Button>

              <p className="text-center text-xs text-white/30 mt-3">
                Cancel anytime. 7-day money-back guarantee.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
