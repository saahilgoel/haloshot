"use client";

import { GenerationQueue } from "@/components/admin/GenerationQueue";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const queueStats = [
  { label: "Queued", value: 2, color: "text-zinc-400" },
  { label: "Processing", value: 2, color: "text-blue-400" },
  { label: "Completed Today", value: 347, color: "text-lime-400" },
  { label: "Failed Today", value: 4, color: "text-red-400" },
  { label: "Avg Duration", value: "41s", color: "text-foreground" },
  { label: "Avg Similarity", value: "91.7%", color: "text-foreground" },
];

export default function GenerationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Generations</h2>
        <p className="text-sm text-muted-foreground">
          Monitor the generation queue and review output quality
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {queueStats.map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("text-xl font-display font-bold mt-0.5", s.color)}>
                {s.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <GenerationQueue />
    </div>
  );
}
