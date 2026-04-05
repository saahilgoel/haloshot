"use client";

import { StatsCards, StatItem } from "@/components/admin/StatsCards";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  UserPlus,
  Image,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats: StatItem[] = [
  { label: "MRR", value: 42600, change: "+22.4%", trend: "up", prefix: "$" },
  { label: "Active Subscribers", value: 890, change: "+8.2%", trend: "up" },
  { label: "Generations Today", value: 347, change: "+15.1%", trend: "up" },
  { label: "Generations (Month)", value: 8420, change: "+31.0%", trend: "up" },
  { label: "Conversion Rate", value: "4.8", change: "+0.3%", trend: "up", suffix: "%" },
  { label: "Churn Rate", value: "2.1", change: "-0.4%", trend: "down", suffix: "%" },
];

const signupsData = [
  { day: "Mon", signups: 42 },
  { day: "Tue", signups: 58 },
  { day: "Wed", signups: 51 },
  { day: "Thu", signups: 67 },
  { day: "Fri", signups: 73 },
  { day: "Sat", signups: 38 },
  { day: "Sun", signups: 29 },
];

const generationVolumeData = [
  { date: "Mar 6", count: 210 },
  { date: "Mar 13", count: 280 },
  { date: "Mar 20", count: 310 },
  { date: "Mar 27", count: 365 },
  { date: "Apr 3", count: 420 },
  { date: "Apr 5", count: 347 },
];

const recentActivity = [
  { type: "signup", text: "New user sarah@company.com signed up", time: "2 min ago", icon: UserPlus },
  { type: "generation", text: "Batch of 8 headshots completed for tom@agency.net", time: "5 min ago", icon: Image },
  { type: "payment", text: "Pro subscription payment received - $29/mo", time: "12 min ago", icon: CreditCard },
  { type: "signup", text: "New user alex@startup.uk signed up", time: "18 min ago", icon: UserPlus },
  { type: "generation", text: "Generation failed for david@firm.com - NSFW filter", time: "25 min ago", icon: Image },
  { type: "payment", text: "Enterprise annual payment - $2,388", time: "1 hr ago", icon: CreditCard },
  { type: "generation", text: "46 headshots generated in last hour", time: "1 hr ago", icon: Image },
  { type: "signup", text: "3 new signups from ProductHunt referral", time: "2 hrs ago", icon: UserPlus },
];

function ChartTooltip({
  active,
  payload,
  label,
  valueKey,
  prefix = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valueKey?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">
        {prefix}{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of HaloShot performance metrics
        </p>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />

        {/* Signups bar chart */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Signups This Week
            </CardTitle>
            <p className="text-2xl font-display font-bold">358</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signupsData}>
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
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="signups"
                    fill="#C5F536"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation volume */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Generation Volume
            </CardTitle>
            <p className="text-2xl font-display font-bold">8,420 this month</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generationVolumeData}>
                  <defs>
                    <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5F536" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#C5F536" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#C5F536"
                    strokeWidth={2}
                    fill="url(#genGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion funnel */}
        <FunnelChart />
      </div>

      {/* Recent Activity */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b border-border last:border-0"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.type === "signup" && "bg-blue-500/10 text-blue-400",
                    item.type === "generation" && "bg-violet-500/10 text-violet-400",
                    item.type === "payment" && "bg-lime-400/10 text-lime-400"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
