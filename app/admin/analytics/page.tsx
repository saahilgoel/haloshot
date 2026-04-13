"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, Loader2, TrendingUp, CheckCircle, XCircle } from "lucide-react";

interface StatsData {
  stats: {
    totalUsers: number;
    proUsers: number;
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    totalImages: number;
    totalCost: number;
    gensToday: number;
    gensMonth: number;
    byPlan: Record<string, number>;
  };
  signupsPerDay: Array<{ day: string; signups: number }>;
  gensPerDay: Array<{ date: string; count: number }>;
}

interface GenStats {
  stats: {
    total: number;
    byModel: Record<string, { count: number; totalCost: number; avgSimilarity: number; totalImages: number }>;
    byStatus: Record<string, number>;
    totalCost: number;
    totalImages: number;
  };
}

interface PresetWithUsage {
  id: string;
  name: string;
  usageCount: number;
  is_active: boolean;
  category: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold text-foreground">
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [genStats, setGenStats] = useState<GenStats | null>(null);
  const [presets, setPresets] = useState<PresetWithUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    try {
      const [statsRes, gensRes, presetsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/generations"),
        fetch("/api/admin/presets"),
      ]);
      const statsJson = await statsRes.json();
      const gensJson = await gensRes.json();
      const presetsJson = await presetsRes.json();
      setData(statsJson);
      setGenStats(gensJson);
      setPresets(presetsJson.presets || []);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    );
  }

  const stats = data?.stats;
  const successRate = stats && stats.totalJobs > 0
    ? ((stats.completedJobs / stats.totalJobs) * 100).toFixed(1)
    : "0";
  const failRate = stats && stats.totalJobs > 0
    ? ((stats.failedJobs / stats.totalJobs) * 100).toFixed(1)
    : "0";

  // Top presets by usage
  const topPresets = [...presets]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 8)
    .map(p => ({ name: p.name || "Unnamed", usage: p.usageCount }));

  // Model breakdown
  const modelData = genStats?.stats?.byModel
    ? Object.entries(genStats.stats.byModel)
        .map(([model, data]) => ({
          model: model === "unknown" ? "Unknown" : model,
          count: data.count,
          cost: data.totalCost,
          images: data.totalImages,
          similarity: data.avgSimilarity,
        }))
        .sort((a, b) => b.count - a.count)
    : [];

  // Plan distribution data
  const planData = stats?.byPlan
    ? Object.entries(stats.byPlan).map(([plan, count]) => ({
        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
        count,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            User behavior, generation performance, and preset usage
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-border gap-1.5"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Row 1: Funnel + Generation Success */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChart />

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generation Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg bg-lime-400/5 border border-lime-400/20 p-4 text-center">
                <CheckCircle className="h-5 w-5 text-lime-400 mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-lime-400">{successRate}%</p>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-sm font-mono mt-1">{stats?.completedJobs.toLocaleString() || 0} jobs</p>
              </div>
              <div className="rounded-lg bg-red-400/5 border border-red-400/20 p-4 text-center">
                <XCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                <p className="text-2xl font-display font-bold text-red-400">{failRate}%</p>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-sm font-mono mt-1">{stats?.failedJobs.toLocaleString() || 0} jobs</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Jobs</span>
                <span className="text-sm font-mono font-medium">{stats?.totalJobs.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Images Generated</span>
                <span className="text-sm font-mono font-medium">{stats?.totalImages.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today</span>
                <span className="text-sm font-mono font-medium">{stats?.gensToday || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-mono font-medium">{stats?.gensMonth || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Cost</span>
                <span className="text-sm font-mono font-medium">${stats?.totalCost.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: User Growth + Generations Per Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              User Signups (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.signupsPerDay || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(260 12% 16%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="signups"
                    fill="#C5F536"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generations Per Day (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.gensPerDay || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(260 12% 16%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6C3CE0"
                    strokeWidth={2}
                    dot={{ fill: "#6C3CE0", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Top presets + Model Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top presets */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Presets by Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPresets.length > 0 ? (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPresets} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(260 12% 16%)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "hsl(260 5% 55%)", fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "hsl(260 5% 55%)", fontSize: 11 }}
                      width={120}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="usage"
                      fill="#6C3CE0"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
                No preset usage data yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model usage breakdown */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Model Usage Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {modelData.length > 0 ? (
              <div className="space-y-4">
                {modelData.map((item) => {
                  const maxCount = modelData[0].count;
                  const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  return (
                    <div key={item.model}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                            {item.model}
                          </code>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground text-xs">
                            {item.images} imgs
                          </span>
                          <span className="font-mono font-medium">
                            {item.count} jobs
                          </span>
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            ${item.cost.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {item.similarity > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Avg similarity: {(item.similarity * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-muted-foreground text-sm">
                No generation data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Plan Distribution */}
      {planData.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {planData.map((item) => {
                const total = planData.reduce((s, p) => s + p.count, 0);
                const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
                return (
                  <div key={item.plan} className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20">
                        {item.plan}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                    <p className="text-xl font-display font-bold">{item.count}</p>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
