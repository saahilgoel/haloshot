"use client";

import { cn } from "@/lib/utils";
import { FunnelChart } from "@/components/admin/FunnelChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Cohort retention data
const cohortData = [
  { cohort: "Jan 2026", users: 420, w1: 68, w4: 42, w12: 28 },
  { cohort: "Feb 2026", users: 580, w1: 71, w4: 45, w12: 31 },
  { cohort: "Mar 2026", users: 740, w1: 74, w4: 48, w12: null },
  { cohort: "Apr 2026", users: 310, w1: 72, w4: null, w12: null },
];

// Top presets
const topPresets = [
  { name: "Natural Light", usage: 4200 },
  { name: "LinkedIn Pro", usage: 3120 },
  { name: "Corporate Classic", usage: 2840 },
  { name: "Warm Studio", usage: 2100 },
  { name: "Creative Studio", usage: 1560 },
  { name: "Tech Founder", usage: 1250 },
  { name: "Executive Suite", usage: 890 },
  { name: "Editorial", usage: 340 },
];

// Revenue by country
const revenueByCountry = [
  { country: "United States", revenue: 18200, pct: 42.7 },
  { country: "United Kingdom", revenue: 5800, pct: 13.6 },
  { country: "India", revenue: 4600, pct: 10.8 },
  { country: "Germany", revenue: 3200, pct: 7.5 },
  { country: "Canada", revenue: 2900, pct: 6.8 },
  { country: "Australia", revenue: 2400, pct: 5.6 },
  { country: "France", revenue: 1800, pct: 4.2 },
  { country: "Others", revenue: 3700, pct: 8.7 },
];

// NPS trend
const npsTrend = [
  { month: "Nov", score: 42 },
  { month: "Dec", score: 48 },
  { month: "Jan", score: 52 },
  { month: "Feb", score: 55 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 64 },
];

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
          {p.name === "revenue" ? "$" : ""}
          {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function retentionColor(pct: number | null) {
  if (pct === null) return "text-muted-foreground/30";
  if (pct >= 50) return "text-lime-400";
  if (pct >= 35) return "text-yellow-400";
  return "text-red-400";
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Deep dive into user behavior, retention, and revenue metrics
        </p>
      </div>

      {/* Row 1: Funnel + NPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChart />

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              NPS Score Trend
            </CardTitle>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-bold text-lime-400">
                +{npsTrend[npsTrend.length - 1].score}
              </p>
              <span className="text-xs text-muted-foreground">current NPS</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={npsTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(260 12% 16%)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#C5F536"
                    strokeWidth={2}
                    dot={{ fill: "#C5F536", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cohort Retention */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cohort Retention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground">
                    Cohort
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                    Users
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                    Week 1
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                    Week 4
                  </th>
                  <th className="text-right py-2 px-4 font-medium text-muted-foreground">
                    Week 12
                  </th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row) => (
                  <tr key={row.cohort} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium">{row.cohort}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {row.users}
                    </td>
                    <td
                      className={cn(
                        "py-3 px-4 text-right font-mono font-medium",
                        retentionColor(row.w1)
                      )}
                    >
                      {row.w1 !== null ? `${row.w1}%` : "--"}
                    </td>
                    <td
                      className={cn(
                        "py-3 px-4 text-right font-mono font-medium",
                        retentionColor(row.w4)
                      )}
                    >
                      {row.w4 !== null ? `${row.w4}%` : "--"}
                    </td>
                    <td
                      className={cn(
                        "py-3 px-4 text-right font-mono font-medium",
                        retentionColor(row.w12)
                      )}
                    >
                      {row.w12 !== null ? `${row.w12}%` : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Row 3: Top presets + Revenue by country */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top presets */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Presets by Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Revenue by country */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueByCountry.map((item) => (
                <div key={item.country}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{item.country}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono">
                        ${item.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
