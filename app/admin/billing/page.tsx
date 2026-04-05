"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const mrrData = [
  { month: "May", mrr: 1200 },
  { month: "Jun", mrr: 2800 },
  { month: "Jul", mrr: 4100 },
  { month: "Aug", mrr: 6500 },
  { month: "Sep", mrr: 9200 },
  { month: "Oct", mrr: 11800 },
  { month: "Nov", mrr: 15400 },
  { month: "Dec", mrr: 18200 },
  { month: "Jan", mrr: 22100 },
  { month: "Feb", mrr: 27500 },
  { month: "Mar", mrr: 34800 },
  { month: "Apr", mrr: 42600 },
];

const subscriberGrowth = [
  { month: "May", count: 48 },
  { month: "Jun", count: 110 },
  { month: "Jul", count: 185 },
  { month: "Aug", count: 280 },
  { month: "Sep", count: 370 },
  { month: "Oct", count: 455 },
  { month: "Nov", count: 540 },
  { month: "Dec", count: 610 },
  { month: "Jan", count: 690 },
  { month: "Feb", count: 760 },
  { month: "Mar", count: 830 },
  { month: "Apr", count: 890 },
];

const churnData = [
  { month: "May", rate: 5.2 },
  { month: "Jun", rate: 4.8 },
  { month: "Jul", rate: 4.1 },
  { month: "Aug", rate: 3.6 },
  { month: "Sep", rate: 3.2 },
  { month: "Oct", rate: 2.9 },
  { month: "Nov", rate: 2.7 },
  { month: "Dec", rate: 3.1 },
  { month: "Jan", rate: 2.8 },
  { month: "Feb", rate: 2.5 },
  { month: "Mar", rate: 2.3 },
  { month: "Apr", rate: 2.1 },
];

const revenueByPlan = [
  { plan: "Starter", revenue: 8900, subscribers: 356, pct: 20.9 },
  { plan: "Pro", revenue: 21750, subscribers: 435, pct: 51.1 },
  { plan: "Enterprise", revenue: 11950, subscribers: 99, pct: 28.0 },
];

const planColors: Record<string, string> = {
  Starter: "#3B82F6",
  Pro: "#6C3CE0",
  Enterprise: "#C5F536",
};

const recentTransactions = [
  { id: "txn_001", user: "tom@agency.net", plan: "Enterprise", amount: "$199", type: "renewal", date: "2026-04-05" },
  { id: "txn_002", user: "sarah@company.com", plan: "Pro", amount: "$29", type: "new", date: "2026-04-05" },
  { id: "txn_003", user: "aisha@creative.co", plan: "Pro", amount: "$29", type: "renewal", date: "2026-04-04" },
  { id: "txn_004", user: "james@tech.io", plan: "Starter", amount: "$12", type: "upgrade", date: "2026-04-04" },
  { id: "txn_005", user: "lisa@brand.io", plan: "Enterprise", amount: "$2,388", type: "annual", date: "2026-04-04" },
  { id: "txn_006", user: "marcus@startup.io", plan: "Starter", amount: "$12", type: "new", date: "2026-04-03" },
  { id: "txn_007", user: "nina@photo.ru", plan: "Pro", amount: "$29", type: "renewal", date: "2026-04-03" },
  { id: "txn_008", user: "emily@freelance.me", plan: "Pro", amount: "-$29", type: "refund", date: "2026-04-02" },
  { id: "txn_009", user: "fatima@creative.ae", plan: "Enterprise", amount: "$199", type: "renewal", date: "2026-04-02" },
  { id: "txn_010", user: "roberto@studio.br", plan: "Starter", amount: "$12", type: "new", date: "2026-04-01" },
];

const typeBadge: Record<string, string> = {
  new: "bg-lime-400/10 text-lime-400 border-lime-400/20",
  renewal: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  upgrade: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  annual: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  refund: "bg-red-500/10 text-red-400 border-red-500/20",
};

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

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold">Billing & Revenue</h2>
        <p className="text-sm text-muted-foreground">
          Revenue metrics, subscriber growth, and transaction history
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: "$42,600", change: "+22.4%", trend: "up" as const },
          { label: "ARR", value: "$511,200", change: "+22.4%", trend: "up" as const },
          { label: "Subscribers", value: "890", change: "+8.2%", trend: "up" as const },
          { label: "ARPU", value: "$47.87", change: "+4.1%", trend: "up" as const },
        ].map((s) => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-bold mt-0.5">{s.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {s.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-lime-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className={cn("text-xs", s.trend === "up" ? "text-lime-400" : "text-red-400")}>
                  {s.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1: MRR + Subscriber Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              MRR Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrData}>
                  <defs>
                    <linearGradient id="billingMrrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C3CE0" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6C3CE0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<ChartTooltip prefix="$" />} />
                  <Area type="monotone" dataKey="mrr" stroke="#6C3CE0" strokeWidth={2} fill="url(#billingMrrGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscriber Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={subscriberGrowth}>
                  <defs>
                    <linearGradient id="subGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5F536" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#C5F536" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="count" stroke="#C5F536" strokeWidth={2} fill="url(#subGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2: Churn + Revenue by plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Churn Rate Trend
            </CardTitle>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-display font-bold">2.1%</p>
              <span className="text-xs text-lime-400 flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" /> improving
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={churnData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(260 12% 16%)" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(260 5% 55%)", fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 6]} />
                  <Tooltip content={<ChartTooltip suffix="%" />} />
                  <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue by Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByPlan.map((plan) => (
                <div key={plan.plan}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: planColors[plan.plan] }}
                      />
                      <span className="text-sm font-medium">{plan.plan}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {plan.subscribers} subs
                      </span>
                      <span className="font-mono font-medium">
                        ${plan.revenue.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground w-12 text-right">
                        {plan.pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${plan.pct}%`,
                        backgroundColor: planColors[plan.plan],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Starter</p>
                <p className="text-lg font-display font-bold">$25</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Pro</p>
                <p className="text-lg font-display font-bold">$50</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg. Enterprise</p>
                <p className="text-lg font-display font-bold">$121</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((txn) => (
                <TableRow key={txn.id} className="border-border">
                  <TableCell className="text-sm">{txn.user}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20"
                    >
                      {txn.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs capitalize", typeBadge[txn.type])}
                    >
                      {txn.type}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-mono text-sm",
                      txn.amount.startsWith("-") ? "text-red-400" : "text-foreground"
                    )}
                  >
                    {txn.amount}
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
        </CardContent>
      </Card>
    </div>
  );
}
