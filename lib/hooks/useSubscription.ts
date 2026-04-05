"use client";

import { useMemo } from "react";
import { useUser } from "./useUser";
import type { SubscriptionTier } from "@/lib/supabase/types";

const FREE_GENERATION_LIMIT = 3;

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  isActive: boolean;
  isPro: boolean;
  isTeam: boolean;
  isFree: boolean;
  canGenerate: boolean;
  generationsLeft: number;
}

export function useSubscription(): UseSubscriptionReturn {
  const { profile } = useUser();

  return useMemo(() => {
    const tier: SubscriptionTier = profile?.subscription_tier ?? "free";
    const status = profile?.subscription_status ?? "inactive";
    const periodEnd = profile?.subscription_period_end;
    const generationsCount = profile?.generations_count ?? 0;

    const isPeriodActive = periodEnd
      ? new Date(periodEnd) > new Date()
      : false;

    const isActive =
      tier === "free"
        ? true
        : (status === "active" || status === "trialing") && isPeriodActive;

    const isPro = tier === "pro" && isActive;
    const isTeam = tier === "team" && isActive;
    const isFree = tier === "free";

    const generationsLeft = isFree
      ? Math.max(0, FREE_GENERATION_LIMIT - generationsCount)
      : Infinity;

    const canGenerate = isPro || isTeam || generationsLeft > 0;

    return {
      tier,
      isActive,
      isPro,
      isTeam,
      isFree,
      canGenerate,
      generationsLeft: isFree ? generationsLeft : Infinity,
    };
  }, [profile]);
}
