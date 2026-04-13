"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RefreshCw, Loader2, TrendingUp, Info } from "lucide-react";

interface StatsData {
  stats: {
    totalUsers: number;
    proUsers: number;
    mrr: number;
    conversionRate: number;
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
  jobs: Array<{
    id: string;
    user_id: string;
    status: string;
    cost_usd: string;
    num_images: number;
    model_version: string;
    created_at: string;
  }>;
}

function ChartTooltip({
  active,
  payload,
  label,
  prefix = "",
  suffix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  prefix?: string;
  suffix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">
        {prefix}
        {payload[0].value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

const planColors: Record<string, string> = {
  Free: "#3B82F6",
  Pro: "#6C3CE0",
  Team: "#C5F536",
};

export default function BillingPage() {
  const [data, setData] = useState<StatsData | null>(null);
  const [genData, setGenData] = useState<GenStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    try {
      const [statsRes, gensRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/generations?limit=20"),
      ]);
      const statsJson = await statsRes.json();
      const gensJson = await gensRes.json();
      setData(statsJson);
      setGenData(gensJson);
    } catch (err) {
      console.error("Failed to fetch billing data:", err);
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
  const mrr = stats?.mrr || 0;
  const arr = mrr * 12;
  const proUsers = stats?.proUsers || 0;
  const arpu = proUsers > 0 ? (mrr / proUsers) : 0;

  // Plan distribution
  const planEntries = stats?.byPlan
    ? Object.entries(stats.byPlan).map(([plan, count]) => ({
        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
        count,
        revenue: plan === "pro" || plan === "team" ? count * 9.99 : 0,
      }))
    : [];
  const totalPlanUsers = planEntries.reduce((s, p) => s + p.count, 0);

  // Recent generation costs as "transactions"
  const recentCosts = (genData?.jobs || [])
    .filter(j => parseFloat(j.cost_usd || "0") > 0)
    .slice(0, 10)
    .map(j => ({
      id: j.id,
      status: j.status,
      cost: parseFloat(j.cost_usd || "0"),
      images: j.num_images,
      model: j.model_version || "unknown",
      date: j.created_at,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Billing & Revenue</h2>
          <p className="text-sm text-muted-foreground">
            Revenue metrics, plan distribution, and generation costs
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: `$${mrr.toFixed(2)}` },
          { label: "ARR", value: `$${arr.toFixed(0)}` },
          { label: "Pro Subscribers", value: proUsers.toString() },
          { label: "ARPU", value: `$${arpu.toFixed(2)}` },
        ].map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-bold mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info banner */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 flex items-start gap-3">
        <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-blue-300">MRR is computed from current Pro/Team subscribers x $9.99/mo</p>
          <p className="text-xs text-blue-400/70 mt-0.5">Historical trend data will be available after Stripe integration</p>
        </div>
      </div>

      {/* Charts: User Growth + Plan Distribution */}
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
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="signups" fill="#C5F536" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plan Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {planEntries.length > 0 ? (
              <div className="space-y-4">
                {planEntries.map((plan) => {
                  const pct = totalPlanUsers > 0 ? ((plan.count / totalPlanUsers) * 100).toFixed(1) : "0";
                  return (
                    <div key={plan.plan}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: planColors[plan.plan] || "#6C3CE0" }}
                          />
                          <span className="text-sm font-medium">{plan.plan}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {plan.count} users
                          </span>
                          {plan.revenue > 0 && (
                            <span className="font-mono font-medium">
                              ${plan.revenue.toFixed(0)}/mo
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground w-12 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: planColors[plan.plan] || "#6C3CE0",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Generation Cost</span>
                    <span className="text-lg font-display font-bold">${stats?.totalCost.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="text-lg font-display font-bold text-lime-400">{stats?.conversionRate.toFixed(1) || "0"}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-muted-foreground text-sm">
                No plan data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Generation Costs */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Generation Costs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentCosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead>Job ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Images</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCosts.map((txn) => (
                  <TableRow key={txn.id} className="border-border">
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {txn.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                        {txn.model}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          txn.status === "completed"
                            ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
                            : txn.status === "failed"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                        )}
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {txn.images}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      ${txn.cost.toFixed(4)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(txn.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              No generation cost data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
