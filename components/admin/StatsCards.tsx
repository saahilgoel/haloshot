"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  prefix?: string;
  suffix?: string;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: string | number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState("0");
  const numericValue =
    typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    if (isNaN(numericValue)) {
      setDisplay(String(value));
      return;
    }

    const duration = 800;
    const steps = 30;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += 1;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = numericValue * eased;

      if (numericValue >= 1000) {
        setDisplay(
          currentValue.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })
        );
      } else if (numericValue % 1 !== 0) {
        setDisplay(currentValue.toFixed(1));
      } else {
        setDisplay(Math.round(currentValue).toLocaleString("en-IN"));
      }

      if (current >= steps) {
        clearInterval(timer);
        setDisplay(
          typeof value === "number"
            ? numericValue >= 1000
              ? numericValue.toLocaleString("en-IN")
              : numericValue % 1 !== 0
              ? numericValue.toFixed(1)
              : numericValue.toLocaleString("en-IN")
            : String(value)
        );
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, numericValue]);

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsCards({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-border bg-card hover:border-violet-500/30 transition-colors"
        >
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-display font-bold tracking-tight">
              <AnimatedNumber
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <div className="mt-1 flex items-center gap-1">
              {stat.trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-lime-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  stat.trend === "up" ? "text-lime-400" : "text-red-400"
                )}
              >
                {stat.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
