"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type Status = "queued" | "processing" | "completed" | "failed";

interface Generation {
  id: string;
  user: string;
  preset: string;
  status: Status;
  duration: string;
  cost: string;
  similarity: number | null;
  time: string;
}

const mockGenerations: Generation[] = [
  { id: "gen_001", user: "sarah@company.com", preset: "Corporate Classic", status: "completed", duration: "42s", cost: "$0.08", similarity: 0.94, time: "2 min ago" },
  { id: "gen_002", user: "marcus@startup.io", preset: "LinkedIn Pro", status: "processing", duration: "18s...", cost: "$0.08", similarity: null, time: "1 min ago" },
  { id: "gen_003", user: "priya@design.co", preset: "Creative Studio", status: "completed", duration: "38s", cost: "$0.08", similarity: 0.91, time: "5 min ago" },
  { id: "gen_004", user: "tom@agency.net", preset: "Executive Suite", status: "failed", duration: "12s", cost: "$0.00", similarity: null, time: "3 min ago" },
  { id: "gen_005", user: "emily@freelance.me", preset: "Natural Light", status: "queued", duration: "--", cost: "$0.08", similarity: null, time: "just now" },
  { id: "gen_006", user: "james@tech.io", preset: "Tech Founder", status: "completed", duration: "45s", cost: "$0.08", similarity: 0.89, time: "8 min ago" },
  { id: "gen_007", user: "aisha@creative.co", preset: "Editorial", status: "completed", duration: "41s", cost: "$0.08", similarity: 0.96, time: "10 min ago" },
  { id: "gen_008", user: "david@firm.com", preset: "Corporate Classic", status: "processing", duration: "25s...", cost: "$0.08", similarity: null, time: "30s ago" },
  { id: "gen_009", user: "lisa@brand.io", preset: "Minimalist", status: "completed", duration: "39s", cost: "$0.08", similarity: 0.92, time: "12 min ago" },
  { id: "gen_010", user: "roberto@studio.br", preset: "Outdoor Pro", status: "failed", duration: "8s", cost: "$0.00", similarity: null, time: "15 min ago" },
  { id: "gen_011", user: "nina@photo.ru", preset: "Warm Studio", status: "completed", duration: "44s", cost: "$0.08", similarity: 0.88, time: "18 min ago" },
  { id: "gen_012", user: "chris@media.ie", preset: "LinkedIn Pro", status: "queued", duration: "--", cost: "$0.08", similarity: null, time: "just now" },
];

const statusConfig: Record<Status, { label: string; className: string }> = {
  queued: { label: "Queued", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  processing: { label: "Processing", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  completed: { label: "Completed", className: "bg-lime-400/10 text-lime-400 border-lime-400/20" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const filters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Queued", value: "queued" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

export function GenerationQueue() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return mockGenerations;
    return mockGenerations.filter((g) => g.status === statusFilter);
  }, [statusFilter]);

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "h-8 text-xs",
                statusFilter === f.value
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-muted-foreground"
              )}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1 text-[10px] opacity-60">
                  {mockGenerations.filter((g) =>
                    f.value === "all" ? true : g.status === f.value
                  ).length}
                </span>
              )}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-8 gap-1.5 border-border text-xs"
        >
          <RefreshCw
            className={cn("h-3 w-3", refreshing && "animate-spin")}
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead>User</TableHead>
              <TableHead>Preset</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Duration</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Similarity</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((gen) => (
              <TableRow
                key={gen.id}
                className={cn(
                  "border-border",
                  gen.status === "failed" && "bg-red-500/5"
                )}
              >
                <TableCell className="text-sm">{gen.user}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {gen.preset}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusConfig[gen.status].className)}
                  >
                    {gen.status === "processing" && (
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    )}
                    {statusConfig[gen.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {gen.duration}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {gen.cost}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {gen.similarity !== null ? (
                    <span
                      className={cn(
                        gen.similarity >= 0.9
                          ? "text-lime-400"
                          : gen.similarity >= 0.85
                          ? "text-yellow-400"
                          : "text-red-400"
                      )}
                    >
                      {(gen.similarity * 100).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {gen.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
