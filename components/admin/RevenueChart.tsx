"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
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

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function RevenueChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Monthly Recurring Revenue
        </CardTitle>
        <p className="text-2xl font-display font-bold">
          ${data[data.length - 1].mrr.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6C3CE0" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6C3CE0" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="#6C3CE0"
                strokeWidth={2}
                fill="url(#mrrGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
