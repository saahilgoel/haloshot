"use client";

import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { FREE_GENERATION_LIMIT } from "@/lib/utils/constants";

interface UsageIndicatorProps {
  tier: "free" | "pro" | "team";
  generationsUsed: number;
  className?: string;
}

export function UsageIndicator({ tier, generationsUsed, className }: UsageIndicatorProps) {
  if (tier !== "free") {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-white/50", className)}>
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span>Unlimited generations</span>
      </div>
    );
  }

  const remaining = Math.max(0, FREE_GENERATION_LIMIT - generationsUsed);
  const percentage = (generationsUsed / FREE_GENERATION_LIMIT) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/60">
          {remaining} of {FREE_GENERATION_LIMIT} free headshots left
        </span>
        {remaining === 0 && (
          <span className="text-violet-400 text-xs font-medium">Upgrade for more</span>
        )}
      </div>
      <Progress
        value={percentage}
        className={cn("h-1.5", percentage >= 100 && "[&>div]:bg-rose-500")}
      />
    </div>
  );
}
