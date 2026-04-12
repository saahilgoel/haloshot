"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RefreshCw, ChevronLeft, ChevronRight, DollarSign, Image, Clock, CheckCircle2 } from "lucide-react";

interface GenerationJob {
  id: string;
  user_id: string;
  preset_id: string;
  model_version: string;
  status: string;
  num_images: number;
  cost_usd: string;
  similarity_scores: number[];
  halo_scores: number[];
  generated_image_urls: string[];
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  byModel: Record<string, { count: number; totalCost: number; avgSimilarity: number; totalImages: number }>;
  byStatus: Record<string, number>;
  totalCost: number;
  totalImages: number;
}

export default function GenerationsPage() {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modelFilter, setModelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const limit = 50;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), model: modelFilter, status: statusFilter });
      const res = await fetch(`/api/admin/generations?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setStats(data.stats || null);
    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, modelFilter, statusFilter]);

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-lime-400/10 text-lime-400 border-lime-400/20";
    if (s === "processing") return "bg-blue-400/10 text-blue-400 border-blue-400/20";
    if (s === "failed") return "bg-red-400/10 text-red-400 border-red-400/20";
    return "bg-zinc-400/10 text-zinc-400 border-zinc-400/20";
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Generation Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Model usage, costs, and quality metrics from real data
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Aggregate stats */}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                  <Image className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Jobs</p>
                  <p className="text-xl font-display font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-halo-500/10">
                  <DollarSign className="h-4 w-4 text-halo-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="text-xl font-display font-bold text-halo-400">${stats.totalCost.toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Images</p>
                  <p className="text-xl font-display font-bold">{stats.totalImages}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-500/10">
                  <Clock className="h-4 w-4 text-lime-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Cost/Image</p>
                  <p className="text-xl font-display font-bold">
                    ${stats.totalImages > 0 ? (stats.totalCost / stats.totalImages).toFixed(4) : "0"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Per-model breakdown */}
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Cost by Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(stats.byModel).map(([model, data]) => (
              <Card key={model} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium">{model}</span>
                    <Badge variant="secondary" className="text-[10px]">{data.count} jobs</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Total cost</p>
                      <p className="font-mono font-bold text-halo-400">${data.totalCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Images</p>
                      <p className="font-mono font-bold">{data.totalImages}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg similarity</p>
                      <p className="font-mono font-bold">{(data.avgSimilarity * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  {data.totalImages > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-[10px] text-muted-foreground">
                        Cost per image: <span className="font-mono text-foreground">${(data.totalCost / data.totalImages).toFixed(4)}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select
          value={modelFilter}
          onChange={(e) => { setModelFilter(e.target.value); setPage(1); }}
          className="h-8 rounded-md border border-border bg-card px-2 text-sm"
        >
          <option value="all">All Models</option>
          <option value="nano-banana-2">Nano Banana 2</option>
          <option value="nano-banana">Nano Banana</option>
          <option value="flux-kontext-pro">Flux Kontext Pro</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="h-8 rounded-md border border-border bg-card px-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="failed">Failed</option>
          <option value="queued">Queued</option>
        </select>
      </div>

      {/* Jobs table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Time</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Model</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Preset</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Images</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Cost</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Similarity</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 && !loading ? (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">No generations found</td></tr>
                ) : jobs.map((j) => {
                  const avgSim = j.similarity_scores?.length
                    ? (j.similarity_scores.reduce((a, b) => a + b, 0) / j.similarity_scores.length * 100).toFixed(1) + "%"
                    : "—";
                  return (
                    <tr key={j.id} className="border-b border-border/50 hover:bg-white/[0.02]">
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {new Date(j.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant="outline" className={cn("text-[11px]", statusColor(j.status))}>
                          {j.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{j.model_version || "—"}</td>
                      <td className="px-4 py-2.5 text-xs">{j.preset_id?.replace(/_/g, " ") || "—"}</td>
                      <td className="px-4 py-2.5 text-center text-xs">{j.num_images}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-halo-400">
                        {j.cost_usd ? `$${parseFloat(j.cost_usd).toFixed(4)}` : "—"}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs">{avgSim}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        {j.user_id?.slice(0, 8)}...
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} total</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <span>Page {page} of {totalPages || 1}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
