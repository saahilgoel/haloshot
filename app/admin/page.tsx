"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, Image, DollarSign, RefreshCw, UserPlus, Sparkles, Target, TrendingUp,
} from "lucide-react";

interface AdminData {
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
    totalScores: number;
    totalHeadshots: number;
    gensToday: number;
    gensMonth: number;
    byPlan: Record<string, number>;
  };
  signupsPerDay: { day: string; signups: number }[];
  gensPerDay: { date: string; count: number }[];
  recentActivity: { type: string; text: string; time: string }[];
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const s = data?.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Live data from production</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Users", value: s?.totalUsers || 0, icon: Users, color: "text-blue-400" },
          { label: "Pro Users", value: s?.proUsers || 0, icon: Sparkles, color: "text-violet-400" },
          { label: "Generations Today", value: s?.gensToday || 0, icon: Image, color: "text-lime-400" },
          { label: "Gens This Month", value: s?.gensMonth || 0, icon: TrendingUp, color: "text-halo-400" },
          { label: "Total Cost", value: `$${(s?.totalCost || 0).toFixed(2)}`, icon: DollarSign, color: "text-amber-400" },
          { label: "Conversion", value: `${(s?.conversionRate || 0).toFixed(1)}%`, icon: Target, color: "text-emerald-400" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
              <p className={cn("text-xl font-display font-bold", stat.color)}>
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Images", value: s?.totalImages || 0 },
          { label: "Halo Scores", value: s?.totalScores || 0 },
          { label: "Saved Headshots", value: s?.totalHeadshots || 0 },
          { label: "Completed Jobs", value: s?.completedJobs || 0 },
          { label: "Failed Jobs", value: s?.failedJobs || 0 },
        ].map((stat) => (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-3">
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-display font-bold">{stat.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signups (Last 7 Days)
            </CardTitle>
            <p className="text-2xl font-display font-bold">
              {data?.signupsPerDay?.reduce((sum, d) => sum + d.signups, 0) || 0}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.signupsPerDay || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="signups" fill="#C5F536" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Generation volume */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generations (Last 7 Days)
            </CardTitle>
            <p className="text-2xl font-display font-bold">
              {data?.gensPerDay?.reduce((sum, d) => sum + d.count, 0) || 0}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.gensPerDay || []}>
                  <defs>
                    <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} fill="url(#genGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan breakdown + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan breakdown */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Users by Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(s?.byPlan || {}).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs capitalize">{plan}</Badge>
                <span className="font-mono text-sm font-bold">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {(data?.recentActivity || []).map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    item.type === "signup" ? "bg-blue-500/10 text-blue-400" : "bg-violet-500/10 text-violet-400"
                  )}>
                    {item.type === "signup" ? <UserPlus className="h-3.5 w-3.5" /> : <Image className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(item.time)}</p>
                  </div>
                </div>
              ))}
              {(data?.recentActivity || []).length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
