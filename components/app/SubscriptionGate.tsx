"use client";

import { useState } from "react";
import { Sparkles, X, Check, Zap, Crown, Loader2 } from "lucide-react";
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
    title: "You\u2019ve used your 3 reality checks.",
    subtitle: "Your best first impression is behind this button. $9.99/month. Cancel anytime.",
  },
  premium_preset: {
    title: "That look is part of the Glow-Up.",
    subtitle: "Unlock every style. Every perception dimension. No limits.",
  },
  download_4k: {
    title: "Print-ready needs the Glow-Up.",
    subtitle: "4K downloads. Crystal clear. Zero compromise.",
  },
  no_watermark: {
    title: "Watermarks kill first impressions.",
    subtitle: "Get clean, professional headshots that actually work for you.",
  },
  editor: {
    title: "The editor is a Glow-Up feature.",
    subtitle: "Swap backgrounds, change outfits, fine-tune your halo.",
  },
};

export function SubscriptionGate({ isOpen, onClose, trigger = "generation_limit", blurredImageUrl }: SubscriptionGateProps) {
  const message = triggerMessages[trigger];
  const pro = SUBSCRIPTION_TIERS.pro;
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const handleCheckout = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/upgrade", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setUpgraded(true);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#1a1025] to-[#0d0a12] border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200"
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

              {/* Alpha notice */}
              <div className="rounded-2xl border-2 border-violet-500 bg-violet-500/10 p-4 text-center mb-6">
                <Badge className="bg-lime-400 text-black text-[10px] border-0 mb-2">
                  ALPHA
                </Badge>
                <p className="text-lg font-display font-bold text-white">
                  Free during alpha
                </p>
                <p className="text-xs text-white/40 mt-1">No credit card required.</p>
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
                onClick={handleCheckout}
                disabled={upgrading || upgraded}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-base font-semibold"
              >
                {upgraded ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Welcome to Pro! Refreshing...
                  </>
                ) : upgrading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Activating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Activate Pro (Free Alpha)
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-white/30 mt-3">
                Free during alpha. No credit card required.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
