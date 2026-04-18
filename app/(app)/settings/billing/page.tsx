"use client";

import { useState } from "react";
import {
  Crown,
  ArrowUpRight,
  Zap,
  Check,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks/useUser";

const planFeatures: Record<string, string[]> = {
  free: ["5 headshots/month", "3 presets", "Standard quality"],
  pro: [
    "50 headshots/month",
    "All presets",
    "HD quality",
    "Priority processing",
    "Download originals",
  ],
  team: [
    "Unlimited headshots",
    "All presets",
    "4K quality",
    "Priority processing",
    "Team management",
    "Brand kit",
    "API access",
  ],
};

export default function BillingPage() {
  const { profile, isLoading } = useUser();
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);

  const plan = profile?.subscription_tier || "free";
  const isFree = plan === "free";
  const generationsUsed = profile?.generations_count_total || 0;
  const generationsLimit = isFree ? 5 : plan === "pro" ? 50 : 999;
  const usagePercent = (generationsUsed / generationsLimit) * 100;
  const periodEnd = profile?.subscription_period_end
    ? new Date(profile.subscription_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  const handleUpgrade = async () => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Billing</h1>
          <p className="mt-1 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      {/* Current plan */}
      <Card
        className={
          isFree
            ? ""
            : "border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-transparent"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Crown className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <CardTitle className="capitalize">
                  {plan} Plan
                </CardTitle>
                <CardDescription>
                  {isFree
                    ? "Free tier"
                    : `Alpha Pro — free during alpha period${periodEnd ? ` (until ${periodEnd})` : ""}`}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            {planFeatures[plan]?.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 shrink-0 text-lime-400" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Generations</span>
            <span className="font-medium">
              {generationsUsed}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA (only for free) */}
      {isFree && (
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-white">
                <Zap className="h-5 w-5 text-lime-400" />
                Upgrade to Pro
              </h3>
              <p className="text-sm text-violet-200">
                Free during alpha. No credit card required.
              </p>
            </div>
            <Button
              onClick={handleUpgrade}
              disabled={upgrading || upgraded}
              className="shrink-0 bg-lime-400 font-semibold text-black hover:bg-lime-300"
            >
              {upgraded ? (
                <>
                  <Check className="h-4 w-4" />
                  Activated! Refreshing...
                </>
              ) : upgrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Pro (Free Alpha)
                  <ArrowUpRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No invoices during alpha.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
