"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const funnelData = [
  { step: "Visitors", count: 48200, color: "bg-violet-300" },
  { step: "Signups", count: 6740, color: "bg-violet-400" },
  { step: "Upload Photos", count: 3820, color: "bg-violet-500" },
  { step: "Generate Headshot", count: 2940, color: "bg-violet-600" },
  { step: "Subscribe", count: 890, color: "bg-lime-400" },
];

export function FunnelChart() {
  const maxCount = funnelData[0].count;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {funnelData.map((item, i) => {
            const widthPercent = (item.count / maxCount) * 100;
            const prevCount = i > 0 ? funnelData[i - 1].count : null;
            const dropOff = prevCount
              ? (((prevCount - item.count) / prevCount) * 100).toFixed(1)
              : null;
            const convRate = ((item.count / maxCount) * 100).toFixed(1);

            return (
              <div key={item.step} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.step}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono">
                      {item.count.toLocaleString()}
                    </span>
                    {dropOff && (
                      <span className="text-xs text-red-400">
                        -{dropOff}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative h-8 w-full rounded bg-secondary overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded transition-all duration-700 ease-out",
                      item.color
                    )}
                    style={{ width: `${widthPercent}%` }}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                    {convRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Overall Conversion
          </span>
          <span className="text-lg font-display font-bold text-lime-400">
            {((funnelData[funnelData.length - 1].count / funnelData[0].count) * 100).toFixed(2)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
